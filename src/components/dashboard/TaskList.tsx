"use client";

import { useState } from "react";
import { Plus, GripVertical, CheckCircle2, Circle, Clock, Zap, Sparkles } from "lucide-react";
import { useStore, Task } from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function TaskList() {
  const { tasks, updateTaskStatus, addTask, searchQuery } = useStore();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const isFocusMode = useStore(state => state.isFocusMode);

  if (isFocusMode) return null;

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    addTask({
      title: newTaskTitle,
      priority: 'medium',
      energyLevel: 'medium',
      estimatedTime: 25,
    });
    setNewTaskTitle("");
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'medium': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'low': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    }
  };

  const getEnergyIcon = (level: Task['energyLevel']) => {
    return <Zap className={cn("w-3 h-3", 
      level === 'high' ? 'text-destructive' : 
      level === 'medium' ? 'text-orange-500' : 'text-emerald-500'
    )} />;
  };

  const pendingTasks = tasks.filter(t => t.status !== 'done' && t.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const completedTasks = tasks.filter(t => t.status === 'done' && t.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="glass-card rounded-3xl p-6 h-[600px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-lg">Smart Tasks</h3>
          <p className="text-xs text-muted-foreground mt-1">AI suggests prioritizing High Energy tasks first.</p>
        </div>
        <button className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors">
          <Sparkles className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleAddTask} className="mb-6 relative">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a new task... (Press Enter)"
          className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
        <button 
          type="submit"
          disabled={!newTaskTitle.trim()}
          className="absolute right-2 top-2 bottom-2 aspect-square bg-primary text-white rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        <AnimatePresence>
          {pendingTasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group glass rounded-xl p-3 border border-white/5 hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex items-start gap-3">
                <button className="mt-1 cursor-grab opacity-30 hover:opacity-100 transition-opacity">
                  <GripVertical className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => updateTaskStatus(task.id, 'done')}
                  className="mt-0.5 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Circle className="w-5 h-5" />
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{task.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border", getPriorityColor(task.priority))}>
                      {task.priority}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-black/30 px-2 py-0.5 rounded-md">
                      <Clock className="w-3 h-3" /> {task.estimatedTime}m
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-black/30 px-2 py-0.5 rounded-md">
                      {getEnergyIcon(task.energyLevel)} Energy
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {completedTasks.length > 0 && (
          <div className="pt-4 mt-4 border-t border-white/5">
            <h4 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Completed</h4>
            {completedTasks.map(task => (
              <div key={task.id} className="flex items-center gap-3 p-2 opacity-50">
                <button onClick={() => updateTaskStatus(task.id, 'todo')}>
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </button>
                <p className="text-sm line-through decoration-white/30">{task.title}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

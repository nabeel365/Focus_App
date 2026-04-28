"use client";

import { Activity, TrendingUp, Clock, Target } from "lucide-react";
import { useStore } from "@/store/useStore";

export function AnalyticsWidget() {
  const { isFocusMode, tasks, focusTimeToday } = useStore();

  if (isFocusMode) return null;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const productivity = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const focusHours = (focusTimeToday / 60).toFixed(1);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="glass-card rounded-3xl p-5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Activity className="w-16 h-16" />
        </div>
        <div className="flex items-center gap-2 text-primary mb-2">
          <TrendingUp className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Productivity</span>
        </div>
        <div className="text-3xl font-bold font-outfit tracking-tight">{productivity}%</div>
        <p className="text-xs text-emerald-400 mt-1 font-medium">{completedTasks} of {totalTasks} tasks done</p>
      </div>

      <div className="glass-card rounded-3xl p-5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Clock className="w-16 h-16" />
        </div>
        <div className="flex items-center gap-2 text-purple-400 mb-2">
          <Target className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Deep Work</span>
        </div>
        <div className="text-3xl font-bold font-outfit tracking-tight">{focusHours}h</div>
        <p className="text-xs text-muted-foreground mt-1 font-medium">Logged today</p>
      </div>
    </div>
  );
}

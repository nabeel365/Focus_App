"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths } from "date-fns";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X, Plus, CalendarPlus } from "lucide-react";
import { useStore, CalendarEventType } from "@/store/useStore";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { calendarEvents, addCalendarEvent } = useStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventType, setNewEventType] = useState<CalendarEventType>('task');

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setIsModalOpen(true);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim() || !selectedDate) return;
    
    addCalendarEvent({
      date: format(selectedDate, 'yyyy-MM-dd'),
      title: newEventTitle,
      type: newEventType,
    });
    
    setNewEventTitle("");
    setIsModalOpen(false);
  };

  const getTypeColor = (type: CalendarEventType) => {
    switch (type) {
      case 'meeting': return 'text-orange-400 border-orange-400/20 bg-orange-400/10';
      case 'reminder': return 'text-purple-400 border-purple-400/20 bg-purple-400/10';
      case 'task': return 'text-emerald-400 border-emerald-400/20 bg-emerald-400/10';
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full gap-6 max-w-5xl mx-auto relative">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-outfit tracking-tight mb-2 flex items-center gap-3">
              <CalendarIcon className="w-8 h-8 text-primary" />
              Calendar
            </h1>
            <p className="text-muted-foreground">Manage your schedule and task deadlines.</p>
          </div>
          
          <div className="flex items-center gap-4 glass-card px-4 py-2 rounded-xl">
            <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-lg font-semibold min-w-[120px] text-center">
              {format(currentDate, 'MMMM yyyy')}
            </span>
            <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 flex-1 flex flex-col">
          <div className="grid grid-cols-7 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-semibold text-muted-foreground py-2 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 flex-1 gap-2">
            {/* Pad beginning of month */}
            {Array.from({ length: monthStart.getDay() }).map((_, index) => (
              <div key={`empty-${index}`} className="p-2 rounded-xl border border-transparent opacity-20" />
            ))}

            {days.map((day) => {
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isCurrentDay = isToday(day);
              
              const dayEvents = calendarEvents.filter(e => e.date === format(day, 'yyyy-MM-dd'));

              return (
                <div
                  key={day.toString()}
                  onClick={() => handleDayClick(day)}
                  className={cn(
                    "p-3 rounded-2xl border transition-all duration-300 min-h-[100px] flex flex-col hover:border-primary/50 cursor-pointer group relative overflow-hidden",
                    !isCurrentMonth ? "opacity-30 border-transparent bg-black/5" : "border-white/5 bg-black/20",
                    isCurrentDay && "border-primary bg-primary/10 ring-1 ring-primary/50"
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={cn(
                      "w-8 h-8 flex items-center justify-center rounded-xl text-sm font-medium transition-colors",
                      isCurrentDay ? "bg-primary text-white" : "text-muted-foreground group-hover:text-white group-hover:bg-white/10"
                    )}>
                      {format(day, 'd')}
                    </span>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-primary hover:bg-primary/20 rounded-md">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex flex-col gap-1 overflow-y-auto custom-scrollbar flex-1">
                    {dayEvents.map(event => (
                      <div 
                        key={event.id} 
                        className={cn("text-[10px] font-medium px-2 py-1 rounded-md border truncate", getTypeColor(event.type))}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add Event Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="glass-card w-full max-w-md rounded-3xl p-6 border border-white/10"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <CalendarPlus className="w-5 h-5 text-primary" />
                    Add Schedule
                  </h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-white p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <p className="text-sm text-muted-foreground mb-6">
                  Scheduling for <strong className="text-white">{selectedDate && format(selectedDate, 'MMMM d, yyyy')}</strong>
                </p>

                <form onSubmit={handleAddEvent} className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Event Title</label>
                    <input
                      type="text"
                      autoFocus
                      required
                      value={newEventTitle}
                      onChange={(e) => setNewEventTitle(e.target.value)}
                      placeholder="e.g. Design review meeting"
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wider">Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['task', 'meeting', 'reminder'] as CalendarEventType[]).map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setNewEventType(type)}
                          className={cn(
                            "px-3 py-2 rounded-xl text-xs font-semibold capitalize border transition-all",
                            newEventType === type 
                              ? "bg-primary/20 border-primary text-primary" 
                              : "bg-black/20 border-white/5 text-muted-foreground hover:border-white/20"
                          )}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-primary text-white py-3 rounded-xl font-medium mt-4 hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(124,58,237,0.4)]"
                  >
                    Add to Calendar
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

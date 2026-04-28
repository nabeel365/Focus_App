"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BarChart3, TrendingUp, Clock, Target, Zap, Activity } from "lucide-react";
import { useStore } from "@/store/useStore";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const mockData = [
  { name: 'Mon', focusTime: 2.4, tasks: 4 },
  { name: 'Tue', focusTime: 3.1, tasks: 6 },
  { name: 'Wed', focusTime: 1.8, tasks: 3 },
  { name: 'Thu', focusTime: 4.5, tasks: 8 },
  { name: 'Fri', focusTime: 5.2, tasks: 10 },
  { name: 'Sat', focusTime: 1.2, tasks: 2 },
  { name: 'Sun', focusTime: 0, tasks: 0 },
];

export default function AnalyticsPage() {
  const { focusTimeToday, tasks, xp } = useStore();
  const completedTasks = tasks.filter(t => t.status === 'done').length;

  const currentFocusTimeFormatted = (focusTimeToday / 60).toFixed(1);
  const updatedData = [...mockData];
  const todayIndex = new Date().getDay() - 1; 
  if (todayIndex >= 0 && todayIndex < 7) {
    updatedData[todayIndex] = { ...updatedData[todayIndex], focusTime: parseFloat(currentFocusTimeFormatted), tasks: completedTasks };
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full gap-8 max-w-6xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold font-outfit tracking-tight mb-2 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-primary" />
            Analytics & Insights
          </h1>
          <p className="text-muted-foreground">Track your productivity, deep work sessions, and consistency.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <Clock className="w-24 h-24" />
            </div>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Total Focus Time</p>
            <p className="text-4xl font-bold font-outfit tracking-tight">{currentFocusTimeFormatted}h</p>
            <p className="text-xs text-emerald-400 mt-2 font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +2.4h this week
            </p>
          </div>
          <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <Target className="w-24 h-24" />
            </div>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Tasks Completed</p>
            <p className="text-4xl font-bold font-outfit tracking-tight">{completedTasks}</p>
            <p className="text-xs text-emerald-400 mt-2 font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +{completedTasks * 2}% completion rate
            </p>
          </div>
          <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <Zap className="w-24 h-24 text-orange-500" />
            </div>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Current Streak</p>
            <p className="text-4xl font-bold font-outfit tracking-tight text-orange-500">12 Days</p>
            <p className="text-xs text-orange-400 mt-2 font-medium">Keep the fire burning!</p>
          </div>
          <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <Activity className="w-24 h-24 text-primary" />
            </div>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Total XP</p>
            <p className="text-4xl font-bold font-outfit tracking-tight text-primary">{xp}</p>
            <p className="text-xs text-primary mt-2 font-medium">Level 12 Focus Master</p>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 flex-1 min-h-[400px]">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Deep Work Trends
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={updatedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fafafa' }}
                />
                <Area type="monotone" dataKey="focusTime" name="Focus Time (hours)" stroke="#7c3aed" strokeWidth={3} fillOpacity={1} fill="url(#colorFocus)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

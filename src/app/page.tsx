"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FocusTimer } from "@/components/dashboard/FocusTimer";
import { TaskList } from "@/components/dashboard/TaskList";
import { AnalyticsWidget } from "@/components/dashboard/AnalyticsWidget";
import { MoodSelector } from "@/components/dashboard/MoodSelector";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";

export default function Dashboard() {
  const isFocusMode = useStore(state => state.isFocusMode);

  const { user } = useAuth();
  
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
  const firstName = user?.displayName ? user.displayName.split(" ")[0] : "Focus Member";

  return (
    <DashboardLayout>
      <AnimatePresence mode="wait">
        {!isFocusMode ? (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full"
          >
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div>
                <h1 className="text-4xl font-bold font-outfit tracking-tight mb-2">
                  {greeting}, {firstName}.
                </h1>
                <p className="text-muted-foreground">Ready to crush your goals today?</p>
              </div>
              
              <MoodSelector />
              
              <FocusTimer />
            </div>

            <div className="lg:col-span-5 flex flex-col gap-6">
              <AnalyticsWidget />
              <TaskList />
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="focus"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full h-full flex items-center justify-center"
          >
            <FocusTimer />
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}

"use client";

import { useEffect } from "react";
import { Play, Pause, Square, Sparkles, Brain, CheckCircle2 } from "lucide-react";
import { useStore } from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function FocusTimer() {
  const { 
    timerDuration, timerRemaining, timerStatus, 
    setTimerStatus, setTimerRemaining, setTimerDuration,
    isFocusMode, setFocusMode, addFocusTime
  } = useStore();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerStatus === 'running' && timerRemaining > 0) {
      interval = setInterval(() => {
        setTimerRemaining(timerRemaining - 1);
        if (timerRemaining % 60 === 0 && timerRemaining !== timerDuration) {
          addFocusTime(1);
        }
      }, 1000);
    } else if (timerRemaining === 0 && timerStatus === 'running') {
      setTimerStatus('idle');
      // trigger break or finish logic here
      new Audio('/notification.mp3').play().catch(() => {});
    }
    return () => clearInterval(interval);
  }, [timerStatus, timerRemaining, setTimerRemaining, setTimerStatus]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = ((timerDuration - timerRemaining) / timerDuration) * 100;

  return (
    <motion.div 
      layout
      className={cn(
        "glass-card rounded-3xl p-8 relative overflow-hidden transition-all duration-500",
        isFocusMode ? "fixed inset-4 z-50 flex flex-col items-center justify-center max-w-4xl mx-auto" : ""
      )}
    >
      {/* Background Pulse in Focus Mode */}
      <AnimatePresence>
        {isFocusMode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-900/10 z-0" 
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col items-center w-full">
        {!isFocusMode && (
          <div className="flex items-center justify-between w-full mb-8">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Focus Session</h3>
            </div>
            <button className="text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-1 hover:bg-primary/20 transition-colors">
              <Sparkles className="w-3 h-3" /> Smart Adjust
            </button>
          </div>
        )}

        {/* Circular Progress Timer */}
        <div className="relative w-64 h-64 flex items-center justify-center mb-8">
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              className="stroke-black/20"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              className="stroke-primary transition-all duration-1000 ease-linear"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 120}
              strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
            />
          </svg>
          <div className="text-center">
            <motion.div 
              key={timerRemaining}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-6xl font-bold tracking-tighter tabular-nums"
              style={{ fontFamily: 'var(--font-outfit)' }}
            >
              {formatTime(timerRemaining)}
            </motion.div>
            <p className="text-muted-foreground mt-2 font-medium tracking-wide">
              {timerStatus === 'running' ? 'Deep Focus' : timerStatus === 'break' ? 'Resting' : 'Ready'}
            </p>
          </div>
        </div>

        {/* Preset Times */}
        {!isFocusMode && timerStatus === 'idle' && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 mb-6 flex-wrap"
          >
            {[5, 15, 25, 45, 60].map((mins) => (
              <button
                key={mins}
                onClick={() => setTimerDuration(mins * 60)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 border",
                  timerDuration === mins * 60
                    ? "bg-primary/20 border-primary/50 text-primary"
                    : "bg-black/20 border-white/5 text-muted-foreground hover:border-white/20 hover:text-white"
                )}
              >
                {mins}m
              </button>
            ))}
          </motion.div>
        )}

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setTimerStatus(timerStatus === 'running' ? 'paused' : 'running')}
            className="w-16 h-16 rounded-2xl bg-white text-black flex items-center justify-center hover:bg-gray-200 transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            {timerStatus === 'running' ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </button>
          
          <button
            onClick={() => {
              setTimerStatus('idle');
              setTimerRemaining(timerDuration);
            }}
            className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-muted-foreground hover:text-white hover:bg-white/10 transition-all"
          >
            <Square className="w-5 h-5" />
          </button>
        </div>

        {/* Focus Mode Toggle */}
        <button
          onClick={() => setFocusMode(!isFocusMode)}
          className="mt-8 px-6 py-2.5 rounded-xl border border-white/10 hover:border-primary/50 text-sm font-medium transition-all group flex items-center gap-2 bg-black/20"
        >
          {isFocusMode ? 'Exit Deep Focus' : 'Enter Deep Focus'}
        </button>

        {isFocusMode && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 w-full max-w-md bg-black/40 rounded-2xl p-6 border border-white/5"
          >
            <h4 className="text-white/80 font-medium mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Current Task
            </h4>
            <p className="text-xl font-semibold">Complete project planning</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

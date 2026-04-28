"use client";

import { useStore } from "@/store/useStore";
import { Smile, Coffee, Battery, BatteryWarning } from "lucide-react";
import { cn } from "@/lib/utils";

const moods = [
  { id: 'high', label: 'Energized', icon: Battery, color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
  { id: 'medium', label: 'Focused', icon: Coffee, color: 'text-primary bg-primary/10 border-primary/20' },
  { id: 'low', label: 'Tired', icon: BatteryWarning, color: 'text-orange-400 bg-orange-400/10 border-orange-400/20' },
];

export function MoodSelector() {
  const { mood, setMood, isFocusMode } = useStore();

  if (isFocusMode) return null;

  return (
    <div className="glass-card rounded-3xl p-6 mb-6">
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <Smile className="w-5 h-5 text-primary" />
        How are you feeling?
      </h3>
      <div className="flex gap-3">
        {moods.map(m => (
          <button
            key={m.id}
            onClick={() => setMood(m.id)}
            className={cn(
              "flex-1 flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-300",
              mood === m.id 
                ? cn(m.color, "ring-2 ring-offset-2 ring-offset-black ring-primary scale-105 shadow-lg") 
                : "border-white/5 bg-black/20 text-muted-foreground hover:bg-white/5 hover:border-white/10"
            )}
          >
            <m.icon className="w-6 h-6 mb-2" />
            <span className="text-xs font-medium">{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

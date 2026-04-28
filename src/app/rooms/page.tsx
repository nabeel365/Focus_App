"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Target, Users, Lock, Unlock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const rooms = [
  { id: 1, name: "Deep Work Club", activeUsers: 142, isLocked: false, tags: ["Silent", "Pomodoro"], color: "from-primary/20 to-purple-500/10", border: "border-primary/30" },
  { id: 2, name: "Developers Focus", activeUsers: 89, isLocked: false, tags: ["Coding", "Lofi"], color: "from-blue-500/20 to-cyan-500/10", border: "border-blue-500/30" },
  { id: 3, name: "Students Library", activeUsers: 320, isLocked: false, tags: ["Study", "Ambient"], color: "from-emerald-500/20 to-teal-500/10", border: "border-emerald-500/30" },
  { id: 4, name: "Design Sprint", activeUsers: 24, isLocked: true, tags: ["Private", "Team"], color: "from-orange-500/20 to-red-500/10", border: "border-orange-500/30" },
];

export default function RoomsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col h-full gap-8 max-w-6xl mx-auto">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold font-outfit tracking-tight mb-2 flex items-center gap-3">
              <Target className="w-8 h-8 text-primary" />
              Focus Rooms
            </h1>
            <p className="text-muted-foreground">Join virtual rooms and work alongside others for accountability.</p>
          </div>
          <button className="bg-primary text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-all text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(124,58,237,0.4)]">
            Create Room
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map(room => (
            <div key={room.id} className={cn("glass-card rounded-3xl p-6 relative overflow-hidden group border", room.border)}>
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50 z-0", room.color)} />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center">
                    {room.isLocked ? <Lock className="w-5 h-5 text-muted-foreground" /> : <Unlock className="w-5 h-5 text-white" />}
                  </div>
                  <div className="bg-black/40 border border-white/5 px-3 py-1 rounded-full flex items-center gap-2 text-xs font-medium">
                    <Users className="w-3 h-3 text-primary" />
                    {room.activeUsers} focusing
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-2">{room.name}</h3>
                
                <div className="flex items-center gap-2 mb-8">
                  {room.tags.map(tag => (
                    <span key={tag} className="text-xs font-medium bg-white/5 text-muted-foreground px-2.5 py-1 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>

                <button className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 text-sm group-hover:border-white/20 border border-transparent">
                  {room.isLocked ? "Request Access" : "Join Room"}
                  <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

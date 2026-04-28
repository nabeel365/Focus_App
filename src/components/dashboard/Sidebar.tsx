"use client";

import { Home, LayoutDashboard, Target, Calendar, BarChart3, Settings, LogOut, Hexagon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { auth } from "@/lib/firebase";
import { useStore } from "@/store/useStore";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Focus Rooms", href: "/rooms", icon: Target },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const xp = useStore((state) => state.xp);

  return (
    <div className="w-64 h-screen border-r border-border glass flex flex-col justify-between hidden md:flex sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.5)]">
            <Hexagon className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gradient">Aura</span>
        </div>

        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                  isActive 
                    ? "text-white bg-white/5" 
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-md shadow-[0_0_10px_rgba(124,58,237,0.8)]" />
                )}
                <item.icon className={cn("w-5 h-5 transition-transform duration-300", isActive ? "scale-110 text-primary" : "group-hover:scale-110")} />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-6">
        <div className="glass-card rounded-2xl p-4 mb-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Pro Level</h4>
          <div className="flex items-end justify-between mb-2">
            <span className="text-2xl font-bold text-white">Lvl {Math.floor(xp / 1000) + 1}</span>
            <span className="text-xs text-primary font-medium">{xp.toLocaleString()} XP</span>
          </div>
          <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-purple-400 rounded-full shadow-[0_0_10px_rgba(124,58,237,0.5)] transition-all duration-1000" 
              style={{ width: `${(xp % 1000) / 10}%` }}
            />
          </div>
        </div>

        <nav className="space-y-2">
          <Link href="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-white hover:bg-white/5 transition-all duration-300">
            <Settings className="w-5 h-5" />
            <span className="font-medium text-sm">Settings</span>
          </Link>
          <button 
            onClick={() => auth.signOut()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-300"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Log Out</span>
          </button>
        </nav>
      </div>
    </div>
  );
}

"use client";

import { Bell, Search, Flame, Menu } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/context/AuthContext";

export function TopBar() {
  const { isFocusMode, searchQuery, setSearchQuery, profile, setIsMobileMenuOpen } = useStore();
  const { user } = useAuth();

  if (isFocusMode) return null;

  return (
    <header className="h-20 px-4 md:px-8 flex items-center justify-between glass z-10 sticky top-0 border-b border-border">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden p-2 rounded-xl hover:bg-white/5 text-muted-foreground hover:text-white transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="relative group w-full hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, rooms, or habits (Press '/')"
            className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all duration-300"
          />
        </div>
      </div>

      <div className="flex items-center gap-6 ml-8">
        <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-xl border border-orange-500/20">
          <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
          <span className="text-sm font-bold text-orange-500">12 Day Streak!</span>
        </div>

        <button className="relative p-2 rounded-xl hover:bg-white/5 text-muted-foreground hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(124,58,237,0.8)]" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-white">{user?.displayName || "Focus Member"}</p>
            <p className="text-xs text-muted-foreground">{profile?.occupation || "Productivity Explorer"}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-primary p-0.5 shadow-lg">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid || 'Aura'}&backgroundColor=transparent`}
              alt="Avatar" 
              className="w-full h-full rounded-[10px] bg-black/50"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

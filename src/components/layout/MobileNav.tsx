"use client";

import { Home, Target, Calendar, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Focus", href: "/rooms", icon: Target },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/10 px-6 py-3 pb-safe flex justify-between items-center bg-black/80 backdrop-blur-2xl">
      {navigation.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300",
              isActive ? "text-primary" : "text-muted-foreground hover:text-white"
            )}
          >
            <item.icon className={cn("w-6 h-6", isActive && "scale-110 drop-shadow-[0_0_8px_rgba(124,58,237,0.8)]")} />
            <span className="text-[10px] font-medium">{item.name}</span>
            {isActive && (
              <span className="absolute -top-3 w-1 h-1 rounded-full bg-primary shadow-[0_0_8px_rgba(124,58,237,1)]" />
            )}
          </Link>
        );
      })}
    </div>
  );
}

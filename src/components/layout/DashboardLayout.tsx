"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { MobileNav } from "@/components/layout/MobileNav";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const isFocusMode = useStore(state => state.isFocusMode);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || (!loading && !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090b]">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#09090b] relative">
      <div className={cn(
        "absolute inset-0 z-0 transition-opacity duration-1000",
        isFocusMode ? "opacity-100" : "opacity-0"
      )}>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-black/80 backdrop-blur-3xl" />
      </div>

      {!isFocusMode && <Sidebar />}

      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <TopBar />

        <main className={cn(
          "flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar transition-all duration-500",
          isFocusMode ? "flex items-center justify-center p-0" : ""
        )}>
          <div className={cn(
            "mx-auto transition-all duration-500 pb-20 md:pb-0",
            isFocusMode ? "w-full max-w-5xl" : "max-w-7xl h-full"
          )}>
            {children}
          </div>
        </main>
        
        {!isFocusMode && <MobileNav />}
      </div>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LoadingScreen } from "@/components/shared/loading-screen";
import { useAuthStore } from "@/stores/auth.store";
import { Sparkles } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    // Redirect is in-flight; render nothing to avoid a flash of protected content.
    return null;
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur px-4 sm:px-6 lg:hidden">
        <span className="text-sm font-semibold">Dashboard</span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            {user?.aiCredits ?? 0}
          </span>
          <ThemeToggle />
        </div>
      </header>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-w-0 pb-20 lg:pb-0">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">{children}</div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}

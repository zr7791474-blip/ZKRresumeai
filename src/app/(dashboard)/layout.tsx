import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { DEMO_USER } from "@/data/demo-user";

/**
 * Client demo dashboard shell. There is no authentication here — this is a
 * UI demo, so the dashboard is simply open. The header/sidebar show a
 * cosmetic demo identity (see src/data/demo-user.ts) rather than a real
 * session.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur px-4 sm:px-6 lg:hidden">
        <span className="text-sm font-semibold">Dashboard</span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">{DEMO_USER.name}</span>
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

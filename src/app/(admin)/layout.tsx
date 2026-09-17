import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { ADMIN_NAV_LINKS, APP_NAME } from "@/constants";

/**
 * Standalone shell for the /admin demo. Deliberately separate from the
 * client dashboard shell — this is a demonstration of what an admin screen
 * could look like, not a role-gated area of the same account. There is no
 * authentication here.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/20">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-bold tracking-tight">{APP_NAME} Admin</span>
            <span className="hidden sm:inline text-xs rounded-full border px-2 py-0.5 text-muted-foreground">Demo</span>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {ADMIN_NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Client demo
            </Link>
          </div>
        </div>
        <nav className="md:hidden flex items-center gap-1 px-4 pb-3 overflow-x-auto">
          {ADMIN_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 text-xs font-medium rounded-full border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}

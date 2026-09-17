"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, LayoutDashboard, Shield } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { APP_NAME, PUBLIC_NAV_LINKS } from "@/constants";
import { cn } from "@/lib/utils";

/** Public marketing navbar. This is a demo — there is no real account system,
 * so the call to action goes straight to the client or admin demo. */
export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="sticky top-0 z-50 w-full border-b glass"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/logo/zkr.jpg" alt={APP_NAME} width={32} height={32} className="rounded-full shrink-0" priority />
          <span className="text-lg font-bold tracking-tight whitespace-nowrap">
            <span className="lg:hidden">ZKR</span>
            <span className="hidden lg:inline">{APP_NAME}</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {PUBLIC_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative px-3 py-2 text-sm font-medium rounded-md transition-colors",
                pathname === link.href ? "text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              {link.label}
              {pathname === link.href && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute inset-0 rounded-md bg-accent/50 -z-10"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin"><Shield className="mr-1.5 h-3.5 w-3.5" />Admin demo</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/dashboard"><LayoutDashboard className="mr-1.5 h-3.5 w-3.5" />Try the demo</Link>
            </Button>
          </div>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <div className="flex flex-col gap-4 mt-8">
                {PUBLIC_NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      pathname === link.href ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t pt-4 mt-2 flex flex-col gap-2">
                  <Button variant="outline" asChild>
                    <Link href="/admin" onClick={() => setMobileOpen(false)}>Admin demo</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/dashboard" onClick={() => setMobileOpen(false)}>Try the demo</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}

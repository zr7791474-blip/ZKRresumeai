"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, FileText, LayoutTemplate, User, Settings, Shield, Sparkles, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/constants";
import { useAuthStore } from "@/stores/auth.store";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/resumes", label: "My Resumes", icon: FileText },
  { href: "/dashboard/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const isAdmin = user?.role === "ADMIN";

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r bg-muted/20 h-[calc(100vh-4rem)] sticky top-16">
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-4 mb-4">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo/zkr.jpg" alt={APP_NAME} width={28} height={28} className="rounded-full" />
            <span className="text-sm font-bold tracking-tight">{APP_NAME}</span>
          </Link>
        </div>
        <Separator className="mb-4" />
        <nav className="px-3 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors",
                  isActive ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute inset-0 rounded-lg bg-accent/70"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <link.icon className="h-4 w-4 relative z-10" />
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
          {isAdmin && (
            <>
              <Separator className="my-3" />
              <Link
                href="/admin"
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors",
                  pathname === "/admin" ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {pathname === "/admin" && (
                  <motion.div
                    layoutId="sidebar-admin-indicator"
                    className="absolute inset-0 rounded-lg bg-accent/70"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <Shield className="h-4 w-4 relative z-10" />
                <span className="relative z-10">Admin</span>
              </Link>
            </>
          )}
        </nav>
      </div>
      <div className="p-4 border-t">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || "User"}</p>
            <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
              <Sparkles className="h-3 w-3" />{user?.aiCredits ?? 0} credits
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => logout()}>
          <LogOut className="h-4 w-4 mr-2" />
          Log out
        </Button>
      </div>
    </aside>
  );
}

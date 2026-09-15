"use client";

import type { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";

/**
 * Hydrates the auth store from the httpOnly session cookie on first load.
 * Mounted once at the root so every page (public or protected) has access
 * to the current user without duplicating the /api/auth/me fetch.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  useAuth();
  return <>{children}</>;
}

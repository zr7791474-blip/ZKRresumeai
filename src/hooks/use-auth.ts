"use client";

import { useCallback, useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";

async function fetchSession() {
  const res = await fetch("/api/auth/me", { credentials: "include" });
  const json = await res.json();
  return { ok: res.ok, json };
}

export function useAuth() {
  const { user, accessToken, isAuthenticated, isLoading, setUser, setAccessToken, logout } = useAuthStore();

  const refresh = useCallback(async () => {
    try {
      const { ok, json } = await fetchSession();
      if (ok && json.success && json.data) {
        setUser(json.data.user);
        setAccessToken(json.data.accessToken);
      } else {
        setUser(null);
        setAccessToken(null);
      }
    } catch {
      setUser(null);
      setAccessToken(null);
    }
  }, [setUser, setAccessToken]);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { user, accessToken, isAuthenticated, isLoading, logout, refresh };
}
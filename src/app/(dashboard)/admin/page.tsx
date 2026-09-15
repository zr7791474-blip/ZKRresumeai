"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, FileText, Sparkles, Download, Shield, Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

interface Stats {
  userCount: number;
  resumeCount: number;
  aiRequestCount: number;
  downloadCount: number;
  activeUsers30d: number;
}

interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  emailVerified: boolean;
  aiCredits: number;
  createdAt: string;
}

export default function AdminPage() {
  const router = useRouter();
  const { user, accessToken, isLoading } = useAuthStore();
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading && user && user.role !== "ADMIN") {
      router.replace("/dashboard");
    }
  }, [isLoading, user, router]);

  function authHeaders(): HeadersInit {
    return {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };
  }

  useEffect(() => {
    async function load() {
      if (!accessToken || user?.role !== "ADMIN") return;
      setLoadingData(true);
      try {
        const [statsRes, usersRes] = await Promise.all([
          fetch("/api/admin/stats", { headers: authHeaders(), credentials: "include" }),
          fetch(`/api/admin/users?search=${encodeURIComponent(search)}`, { headers: authHeaders(), credentials: "include" }),
        ]);
        const statsJson = await statsRes.json();
        const usersJson = await usersRes.json();
        if (statsJson.success) setStats(statsJson.data);
        if (usersJson.success) setUsers(usersJson.data.users);
      } finally {
        setLoadingData(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, user, search]);

  if (isLoading || (user && user.role !== "ADMIN")) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon={Users} label="Users" value={stats?.userCount} loading={loadingData} />
        <StatCard icon={FileText} label="Resumes" value={stats?.resumeCount} loading={loadingData} />
        <StatCard icon={Sparkles} label="AI Requests" value={stats?.aiRequestCount} loading={loadingData} />
        <StatCard icon={Download} label="Downloads" value={stats?.downloadCount} loading={loadingData} />
        <StatCard icon={Users} label="Active (30d)" value={stats?.activeUsers30d} loading={loadingData} />
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Users</h2>
            <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
          </div>

          {loadingData ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
            </div>
          ) : users.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 font-medium">Name</th>
                    <th className="pb-2 font-medium">Email</th>
                    <th className="pb-2 font-medium">Role</th>
                    <th className="pb-2 font-medium">Credits</th>
                    <th className="pb-2 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b last:border-0">
                      <td className="py-3">{u.name || "—"}</td>
                      <td className="py-3 text-muted-foreground">{u.email}</td>
                      <td className="py-3">
                        <Badge variant={u.role === "ADMIN" ? "default" : "secondary"}>{u.role}</Badge>
                      </td>
                      <td className="py-3">{u.aiCredits}</td>
                      <td className="py-3 text-muted-foreground">{formatDate(u.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, loading }: { icon: typeof Users; label: string; value?: number; loading: boolean }) {
  return (
    <Card>
      <CardContent className="p-4">
        <Icon className="h-4 w-4 text-muted-foreground mb-2" />
        {loading ? <Skeleton className="h-6 w-12" /> : <p className="text-xl font-bold">{value ?? 0}</p>}
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </CardContent>
    </Card>
  );
}

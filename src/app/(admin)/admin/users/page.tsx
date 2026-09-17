"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MOCK_USERS } from "@/data/mock-users";
import { formatDate } from "@/lib/utils";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");

  const filtered = MOCK_USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground mt-1">Demo user directory — static data, not a real user database.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4 gap-3">
            <h2 className="text-lg font-semibold">All Users</h2>
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 font-medium">Name</th>
                    <th className="pb-2 font-medium">Email</th>
                    <th className="pb-2 font-medium">Role</th>
                    <th className="pb-2 font-medium">Plan</th>
                    <th className="pb-2 font-medium">Resumes</th>
                    <th className="pb-2 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr key={u.id} className="border-b last:border-0">
                      <td className="py-3">{u.name}</td>
                      <td className="py-3 text-muted-foreground">{u.email}</td>
                      <td className="py-3">
                        <Badge variant={u.role === "ADMIN" ? "default" : "secondary"}>{u.role}</Badge>
                      </td>
                      <td className="py-3">
                        <Badge variant={u.plan === "PRO" ? "default" : "outline"}>{u.plan}</Badge>
                      </td>
                      <td className="py-3">{u.resumeCount}</td>
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

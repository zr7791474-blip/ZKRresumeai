export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  plan: "FREE" | "PRO";
  resumeCount: number;
  createdAt: string;
}

/**
 * Static roster for the /admin/users demo screen. This is illustrative data
 * only — the admin dashboard is a UI demo and does not read or write a real
 * user database.
 */
export const MOCK_USERS: MockUser[] = [
  { id: "u1", name: "Alex Rivera", email: "alex.rivera@example.com", role: "USER", plan: "PRO", resumeCount: 3, createdAt: "2025-11-02T10:00:00.000Z" },
  { id: "u2", name: "Priya Nair", email: "priya.nair@example.com", role: "USER", plan: "FREE", resumeCount: 1, createdAt: "2025-11-14T10:00:00.000Z" },
  { id: "u3", name: "David Martinez", email: "david.martinez@example.com", role: "USER", plan: "FREE", resumeCount: 2, createdAt: "2025-12-01T10:00:00.000Z" },
  { id: "u4", name: "Sarah Chen", email: "sarah.chen@example.com", role: "ADMIN", plan: "PRO", resumeCount: 4, createdAt: "2025-09-18T10:00:00.000Z" },
  { id: "u5", name: "Michael Foster", email: "michael.foster@example.com", role: "USER", plan: "PRO", resumeCount: 5, createdAt: "2025-12-20T10:00:00.000Z" },
  { id: "u6", name: "Emma Wright", email: "emma.wright@example.com", role: "USER", plan: "FREE", resumeCount: 1, createdAt: "2026-01-04T10:00:00.000Z" },
  { id: "u7", name: "Jordan Blake", email: "jordan.blake@example.com", role: "USER", plan: "FREE", resumeCount: 2, createdAt: "2026-01-19T10:00:00.000Z" },
  { id: "u8", name: "Noah Kim", email: "noah.kim@example.com", role: "USER", plan: "PRO", resumeCount: 3, createdAt: "2026-02-02T10:00:00.000Z" },
];

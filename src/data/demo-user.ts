/**
 * The client dashboard demo is not gated by real authentication — there is
 * no login, no session, and no user database. This constant is purely
 * cosmetic: it lets the dashboard UI show a name in the sidebar the way a
 * signed-in product would, without pretending any account system exists.
 */
export const DEMO_USER = {
  name: "Alex Rivera",
  email: "alex.rivera@example.com",
  initials: "AR",
} as const;

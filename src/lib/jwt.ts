import jwt from "jsonwebtoken";
import type { JwtPayload } from "@/types";

// Falls back to insecure development defaults only outside production so that
// `next dev` / `next build` don't crash before .env is configured. In
// production, missing secrets fail loudly instead of silently using a weak key.
function getSecret(name: "JWT_SECRET" | "JWT_REFRESH_SECRET"): string {
  const value = process.env[name];
  if (value) return value;
  if (process.env.NODE_ENV === "production") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return `dev-insecure-${name.toLowerCase()}-do-not-use-in-production`;
}

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, getSecret("JWT_SECRET"), { expiresIn: "15m" });
}

export function signRefreshToken(payload: JwtPayload, expiresInSeconds: number = 7 * 24 * 60 * 60): string {
  return jwt.sign(payload, getSecret("JWT_REFRESH_SECRET"), { expiresIn: expiresInSeconds });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, getSecret("JWT_SECRET")) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, getSecret("JWT_REFRESH_SECRET")) as JwtPayload;
}

/** Seconds remaining until the token's `exp` claim, or null if it can't be read. */
export function getTokenRemainingSeconds(token: string): number | null {
  const decoded = jwt.decode(token);
  if (!decoded || typeof decoded === "string" || !decoded.exp) return null;
  return Math.max(0, decoded.exp - Math.floor(Date.now() / 1000));
}

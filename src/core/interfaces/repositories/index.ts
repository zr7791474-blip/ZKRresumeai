import type { User, Session, RefreshToken, Resume, ResumeSection, AIRequest, Download, AIRequestType, AIRequestStatus, Prisma } from "@prisma/client";
import type { SafeUser } from "@/types";

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: { email: string; passwordHash: string; name?: string; role?: "USER" | "ADMIN" | "PREMIUM" }): Promise<User>;
  update(id: string, data: Partial<Pick<User, "passwordHash" | "emailVerified" | "deletedAt" | "aiCredits" | "name" | "avatar" | "bio" | "location" | "plan" | "stripeCustomerId" | "stripeSubscriptionId" | "stripeCurrentPeriodEnd">>): Promise<User>;
  findManyPaginated(params: { page: number; pageSize: number; search?: string }): Promise<{ users: User[]; total: number }>;
  countAll(): Promise<number>;
}

export interface ISessionRepository {
  create(data: { userId: string; token: string; userAgent?: string | null; ipAddress?: string | null; expiresAt: Date }): Promise<Session>;
  deleteManyByUserId(userId: string): Promise<number>;
}

export interface IRefreshTokenRepository {
  create(data: { userId: string; token: string; expiresAt: Date }): Promise<RefreshToken>;
  findByToken(token: string): Promise<RefreshToken | null>;
  revoke(id: string): Promise<RefreshToken>;
  revokeAllByUserId(userId: string): Promise<number>;
  /** Revokes every refresh token for a user except the one currently in use, so a
   *  security-sensitive action (e.g. changing your password) can invalidate any
   *  other stolen/leaked sessions without logging the user out of their own. */
  revokeAllByUserIdExcept(userId: string, exceptToken: string): Promise<number>;
}

export interface IResumeRepository {
  findMany(userId: string): Promise<(Resume & { sections: ResumeSection[] })[]>;
  findById(id: string, userId: string): Promise<(Resume & { sections: ResumeSection[] }) | null>;
  create(data: { userId: string; title: string; templateId?: string | null }): Promise<Resume>;
  update(id: string, userId: string, data: Partial<Pick<Resume, "title" | "templateId" | "status" | "isFavorite">> & { data?: any }): Promise<Resume | null>;
  softDelete(id: string, userId: string): Promise<boolean>;
  createSection(data: { resumeId: string; type: string; title?: string | null; content?: unknown; order: number }): Promise<ResumeSection>;
  updateSection(id: string, resumeId: string, data: Partial<Pick<ResumeSection, "title" | "order">> & { content?: any }): Promise<ResumeSection | null>;
  deleteSection(id: string, resumeId: string): Promise<boolean>;
  createDownload(data: { userId: string; resumeId: string; format: string; filename: string; fileSize: number }): Promise<Download>;
}

export interface IAIRequestRepository {
  create(data: { userId: string; type: AIRequestType; input: Prisma.InputJsonValue; output: Prisma.InputJsonValue; tokensUsed: number; model: string; status: AIRequestStatus; completedAt?: Date }): Promise<AIRequest>;
}
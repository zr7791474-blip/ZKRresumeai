import { prisma } from "@/infra/database/prisma/client";
import type { ISessionRepository } from "@/core/interfaces/repositories";

export class PrismaSessionRepository implements ISessionRepository {
  async create(data: { userId: string; token: string; userAgent?: string | null; ipAddress?: string | null; expiresAt: Date }) {
    return prisma.session.create({ data });
  }

  async deleteManyByUserId(userId: string) {
    const result = await prisma.session.deleteMany({ where: { userId } });
    return result.count;
  }
}
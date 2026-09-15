import { prisma } from "@/infra/database/prisma/client";
import type { IRefreshTokenRepository } from "@/core/interfaces/repositories";

export class PrismaRefreshTokenRepository implements IRefreshTokenRepository {
  async create(data: { userId: string; token: string; expiresAt: Date }) {
    return prisma.refreshToken.create({ data });
  }

  async findByToken(token: string) {
    return prisma.refreshToken.findUnique({ where: { token } });
  }

  async revoke(id: string) {
    return prisma.refreshToken.update({ where: { id }, data: { revokedAt: new Date() } });
  }

  async revokeAllByUserId(userId: string) {
    const result = await prisma.refreshToken.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } });
    return result.count;
  }

  async revokeAllByUserIdExcept(userId: string, exceptToken: string) {
    const result = await prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null, token: { not: exceptToken } },
      data: { revokedAt: new Date() },
    });
    return result.count;
  }
}
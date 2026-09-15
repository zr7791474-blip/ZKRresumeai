import type { IUserRepository } from "@/core/interfaces/repositories";
import { prisma } from "@/infra/database/prisma/client";
import { AppError } from "@/core/errors/app.error";

export class AdminService {
  constructor(private userRepo: IUserRepository) {}

  async getStats() {
    const [userCount, resumeCount, aiRequestCount, downloadCount, activeUsers30d] = await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.resume.count({ where: { deletedAt: null } }),
      prisma.aIRequest.count(),
      prisma.download.count(),
      prisma.user.count({
        where: {
          deletedAt: null,
          updatedAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
      }),
    ]);

    return { userCount, resumeCount, aiRequestCount, downloadCount, activeUsers30d };
  }

  async listUsers(params: { page: number; pageSize: number; search?: string }) {
    const { users, total } = await this.userRepo.findManyPaginated(params);
    return {
      users: users.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        emailVerified: u.emailVerified,
        aiCredits: u.aiCredits,
        createdAt: u.createdAt,
      })),
      total,
      page: params.page,
      pageSize: params.pageSize,
    };
  }

  async setUserRole(userId: string, role: "USER" | "ADMIN" | "PREMIUM") {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new AppError("User not found.", 404);
    return prisma.user.update({ where: { id: userId }, data: { role } });
  }
}

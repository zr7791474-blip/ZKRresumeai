import { prisma } from "@/infra/database/prisma/client";
import type { IUserRepository } from "@/core/interfaces/repositories";

export class PrismaUserRepository implements IUserRepository {
  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async create(data: { email: string; passwordHash: string; name?: string; role?: "USER" | "ADMIN" | "PREMIUM" }) {
    return prisma.user.create({ data });
  }

  async update(id: string, data: Partial<Pick<import("@prisma/client").User, "passwordHash" | "emailVerified" | "deletedAt" | "aiCredits" | "name" | "avatar" | "bio" | "location" | "plan" | "stripeCustomerId" | "stripeSubscriptionId" | "stripeCurrentPeriodEnd">>) {
    return prisma.user.update({ where: { id }, data });
  }

  async findManyPaginated(params: { page: number; pageSize: number; search?: string }) {
    const { page, pageSize, search } = params;
    const where = search
      ? {
          deletedAt: null,
          OR: [
            { email: { contains: search, mode: "insensitive" as const } },
            { name: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : { deletedAt: null };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.user.count({ where }),
    ]);

    return { users, total };
  }

  async countAll() {
    return prisma.user.count({ where: { deletedAt: null } });
  }
}
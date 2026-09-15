import { prisma } from "@/infra/database/prisma/client";
import type { IAIRequestRepository } from "@/core/interfaces/repositories";

export class PrismaAIRequestRepository implements IAIRequestRepository {
  async create(data: { userId: string; type: string; input: unknown; output: unknown; tokensUsed: number; model: string; status: string; completedAt?: Date }) {
    return prisma.aIRequest.create({ data }) as Promise<any>;
  }
}
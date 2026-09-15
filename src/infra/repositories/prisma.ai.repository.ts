import { prisma } from "@/infra/database/prisma/client";
import type { IAIRequestRepository } from "@/core/interfaces/repositories";
import type { AIRequestType, AIRequestStatus, Prisma } from "@prisma/client";

export class PrismaAIRequestRepository implements IAIRequestRepository {
  async create(data: { userId: string; type: AIRequestType; input: Prisma.InputJsonValue; output: Prisma.InputJsonValue; tokensUsed: number; model: string; status: AIRequestStatus; completedAt?: Date }) {
    return prisma.aIRequest.create({ data });
  }
}
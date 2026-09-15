import { prisma } from "@/infra/database/prisma/client";
import type { IResumeRepository } from "@/core/interfaces/repositories";
import { AppError } from "@/core/errors/app.error";

export class PrismaResumeRepository implements IResumeRepository {
  async findMany(userId: string) {
    return prisma.resume.findMany({
      where: { userId, deletedAt: null },
      include: { sections: { orderBy: { order: "asc" } } },
      orderBy: { updatedAt: "desc" },
    }) as Promise<any[]>;
  }

  async findById(id: string, userId: string) {
    const resume = await prisma.resume.findFirst({
      where: { id, userId, deletedAt: null },
      include: { sections: { orderBy: { order: "asc" } } },
    });
    return resume ?? null;
  }

  async create(data: { userId: string; title: string; templateId?: string | null }) {
    return prisma.resume.create({ data });
  }

  async update(id: string, userId: string, data: Partial<any>) {
    const resume = await this.findById(id, userId);
    if (!resume) return null;
    return prisma.resume.update({ where: { id }, data });
  }

  async softDelete(id: string, userId: string): Promise<boolean> {
    const resume = await this.findById(id, userId);
    if (!resume) return false;
    await prisma.resume.update({ where: { id }, data: { deletedAt: new Date() } });
    return true;
  }

  async createSection(data: { resumeId: string; type: string; title?: string | null; content: unknown; order: number }) {
    return prisma.resumeSection.create({ data });
  }

  async updateSection(id: string, resumeId: string, data: Partial<any>): Promise<any | null> {
    const section = await prisma.resumeSection.findFirst({ where: { id, resumeId } });
    if (!section) return null;
    return prisma.resumeSection.update({ where: { id }, data });
  }

  async deleteSection(id: string, resumeId: string): Promise<boolean> {
    const count = await prisma.resumeSection.deleteMany({ where: { id, resumeId } });
    return count.count > 0;
  }

  async createDownload(data: { userId: string; resumeId: string; format: string; filename: string; fileSize: number }) {
    await prisma.download.create({ data });
    return {} as any;
  }
}
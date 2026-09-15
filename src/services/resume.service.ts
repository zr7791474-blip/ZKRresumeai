import type { IResumeRepository } from "@/core/interfaces/repositories";
import { AppError } from "@/core/errors/app.error";
import { buildResumePdf, buildResumeDocx, buildResumeJson } from "@/lib/resume-export";
import type { SectionType } from "@/types";
import type { CreateResumeDto, UpdateResumeDto, CreateSectionDto, UpdateSectionDto, ExportResumeDto } from "@/validators/resume.validator";

export interface ExportResult {
  buffer: Buffer;
  contentType: string;
  filename: string;
}

export class ResumeService {
  constructor(private resumeRepo: IResumeRepository) {}

  async getAll(userId: string) {
    return this.resumeRepo.findMany(userId);
  }

  async getById(id: string, userId: string) {
    const resume = await this.resumeRepo.findById(id, userId);
    if (!resume) {
      throw new AppError("Resume not found.", 404);
    }
    return resume;
  }

  async create(userId: string, dto: CreateResumeDto) {
    return this.resumeRepo.create({
      userId,
      title: dto.title,
      templateId: dto.templateId || null,
    });
  }

  async update(id: string, userId: string, dto: UpdateResumeDto) {
    const resume = await this.resumeRepo.update(id, userId, dto);
    if (!resume) {
      throw new AppError("Resume not found.", 404);
    }
    return resume;
  }

  async delete(id: string, userId: string) {
    const success = await this.resumeRepo.softDelete(id, userId);
    if (!success) {
      throw new AppError("Resume not found.", 404);
    }
  }

  async addSection(resumeId: string, userId: string, dto: CreateSectionDto) {
    await this.getById(resumeId, userId); // throws 404 if not found or not owned
    return this.resumeRepo.createSection({
      resumeId,
      type: dto.type,
      title: dto.title,
      content: dto.content,
      order: dto.order,
    });
  }

  async updateSection(id: string, resumeId: string, userId: string, dto: UpdateSectionDto) {
    await this.getById(resumeId, userId); // throws 404 if not found or not owned
    const section = await this.resumeRepo.updateSection(id, resumeId, dto);
    if (!section) {
      throw new AppError("Section not found.", 404);
    }
    return section;
  }

  async deleteSection(id: string, resumeId: string, userId: string) {
    await this.getById(resumeId, userId); // throws 404 if not found or not owned
    const success = await this.resumeRepo.deleteSection(id, resumeId);
    if (!success) {
      throw new AppError("Section not found.", 404);
    }
  }

  async export(id: string, userId: string, dto: ExportResumeDto): Promise<ExportResult> {
    const resume = await this.resumeRepo.findById(id, userId);
    if (!resume) {
      throw new AppError("Resume not found.", 404);
    }

    const exportable = {
      title: resume.title,
      data: (resume.data ?? {}) as Record<string, unknown>,
      sections: resume.sections
        .slice()
        .sort((a: { order: number }, b: { order: number }) => a.order - b.order)
        .map((s: { id: string; type: SectionType; title: string | null; content: unknown; order: number }) => ({
          id: s.id,
          type: s.type,
          title: s.title,
          content: (s.content ?? {}) as Record<string, unknown>,
          order: s.order,
        })),
    };

    let buffer: Buffer;
    let contentType: string;
    const safeTitle = resume.title.replace(/[^a-z0-9\-_ ]/gi, "").trim() || "resume";

    switch (dto.format) {
      case "PDF":
        buffer = await buildResumePdf(exportable);
        contentType = "application/pdf";
        break;
      case "DOCX":
        buffer = await buildResumeDocx(exportable);
        contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        break;
      case "JSON":
      default:
        buffer = buildResumeJson(exportable);
        contentType = "application/json";
        break;
    }

    const filename = `${safeTitle}.${dto.format.toLowerCase()}`;

    await this.resumeRepo.createDownload({
      userId,
      resumeId: id,
      format: dto.format,
      filename,
      fileSize: buffer.byteLength,
    });

    return { buffer, contentType, filename };
  }
}

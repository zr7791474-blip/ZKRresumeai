import { z } from "zod";

export const createResumeValidator = z.object({
  title: z.string().min(1, "Title is required"),
  templateId: z.string().optional(),
});

export const updateResumeValidator = z.object({
  title: z.string().min(1).optional(),
  templateId: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  isFavorite: z.boolean().optional(),
  data: z.record(z.unknown()).optional(),
});

export const createSectionValidator = z.object({
  type: z.enum([
    "PERSONAL_INFO", "SUMMARY", "EXPERIENCE", "EDUCATION", "SKILLS", "LANGUAGES", "PROJECTS", "CERTIFICATIONS", "AWARDS", "INTERESTS", "REFERENCES",
  ]),
  title: z.string().optional(),
  content: z.record(z.unknown()).default({}),
  order: z.number().int().min(0),
});

export const updateSectionValidator = z.object({
  title: z.string().optional(),
  content: z.record(z.unknown()).optional(),
  order: z.number().int().min(0).optional(),
});

export const exportResumeValidator = z.object({
  format: z.enum(["PDF", "DOCX", "JSON"]),
});

export type CreateResumeDto = z.infer<typeof createResumeValidator>;
export type UpdateResumeDto = z.infer<typeof updateResumeValidator>;
export type CreateSectionDto = z.infer<typeof createSectionValidator>;
export type UpdateSectionDto = z.infer<typeof updateSectionValidator>;
export type ExportResumeDto = z.infer<typeof exportResumeValidator>;
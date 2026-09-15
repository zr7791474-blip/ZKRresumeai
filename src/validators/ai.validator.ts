import { z } from "zod";

export const generateSummaryValidator = z.object({
  jobTitle: z.string().min(1),
  experience: z.string().min(10),
  skills: z.array(z.string()).min(1),
});

export const atsOptimizeValidator = z.object({
  resumeText: z.string().min(50),
  jobDescription: z.string().min(20),
});

export const rewriteValidator = z.object({
  text: z.string().min(5),
  tone: z.enum(["professional", "confident", "action-oriented", "concise"]).optional(),
});

export const grammarFixValidator = z.object({
  text: z.string().min(5),
});

export const scoreResumeValidator = z.object({
  resumeText: z.string().min(50),
  jobDescription: z.string().optional(),
});

export const coverLetterValidator = z.object({
  resumeText: z.string().min(50),
  jobTitle: z.string().min(1),
  companyName: z.string().min(1),
  jobDescription: z.string().optional(),
});

export const skillsSuggestValidator = z.object({
  jobTitle: z.string().min(1),
  currentSkills: z.array(z.string()),
  industry: z.string().optional(),
});

export type GenerateSummaryDto = z.infer<typeof generateSummaryValidator>;
export type AtsOptimizeDto = z.infer<typeof atsOptimizeValidator>;
export type RewriteDto = z.infer<typeof rewriteValidator>;
export type GrammarFixDto = z.infer<typeof grammarFixValidator>;
export type ScoreResumeDto = z.infer<typeof scoreResumeValidator>;
export type CoverLetterDto = z.infer<typeof coverLetterValidator>;
export type SkillsSuggestDto = z.infer<typeof skillsSuggestValidator>;
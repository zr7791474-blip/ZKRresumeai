export type SectionType =
  | "PERSONAL_INFO"
  | "SUMMARY"
  | "EXPERIENCE"
  | "EDUCATION"
  | "SKILLS"
  | "LANGUAGES"
  | "PROJECTS"
  | "CERTIFICATIONS"
  | "AWARDS"
  | "INTERESTS"
  | "REFERENCES";

export type ResumeStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface ResumeSectionData {
  id: string;
  type: SectionType;
  title: string | null;
  content: Record<string, unknown>;
  order: number;
}

export interface ResumeWithSections {
  id: string;
  title: string;
  templateId: string | null;
  status: ResumeStatus;
  isFavorite: boolean;
  data: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  sections: ResumeSectionData[];
}

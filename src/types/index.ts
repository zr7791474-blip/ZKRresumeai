import type { Role, Plan, ResumeStatus, SectionType, AIRequestType, AIRequestStatus, DownloadFormat } from "@prisma/client";

export type { Role, Plan, ResumeStatus, SectionType, AIRequestType, AIRequestStatus, DownloadFormat };

export interface SafeUser {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  bio: string | null;
  location: string | null;
  role: Role;
  plan: Plan;
  emailVerified: boolean;
  aiCredits: number;
  createdAt: Date;
}

export interface ResumeWithSections {
  id: string;
  title: string;
  templateId: string | null;
  status: ResumeStatus;
  isFavorite: boolean;
  data: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  sections: ResumeSectionData[];
}

export interface ResumeSectionData {
  id: string;
  type: SectionType;
  title: string | null;
  content: Record<string, unknown>;
  order: number;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
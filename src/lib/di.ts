import { PrismaUserRepository } from "@/infra/repositories/prisma.user.repository";
import { PrismaSessionRepository } from "@/infra/repositories/prisma.session.repository";
import { PrismaRefreshTokenRepository } from "@/infra/repositories/prisma.refresh-token.repository";
import { PrismaResumeRepository } from "@/infra/repositories/prisma.resume.repository";
import { PrismaAIRequestRepository } from "@/infra/repositories/prisma.ai.repository";
import { AuthService } from "@/services/auth.service";
import { ResumeService } from "@/services/resume.service";
import { AIService } from "@/services/ai.service";
import { AdminService } from "@/services/admin.service";
import { SettingsService } from "@/services/settings.service";
import { BillingService } from "@/services/billing.service";
import type { IUserRepository } from "@/core/interfaces/repositories";
import type { ISessionRepository } from "@/core/interfaces/repositories";
import type { IRefreshTokenRepository } from "@/core/interfaces/repositories";
import type { IResumeRepository } from "@/core/interfaces/repositories";
import type { IAIRequestRepository } from "@/core/interfaces/repositories";

interface Services {
  authService: AuthService;
  resumeService: ResumeService;
  aiService: AIService;
  adminService: AdminService;
  settingsService: SettingsService;
  billingService: BillingService;
  userRepo: IUserRepository;
  sessionRepo: ISessionRepository;
  refreshTokenRepo: IRefreshTokenRepository;
  resumeRepo: IResumeRepository;
  aiRepo: IAIRequestRepository;
}

let cachedServices: Services | null = null;

export function getServices(): Services {
  if (cachedServices) return cachedServices;

  const userRepo: IUserRepository = new PrismaUserRepository();
  const sessionRepo: ISessionRepository = new PrismaSessionRepository();
  const refreshTokenRepo: IRefreshTokenRepository = new PrismaRefreshTokenRepository();
  const resumeRepo: IResumeRepository = new PrismaResumeRepository();
  const aiRepo: IAIRequestRepository = new PrismaAIRequestRepository();

  const authService = new AuthService(userRepo, sessionRepo, refreshTokenRepo);
  const resumeService = new ResumeService(resumeRepo);
  const aiService = new AIService(aiRepo, resumeRepo);
  const adminService = new AdminService(userRepo);
  const settingsService = new SettingsService();
  const billingService = new BillingService(userRepo);

  cachedServices = { authService, resumeService, aiService, adminService, settingsService, billingService, userRepo, sessionRepo, refreshTokenRepo, resumeRepo, aiRepo };
  return cachedServices;
}
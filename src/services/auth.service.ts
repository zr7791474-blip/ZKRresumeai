import { randomUUID } from "crypto";
import type { IUserRepository } from "@/core/interfaces/repositories";
import type { ISessionRepository } from "@/core/interfaces/repositories";
import type { IRefreshTokenRepository } from "@/core/interfaces/repositories";
import { hashPassword, comparePassword } from "@/lib/password";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "@/lib/jwt";
import { AppError } from "@/core/errors/app.error";
import { prisma } from "@/infra/database/prisma/client";
import { sendVerificationEmail, sendPasswordResetEmail } from "@/lib/email";
import type { JwtPayload, AuthTokens, SafeUser } from "@/types";
import type {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
  DeleteAccountDto,
} from "@/validators/auth.validator";

export class AuthService {
  constructor(
    private userRepo: IUserRepository,
    private sessionRepo: ISessionRepository,
    private refreshTokenRepo: IRefreshTokenRepository
  ) {}

  private sanitizeUser(user: { id: string; email: string; name: string | null; avatar: string | null; bio?: string | null; location?: string | null; role: string; plan?: string; emailVerified: boolean; aiCredits: number; createdAt: Date }): SafeUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      bio: user.bio ?? null,
      location: user.location ?? null,
      role: user.role as "USER" | "ADMIN" | "PREMIUM",
      plan: (user.plan as "FREE" | "PRO") ?? "FREE",
      emailVerified: user.emailVerified,
      aiCredits: user.aiCredits,
      createdAt: user.createdAt,
    };
  }

  private generateTokens(payload: JwtPayload, refreshExpiresInSeconds: number = 7 * 24 * 60 * 60): AuthTokens {
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload, refreshExpiresInSeconds);
    return { accessToken, refreshToken };
  }

  async register(dto: RegisterDto, ipAddress: string | null, userAgent: string | null): Promise<{ user: SafeUser; tokens: AuthTokens }> {
    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) {
      throw new AppError("An account with this email already exists.", 409);
    }

    const passwordHash = await hashPassword(dto.password);
    const user = await this.userRepo.create({
      email: dto.email,
      passwordHash,
      name: dto.name,
    });

    const payload: JwtPayload = { userId: user.id, email: user.email, role: user.role };
    const tokens = this.generateTokens(payload);

    await this.sessionRepo.create({
      userId: user.id,
      token: randomUUID(),
      userAgent: userAgent || null,
      ipAddress: ipAddress || null,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await this.refreshTokenRepo.create({
      userId: user.id,
      token: tokens.refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const verificationToken = randomUUID();
    await prisma.emailVerification.create({
      data: {
        userId: user.id,
        token: verificationToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    // Email delivery failures must never block registration — the user already
    // has a working account either way, and can request a new link later.
    try {
      await sendVerificationEmail(user.email, verificationToken);
    } catch (err) {
      console.error("Failed to send verification email:", err);
    }

    return { user: this.sanitizeUser(user), tokens };
  }

  async login(dto: LoginDto, ipAddress: string | null, userAgent: string | null): Promise<{ user: SafeUser; tokens: AuthTokens }> {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user || user.deletedAt) {
      throw new AppError("Invalid email or password.", 401);
    }

    const isValid = await comparePassword(dto.password, user.passwordHash);
    if (!isValid) {
      throw new AppError("Invalid email or password.", 401);
    }

    const payload: JwtPayload = { userId: user.id, email: user.email, role: user.role };
    const refreshDuration = dto.rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
    const tokens = this.generateTokens(payload, refreshDuration / 1000);

    const sessionDuration = dto.rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
    await this.sessionRepo.create({
      userId: user.id,
      token: randomUUID(),
      userAgent: userAgent || null,
      ipAddress: ipAddress || null,
      expiresAt: new Date(Date.now() + sessionDuration),
    });

    await this.refreshTokenRepo.create({
      userId: user.id,
      token: tokens.refreshToken,
      expiresAt: new Date(Date.now() + refreshDuration),
    });

    return { user: this.sanitizeUser(user), tokens };
  }

  async refreshTokens(refreshTokenStr: string): Promise<AuthTokens> {
    const storedToken = await this.refreshTokenRepo.findByToken(refreshTokenStr);
    if (!storedToken || storedToken.revokedAt || new Date() > storedToken.expiresAt) {
      throw new AppError("Invalid or expired refresh token.", 401);
    }

    await this.refreshTokenRepo.revoke(storedToken.id);

    const payload = verifyRefreshToken(refreshTokenStr);
    // Preserve the original grant length (e.g. "remember me" = 30d vs 7d) across rotation,
    // instead of collapsing every refresh back down to a fixed 7 days.
    const originalDurationMs = storedToken.expiresAt.getTime() - storedToken.createdAt.getTime();
    const refreshDurationMs = originalDurationMs > 0 ? originalDurationMs : 7 * 24 * 60 * 60 * 1000;
    const newTokens = this.generateTokens(payload, refreshDurationMs / 1000);

    await this.refreshTokenRepo.create({
      userId: payload.userId,
      token: newTokens.refreshToken,
      expiresAt: new Date(Date.now() + refreshDurationMs),
    });

    return newTokens;
  }

  async logout(userId: string): Promise<void> {
    await this.sessionRepo.deleteManyByUserId(userId);
    await this.refreshTokenRepo.revokeAllByUserId(userId);
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<void> {
    const user = await this.userRepo.findByEmail(dto.email);
    if (user) {
      const token = randomUUID();
      await prisma.passwordReset.create({
        data: { userId: user.id, token, expiresAt: new Date(Date.now() + 3600000) },
      });
      // Same rule as the verification email: never let a delivery failure surface
      // as an API error, since that would leak whether the address exists.
      try {
        await sendPasswordResetEmail(user.email, token);
      } catch (err) {
        console.error("Failed to send password reset email:", err);
      }
    }
    // No else branch — the API route returns { sent: true } unconditionally either
    // way, so this method must not throw or behave differently for unknown emails.
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const reset = await prisma.passwordReset.findUnique({ where: { token: dto.token } });
    if (!reset || reset.usedAt || new Date() > reset.expiresAt) {
      throw new AppError("Invalid or expired token.", 400);
    }

    const passwordHash = await hashPassword(dto.password);
    await this.userRepo.update(reset.userId, { passwordHash });
    await prisma.passwordReset.update({ where: { id: reset.id }, data: { usedAt: new Date() } });
    await this.refreshTokenRepo.revokeAllByUserId(reset.userId);
    await this.sessionRepo.deleteManyByUserId(reset.userId);
  }

  async changePassword(userId: string, dto: ChangePasswordDto, currentRefreshToken?: string): Promise<void> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new AppError("User not found.", 404);

    const isValid = await comparePassword(dto.currentPassword, user.passwordHash);
    if (!isValid) throw new AppError("Current password is incorrect.", 401);

    const passwordHash = await hashPassword(dto.newPassword);
    await this.userRepo.update(userId, { passwordHash });

    // Invalidate every other session so a stolen/leaked refresh token stops
    // working the moment the password changes, without logging the user out
    // of the device they just used to change it.
    if (currentRefreshToken) {
      await this.refreshTokenRepo.revokeAllByUserIdExcept(userId, currentRefreshToken);
    } else {
      await this.refreshTokenRepo.revokeAllByUserId(userId);
    }
  }

  async deleteAccount(userId: string, dto: DeleteAccountDto): Promise<void> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new AppError("User not found.", 404);

    const isValid = await comparePassword(dto.password, user.passwordHash);
    if (!isValid) throw new AppError("Password is incorrect.", 401);

    await this.userRepo.update(userId, { deletedAt: new Date() });
  }

  async resendVerificationEmail(userId: string): Promise<void> {
    const user = await this.userRepo.findById(userId);
    if (!user || user.deletedAt) {
      throw new AppError("User not found.", 404);
    }
    if (user.emailVerified) {
      throw new AppError("Your email is already verified.", 400);
    }

    const token = randomUUID();
    await prisma.emailVerification.create({
      data: { userId: user.id, token, expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) },
    });
    await sendVerificationEmail(user.email, token);
  }

  async verifyEmail(token: string): Promise<void> {
    const verification = await prisma.emailVerification.findUnique({ where: { token } });
    if (!verification || verification.verifiedAt || new Date() > verification.expiresAt) {
      throw new AppError("Invalid or expired token.", 400);
    }

    await this.userRepo.update(verification.userId, { emailVerified: true });
    await prisma.emailVerification.update({ where: { id: verification.id }, data: { verifiedAt: new Date() } });
  }

  async getProfile(userId: string): Promise<SafeUser> {
    const user = await this.userRepo.findById(userId);
    if (!user || user.deletedAt) {
      throw new AppError("User not found.", 404);
    }
    return this.sanitizeUser(user);
  }

  async updateProfile(userId: string, dto: import("@/validators/auth.validator").UpdateProfileDto): Promise<SafeUser> {
    const user = await this.userRepo.findById(userId);
    if (!user || user.deletedAt) {
      throw new AppError("User not found.", 404);
    }

    const updated = await this.userRepo.update(userId, {
      ...(dto.name !== undefined ? { name: dto.name } : {}),
      ...(dto.bio !== undefined ? { bio: dto.bio } : {}),
      ...(dto.location !== undefined ? { location: dto.location } : {}),
      ...(dto.avatar !== undefined ? { avatar: dto.avatar || null } : {}),
    });
    return this.sanitizeUser(updated);
  }
}
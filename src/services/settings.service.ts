import { prisma } from "@/infra/database/prisma/client";

export interface NotificationPrefs {
  productUpdates: boolean;
  aiCreditAlerts: boolean;
  marketingEmails: boolean;
}

export interface PrivacyPrefs {
  profileVisible: boolean;
}

const DEFAULT_NOTIFICATIONS: NotificationPrefs = {
  productUpdates: true,
  aiCreditAlerts: true,
  marketingEmails: false,
};

const DEFAULT_PRIVACY: PrivacyPrefs = {
  profileVisible: false,
};

export class SettingsService {
  async getSettings(userId: string) {
    const settings = await prisma.userSettings.upsert({
      where: { userId },
      update: {},
      create: { userId, theme: "system", notifications: DEFAULT_NOTIFICATIONS, privacy: DEFAULT_PRIVACY },
    });
    return settings;
  }

  async updateSettings(
    userId: string,
    dto: { theme?: string; notifications?: Partial<NotificationPrefs>; privacy?: Partial<PrivacyPrefs> }
  ) {
    const current = await this.getSettings(userId);
    const notifications = { ...(current.notifications as object), ...(dto.notifications ?? {}) };
    const privacy = { ...(current.privacy as object), ...(dto.privacy ?? {}) };

    return prisma.userSettings.update({
      where: { userId },
      data: {
        theme: dto.theme ?? current.theme,
        notifications,
        privacy,
      },
    });
  }
}

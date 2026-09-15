/**
 * Email provider abstraction.
 *
 * Production: set RESEND_API_KEY and EMAIL_FROM to send real emails via Resend
 * (https://resend.com — a single HTTPS API call, no SMTP setup required).
 *
 * Development / no key configured: falls back to logging the email to the
 * console so verification and password-reset links are still visible and
 * usable locally without any external service.
 */

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailProvider {
  send(message: EmailMessage): Promise<void>;
}

class ResendEmailProvider implements EmailProvider {
  constructor(private apiKey: string, private from: string) {}

  async send(message: EmailMessage): Promise<void> {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: this.from,
        to: message.to,
        subject: message.subject,
        html: message.html,
        text: message.text,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Failed to send email via Resend (${res.status}): ${body}`);
    }
  }
}

class ConsoleEmailProvider implements EmailProvider {
  async send(message: EmailMessage): Promise<void> {
    // eslint-disable-next-line no-console
    console.log(
      `\n[email:dev-fallback] No RESEND_API_KEY configured — printing instead of sending.\n` +
        `To: ${message.to}\nSubject: ${message.subject}\n${message.text ?? message.html}\n`
    );
  }
}

let cachedProvider: EmailProvider | null = null;

export function getEmailProvider(): EmailProvider {
  if (cachedProvider) return cachedProvider;

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "ZKR Resume AI <onboarding@resend.dev>";

  cachedProvider = apiKey ? new ResendEmailProvider(apiKey, from) : new ConsoleEmailProvider();
  return cachedProvider;
}

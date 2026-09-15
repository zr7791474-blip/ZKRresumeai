import { getEmailProvider } from "@/lib/email/provider";
import { verificationEmail, passwordResetEmail } from "@/lib/email/templates";

export async function sendVerificationEmail(to: string, token: string): Promise<void> {
  const { subject, html, text } = verificationEmail(token);
  await getEmailProvider().send({ to, subject, html, text });
}

export async function sendPasswordResetEmail(to: string, token: string): Promise<void> {
  const { subject, html, text } = passwordResetEmail(token);
  await getEmailProvider().send({ to, subject, html, text });
}

import nodemailer from "nodemailer";
import { env } from "@/env.mjs";

export type EmailTemplate = {
  subject: string;
  htmlBody: string;
  textBody: string;
};

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465, // true for 465, false for other ports
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export async function sendEmail({
  to,
  template,
  from = `"${env.SMTP_FROM_NAME}" <${env.SMTP_FROM_EMAIL}>`,
}: {
  to: string | string[];
  template: EmailTemplate;
  from?: string;
}) {
  const toAddresses = Array.isArray(to) ? to : [to];

  try {
    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: from,
      to: toAddresses.join(", "),
      subject: template.subject,
      text: template.textBody,
      html: template.htmlBody,
    });

    console.log("Message sent: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

// Verify SMTP connection on startup
transporter.verify(function (error, success) {
  if (error) {
    console.error("SMTP connection error:", error);
  } else {
    console.log("SMTP server is ready to take our messages");
  }
});

// Helper function to load email template
export async function loadEmailTemplate(templateName: string): Promise<EmailTemplate> {
  const template = await import(`@/emails/templates/${templateName}`);
  return template.default;
} 
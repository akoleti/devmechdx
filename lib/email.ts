import nodemailer from "nodemailer";
import { env } from "@/env.mjs";

export type EmailTemplate = {
  subject: string;
  htmlBody: string;
  textBody: string;
};

// Initialize transporter variable
let transporter: nodemailer.Transporter;
let isEtherealAccount = false;
let etherealPreviewUrl = '';

// Setup email transport - now async to support Ethereal fallback
async function setupEmailTransport() {
  try {
    // Check if we have SMTP credentials
    if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
      // Create reusable transporter object using SMTP transport
      transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_PORT === 465, // true for 465, false for other ports
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
      });

      // Verify connection
      await transporter.verify();
      console.log("SMTP server is ready to take our messages");
      isEtherealAccount = false;
    } else {
      // Fallback to Ethereal for testing
      console.warn("No SMTP credentials found, falling back to Ethereal test account");
      const testAccount = await nodemailer.createTestAccount();
      
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      
      isEtherealAccount = true;
      console.log("Using Ethereal test account for email sending:", testAccount.user);
    }
  } catch (error) {
    console.error("Failed to set up email transport:", error);
    // Create a dummy transport that logs but doesn't send
    transporter = {
      sendMail: async (options: nodemailer.SendMailOptions) => {
        console.log("Email would have been sent:", options);
        return { messageId: "dummy-id" };
      },
    } as any;
  }
}

// Call setup function right away
setupEmailTransport().catch(console.error);

export async function sendEmail({
  to,
  template,
  from = env.SMTP_FROM_EMAIL ? `"${env.SMTP_FROM_NAME}" <${env.SMTP_FROM_EMAIL}>` : undefined,
}: {
  to: string | string[];
  template: EmailTemplate;
  from?: string;
}) {
  const toAddresses = Array.isArray(to) ? to : [to];

  // Ensure transporter is initialized
  if (!transporter) {
    await setupEmailTransport();
  }

  try {
    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: from || "noreply@example.com",
      to: toAddresses.join(", "),
      subject: template.subject,
      text: template.textBody,
      html: template.htmlBody,
    });

    console.log("Message sent: %s", info.messageId);
    
    // If using Ethereal, get the preview URL
    if (isEtherealAccount && info) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        etherealPreviewUrl = previewUrl as string;
        console.log("Preview URL: %s", etherealPreviewUrl);
        console.log("⚠️ Using Ethereal test account - emails are not actually delivered to recipients!");
        console.log("Open the preview URL above to see the email content.");
      }
    }
    
    return { 
      success: true, 
      messageId: info.messageId,
      isTestAccount: isEtherealAccount,
      previewUrl: isEtherealAccount ? etherealPreviewUrl : undefined
    };
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

// Helper function to load email template
export async function loadEmailTemplate(templateName: string): Promise<EmailTemplate> {
  const template = await import(`@/emails/templates/${templateName}`);
  return template.default;
} 
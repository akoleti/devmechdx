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
    // Check if we have SMTP credentials for SendGrid
    if (env.SMTP_HOST === "smtp.sendgrid.net" && env.SMTP_USER && env.SMTP_PASS) {
      console.log(`Setting up SendGrid SMTP transport with host: ${env.SMTP_HOST}, port: ${env.SMTP_PORT}, user: ${env.SMTP_USER}`);
      
      // Create SendGrid transporter
      transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: false, // SendGrid doesn't use SSL on port 587
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
        debug: true, // Enable debug output
      });

      // Verify connection
      console.log("Verifying SendGrid SMTP connection...");
      try {
        await transporter.verify();
        console.log("✅ SendGrid SMTP server connection verified and ready to send messages");
        isEtherealAccount = false;
      } catch (verifyError: any) {
        console.error("SendGrid SMTP verification failed:", {
          error: {
            name: verifyError.name,
            message: verifyError.message,
            code: verifyError.code,
            command: verifyError.command,
            responseCode: verifyError.responseCode,
            response: verifyError.response
          }
        });
        throw verifyError;
      }
    } 
    // Try generic SMTP if not SendGrid
    else if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
      console.log(`Setting up generic SMTP transport with host: ${env.SMTP_HOST}, port: ${env.SMTP_PORT}, user: ${env.SMTP_USER}`);
      
      // Create reusable transporter object using SMTP transport
      transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_PORT === 465, // true for 465, false for other ports
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
        debug: true, // Enable debug output
        logger: true, // Log information
      });

      // Verify connection
      console.log("Verifying SMTP connection...");
      try {
        await transporter.verify();
        console.log("✅ SMTP server connection verified and ready to send messages");
        isEtherealAccount = false;
      } catch (verifyError: any) {
        console.error("SMTP verification failed:", {
          error: {
            name: verifyError.name,
            message: verifyError.message,
            code: verifyError.code,
            command: verifyError.command,
            responseCode: verifyError.responseCode,
            response: verifyError.response
          }
        });
        throw verifyError;
      }
    } else {
      // Log missing configuration
      if (!env.SMTP_HOST) console.warn("Missing SMTP_HOST environment variable");
      if (!env.SMTP_USER) console.warn("Missing SMTP_USER environment variable");
      if (!env.SMTP_PASS) console.warn("Missing SMTP_PASS environment variable");
      
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
  } catch (error: any) {
    console.error("Failed to set up email transport:", {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: error.code,
        command: error.command,
        responseCode: error.responseCode,
        response: error.response
      }
    });
    
    // Create a dummy transport that logs but doesn't send
    transporter = {
      sendMail: async (options: nodemailer.SendMailOptions) => {
        console.log("Email would have been sent (after transport setup failed):", options);
        return { messageId: "dummy-id" };
      },
    } as any;
    
    // This will allow the caller to continue without an exception
    console.log("Created dummy email transport that will log but not send emails");
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
    console.log("Email transporter not initialized, setting up now...");
    try {
      await setupEmailTransport();
    } catch (setupError: any) {
      console.error("Failed to setup email transport during sending attempt:", setupError);
      // Continue with the dummy transporter created during setupEmailTransport error handling
    }
  }

  // Safety check in case transporter is still undefined after setup attempt
  if (!transporter) {
    console.warn("Email transporter still undefined after setup attempt, using dummy transport");
    transporter = {
      sendMail: async (options: nodemailer.SendMailOptions) => {
        console.log("Email would have been sent (dummy transport):", options);
        return { messageId: "dummy-id" };
      },
    } as any;
  }

  try {
    console.log(`Attempting to send email to ${toAddresses.join(", ")} with subject "${template.subject}"`);
    console.log(`Using SMTP configuration: Host=${env.SMTP_HOST}, Port=${env.SMTP_PORT}, User=${env.SMTP_USER}, From=${from || "noreply@example.com"}`);
    
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
      try {
        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
          etherealPreviewUrl = previewUrl as string;
          console.log("Preview URL: %s", etherealPreviewUrl);
          console.log("⚠️ Using Ethereal test account - emails are not actually delivered to recipients!");
          console.log("Open the preview URL above to see the email content.");
        }
      } catch (previewError) {
        console.error("Error getting Ethereal preview URL:", previewError);
      }
    }
    
    return { 
      success: true, 
      messageId: info.messageId,
      isTestAccount: isEtherealAccount,
      previewUrl: isEtherealAccount ? etherealPreviewUrl : undefined
    };
  } catch (error: any) {
    // Enhanced error logging
    const errorDetails: any = {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
    
    // Add SMTP-specific error details if available
    if (error.code) errorDetails.code = error.code;
    if (error.command) errorDetails.command = error.command;
    if (error.responseCode) errorDetails.responseCode = error.responseCode;
    if (error.response) errorDetails.response = error.response;
    
    // Add transport configuration details
    const configDetails = {
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      authUser: env.SMTP_USER ? '[REDACTED]' : undefined,
      from: from || "noreply@example.com",
      to: toAddresses.join(", "),
      subject: template.subject
    };
    
    console.error("Error sending email:", {
      error: errorDetails,
      config: configDetails
    });
    
    throw error;
  }
}

// Helper function to load email template
export async function loadEmailTemplate(templateName: string): Promise<EmailTemplate> {
  const template = await import(`@/emails/templates/${templateName}`);
  return template.default;
} 
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db/index';
import { generatePasswordResetToken } from '@/lib/auth/password-reset';
import { ForgotPasswordEmail } from '@/emails/templates/forgotPasswordEmail';
import { renderAsync } from '@react-email/render';
import { sendEmail } from '@/lib/email';

// Validation schema for forgot password request
const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
});

export async function POST(req: NextRequest) {
  console.log('Forgot password endpoint called');
  
  try {
    // Parse request body
    const body = await req.json();
    console.log('Forgot password request body:', body);

    // Validate the request data
    const validationResult = forgotPasswordSchema.safeParse(body);
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error);
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const { email } = validationResult.data;
    
    // Lookup the user (but don't tell the client if they exist or not for security)
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log(`User not found for email: ${email}, but we'll still send a success response for security`);
      // Don't reveal that the user doesn't exist
      return NextResponse.json({ 
        success: true, 
        message: "If your email is registered, you will receive password reset instructions shortly."
      });
    }

    // Generate a password reset token
    const token = await generatePasswordResetToken(email);
    
    if (!token) {
      console.error(`Failed to generate password reset token for ${email}`);
      return NextResponse.json(
        { success: false, message: "Something went wrong. Please try again later." },
        { status: 500 }
      );
    }

    console.log(`Generated password reset token for email: ${email}`);

    // Create the reset link
    const origin = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const resetLink = `${origin}/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;
    console.log(`Reset link created: ${resetLink}`);

    // Send the password reset email
    try {
      console.log(`Preparing to send reset email to: ${email}`);
      
      // Render HTML content with improved styling to match the image
      const htmlBody = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              text-align: center;
              padding: 20px;
            }
            h1 {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 20px;
              color: #222;
            }
            p {
              margin-bottom: 20px;
              font-size: 16px;
            }
            .button {
              display: inline-block;
              background-color: #5e5ef7;
              color: white !important;
              text-decoration: none;
              padding: 12px 30px;
              border-radius: 4px;
              font-size: 16px;
              font-weight: normal;
              margin: 20px 0;
              width: 100%;
              text-align: center;
            }
            .footer {
              margin-top: 30px;
              font-size: 14px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Reset Your Password</h1>
            <p>We received a request to reset your DevMechDX account password. Click the button below to choose a new password:</p>
            <a href="${resetLink}" class="button">Reset Password</a>
            <div class="footer">
              <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const textBody = `
        Reset Your Password
        
        We received a request to reset your DevMechDX account password. Visit the link below to choose a new password:
        
        ${resetLink}
        
        If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
      `;

      console.log(`Rendering email template for: ${email}`);
      
      // Send the email
      const emailResult = await sendEmail({
        to: email,
        template: {
          subject: "Reset Your Password",
          htmlBody,
          textBody,
        },
      });

      console.log("Email send result:", emailResult);
      
      // If it's a test account, we should show the preview URL in the response for development
      if (emailResult.isTestAccount && emailResult.previewUrl) {
        console.log(`Using test email account - preview URL: ${emailResult.previewUrl}`);
        return NextResponse.json({
          success: true,
          message: "If your email is registered, you will receive password reset instructions shortly.",
          _dev: {
            isTestEmail: true,
            previewUrl: emailResult.previewUrl,
            note: "This information is only included in development mode"
          }
        });
      }

      return NextResponse.json({
        success: true,
        message: "If your email is registered, you will receive password reset instructions shortly."
      });
    } catch (error: any) {
      console.error("Error sending password reset email:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
      
      return NextResponse.json(
        { success: false, message: "Failed to send password reset email. Please try again later." },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error processing forgot password request:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred. Please try again later.' },
      { status: 500 }
    );
  }
} 
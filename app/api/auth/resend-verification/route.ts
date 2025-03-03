import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db/index';
import { generateVerificationToken, formatVerificationCode } from '@/lib/auth/verification-token';
import { VerificationEmail } from '@/emails/templates/verificationEmail';
import { sendEmail } from '@/lib/email';
import { renderAsync } from '@react-email/render';

const resendVerificationSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  console.log('Resend verification endpoint called');
  try {
    const body = await req.json();
    console.log('Resend verification request body:', body);

    // Validate request data
    const validationResult = resendVerificationSchema.safeParse(body);
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error);
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { email } = validationResult.data;
    console.log(`Resending verification for email: ${email}`);

    // Check if user exists and needs verification
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log(`User with email ${email} not found`);
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      console.log(`User ${email} is already verified`);
      return NextResponse.json(
        { 
          success: true, 
          message: 'Your email is already verified. You can proceed to login.',
          alreadyVerified: true
        }
      );
    }

    // Generate a new verification token
    const token = await generateVerificationToken(email);
    if (!token) {
      console.error('Failed to generate verification token');
      return NextResponse.json(
        { success: false, message: 'Failed to generate verification token' },
        { status: 500 }
      );
    }

    // Generate a short code for manual entry
    const verificationCode = formatVerificationCode(token);
    console.log(`Generated verification code: ${verificationCode}`);

    // Build verification URL
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const verificationLink = `${baseUrl}/verify-email?token=${token}&email=${encodeURIComponent(email)}`;
    console.log(`Verification URL: ${verificationLink}`);

    // Render the email template
    const emailComponent = VerificationEmail({
      verificationCode,
      verificationLink,
    });

    // Send verification email
    try {
      // Render the HTML content of the email
      const htmlContent = await renderAsync(emailComponent);
      
      await sendEmail({
        to: email,
        template: {
          subject: "Verify your email address",
          htmlBody: htmlContent,
          textBody: `Please verify your email by entering this code: ${verificationCode} or visiting this link: ${verificationLink}`,
        }
      });

      return NextResponse.json({
        success: true,
        message: 'Verification email sent successfully',
      });
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to send verification email',
          error: String(emailError)
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in resend verification:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred', error: String(error) },
      { status: 500 }
    );
  }
} 
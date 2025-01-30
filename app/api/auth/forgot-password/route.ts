import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set token expiration to 1 hour from now
    const tokenExpiration = new Date(Date.now() + 3600000);

    // Save the token in the database
    await db
      .update(users)
      .set({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: tokenExpiration,
      })
      .where(eq(users.email, email));

    // Create the reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    // Send the reset email
    await resend.emails.send({
      from: 'Your App <noreply@yourdomain.com>',
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });

    // For security reasons, we always return a success message
    // even if the email doesn't exist in our system
    return NextResponse.json({
      message: 'If an account exists with this email, you will receive password reset instructions.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
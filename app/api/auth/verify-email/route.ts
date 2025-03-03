import { NextRequest, NextResponse } from 'next/server';
import { consumeVerificationToken } from '@/lib/auth/verification-token';
import { z } from 'zod';
import { db } from '@/db/index';

const verifyEmailSchema = z.object({
  email: z.string().email(),
  token: z.string()
});

export async function POST(req: NextRequest) {
  console.log('Verification endpoint called');
  try {
    const body = await req.json();
    console.log('Verify email request body:', body);

    // Validate the request data
    const validationResult = verifyEmailSchema.safeParse(body);
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error);
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { email, token } = validationResult.data;
    console.log(`Verifying email: ${email} with token: ${token}`);

    // Check if user exists
    const user = await db.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.log(`User with email ${email} not found`);
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user is already verified
    if (user.emailVerified) {
      console.log(`User ${email} is already verified, no need to verify again`);
      return NextResponse.json({
        success: true,
        message: 'Email is already verified',
        alreadyVerified: true
      });
    }

    // Verify and consume the token
    const verified = await consumeVerificationToken(email, token);
    console.log(`Verification result: ${verified}`);

    if (!verified) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid or expired verification token' 
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Error verifying email:', error);
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    );
  }
} 
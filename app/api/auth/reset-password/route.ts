import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db/index';
import { resetPassword } from '@/lib/auth/password-reset';
import bcrypt from 'bcrypt';

// Validation schema for reset password request
const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function POST(req: NextRequest) {
  console.log('Reset password endpoint called');
  
  try {
    // Parse request body
    const body = await req.json();
    console.log('Reset password request received for email:', body.email);

    // Validate the request data
    const validationResult = resetPasswordSchema.safeParse(body);
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error);
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { email, token, password } = validationResult.data;
    
    // Check if user exists
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log(`User with email ${email} not found during password reset`);
      return NextResponse.json(
        { success: false, message: 'Invalid or expired reset link' },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('New password hashed');

    // Reset the password
    const success = await resetPassword(email, token, hashedPassword);
    
    if (!success) {
      console.log('Password reset failed, likely due to invalid or expired token');
      return NextResponse.json(
        { success: false, message: 'Invalid or expired reset link' },
        { status: 400 }
      );
    }

    console.log(`Password reset successful for user: ${email}`);
    
    return NextResponse.json({
      success: true,
      message: 'Your password has been reset successfully. You can now log in with your new password.',
    });
  } catch (error) {
    console.error('Error processing reset password request:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while resetting your password. Please try again.' },
      { status: 500 }
    );
  }
} 
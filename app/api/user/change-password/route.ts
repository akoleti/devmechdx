import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import * as bcrypt from 'bcrypt';

// Schema for validating password change requests
const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, { message: 'Current password is required' }),
  newPassword: z.string().min(8, { message: 'Password must be at least 8 characters' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: 'Password must include uppercase, lowercase and number',
    }),
});

/**
 * POST /api/user/change-password
 * 
 * Change a user's password after verifying their current password
 * Requires authentication
 */
export async function POST(request: Request) {
  try {
    // Verify user is authenticated
    const session = await auth();
    console.log('Session user:', session?.user?.id ? 'Authenticated' : 'Not authenticated');
    
    if (!session?.user?.id) {
      console.error('Authentication failed: No user ID in session');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Additional session validation
    if (!session.user.email) {
      console.error('Authentication issue: No email in session');
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 400 }
      );
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
      console.log('Received password change request:', { ...body, currentPassword: '[REDACTED]', newPassword: '[REDACTED]' });
      
      const validationResult = passwordChangeSchema.safeParse(body);
      if (!validationResult.success) {
        console.error('Validation error:', validationResult.error.format());
        return NextResponse.json(
          { error: 'Invalid request data', details: validationResult.error.format() },
          { status: 400 }
        );
      }
    } catch (e) {
      console.error('Error parsing request body:', e);
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = body;

    // Get user from database with more fields for validation
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { 
        hashedPassword: true, 
        email: true,
        id: true,
        emailVerified: true
      }
    });

    console.log('Found user in database:', user ? 'Yes' : 'No');
    if (user) {
      console.log('Email verified:', user.emailVerified ? 'Yes' : 'No');
    }

    if (!user) {
      console.error('User not found in database for ID:', session.user.id);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Ensure email is verified
    if (!user.emailVerified) {
      console.error('Attempting to change password for unverified email');
      return NextResponse.json(
        { error: 'Email not verified. Please verify your email before changing password.' },
        { status: 400 }
      );
    }

    // Verify current password
    let passwordValid = false;
    if (user.hashedPassword) {
      passwordValid = await bcrypt.compare(currentPassword, user.hashedPassword);
      console.log('Current password validation:', passwordValid ? 'Valid' : 'Invalid');
      
      if (!passwordValid) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 400 }
        );
      }
    } else {
      // If user doesn't have a password yet (e.g., social login), just set the new one
      console.log('User does not have a password set, setting new password');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log('New password hashed successfully');

    // Update user password
    try {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { 
          hashedPassword: hashedPassword,
        }
      });
      console.log('Password updated in database');
    } catch (updateError: any) {
      console.error('Error updating password in database:', updateError);
      // Check if this is a database constraint error
      if (updateError.code === 'P2002') {
        return NextResponse.json(
          { error: 'Database constraint violation. Please try a different password.' },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to update password in database' },
        { status: 500 }
      );
    }

    // Log the password change activity if user has an organization context
    if (session.user.currentOrganization?.id) {
      try {
        await prisma.activity.create({
          data: {
            resourceId: session.user.id,
            activityType: 'UPDATE',
            activityDate: new Date(),
            byUserId: session.user.id,
            organizationId: session.user.currentOrganization.id,
          }
        });
        console.log('Password change activity logged');
      } catch (err) {
        // If activity logging fails, we still want to return success for the password change
        console.error('Failed to log activity:', err);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json(
      { error: 'Failed to change password' },
      { status: 500 }
    );
  }
} 
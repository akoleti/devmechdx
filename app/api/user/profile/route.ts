import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Schema for validating profile update requests
const profileUpdateSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  preferences: z.object({
    timezone: z.string().optional(),
  }).optional(),
});

/**
 * GET /api/user/profile
 * 
 * Get the current user's profile information
 * Requires authentication
 */
export async function GET(request: Request) {
  try {
    // Verify user is authenticated
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user from database with full details
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { 
        id: true,
        name: true, 
        email: true,
        emailVerified: true,
        image: true,
        preferences: true,
        createdAt: true,
        lastLogin: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/user/profile
 * 
 * Update the current user's profile information
 * Requires authentication
 */
export async function PUT(request: Request) {
  try {
    // Verify user is authenticated
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate request body
    let body;
    try {
      body = await request.json();
      const validationResult = profileUpdateSchema.safeParse(body);
      
      if (!validationResult.success) {
        return NextResponse.json(
          { error: 'Invalid request data', details: validationResult.error.format() },
          { status: 400 }
        );
      }
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { name, preferences } = body;

    // Get current user data
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { 
        preferences: true,
      }
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const currentPreferences = currentUser.preferences || {};
    const updatedPreferences = preferences 
      ? { ...JSON.parse(JSON.stringify(currentPreferences)), ...preferences }
      : currentPreferences;

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        name,
        preferences: updatedPreferences,
      },
      select: {
        id: true,
        name: true,
        email: true,
        preferences: true,
      }
    });

    // Create activity record for the profile update
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
      } catch (err) {
        console.error('Failed to log activity:', err);
      }
    }

    return NextResponse.json({
      user: updatedUser,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Schema for validating notification preferences
const preferencesSchema = z.object({
  preferences: z.object({
    emailNotifications: z.boolean().optional(),
    pushNotifications: z.boolean().optional(),
    systemAlerts: z.boolean().optional(),
    equipmentUpdates: z.boolean().optional(),
    logEvents: z.boolean().optional(),
    reportGeneration: z.boolean().optional(),
  })
});

/**
 * GET /api/user/preferences
 * 
 * Get the current user's preferences
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

    // Get user preferences from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { 
        preferences: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      preferences: user.preferences || {}
    });
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user preferences' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/user/preferences
 * 
 * Update the current user's notification preferences
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
      const validationResult = preferencesSchema.safeParse(body);
      
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

    const { preferences } = body;

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

    // Prepare update data by merging with existing preferences
    const currentPreferences = currentUser.preferences || {};
    const updatedPreferences = { 
      ...JSON.parse(JSON.stringify(currentPreferences)), 
      ...preferences 
    };

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        preferences: updatedPreferences,
      },
      select: {
        id: true,
        preferences: true,
      }
    });

    // Create activity record for the preferences update
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
      preferences: updatedUser.preferences,
      message: 'Preferences updated successfully',
    });
  } catch (error) {
    console.error('Error updating user preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update user preferences' },
      { status: 500 }
    );
  }
} 
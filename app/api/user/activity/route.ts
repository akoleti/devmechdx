import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/user/activity
 * 
 * Get recent activity for the current user
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

    // Get query params for pagination
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const page = parseInt(url.searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    // Get activities where the user was the actor (byUserId)
    const activities = await prisma.activity.findMany({
      where: {
        byUserId: session.user.id,
      },
      orderBy: {
        activityDate: 'desc',
      },
      take: limit,
      skip: skip,
      include: {
        organization: {
          select: {
            name: true,
          },
        },
      },
    });

    // Get total count for pagination
    const totalActivities = await prisma.activity.count({
      where: {
        byUserId: session.user.id,
      },
    });

    // Format activities for client consumption
    const formattedActivities = activities.map(activity => {
      // Generate a human-readable description based on activity type
      let description;
      switch (activity.activityType) {
        case 'VIEW':
          description = 'Viewed a resource';
          break;
        case 'CREATE':
          description = 'Created a resource';
          break;
        case 'UPDATE':
          description = 'Updated a resource';
          break;
        case 'DELETE':
          description = 'Deleted a resource';
          break;
        case 'SUBMIT':
          description = 'Submitted a form or request';
          break;
        case 'LOG':
          description = 'Logged an event';
          break;
        default:
          description = `Performed an action: ${activity.activityType}`;
      }

      return {
        id: activity.id,
        description,
        activityType: activity.activityType,
        activityDate: activity.activityDate,
        organizationName: activity.organization?.name || 'Personal',
      };
    });

    // Return paginated results
    return NextResponse.json({
      activities: formattedActivities,
      totalActivities,
      totalPages: Math.ceil(totalActivities / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching user activity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity history' },
      { status: 500 }
    );
  }
} 
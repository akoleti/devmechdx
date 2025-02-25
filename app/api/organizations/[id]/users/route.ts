import { NextResponse } from "next/server";
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/organizations/[id]/users
 * 
 * Fetches all users in a specific organization
 * Requires authentication and user must be in the organization
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const organizationId = params.id;

    // Verify the current user belongs to this organization
    const userOrganization = await prisma.organizationUser.findUnique({
      where: {
        userId_organizationId: {
          userId: session.user.id,
          organizationId: organizationId,
        },
      },
    });

    if (!userOrganization) {
      return NextResponse.json(
        { error: 'You do not have access to this organization' },
        { status: 403 }
      );
    }

    // Get all users in the organization
    const organizationUsers = await prisma.organizationUser.findMany({
      where: {
        organizationId: organizationId,
        isDeleted: false,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    // Format the response
    const users = organizationUsers.map((orgUser) => ({
      id: orgUser.user.id,
      name: orgUser.user.name,
      email: orgUser.user.email,
      image: orgUser.user.image,
      role: orgUser.role,
      isActive: orgUser.isActive,
      isVerified: orgUser.isVerified,
      joinedAt: orgUser.createdAt,
    }));

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching organization users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch organization users' },
      { status: 500 }
    );
  }
} 
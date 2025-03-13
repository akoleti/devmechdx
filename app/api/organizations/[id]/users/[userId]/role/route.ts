import { NextResponse } from "next/server";
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for request body
const updateRoleSchema = z.object({
  role: z.enum(['ADMINISTRATOR', 'MANAGER', 'USER', 'SUPERVISOR', 'TECHNICIAN', 'DISPATCHER', 'ESTIMATOR', 'CUSTOMER']),
});

/**
 * PUT /api/organizations/[id]/users/[userId]/role
 * 
 * Updates a user's role in an organization
 * Only administrators and managers can update roles
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string, userId: string } }
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
    const targetUserId = params.userId;

    // Verify the current user belongs to this organization and has appropriate role
    const currentUserOrganization = await prisma.organizationUser.findUnique({
      where: {
        userId_organizationId: {
          userId: session.user.id,
          organizationId: organizationId,
        },
        isDeleted: false,
      },
    });

    if (!currentUserOrganization) {
      return NextResponse.json(
        { error: 'You do not have access to this organization' },
        { status: 403 }
      );
    }

    // Verify the user is an administrator or manager
    if (!['ADMINISTRATOR', 'MANAGER'].includes(currentUserOrganization.role)) {
      return NextResponse.json(
        { error: 'You do not have permission to update user roles' },
        { status: 403 }
      );
    }

    // Verify target user exists in the organization
    const targetUserOrganization = await prisma.organizationUser.findUnique({
      where: {
        userId_organizationId: {
          userId: targetUserId,
          organizationId: organizationId,
        },
        isDeleted: false,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    });

    if (!targetUserOrganization) {
      return NextResponse.json(
        { error: 'Target user is not a member of this organization' },
        { status: 404 }
      );
    }

    // Parse and validate the request body
    let body;
    try {
      body = await request.json();
      const validation = updateRoleSchema.safeParse(body);
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Invalid request data', details: validation.error.format() },
          { status: 400 }
        );
      }
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { role } = body;

    // Manager cannot set a user role to ADMINISTRATOR
    if (currentUserOrganization.role === 'MANAGER' && role === 'ADMINISTRATOR') {
      return NextResponse.json(
        { error: 'Managers cannot assign administrator roles' },
        { status: 403 }
      );
    }

    // Admin cannot change another admin's role
    if (targetUserOrganization.role === 'ADMINISTRATOR' && 
        targetUserId !== session.user.id && 
        role !== 'ADMINISTRATOR') {
      return NextResponse.json(
        { error: 'You cannot change another administrator\'s role' },
        { status: 403 }
      );
    }

    // Update the user's role
    const updatedUserOrganization = await prisma.organizationUser.update({
      where: {
        id: targetUserOrganization.id,
      },
      data: {
        role,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: `User role updated to ${role}`,
      userEmail: targetUserOrganization.user.email,
      userName: targetUserOrganization.user.name,
      role: updatedUserOrganization.role,
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json(
      { error: 'Failed to update user role' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from "next/server";
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for request body
const updateRoleSchema = z.object({
  role: z.enum(['ADMINISTRATOR', 'MANAGER', 'USER', 'SUPERVISOR', 'TECHNICIAN', 'DISPATCHER', 'ESTIMATOR', 'CUSTOMER']),
});

/**
 * PUT /api/organizations/[id]/invitations/[invitationId]/role
 * 
 * Updates an invitation's role before it's accepted
 * Only administrators and managers can update invitation roles
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string, invitationId: string } }
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
    const invitationId = params.invitationId;

    // Verify the current user belongs to this organization and has appropriate role
    const userOrganization = await prisma.organizationUser.findUnique({
      where: {
        userId_organizationId: {
          userId: session.user.id,
          organizationId: organizationId,
        },
        isDeleted: false,
      },
    });

    if (!userOrganization) {
      return NextResponse.json(
        { error: 'You do not have access to this organization' },
        { status: 403 }
      );
    }

    // Verify the user is an administrator or manager
    if (!['ADMINISTRATOR', 'MANAGER'].includes(userOrganization.role)) {
      return NextResponse.json(
        { error: 'You do not have permission to update invitation roles' },
        { status: 403 }
      );
    }

    // Verify invitation exists and belongs to this organization
    const invitation = await prisma.organizationInvitation.findUnique({
      where: {
        id: invitationId,
        organizationId: organizationId,
        status: 'PENDING',
      },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: 'Invitation not found or already used' },
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

    // Manager cannot set a role to ADMINISTRATOR
    if (userOrganization.role === 'MANAGER' && role === 'ADMINISTRATOR') {
      return NextResponse.json(
        { error: 'Managers cannot assign administrator roles' },
        { status: 403 }
      );
    }

    // Update the invitation role
    const updatedInvitation = await prisma.organizationInvitation.update({
      where: {
        id: invitationId,
      },
      data: {
        role,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Invitation role updated to ${role}`,
      invitationId: updatedInvitation.id,
      email: updatedInvitation.email,
      role: updatedInvitation.role,
    });
  } catch (error) {
    console.error('Error updating invitation role:', error);
    return NextResponse.json(
      { error: 'Failed to update invitation role' },
      { status: 500 }
    );
  }
} 
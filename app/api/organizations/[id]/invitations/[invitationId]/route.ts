import { NextResponse } from "next/server";
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

/**
 * DELETE /api/organizations/[id]/invitations/[invitationId]
 * 
 * Cancels a pending invitation
 * Requires authentication and appropriate permissions
 */
export async function DELETE(
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

    // Check if user has permission to cancel invitations
    const userRole = await prisma.organizationUser.findUnique({
      where: {
        userId_organizationId: {
          userId: session.user.id,
          organizationId,
        },
      },
      select: {
        role: true,
      },
    });

    if (!userRole || (userRole.role !== 'ADMINISTRATOR' && userRole.role !== 'MANAGER')) {
      return NextResponse.json(
        { error: 'You do not have permission to cancel invitations' },
        { status: 403 }
      );
    }

    // Check if invitation exists and belongs to the organization
    const invitation = await prisma.organizationInvitation.findFirst({
      where: {
        id: invitationId,
        organizationId,
        status: 'PENDING',
      },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: 'Invitation not found or already processed' },
        { status: 404 }
      );
    }

    // Delete the invitation
    await prisma.organizationInvitation.delete({
      where: {
        id: invitationId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Invitation canceled successfully',
    });
  } catch (error) {
    console.error('Error canceling invitation:', error);
    return NextResponse.json(
      { error: 'Failed to cancel invitation' },
      { status: 500 }
    );
  }
} 
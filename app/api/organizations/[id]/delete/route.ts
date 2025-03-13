import { NextResponse } from "next/server";
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

/**
 * DELETE /api/organizations/[id]/delete
 * 
 * Permanently deletes an organization and all associated data
 * Only organization administrators can delete an organization
 */
export async function DELETE(
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

    // Verify the user is an administrator
    if (userOrganization.role !== 'ADMINISTRATOR') {
      return NextResponse.json(
        { error: 'Only administrators can delete an organization' },
        { status: 403 }
      );
    }

    // Begin transaction to delete organization and related data
    await prisma.$transaction(async (tx) => {
      // 1. Delete all organization invitations
      await tx.organizationInvitation.deleteMany({
        where: { organizationId }
      });

      // 2. Mark all organization user relationships as deleted
      await tx.organizationUser.updateMany({
        where: { organizationId },
        data: { 
          isDeleted: true,
          updatedAt: new Date()
        }
      });

      // 3. Delete the organization itself
      await tx.organization.delete({
        where: { id: organizationId }
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Organization has been permanently deleted'
    });
  } catch (error) {
    console.error('Error deleting organization:', error);
    return NextResponse.json(
      { error: 'Failed to delete organization' },
      { status: 500 }
    );
  }
} 
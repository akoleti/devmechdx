import { NextResponse } from "next/server";
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/invitations/[token]/accept
 * 
 * Accepts an invitation and adds the user to the organization
 * Requires authentication
 */
export async function POST(
  request: Request,
  { params }: { params: { token: string } }
) {
  try {
    const session = await auth();

    // Check if user is authenticated
    if (!session?.user) {
      console.log("Accept invitation failed: User not authenticated");
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = params.token;
    console.log(`Processing invitation acceptance for token: ${token}`);

    // Check if invitation exists and is valid
    const invitation = await prisma.organizationInvitation.findUnique({
      where: {
        token,
        status: 'PENDING',
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!invitation) {
      console.log(`Invitation not found or already used: ${token}`);
      return NextResponse.json(
        { error: 'Invitation not found or already used' },
        { status: 404 }
      );
    }

    // Check if invitation has expired
    if (invitation.expiresAt < new Date()) {
      console.log(`Invitation expired: ${token}, expired at ${invitation.expiresAt}`);
      // Update invitation status to EXPIRED
      await prisma.organizationInvitation.update({
        where: { id: invitation.id },
        data: { status: 'EXPIRED' },
      });

      return NextResponse.json(
        { error: 'Invitation expired' },
        { status: 410 }
      );
    }

    // Check if user's email matches the invitation email
    console.log(`Comparing emails - Session: ${session.user.email}, Invitation: ${invitation.email}`);
    if (session.user.email !== invitation.email) {
      console.log(`Email mismatch - Session: ${session.user.email}, Invitation: ${invitation.email}`);
      return NextResponse.json(
        { error: 'This invitation was sent to a different email address' },
        { status: 403 }
      );
    }

    // Check if user is already a member of the organization
    const existingMember = await prisma.organizationUser.findUnique({
      where: {
        userId_organizationId: {
          userId: session.user.id,
          organizationId: invitation.organizationId,
        },
      },
    });

    if (existingMember && !existingMember.isDeleted) {
      // User is already a member, update invitation status
      await prisma.organizationInvitation.update({
        where: { id: invitation.id },
        data: { status: 'ACCEPTED' },
      });

      return NextResponse.json({
        message: 'You are already a member of this organization',
        organization: invitation.organization,
        role: existingMember.role,
      });
    }

    if (existingMember && existingMember.isDeleted) {
      // Reactivate the user's membership
      await prisma.organizationUser.update({
        where: {
          id: existingMember.id,
        },
        data: {
          isDeleted: false,
          isActive: true,
          role: invitation.role,
          updatedAt: new Date(),
        },
      });
    } else {
      // Add the user to the organization
      await prisma.organizationUser.create({
        data: {
          userId: session.user.id,
          organizationId: invitation.organizationId,
          role: invitation.role,
          isActive: true,
          isVerified: true,
        },
      });
    }

    // Update invitation status to ACCEPTED
    await prisma.organizationInvitation.update({
      where: { id: invitation.id },
      data: { status: 'ACCEPTED' },
    });
    
    // Ensure organization data is properly structured
    const organizationData = invitation.organization ? {
      id: invitation.organization.id,
      name: invitation.organization.name,
    } : null;
    
    if (!organizationData) {
      console.error('Organization data is missing in the invitation');
      return NextResponse.json({
        error: 'Organization data is missing',
        status: 500
      });
    }
    
    console.log(`Successfully accepted invitation: ${invitation.id} for organization: ${invitation.organizationId}`);
    console.log('Returning organization data:', organizationData);

    return NextResponse.json({
      success: true,
      message: 'Successfully joined organization',
      organization: organizationData,
      role: invitation.role,
    });
  } catch (error) {
    console.error('Error accepting invitation:', error);
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    return NextResponse.json(
      { error: 'Failed to accept invitation' },
      { status: 500 }
    );
  }
} 
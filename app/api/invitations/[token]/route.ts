import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

/**
 * GET /api/invitations/[token]
 * 
 * Verifies an invitation token and returns the invitation details
 */
export async function GET(
  request: Request,
  { params }: { params: { token: string } }
) {
  try {
    const token = params.token;

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
        invitedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: 'Invitation not found or already used' },
        { status: 404 }
      );
    }

    // Check if invitation has expired
    if (invitation.expiresAt < new Date()) {
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

    return NextResponse.json({
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        message: invitation.message,
        organization: invitation.organization,
        invitedBy: invitation.invitedBy,
        expiresAt: invitation.expiresAt,
      }
    });
  } catch (error) {
    console.error('Error verifying invitation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
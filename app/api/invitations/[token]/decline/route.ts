import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

/**
 * POST /api/invitations/[token]/decline
 * 
 * Declines an invitation
 * Does not require authentication
 */
export async function POST(
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
    });

    if (!invitation) {
      return NextResponse.json(
        { error: 'Invitation not found or already processed' },
        { status: 404 }
      );
    }

    // Update invitation status to DECLINED
    await prisma.organizationInvitation.update({
      where: { id: invitation.id },
      data: { status: 'DECLINED' },
    });

    return NextResponse.json({
      success: true,
      message: 'Invitation declined',
    });
  } catch (error) {
    console.error('Error declining invitation:', error);
    return NextResponse.json(
      { error: 'Failed to decline invitation' },
      { status: 500 }
    );
  }
} 
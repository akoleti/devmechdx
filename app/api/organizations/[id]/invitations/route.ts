import { NextResponse } from "next/server";
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { Role } from '@prisma/client';
import { sendEmail } from '@/lib/email';

// Schema for validating the invitation request
const inviteSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["USER", "MANAGER", "ADMINISTRATOR", "SUPERVISOR", "TECHNICIAN", "DISPATCHER", "ESTIMATOR", "CUSTOMER"]),
  message: z.string().optional(),
});

/**
 * GET /api/organizations/[id]/invitations
 * 
 * Get all invitations for an organization
 * Requires authentication and appropriate permissions
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

    // Check if user has permission to view invitations
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
        { error: 'You do not have permission to view invitations' },
        { status: 403 }
      );
    }

    // Get all pending invitations for the organization
    const invitations = await prisma.organizationInvitation.findMany({
      where: {
        organizationId,
        status: 'PENDING',
      },
      include: {
        invitedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ invitations });
  } catch (error) {
    console.error('Error fetching invitations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invitations' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/organizations/[id]/invitations
 * 
 * Create and send a new invitation to join an organization
 * Requires authentication and appropriate permissions
 */
export async function POST(
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

    // Check if user has permission to send invitations
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
        { error: 'You do not have permission to send invitations' },
        { status: 403 }
      );
    }

    // Validate request body
    const body = await request.json();
    const validationResult = inviteSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { email, role, message } = validationResult.data;

    // Get organization details
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: { name: true },
    });

    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      );
    }

    // Check if user is already a member of the organization
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      const existingMember = await prisma.organizationUser.findUnique({
        where: {
          userId_organizationId: {
            userId: existingUser.id,
            organizationId,
          },
        },
      });

      if (existingMember && !existingMember.isDeleted) {
        return NextResponse.json(
          { error: 'This user is already a member of the organization' },
          { status: 400 }
        );
      }
    }

    // Check if there's already a pending invitation for this email
    const existingInvitation = await prisma.organizationInvitation.findFirst({
      where: {
        organizationId,
        email,
        status: 'PENDING',
      },
    });

    if (existingInvitation) {
      return NextResponse.json(
        { error: 'There is already a pending invitation for this email address' },
        { status: 400 }
      );
    }

    // Generate a unique token for the invitation
    const token = uuidv4();
    
    // Set expiration date (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Create invitation
    const invitation = await prisma.organizationInvitation.create({
      data: {
        organizationId,
        email,
        role: role as Role,
        token,
        message: message || null,
        expiresAt,
        invitedById: session.user.id,
      },
      include: {
        organization: {
          select: {
            name: true,
          },
        },
        invitedBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Create invitation link
    const origin = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const invitationLink = `${origin}/invitations/${token}`;
    
    // Send invitation email
    try {
      console.log(`Preparing to send invitation email to: ${email}`);
      
      // Prepare email content
      const htmlBody = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Invitation to Join ${organization.name}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              text-align: center;
              padding: 20px;
            }
            h1 {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 20px;
              color: #222;
            }
            p {
              margin-bottom: 20px;
              font-size: 16px;
            }
            .message {
              background-color: #f5f5f5;
              padding: 15px;
              border-radius: 4px;
              font-style: italic;
              margin: 20px 0;
            }
            .button {
              display: inline-block;
              background-color: #5e5ef7;
              color: white !important;
              text-decoration: none;
              padding: 12px 30px;
              border-radius: 4px;
              font-size: 16px;
              font-weight: normal;
              margin: 20px 0;
              width: 100%;
              text-align: center;
            }
            .footer {
              margin-top: 30px;
              font-size: 14px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>You've been invited to join ${organization.name}</h1>
            <p>${session.user.name || 'A team member'} has invited you to join their organization on DevMechDX.</p>
            ${message ? `<div class="message">"${message}"</div>` : ''}
            <p>You'll be given the role of <strong>${role.toLowerCase()}</strong> in this organization.</p>
            <a href="${invitationLink}" class="button">Accept Invitation</a>
            <div class="footer">
              <p>This invitation will expire in 7 days.</p>
              <p>If you didn't expect this invitation, you can safely ignore this email.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const textBody = `
        You've been invited to join ${organization.name}
        
        ${session.user.name || 'A team member'} has invited you to join their organization on DevMechDX.
        ${message ? `\nPersonal message: "${message}"\n` : ''}
        You'll be given the role of ${role.toLowerCase()} in this organization.
        
        Please click the link below to accept the invitation:
        ${invitationLink}
        
        This invitation will expire in 7 days.
        
        If you didn't expect this invitation, you can safely ignore this email.
      `;

      try {
        // Send the email
        const emailResult = await sendEmail({
          to: email,
          template: {
            subject: `You've been invited to join ${organization.name}`,
            htmlBody,
            textBody,
          },
        });

        console.log("Invitation email send result:", emailResult);
        
        // Return response with preview URL for test accounts
        if (emailResult.isTestAccount && emailResult.previewUrl) {
          console.log(`Using test email account - preview URL: ${emailResult.previewUrl}`);
          return NextResponse.json({
            success: true,
            message: `Invitation sent to ${email}`,
            invitationId: invitation.id,
            _dev: {
              isTestEmail: true,
              previewUrl: emailResult.previewUrl,
              note: "This information is only included in development mode"
            }
          });
        }

        return NextResponse.json({
          success: true,
          message: `Invitation sent to ${email}`,
          invitationId: invitation.id,
        });
      } catch (emailError: any) {
        console.error("Error sending invitation email:", {
          name: emailError.name,
          message: emailError.message,
          stack: emailError.stack,
          code: emailError.code
        });
        
        // Even if email sending fails, the invitation was created
        return NextResponse.json({
          success: true,
          message: `Invitation created for ${email}, but email delivery failed. User can still access via link.`,
          invitationId: invitation.id,
          invitationLink, // Including link in response since email failed
          warning: "Email delivery failed, but invitation was created successfully"
        });
      }
    } catch (outerError: any) {
      console.error("Unexpected error in invitation process:", outerError);
      
      // Even if there's an unexpected error, we still created the invitation 
      // The user can still access via link
      return NextResponse.json({
        success: true,
        message: `Invitation created for ${email}, but there was a problem with the email delivery.`,
        invitationId: invitation.id,
        invitationLink,
        warning: "There was a problem with the email delivery, but the invitation was created successfully"
      });
    }
  } catch (error) {
    console.error('Error creating invitation:', error);
    return NextResponse.json(
      { error: 'Failed to create invitation' },
      { status: 500 }
    );
  }
} 
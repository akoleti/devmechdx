import { NextResponse } from "next/server";
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { z } from 'zod';
import { sendEmail } from '@/lib/email';

// Validation schema for request body
const inviteSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  role: z.enum(['ADMINISTRATOR', 'MANAGER', 'USER']),
  message: z.string().optional(),
});

/**
 * POST /api/organizations/[id]/invite
 * 
 * Invites a user to join an organization
 * Requires authentication and user must be an admin or manager in the organization
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

    // Verify the current user belongs to this organization and has appropriate role
    const userOrganization = await prisma.organizationUser.findUnique({
      where: {
        userId_organizationId: {
          userId: session.user.id,
          organizationId: organizationId,
        },
        isDeleted: false,
      },
      include: {
        organization: {
          select: {
            name: true,
          },
        },
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
        { error: 'You do not have permission to invite users' },
        { status: 403 }
      );
    }

    // Parse and validate the request body
    let body;
    try {
      body = await request.json();
      const validation = inviteSchema.safeParse(body);
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

    const { email, role, message } = body;

    // Check if user with this email already exists in the system
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    let userId = existingUser?.id;

    // Check if user is already in the organization
    if (userId) {
      const existingMember = await prisma.organizationUser.findUnique({
        where: {
          userId_organizationId: {
            userId,
            organizationId,
          },
          isDeleted: false,
        },
      });

      if (existingMember) {
        return NextResponse.json(
          { error: 'User is already a member of this organization' },
          { status: 400 }
        );
      }
    }

    // Generate a unique token for this invitation
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Invite expires in 7 days

    // Create the invitation record
    const invitation = await prisma.organizationInvitation.create({
      data: {
        email,
        role,
        token,
        expiresAt,
        invitedById: session.user.id,
        organizationId,
        message: message || '',
      },
    });

    // If the user exists, we send an invitation to join the organization
    // If not, we send an invitation to join the platform and the organization
    const origin = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const inviteLink = existingUser
      ? `${origin}/invitations/${token}`
      : `${origin}/signup?invitation=${token}`;

    // Send invitation email using our improved email sender
    try {
      console.log(`Preparing to send invitation email to: ${email}`);
      
      // Prepare email content with the same styling we're using elsewhere
      const htmlBody = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Invitation to Join ${userOrganization.organization.name}</title>
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
            <h1>You've been invited to join ${userOrganization.organization.name}</h1>
            <p>${session.user.name || 'A team member'} has invited you to join their organization on DevMechDX.</p>
            ${message ? `<div class="message">"${message}"</div>` : ''}
            <p>You'll be given the role of <strong>${role.toLowerCase()}</strong> in this organization.</p>
            <a href="${inviteLink}" class="button">Accept Invitation</a>
            <div class="footer">
              <p>This invitation will expire in 7 days.</p>
              <p>If you didn't expect this invitation, you can safely ignore this email.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const textBody = `
        You've been invited to join ${userOrganization.organization.name}
        
        ${session.user.name || 'A team member'} has invited you to join their organization on DevMechDX.
        ${message ? `\nPersonal message: "${message}"\n` : ''}
        You'll be given the role of ${role.toLowerCase()} in this organization.
        
        Please click the link below to accept the invitation:
        ${inviteLink}
        
        This invitation will expire in 7 days.
        
        If you didn't expect this invitation, you can safely ignore this email.
      `;

      try {
        // Send the email using our improved function
        const emailResult = await sendEmail({
          to: email,
          template: {
            subject: `You've been invited to join ${userOrganization.organization.name}`,
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
          invitationLink: inviteLink,
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
        invitationLink: inviteLink,
        warning: "There was a problem with the email delivery, but the invitation was created successfully"
      });
    }
  } catch (error) {
    console.error('Error inviting user to organization:', error);
    return NextResponse.json(
      { error: 'Failed to send invitation' },
      { status: 500 }
    );
  }
} 
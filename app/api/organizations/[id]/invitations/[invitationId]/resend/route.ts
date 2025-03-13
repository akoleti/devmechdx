import { NextResponse } from "next/server";
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

/**
 * POST /api/organizations/[id]/invitations/[invitationId]/resend
 * 
 * Resends a pending invitation
 * Requires authentication and appropriate permissions
 */
export async function POST(
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

    // Check if user has permission to resend invitations
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
        { error: 'You do not have permission to resend invitations' },
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
        { error: 'Invitation not found or already processed' },
        { status: 404 }
      );
    }

    // Update the expiration date (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Update the invitation
    await prisma.organizationInvitation.update({
      where: {
        id: invitationId,
      },
      data: {
        expiresAt,
        updatedAt: new Date(),
      },
    });

    // Create invitation link
    const origin = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const invitationLink = `${origin}/invitations/${invitation.token}`;
    
    // Send invitation email
    try {
      console.log(`Preparing to resend invitation email to: ${invitation.email}`);
      
      // Prepare email content
      const htmlBody = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Invitation to Join ${invitation.organization.name}</title>
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
            <h1>Reminder: You've been invited to join ${invitation.organization.name}</h1>
            <p>${invitation.invitedBy.name || 'A team member'} has invited you to join their organization on DevMechDX.</p>
            ${invitation.message ? `<div class="message">"${invitation.message}"</div>` : ''}
            <p>You'll be given the role of <strong>${invitation.role.toLowerCase()}</strong> in this organization.</p>
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
        Reminder: You've been invited to join ${invitation.organization.name}
        
        ${invitation.invitedBy.name || 'A team member'} has invited you to join their organization on DevMechDX.
        ${invitation.message ? `\nPersonal message: "${invitation.message}"\n` : ''}
        You'll be given the role of ${invitation.role.toLowerCase()} in this organization.
        
        Please click the link below to accept the invitation:
        ${invitationLink}
        
        This invitation will expire in 7 days.
        
        If you didn't expect this invitation, you can safely ignore this email.
      `;

      try {
        // Send the email
        const emailResult = await sendEmail({
          to: invitation.email,
          template: {
            subject: `Reminder: You've been invited to join ${invitation.organization.name}`,
            htmlBody,
            textBody,
          },
        });

        console.log("Invitation email resend result:", emailResult);
        
        // Return response with preview URL for test accounts
        if (emailResult.isTestAccount && emailResult.previewUrl) {
          console.log(`Using test email account - preview URL: ${emailResult.previewUrl}`);
          return NextResponse.json({
            success: true,
            message: 'Invitation resent successfully',
            _dev: {
              isTestEmail: true,
              previewUrl: emailResult.previewUrl,
              note: "This information is only included in development mode"
            }
          });
        }

        return NextResponse.json({
          success: true,
          message: 'Invitation resent successfully',
        });
      } catch (emailError: any) {
        console.error("Error resending invitation email:", {
          name: emailError.name,
          message: emailError.message,
          stack: emailError.stack,
          code: emailError.code
        });
        
        // Even if email sending fails, the invitation was updated
        return NextResponse.json({
          success: true,
          message: 'Invitation expiration extended, but email delivery failed',
          invitationLink, // Including link in response since email failed
          warning: "Email delivery failed, but invitation was updated successfully"
        });
      }
    } catch (outerError: any) {
      console.error("Unexpected error in invitation resend process:", outerError);
      
      // Even if there's an unexpected error, we still updated the invitation
      return NextResponse.json({
        success: true,
        message: 'Invitation expiration extended, but there was a problem with the email delivery',
        invitationLink,
        warning: "There was a problem with the email delivery, but the invitation was updated successfully"
      });
    }
  } catch (error) {
    console.error('Error resending invitation:', error);
    return NextResponse.json(
      { error: 'Failed to resend invitation' },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { withPermission } from '@/lib/auth/authorization';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Check if user has permission to view organizations
    const authError = await withPermission('viewOrganization')(request);
    if (authError) return authError;

    // Get authenticated user
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's organizations with their roles
    const organizations = await prisma.organizationUser.findMany({
      where: {
        userId: params.userId,
        isDeleted: false,
        isActive: true,
      },
      include: {
        organization: {
          include: {
            plan: true,
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          }
        }
      }
    });

    // Transform the response to include role and other relevant information
    const transformedOrganizations = organizations.map(org => ({
      id: org.organization.id,
      name: org.organization.name,
      type: org.organization.type,
      role: org.role,
      plan: org.organization.plan,
      owner: org.organization.owner,
      isActive: org.organization.isActive,
      isVerified: org.organization.isVerified,
      planStatus: org.organization.planStatus,
      createdAt: org.organization.createdAt,
      updatedAt: org.organization.updatedAt,
    }));

    return NextResponse.json({
      organizations: transformedOrganizations
    });
  } catch (error) {
    console.error('Error fetching user organizations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
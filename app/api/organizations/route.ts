import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { withPermission } from '@/lib/auth/authorization';
import { getCurrentOrganizationContext } from '@/lib/auth/organization-context';
import * as z from 'zod';

// Get organizations schema
export async function GET(req: NextRequest) {
  // Check if user has permission to view organizations
  const authError = await withPermission('viewOrganization')(req);
  if (authError) return authError;
  
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get user's organizations
    const organizations = await prisma.organizationUser.findMany({
      where: {
        userId: session.user.id,
        isDeleted: false,
        isActive: true,
      },
      include: {
        organization: {
          include: {
            plan: true
          }
        }
      }
    });
    
    return NextResponse.json({
      organizations: organizations.map(org => ({
        ...org.organization,
        role: org.role
      }))
    });
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create organization schema
const createOrganizationSchema = z.object({
  name: z.string().min(2),
  type: z.enum(['CUSTOMER', 'VENDOR']),
});

// Create a new organization
export async function POST(req: NextRequest) {
  try {
    // Get authenticated user
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Parse request body
    const body = await req.json();
    
    // Validate request body
    const validationResult = createOrganizationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { name, type } = validationResult.data;

    // Get the default free plan if available
    const freePlan = await prisma.plan.findFirst({
      where: {
        OR: [
          { name: 'Free' },
          { price: 0 }
        ]
      }
    });
    
    // Start a transaction to create organization and relationship
    const result = await prisma.$transaction(async (tx) => {
      // Create the organization
      const organization = await tx.organization.create({
        data: {
          name,
          type,
          ownerId: session.user.id,
          planId: freePlan?.id || 'free',
        },
      });
      
      // Create organization user relationship with admin role
      await tx.organizationUser.create({
        data: {
          organizationId: organization.id,
          userId: session.user.id,
          role: 'ADMINISTRATOR',
          isActive: true,
          isVerified: true,
        },
      });
      
      // Create a default session for this user-organization
      await tx.session.upsert({
        where: { id: session.user.id },
        update: { currentOrganizationId: organization.id },
        create: {
          id: session.user.id,
          userId: session.user.id,
          currentOrganizationId: organization.id,
        },
      });
      
      return organization;
    });
    
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating organization:', error);
    return NextResponse.json(
      { error: 'Failed to create organization' },
      { status: 500 }
    );
  }
} 
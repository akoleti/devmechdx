import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { withPermission } from '@/lib/auth/authorization';
import { z } from 'zod';

// Schema for validating plan updates
const planUpdateSchema = z.object({
  plan: z.enum(['FREE', 'STARTER', 'PROFESSIONAL', 'ENTERPRISE']),
  billingPeriod: z.enum(['MONTHLY', 'ANNUAL']),
});

// Update organization plan
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Extract ID from params
    const id = params.id;
    console.log('Updating organization plan with ID:', id);

    // Check if user has permission to update organization
    const authError = await withPermission('editOrganization')(request);
    if (authError) return authError;

    // Get authenticated user
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate request body
    let body;
    try {
      body = await request.json();
      console.log('Received plan update data:', body);
    } catch (error) {
      console.error('Error parsing request body:', error);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const validationResult = planUpdateSchema.safeParse(body);
    
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error.format());
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { plan, billingPeriod } = validationResult.data;

    // Check if user has access to the organization and has proper role
    const orgUser = await prisma.organizationUser.findUnique({
      where: {
        userId_organizationId: {
          userId: session.user.id,
          organizationId: id,
        },
        isDeleted: false,
        isActive: true,
      },
    });

    if (!orgUser) {
      return NextResponse.json(
        { error: 'Organization not found or you do not have access' },
        { status: 404 }
      );
    }

    // Check if user has admin or manager role
    if (!['ADMINISTRATOR', 'MANAGER'].includes(orgUser.role)) {
      return NextResponse.json(
        { error: 'You do not have permission to update this organization plan' },
        { status: 403 }
      );
    }

    // Check if the organization exists
    const organization = await prisma.organization.findUnique({
      where: { id },
    });

    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      );
    }

    // Update the organization with planData field
    const updatedOrg = await prisma.organization.update({
      where: { id },
      data: {
        updatedAt: new Date(),
        // We'll store the plan data in a JSON field or other available field
        // Format the description field to preserve any existing non-plan-related description
        description: formatDescriptionWithPlan(organization.description, plan, billingPeriod),
      },
    });

    console.log('Organization plan updated successfully:', {
      organizationId: id,
      plan,
      billingPeriod,
    });

    return NextResponse.json({
      success: true,
      message: 'Organization plan updated successfully',
      organization: {
        id: organization.id,
        name: organization.name,
        plan: plan.toLowerCase(), // Include plan in response for immediate feedback
      },
      subscription: {
        plan,
        billingPeriod,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error updating organization plan:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Helper function to format the description field with plan information
function formatDescriptionWithPlan(
  existingDescription: string | null,
  plan: string,
  billingPeriod: string
): string {
  const now = new Date();
  const planData = {
    plan,
    billingPeriod,
    updatedAt: now.toISOString(),
  };
  
  // If the existing description looks like JSON, try to preserve non-plan information
  if (existingDescription && existingDescription.trim().startsWith('{')) {
    try {
      const existingData = JSON.parse(existingDescription);
      return JSON.stringify({
        ...existingData,
        ...planData,
      });
    } catch (e) {
      // If parsing fails, just use the new plan data
      console.error('Failed to parse existing description as JSON:', e);
    }
  }
  
  // Otherwise, just return the JSON with plan data
  return JSON.stringify(planData);
} 
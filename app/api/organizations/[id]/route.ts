import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { withPermission } from '@/lib/auth/authorization';
import { z } from 'zod';
import { OrganizationType } from '@prisma/client';

// Schema for validating organization updates
const organizationUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  type: z.string().optional(),
  description: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  zip: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable().or(z.literal('')),
  website: z.string().url().optional().nullable().or(z.literal('')),
});

// Get organization by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user has permission to view organization
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

    const id = params.id;

    // First check if user has access to the organization
    const membership = await prisma.organizationUser.findUnique({
      where: {
        userId_organizationId: {
          userId: session.user.id,
          organizationId: id,
        },
        isDeleted: false,
        isActive: true,
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: 'Organization not found or you do not have access' },
        { status: 404 }
      );
    }

    // Then get the organization details
    const organization = await prisma.organization.findUnique({
      where: { id },
    });

    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      );
    }

    // Return the organization data - only including fields we know exist in the schema
    return NextResponse.json({
      organization: {
        id: organization.id,
        name: organization.name,
        type: organization.type,
        // Add the new fields with safe defaults
        description: organization.description || '',
        address: organization.address || '',
        city: organization.city || '',
        state: organization.state || '',
        zip: organization.zip || '',
        country: organization.country || '',
        phone: organization.phone || '',
        email: organization.email || '',
        website: organization.website || '',
        createdAt: organization.createdAt,
        updatedAt: organization.updatedAt,
        isActive: organization.isActive,
        isVerified: organization.isVerified,
        userRole: membership.role,
        // Try to extract plan information from the description field
        ...extractPlanInfo(organization.description),
      },
    });
  } catch (error) {
    console.error('Error fetching organization:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to extract plan info from the description field
function extractPlanInfo(description: string | null): { plan?: string, billingPeriod?: string } {
  if (!description) return {};
  
  try {
    // Try to parse the description as JSON
    const data = JSON.parse(description);
    
    // Check if it has plan information
    if (data && data.plan) {
      return {
        plan: data.plan.toLowerCase(), // Return lowercase to match the frontend expectations
        billingPeriod: data.billingPeriod,
      };
    }
  } catch (e) {
    // If parsing fails, just return empty object
    console.log('Failed to parse plan info from description:', e);
  }
  
  return {};
}

// Update organization by ID
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Extract ID from params
    const id = params.id;
    console.log('Updating organization with ID:', id);

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
      console.log('Received organization update data:', body);
    } catch (error) {
      console.error('Error parsing request body:', error);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const validationResult = organizationUpdateSchema.safeParse(body);
    
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error.format());
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

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
        { error: 'You do not have permission to update this organization' },
        { status: 403 }
      );
    }

    // Construct the update data safely
    const updateData: any = {
      updatedAt: new Date(),
    };

    // Only add fields that are included in the request
    if (validatedData.name !== undefined) updateData.name = validatedData.name;
    if (validatedData.type !== undefined) {
      try {
        // Attempt to cast the type to the OrganizationType enum
        updateData.type = validatedData.type as OrganizationType;
      } catch (error) {
        console.error('Invalid organization type:', validatedData.type, error);
      }
    }
    if (validatedData.description !== undefined) updateData.description = validatedData.description;
    if (validatedData.address !== undefined) updateData.address = validatedData.address;
    if (validatedData.city !== undefined) updateData.city = validatedData.city;
    if (validatedData.state !== undefined) updateData.state = validatedData.state;
    if (validatedData.zip !== undefined) updateData.zip = validatedData.zip;
    if (validatedData.country !== undefined) updateData.country = validatedData.country;
    if (validatedData.phone !== undefined) updateData.phone = validatedData.phone;
    if (validatedData.email !== undefined) updateData.email = validatedData.email;
    if (validatedData.website !== undefined) updateData.website = validatedData.website;

    console.log('Updating organization with data:', updateData);

    // Update the organization
    const updatedOrg = await prisma.organization.update({
      where: { id },
      data: updateData,
    });

    console.log('Organization updated successfully:', updatedOrg.id);

    return NextResponse.json({
      success: true,
      organization: {
        id: updatedOrg.id,
        name: updatedOrg.name,
        type: updatedOrg.type,
      }
    });
  } catch (error) {
    console.error('Error updating organization:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 
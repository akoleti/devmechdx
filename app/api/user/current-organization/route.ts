import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getCurrentOrganizationContext } from '@/lib/auth/organization-context';

/**
 * This endpoint gets the current organization context from the database
 * and returns it to update the client-side session
 */
export async function GET(req: NextRequest) {
  try {
    // Get authenticated user
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get the user's current organization context from the database
    const context = await getCurrentOrganizationContext(session.user.id);
    
    if (!context || !context.organization) {
      return NextResponse.json(
        { error: 'No current organization found' },
        { status: 404 }
      );
    }
    
    // Return the organization and role
    return NextResponse.json({
      currentOrganization: {
        id: context.organization.id,
        name: context.organization.name,
        role: context.role
      },
      currentRole: context.role
    });
  } catch (error) {
    console.error('Error getting current organization:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
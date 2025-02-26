import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { setCurrentOrganization } from '@/lib/auth/organization-context';

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
    const { organizationId } = body;
    
    if (!organizationId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      );
    }
    
    // Set the current organization in the session
    const success = await setCurrentOrganization(session.user.id, organizationId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to set organization' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error setting organization:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { Permissions, hasPermission } from '@/lib/auth/permissions';

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
    
    // Get permission from query params
    const url = new URL(req.url);
    const permissionName = url.searchParams.get('permission');
    
    if (!permissionName || !(permissionName in Permissions)) {
      return NextResponse.json(
        { error: 'Invalid permission' },
        { status: 400 }
      );
    }
    
    // Check if user has the specified permission
    const permitted = await hasPermission(
      session.user.id,
      Permissions[permissionName as keyof typeof Permissions]
    );
    
    return NextResponse.json({ hasPermission: permitted });
  } catch (error) {
    console.error('Error checking permission:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { Permissions, hasPermission } from './permissions';

/**
 * Middleware to check if the current user has the required permission
 */
export function withPermission(permission: keyof typeof Permissions) {
  return async (request: NextRequest) => {
    try {
      const session = await auth();
      
      if (!session?.user?.id) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
      
      const hasRequiredPermission = await hasPermission(
        session.user.id, 
        Permissions[permission]
      );
      
      if (!hasRequiredPermission) {
        return NextResponse.json(
          { error: 'Forbidden: Insufficient permissions' },
          { status: 403 }
        );
      }
      
      // User has the required permission, proceed with the request
      return null;
    } catch (error) {
      console.error('Authorization error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

/**
 * API route wrapper for checking permissions
 * @example
 * export async function GET(req: NextRequest) {
 *   // Check if user has permission to view users
 *   const authError = await withPermission('viewUsers')(req);
 *   if (authError) return authError;
 *   
 *   // Proceed with the request handling
 *   // ...
 * }
 */

/**
 * React component wrapper for checking permissions
 * This can be used in client components to conditionally render UI elements
 * based on the user's permissions
 */
export function useHasPermission(permission: keyof typeof Permissions) {
  // This is a simplified version - in a real app, you'd use React Query or SWR
  // to fetch the permission status from an API endpoint
  return async () => {
    const res = await fetch(`/api/user/has-permission?permission=${permission}`);
    if (!res.ok) return false;
    const data = await res.json();
    return data.hasPermission;
  };
} 
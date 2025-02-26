import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Role } from '@prisma/client';

// Define the role hierarchy
const ROLE_HIERARCHY: Record<Role, number> = {
  ROOT: 9,
  ADMINISTRATOR: 8,
  MANAGER: 7,
  SUPERVISOR: 6,
  TECHNICIAN: 5,
  DISPATCHER: 4,
  ESTIMATOR: 3,
  CUSTOMER: 2,
  USER: 1
};

interface Permission {
  minimumRole: Role;
}

// Define the permissions
export const Permissions = {
  // User management
  createUser: { minimumRole: 'ADMINISTRATOR' as Role },
  viewUsers: { minimumRole: 'SUPERVISOR' as Role },
  editUser: { minimumRole: 'ADMINISTRATOR' as Role },
  deleteUser: { minimumRole: 'ADMINISTRATOR' as Role },
  
  // Organization management
  viewOrganization: { minimumRole: 'USER' as Role },
  editOrganization: { minimumRole: 'ADMINISTRATOR' as Role },
  
  // Equipment management
  viewEquipment: { minimumRole: 'USER' as Role },
  createEquipment: { minimumRole: 'TECHNICIAN' as Role },
  editEquipment: { minimumRole: 'TECHNICIAN' as Role },
  deleteEquipment: { minimumRole: 'SUPERVISOR' as Role },
  
  // Logs management
  viewLogs: { minimumRole: 'USER' as Role },
  createLog: { minimumRole: 'USER' as Role },
  editLog: { minimumRole: 'SUPERVISOR' as Role },
  deleteLog: { minimumRole: 'ADMINISTRATOR' as Role },

  // Location management
  viewLocation: { minimumRole: 'USER' as Role },
  createLocation: { minimumRole: 'SUPERVISOR' as Role },
  editLocation: { minimumRole: 'SUPERVISOR' as Role },
  deleteLocation: { minimumRole: 'ADMINISTRATOR' as Role },
};

/**
 * React hook for checking if the current user has a specific permission
 * based on their role in the currently selected organization
 */
export function usePermission(permissionName: keyof typeof Permissions) {
  const { data: session } = useSession();
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  
  useEffect(() => {
    if (!session?.user) {
      setHasPermission(false);
      return;
    }
    
    const currentRole = session.user.currentRole || session.user.role;
    const permission = Permissions[permissionName];
    
    if (!currentRole || !permission) {
      setHasPermission(false);
      return;
    }
    
    const userRoleLevel = ROLE_HIERARCHY[currentRole];
    const requiredRoleLevel = ROLE_HIERARCHY[permission.minimumRole];
    
    setHasPermission(userRoleLevel >= requiredRoleLevel);
  }, [session, permissionName]);
  
  return hasPermission;
}

/**
 * Component wrapper for permission-based rendering
 */
export function WithPermission(props: { 
  permission: keyof typeof Permissions; 
  children: React.ReactNode; 
  fallback?: React.ReactNode;
}) {
  const hasPermission = usePermission(props.permission);
  
  if (!hasPermission) {
    return props.fallback ? React.createElement(React.Fragment, null, props.fallback) : null;
  }
  
  return React.createElement(React.Fragment, null, props.children);
}
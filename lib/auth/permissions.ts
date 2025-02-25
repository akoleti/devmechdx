import { Role } from "@prisma/client";
import { getCurrentOrganizationContext } from "./organization-context";

/**
 * Role hierarchy - higher roles include permissions of lower roles
 */
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

/**
 * Check if a user has permission to perform an action based on their role
 * in their current organization context
 */
export async function hasPermission(
  userId: string, 
  permission: {
    minimumRole: Role;
  }
): Promise<boolean> {
  const context = await getCurrentOrganizationContext(userId);
  
  if (!context) {
    return false;
  }
  
  const userRoleLevel = ROLE_HIERARCHY[context.role];
  const requiredRoleLevel = ROLE_HIERARCHY[permission.minimumRole];
  
  return userRoleLevel >= requiredRoleLevel;
}

/**
 * Define permissions for specific actions in the system
 */
export const Permissions = {
  // User management
  createUser: { minimumRole: Role.ADMINISTRATOR },
  viewUsers: { minimumRole: Role.SUPERVISOR },
  editUser: { minimumRole: Role.ADMINISTRATOR },
  deleteUser: { minimumRole: Role.ADMINISTRATOR },
  
  // Organization management
  viewOrganization: { minimumRole: Role.USER },
  editOrganization: { minimumRole: Role.ADMINISTRATOR },
  
  // Equipment management
  viewEquipment: { minimumRole: Role.USER },
  createEquipment: { minimumRole: Role.TECHNICIAN },
  editEquipment: { minimumRole: Role.TECHNICIAN },
  deleteEquipment: { minimumRole: Role.SUPERVISOR },
  
  // Logs management
  viewLogs: { minimumRole: Role.USER },
  createLog: { minimumRole: Role.USER },
  editLog: { minimumRole: Role.SUPERVISOR },
  deleteLog: { minimumRole: Role.ADMINISTRATOR },

  // Location management
  viewLocation: { minimumRole: Role.USER },
  createLocation: { minimumRole: Role.SUPERVISOR },
  editLocation: { minimumRole: Role.SUPERVISOR },
  deleteLocation: { minimumRole: Role.ADMINISTRATOR },
};

/**
 * Creates a middleware that checks if the user has the required permission
 */
export function requirePermission(permission: keyof typeof Permissions) {
  return async (userId: string): Promise<boolean> => {
    return hasPermission(userId, Permissions[permission]);
  };
} 
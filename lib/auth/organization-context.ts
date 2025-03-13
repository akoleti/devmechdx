import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

/**
 * Sets the current organization for a user's session
 */
export async function setCurrentOrganization(userId: string, organizationId: string): Promise<boolean> {
  try {
    // Check if the user belongs to this organization
    const membership = await prisma.organizationUser.findUnique({
      where: {
        userId_organizationId: {
          userId,
          organizationId
        }
      },
      include: {
        organization: true  // Include the organization data to get the name
      }
    });

    if (!membership || membership.isDeleted || !membership.isActive) {
      return false;
    }

    // Get full organization details to store in the session
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: {
        id: true,
        name: true
      }
    });

    if (!organization) {
      return false;
    }

    // Update or create a session with the current organization
    await prisma.session.updateMany({
      where: { userId },
      data: { 
        currentOrganizationId: organizationId,
        updatedAt: new Date()
      }
    });

    return true;
  } catch (error) {
    console.error("Error setting current organization:", error);
    return false;
  }
}

/**
 * Gets the current organization context for a user
 */
export async function getCurrentOrganizationContext(userId: string) {
  try {
    // Get the user's current session
    const session = await prisma.session.findFirst({
      where: { userId },
      include: {
        currentOrganization: true
      }
    });

    if (!session?.currentOrganizationId) {
      return null;
    }

    // Get the user's role in this organization
    const membership = await prisma.organizationUser.findUnique({
      where: {
        userId_organizationId: {
          userId,
          organizationId: session.currentOrganizationId
        }
      }
    });

    if (!membership || membership.isDeleted || !membership.isActive) {
      return null;
    }

    return {
      organization: session.currentOrganization,
      role: membership.role
    };
  } catch (error) {
    console.error("Error getting current organization context:", error);
    return null;
  }
}

/**
 * Gets all organizations that a user belongs to
 */
export async function getUserOrganizations(userId: string) {
  try {
    const memberships = await prisma.organizationUser.findMany({
      where: {
        userId,
        isDeleted: false,
        isActive: true
      },
      include: {
        organization: true
      }
    });

    return memberships.map(membership => ({
      organization: membership.organization,
      role: membership.role
    }));
  } catch (error) {
    console.error("Error getting user organizations:", error);
    return [];
  }
}

/**
 * Checks if a user has the required role in their current organization
 */
export async function hasRole(userId: string, requiredRoles: Role[] | Role): Promise<boolean> {
  const context = await getCurrentOrganizationContext(userId);
  
  if (!context) {
    return false;
  }

  const requiredRolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  
  return requiredRolesArray.includes(context.role);
} 
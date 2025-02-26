import "next-auth";
import { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: Role;
      image?: string;
      organizations?: Array<{
        id: string;
        name: string;
        role: Role;
      }>;
      currentOrganization?: {
        id: string;
        name: string;
        role: Role;
      };
      currentRole?: Role;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    organizations?: Array<{
      id: string;
      name: string;
      role: Role;
    }>;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    organizations?: Array<{
      id: string;
      name: string;
      role: Role;
    }>;
    currentOrganization?: {
      id: string;
      name: string;
      role: Role;
    };
    currentRole?: Role;
  }
} 
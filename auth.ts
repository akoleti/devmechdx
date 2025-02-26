import NextAuth from "next-auth";
import {PrismaAdapter} from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";
import { Role } from "@prisma/client";
import type { NextAuthConfig } from "next-auth";
import { getUserOrganizations } from "./lib/auth/organization-context";

export const config: NextAuthConfig = {
    adapter: PrismaAdapter(prisma) as any,
    pages: {
        signIn: "/login",
        signOut: "/logout",
        error: "/login",
        verifyRequest: "/verify-request",
        newUser: "/signup",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials.email || !credentials.password) {
                    return null;
                }
                //Find User
                const user = await prisma.user.findFirst({
                    where: { email: credentials.email },
                });
                if (user && user.hashedPassword) {
                const isMatch = compareSync(credentials.password as string, user.hashedPassword);
                if (isMatch) {
                    // Get user's organizations
                    const organizations = await getUserOrganizations(user.id);
                    
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        organizations: organizations.map(org => ({
                            id: org.organization.id,
                            name: org.organization.name,
                            role: org.role
                        }))
                    };
                }
            }
            return null;
        },
    }),
    ],
    callbacks: {
        async session({ session, user, trigger, token } :any) {
            session.user.id = token.id as string;
            
            // Include organizations in the session
            if (token.organizations) {
                session.user.organizations = token.organizations;
            }
            
            // Include selected organization and role if available
            if (token.currentOrganization) {
                session.user.currentOrganization = token.currentOrganization;
                session.user.currentRole = token.currentRole;
            }
            
            if (trigger === "update") {
                session.user.name = token.name as string;
                session.user.email = token.email as string;
                session.user.role = token.role as Role;
            }
            return session;
        },
        async jwt({ token, user, trigger, session } :any) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.organizations = user.organizations;
            }
            
            // Handle organization selection via session update
            if (trigger === "update" && session?.currentOrganization) {
                token.currentOrganization = session.currentOrganization;
                token.currentRole = session.currentRole;
            }
            
            return token;
        },
    },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config as any);
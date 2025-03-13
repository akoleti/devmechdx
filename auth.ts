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
        verifyRequest: "/verify-email",
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
                
                // Check if user exists and has a password
                if (user && user.hashedPassword) {
                    // Check if email is verified
                    if (!user.emailVerified) {
                        // The user exists but email is not verified
                        // We will handle this by throwing an error that we can check for in the signIn function
                        throw new Error("EMAIL_NOT_VERIFIED");
                    }
                    
                    // Email is verified, proceed with password check
                    const isMatch = compareSync(credentials.password as string, user.hashedPassword);
                    if (isMatch) {
                        // Get user's organizations
                        const organizations = await getUserOrganizations(user.id);
                        
                        // Update last login time
                        await prisma.user.update({
                            where: { id: user.id },
                            data: { lastLogin: new Date() },
                        });
                        
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
            }
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
                console.log("Setting session.user.currentOrganization:", token.currentOrganization);
            }
            
            if (trigger === "update") {
                session.user.name = token.name as string;
                session.user.email = token.email as string;
                session.user.role = token.role as Role;
                
                // If update includes currentOrganization, set it in the session
                if (session.currentOrganization) {
                    // Ensure the currentOrganization is a valid object
                    if (typeof session.currentOrganization === 'object' && 
                        session.currentOrganization !== null &&
                        session.currentOrganization.id) {
                        
                        session.user.currentOrganization = session.currentOrganization;
                        console.log("Updated session with organization:", session.user.currentOrganization);
                        
                        // Only set currentRole if it's a valid string
                        if (typeof session.currentRole === 'string') {
                            session.user.currentRole = session.currentRole;
                        }
                        
                        // Clean up the session object
                        delete session.currentOrganization;
                        delete session.currentRole;
                    } else {
                        console.error("Invalid organization data in session update:", session.currentOrganization);
                    }
                }
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
            if (trigger === "update" && session) {
                // Only update if currentOrganization is a valid object
                if (session.currentOrganization && 
                    typeof session.currentOrganization === 'object' && 
                    session.currentOrganization !== null &&
                    session.currentOrganization.id) {
                    
                    console.log("JWT callback - Updating currentOrganization:", session.currentOrganization);
                    token.currentOrganization = session.currentOrganization;
                    
                    // Only set currentRole if it's a valid string
                    if (typeof session.currentRole === 'string') {
                        token.currentRole = session.currentRole;
                    }
                } else if (session.currentOrganization) {
                    console.error("JWT callback - Invalid organization data:", session.currentOrganization);
                }
            }
            
            return token;
        },
    },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config as any);
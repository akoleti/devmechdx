import NextAuth from "next-auth";
import {PrismaAdapter} from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";
import { Role } from "@prisma/client";
import type { NextAuthConfig } from "next-auth";

export const config = {
    adapter: PrismaAdapter(prisma),
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
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,

                    };
                }
            }
            return null;
        },
    }),
    ],
    callbacks: {
        async session({ session, user,trigger, token } :any) {
            session.user.id = token.id as string;
            
            if (trigger === "update") {
                session.user.name = token.name as string;
                session.user.email = token.email as string;
                session.user.role = token.role as Role;
            }
            return session;
        },
    },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
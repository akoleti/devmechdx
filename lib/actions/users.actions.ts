'use server'

import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { signInFormSchema } from '../validators'
import { signIn, signOut } from '@/auth'
import { redirect } from 'next/navigation'
import { Session } from 'next-auth'
import { prisma } from '@/lib/prisma'

// Fetch organizations for a user
export async function fetchUserOrganizations(userId: string) {
    try {
        const organizations = await prisma.organizationUser.findMany({
            where: {
                userId: userId,
                isDeleted: false,
                isActive: true,
            },
            include: {
                organization: {
                    include: {
                        plan: true,
                        owner: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            }
                        }
                    }
                }
            }
        });

        return organizations.map(org => ({
            id: org.organization.id,
            name: org.organization.name,
            type: org.organization.type,
            role: org.role,
            plan: org.organization.plan,
            owner: org.organization.owner,
            isActive: org.organization.isActive,
            isVerified: org.organization.isVerified,
            planStatus: org.organization.planStatus,
            createdAt: org.organization.createdAt,
            updatedAt: org.organization.updatedAt,
        }));
    } catch (error) {
        console.error('Error fetching user organizations:', error);
        return [];
    }
}

// sign in user with credentials
export async function signInWithCredentials(prevState: unknown, formData: FormData) {
    try {
        const user = signInFormSchema.parse({
            email: formData.get('email'),
            password: formData.get('password'),
        })
        
        try {
            const result = await signIn('credentials', user) as Session
            
            if (!result?.user?.id) {
                throw new Error('No user ID in session');
            }

            // Fetch organizations for the authenticated user
            const organizations = await fetchUserOrganizations(result.user.id);
            console.log('Fetched organizations:', organizations);

            // Update the session store with organizations data
            if (typeof window !== 'undefined') {
                const store = await import('@/app/stores/sessionStore');
                store.default.setState({
                    status: 'authenticated',
                    user: result.user,
                    organizations: organizations,
                    initialized: true
                });
            }

            // Redirect to organizations page
            redirect('/organizations');
        } catch (error: any) {
            // Check for our custom EMAIL_NOT_VERIFIED error
            if (error.message && error.message.includes('EMAIL_NOT_VERIFIED')) {
                // Redirect user to verify email page with their email
                redirect(`/verify-email?email=${encodeURIComponent(user.email)}&requiresVerification=true`)
            }
            
            // Rethrow other errors to be caught by the outer catch block
            throw error
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error
        }
        return { success: false, message: 'Invalid email or password' }
    }
}

// sign out user
export async function signOutUser() {
    await signOut()
}
    
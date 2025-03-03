'use server'

import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { signInFormSchema } from '../validators'
import { signIn, signOut } from '@/auth'
import { redirect } from 'next/navigation'

// sign in user with credentials
export async function signInWithCredentials(prevState: unknown, formData: FormData) {
    try {
        const user = signInFormSchema.parse({
            email: formData.get('email'),
            password: formData.get('password'),
        })
        
        try {
            await signIn('credentials', user)
            return { success: true, message: 'Signed in successfully' }
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
    
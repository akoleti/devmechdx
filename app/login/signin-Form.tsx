'use client'

import { Input } from "@/components/ui/input";
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom'
import { signInWithCredentials } from '@/lib/actions/users.actions';
import { Button } from "@/components/ui/button";
import Link from "next/link";   
import { useSearchParams } from "next/navigation";

const signinDefaultValues = {
    email: 'test@test.com',
    password: 'test1234',
}


export default function SignInForm() {

    const searchParams = useSearchParams()  
    const callbackUrl = searchParams.get('callbackUrl') || '/organizations'

    const [data, action] = useActionState(signInWithCredentials, {
        success: false,
        message: '',
    })

    const SignInButton = () => {
        const { pending } = useFormStatus()
        return (
            <Button type="submit" disabled={pending} className="w-full">
                {pending ? 'Signing in...' : 'Sign in'}
            </Button>
        )
    }

    return (
        <form className="space-y-6" action={action}>
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
          <div className="mt-1">        
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              defaultValue={signinDefaultValues.email}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="mt-1">
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              defaultValue={signinDefaultValues.password}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
              Forgot your password?
            </Link>
          </div>
        </div>

        <SignInButton />
        {data && !data.success && <p className="text-red-500">{data.message}</p>}
      </form>
    )
}
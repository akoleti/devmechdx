'use client';

import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, AlertTriangle, Loader2 } from 'lucide-react';

export default function LogoutPage() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      setError(null);
      
      // Sign out and redirect to login page
      await signOut({ 
        redirect: false, 
        // Don't auto-redirect here as we want to handle it ourselves
      });
      
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      setError('There was an error signing out. Please try again.');
      setIsLoggingOut(false);
    }
  };

  const handleCancel = () => {
    router.back(); // Go back to the previous page
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <LogOut className="h-10 w-10 text-gray-400" />
          </div>
          <CardTitle className="text-2xl text-center">Sign Out</CardTitle>
          <CardDescription className="text-center">
            Are you sure you want to sign out of your account?
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 flex items-center rounded-md border border-red-200 bg-red-50 p-3 text-red-700">
              <AlertTriangle className="mr-2 h-5 w-5" />
              <span>{error}</span>
            </div>
          )}
          <p className="text-center text-sm text-gray-500">
            You will need to sign in again to access your account.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button 
            onClick={handleLogout} 
            disabled={isLoggingOut} 
            className="w-full" 
            variant="destructive"
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing out...
              </>
            ) : (
              'Sign Out'
            )}
          </Button>
          <Button 
            onClick={handleCancel} 
            variant="outline" 
            className="w-full"
            disabled={isLoggingOut}
          >
            Cancel
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 
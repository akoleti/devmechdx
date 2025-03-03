'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Mail } from 'lucide-react';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [manualToken, setManualToken] = useState('');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [isAlreadyVerified, setIsAlreadyVerified] = useState(false);
  
  // Additional flags from URL params
  const justRegistered = searchParams.get('justRegistered') === 'true';
  const requiresVerification = searchParams.get('requiresVerification') === 'true';
  
  // Get token and email from URL if they exist
  useEffect(() => {
    const params = searchParams;
    const token = params?.get('token');
    const emailParam = params?.get('email');
    
    if (token && emailParam) {
      setEmail(emailParam);
      setToken(token);
    } else if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);
  
  useEffect(() => {
    if (email && token) {
      verifyEmail();
    }
  }, [email, token]);
  
  const verifyEmail = async () => {
    if (!email || !token) return;
    
    console.log('Attempting to verify email with:');
    console.log('Email:', email);
    console.log('Token:', token.substring(0, 10) + '...');
    
    setIsVerifying(true);
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, token }),
      });
      
      const data = await response.json();
      console.log('Verification response:', data);
      
      if (response.ok) {
        if (data.alreadyVerified) {
          setIsAlreadyVerified(true);
          setVerificationStatus('success');
          toast.success(data.message || 'Email is already verified');
          setTimeout(() => router.push('/login'), 3000);
        } else {
          setVerificationStatus('success');
          toast.success(data.message || 'Email verified successfully');
          setTimeout(() => router.push('/login'), 2000);
        }
      } else {
        console.error('Verification failed:', data);
        setVerificationStatus('error');
        toast.error(data.message || 'Failed to verify email');
      }
    } catch (error) {
      console.error('Error during verification:', error);
      setVerificationStatus('error');
      toast.error('An error occurred during verification');
    } finally {
      setIsVerifying(false);
    }
  };
  
  const handleManualVerification = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    if (!manualToken) {
      toast.error('Please enter your verification code');
      return;
    }
    
    // Set the token to the manual token entered by user
    setToken(manualToken);
  };
  
  const goToLogin = () => {
    router.push('/login');
  };
  
  // Function to resend verification email
  const resendVerificationEmail = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsResending(true);
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (response.ok) {
        if (data.alreadyVerified) {
          setIsAlreadyVerified(true);
          setVerificationStatus('success');
          toast.success(data.message || 'Your email is already verified');
          setTimeout(() => router.push('/login'), 3000);
        } else {
          toast.success(data.message || 'Verification email sent successfully');
        }
      } else {
        toast.error(data.message || 'Failed to resend verification email');
      }
    } catch (error) {
      console.error('Error resending verification email:', error);
      toast.error('An error occurred while resending the verification email');
    } finally {
      setIsResending(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Verify Your Email
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {verificationStatus === 'pending' && justRegistered && 
            'Thanks for signing up! Please check your email and verify your address to continue.'}
          {verificationStatus === 'pending' && requiresVerification && 
            'You need to verify your email before you can log in.'}
          {verificationStatus === 'pending' && !justRegistered && !requiresVerification && 
            'Please verify your email address to continue'}
          {verificationStatus === 'success' && 'Thank you for verifying your email!'}
          {verificationStatus === 'error' && 'There was a problem verifying your email'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {verificationStatus === 'pending' && (
            <>
              {!searchParams.get('token') && (
                <div>
                  {(justRegistered || requiresVerification) && (
                    <div className="mb-6 text-center">
                      <Mail className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">
                        We've sent a verification email to <strong>{email}</strong>. 
                        Please check your inbox and click the verification link or enter the verification code below.
                      </p>
                      <Button
                        onClick={resendVerificationEmail}
                        variant="outline"
                        disabled={isResending}
                        className="mt-4"
                      >
                        {isResending ? (
                          <>
                            <span className="mr-2">Sending...</span>
                            <span className="animate-spin">⟳</span>
                          </>
                        ) : (
                          'Resend verification email'
                        )}
                      </Button>
                    </div>
                  )}
                
                  <form className="space-y-6" onSubmit={handleManualVerification}>
                    {!email && (
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email address
                        </label>
                        <div className="mt-1">
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <label htmlFor="token" className="block text-sm font-medium text-gray-700">
                        Verification Code
                      </label>
                      <div className="mt-1">
                        <Input
                          id="token"
                          type="text"
                          value={manualToken}
                          onChange={(e) => setManualToken(e.target.value)}
                          placeholder="Enter the code from your email"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Button
                        type="submit"
                        className="w-full flex justify-center py-2"
                        disabled={isVerifying}
                      >
                        {isVerifying ? 'Verifying...' : 'Verify Email'}
                      </Button>
                    </div>
                  </form>
                </div>
              )}
              
              {searchParams.get('token') && (
                <div className="flex flex-col items-center justify-center py-8">
                  <Mail className="h-12 w-12 text-blue-500 animate-pulse" />
                  <p className="mt-4 text-center text-gray-600">
                    Verifying your email...
                  </p>
                </div>
              )}
            </>
          )}
          
          {verificationStatus === 'success' && (
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
              <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <div className="text-center">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                  {isAlreadyVerified ? (
                    <>
                      <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
                        Email Already Verified
                      </h2>
                      <p className="mt-2 text-center text-sm text-gray-600">
                        Your email address has already been verified. You can continue to login.
                      </p>
                    </>
                  ) : (
                    <>
                      <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
                        Email Verified Successfully
                      </h2>
                      <p className="mt-2 text-center text-sm text-gray-600">
                        Thank you for verifying your email address. You can now login to your account.
                      </p>
                    </>
                  )}
                  <div className="mt-6">
                    <Button 
                      className="w-full"
                      onClick={goToLogin}
                    >
                      Go to Login
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {verificationStatus === 'error' && (
            <div className="flex flex-col items-center justify-center py-8">
              <XCircle className="h-16 w-16 text-red-500" />
              <p className="mt-4 text-center text-gray-600">
                We couldn't verify your email. The verification link may have expired or is invalid.
              </p>
              <div className="mt-6">
                <form className="space-y-6" onSubmit={handleManualVerification}>
                  <div>
                    <label htmlFor="token" className="block text-sm font-medium text-gray-700">
                      Verification Code
                    </label>
                    <div className="mt-1">
                      <Input
                        id="token"
                        type="text"
                        value={manualToken}
                        onChange={(e) => setManualToken(e.target.value)}
                        placeholder="Enter the code from your email"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Button
                      type="submit"
                      className="w-full flex justify-center py-2"
                      disabled={isVerifying}
                    >
                      {isVerifying ? 'Verifying...' : 'Try Again'}
                    </Button>
                  </div>
                </form>
                
                <div className="mt-4 text-center">
                  <Button
                    onClick={resendVerificationEmail}
                    variant="outline"
                    disabled={isResending}
                    className="mt-2"
                  >
                    {isResending ? (
                      <>
                        <span className="mr-2">Sending...</span>
                        <span className="animate-spin">⟳</span>
                      </>
                    ) : (
                      'Resend verification email'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
} 
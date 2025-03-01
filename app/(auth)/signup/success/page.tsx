'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function SuccessPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render until client-side hydration is complete
  if (!isClient) {
    return null;
  }

  return (
      <div className="min-h-screen bg-gray-50 pt-32">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome to MechDX!
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Your account has been successfully created.
          </p>
          <div className="mt-8 space-y-4">
            <p className="text-gray-600">
              We&apos;ve sent you an email with instructions to verify your account.
            </p>
            <p className="text-gray-600">
              Once verified, you can start using MechDX right away.
            </p>
          </div>
          <div className="mt-12 space-x-4">
            <Button asChild>
              <Link href="/dashboard">
                Go to Dashboard
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/docs/quick-start">
                View Quick Start Guide
              </Link>
            </Button>
          </div>
        </div>
      </div>
  );
} 
'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import Footer from '@/components/navigation/Footer';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function OrganizationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Simple header with logo from auth layout */}
      <header className="fixed w-full bg-white/95 backdrop-blur-sm z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <Link href="/" className="flex items-center">
                <Image
                  src="/images/logo/primaryblack.png"
                  alt="MechDX Logo"
                  width={120}
                  height={40}
                  className="h-8 w-auto"
                  priority
                />
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow pt-16 bg-gray-100">
        {children}
      </main>
      
      <Footer />
    </div>
  );
} 
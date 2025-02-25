'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LayoutGrid } from "lucide-react";

export function Header() {
  const { data: session } = useSession();
  
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <LayoutGrid className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">DevMechDX</span>
        </div>
        <div>
          {session?.user?.name && (
            <span className="text-sm text-gray-600">Hello, {session.user.name}</span>
          )}
        </div>
      </div>
    </header>
  );
} 
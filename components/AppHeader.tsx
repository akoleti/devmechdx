import React from 'react';
import { useSession } from 'next-auth/react';
import OrganizationSwitcher from './organization-switcher';
import { WithPermission } from '@/hooks/usePermission';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AppHeader() {
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="font-semibold text-xl">
            Your App Name
          </Link>
          
          <nav className="hidden md:flex gap-4">
            <Link href="/dashboard" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Dashboard
            </Link>
            
            <WithPermission permission="viewUsers">
              <Link href="/users" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                Users
              </Link>
            </WithPermission>
            
            <WithPermission permission="viewEquipment">
              <Link href="/equipment" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                Equipment
              </Link>
            </WithPermission>
            
            <WithPermission permission="viewLogs">
              <Link href="/logs" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                Logs
              </Link>
            </WithPermission>
            
            <WithPermission permission="viewLocation">
              <Link href="/locations" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                Locations
              </Link>
            </WithPermission>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Organization Switcher */}
          <OrganizationSwitcher />
          
          <div className="flex items-center gap-2">
            <div className="text-sm">
              <p className="font-medium">{session.user.name}</p>
              <p className="text-gray-500 text-xs">{session.user.currentRole || session.user.role}</p>
            </div>
            
            <Link href="/settings">
              <Button variant="ghost" size="icon" className="rounded-full">
                {session.user.image ? (
                  <img 
                    src={session.user.image} 
                    alt={session.user.name}
                    className="w-8 h-8 rounded-full" 
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                    {session.user.name.charAt(0)}
                  </div>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
} 
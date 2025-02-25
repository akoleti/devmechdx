'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  LayoutGrid, Menu, X, Users, Building, Settings, 
  LogOut, BarChart3, FileText, Bell, Search, 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import Footer from '@/components/navigation/Footer';

// Navigation links for the sidebar
const navLinks = [
  { title: 'Dashboard', href: '/dashboard', icon: <BarChart3 className="h-5 w-5" /> },
  { title: 'Organizations', href: '/organizations', icon: <Building className="h-5 w-5" /> },
  { title: 'Users', href: '/users', icon: <Users className="h-5 w-5" /> },
  { title: 'Equipment', href: '/equipment'},
  { title: 'Reports', href: '/reports', icon: <FileText className="h-5 w-5" /> },
  { title: 'Settings', href: '/settings', icon: <Settings className="h-5 w-5" /> },
];

export default function FunctionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!session?.user?.name) return 'U';
    return session.user.name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar - mobile version has overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity md:hidden ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      />
      
      {/* Sidebar */}
   
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <button 
                className="md:hidden text-gray-500 hover:text-gray-700"
                onClick={toggleSidebar}
              >
                <Menu className="h-5 w-5" />
              </button>
              
              {/* Search (hidden on smaller screens) */}
              <div className="hidden sm:block relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search..."
                  className="pl-10 w-64"
                />
              </div>
            </div>
            
            {/* Right side items */}
            <div className="flex items-center gap-3">
              <button className="p-1.5 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                <Bell className="h-5 w-5" />
              </button>
              
              {/* Only show logout if logged in */}
              {session?.user && (
                <Link href="/api/auth/signout">
                  <Button variant="ghost" size="icon" title="Sign Out">
                    <LogOut className="h-5 w-5" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
        <hr className="my-8" />
      </div>
    </div>
  );
} 
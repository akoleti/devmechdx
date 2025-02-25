'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  LayoutGrid, Menu, X, Users, Building, Settings, 
  LogOut, BarChart3, FileText, HardDrive
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import FunctionalNavbar from '@/components/navigation/FunctionalNavbar';

// Navigation links for the sidebar
const navLinks = [
  { title: 'Dashboard', href: '/dashboard', icon: <BarChart3 className="h-5 w-5" /> },
  { title: 'Customers', href: '/customers', icon: <Users className="h-5 w-5" /> },
  { title: 'Organizations', href: '/organizations', icon: <Building className="h-5 w-5" /> },
  { title: 'Logs', href: '/logs', icon: <FileText className="h-5 w-5" /> },
  { title: 'Equipments', href: '/equipments', icon: <HardDrive className="h-5 w-5" /> },
  { title: 'Reports', href: '/reports', icon: <BarChart3 className="h-5 w-5" /> },
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
    <div className="flex overflow-hidden bg-gray-100">
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Top Navbar - Full width with contained content */}
        <div className="w-full bg-white shadow-sm">
          <div className="container mx-auto px-4">
            <FunctionalNavbar />
          </div>
        </div>
        
        {/* Page content - Full width with contained content */}
        <main className="flex-1 overflow-y-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
} 
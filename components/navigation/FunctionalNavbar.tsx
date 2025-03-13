'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
  Search,
  Bell,
  User,
  Menu,
  X,
  LayoutDashboard,
  Users,
  ClipboardList,
  BarChart3,
  Settings,
  HardDrive,
  Users2Icon,
  ShieldCheck,
  Building,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import OrganizationSwitcher from '@/components/organization-switcher';
import OrganizationDisplay from '@/components/organization-display';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
  },
  {
    name: 'Customers',
    href: '/customers',
   
  },
  {
    name: 'Locations',
    href: '/locations',
   
  },
  
  {
    name: 'Equipments',
    href: '/equipments',
  },
  {
    name: 'Logs',
    href: '/logs',
  },
  {
    name: 'Reports',
    href: '/reports',
  },
];

export default function FunctionalNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasNotifications, setHasNotifications] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const hasRefreshedRef = useRef(false);

  // Get the first character of the user's name
  const getUserInitial = () => {
    if (session?.user?.name) {
      return session.user.name.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Handle logout function
  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  // Close the mobile menu when path changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Log the session and fetch organization data only once
  useEffect(() => {
    const refreshOrganizationData = async () => {
      try {
        // Only log once to avoid console spam
        console.log("Initial session in profile:", JSON.stringify(session?.user?.currentOrganization || {}));
        
        const response = await fetch('/api/user/current-organization');
        if (response.ok) {
          const data = await response.json();
          
          // Compare current organization with new data to avoid unnecessary updates
          const currentOrgId = session?.user?.currentOrganization?.id;
          const newOrgId = data.currentOrganization?.id;
          
          // Only update if the data is different or missing
          if (data.currentOrganization && (!currentOrgId || currentOrgId !== newOrgId)) {
            console.log("Updating session with fresh organization data:", data.currentOrganization);
            await update({
              currentOrganization: data.currentOrganization,
              currentRole: data.currentRole
            });
          } else {
            console.log("Organization data already up to date, no update needed");
          }
        }
      } catch (error) {
        console.error("Error refreshing organization data:", error);
      }
    };
    
    // Only refresh once when session is available and we haven't refreshed yet
    if (session && !hasRefreshedRef.current) {
      hasRefreshedRef.current = true;
      refreshOrganizationData();
    }
  }, [session, update]);

  return (
    
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-full items-center justify-between px-1 sm:px-6 lg:px-1">
        {/* Logo */}
        <div className="flex items-center">
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

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-4 lg:space-x-6">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2 text-sm font-medium transition-colors ${
                pathname === item.href
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <span className="ml-2">{item.name}</span>
            </Link>
          ))}
        </div>

        {/* Search, Notifications, and Profile */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden md:block">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="search"
                placeholder="Search..."
                className="w-64 pl-10 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-gray-600" />
                {hasNotifications && (
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500"></span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-96 overflow-y-auto">
                <div className="p-4 text-center text-sm text-gray-500">
                  No new notifications
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/notifications" className="cursor-pointer justify-center">
                  View all notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "User"} />
                  <AvatarFallback>{getUserInitial()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{session?.user?.name || "My Account"}</DropdownMenuLabel>
              {session && <OrganizationDisplay variant="compact" className="px-2 py-1" />}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" /> Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/organization">
                  <Building className="mr-2 h-4 w-4" /> Organization
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/security">
                  <ShieldCheck className="mr-2 h-4 w-4" /> Security
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/users">
                  <Users2Icon className="mr-2 h-4 w-4" /> Users
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {/* Mobile Search */}
            <div className="mb-4 mt-2">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full pl-10 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {/* Mobile Nav Links */}
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center rounded-md px-3 py-2 text-base font-medium ${
                  pathname === item.href
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-900 hover:bg-gray-50 hover:text-blue-600'
                }`}
              >
                <span className="ml-3">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
} 
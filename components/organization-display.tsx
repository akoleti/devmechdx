'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { Building } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrganizationDisplayProps {
  variant?: 'default' | 'badge' | 'compact';
  className?: string;
}

export default function OrganizationDisplay({ 
  variant = 'default',
  className
}: OrganizationDisplayProps) {
  const { data: session } = useSession();
  const [orgName, setOrgName] = useState<string | null>(null);
  const hasRefreshedRef = useRef(false);

  useEffect(() => {
    // Get organization name from session only once
    if (session?.user?.currentOrganization?.name && !orgName) {
      setOrgName(session.user.currentOrganization.name);
    }
    
    // If we don't have organization name and haven't refreshed yet, try to fetch it
    if (!orgName && !hasRefreshedRef.current && session) {
      hasRefreshedRef.current = true;
      
      const fetchOrgData = async () => {
        try {
          const response = await fetch('/api/user/current-organization');
          if (response.ok) {
            const data = await response.json();
            if (data.currentOrganization?.name) {
              setOrgName(data.currentOrganization.name);
            }
          }
        } catch (error) {
          console.error('Error fetching organization:', error);
        }
      };
      
      fetchOrgData();
    }
  }, [session, orgName]);

  if (!orgName) {
    return null;
  }

  if (variant === 'badge') {
    return (
      <div className={cn("bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium inline-flex items-center", className)}>
        <Building className="mr-1 h-3 w-3" />
        {orgName}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={cn("text-sm text-gray-500 flex items-center", className)}>
        <Building className="mr-1 h-3 w-3" />
        {orgName}
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn("text-gray-700 flex items-center", className)}>
      <Building className="mr-2 h-4 w-4 text-gray-500" />
      {orgName}
    </div>
  );
} 
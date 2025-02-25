'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronDown, Building } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function OrganizationSwitcher() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  if (!session?.user?.organizations || session.user.organizations.length === 0) {
    return null;
  }

  const currentOrganization = session.user.currentOrganization || session.user.organizations[0];
  const hasMultipleOrgs = session.user.organizations.length > 1;
  
  const handleOrganizationChange = async (organizationId: string) => {
    setIsLoading(true);
    
    try {
      // Find the selected organization in the user's organizations
      const selectedOrg = session.user.organizations?.find(org => org.id === organizationId);
      
      if (!selectedOrg) {
        throw new Error('Organization not found');
      }
      
      // Call the API to update the user's session with the selected organization
      const response = await fetch('/api/user/set-organization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ organizationId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to switch organization');
      }
      
      // Update the client-side session with the new organization context
      await update({
        currentOrganization: selectedOrg,
        currentRole: selectedOrg.role,
      });
      
      // Reload the current page to refresh data based on the new organization context
      router.refresh();
      
    } catch (error) {
      console.error('Error switching organization:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      {hasMultipleOrgs && !session.user.currentOrganization && (
        <span className="absolute -right-1 -top-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
        </span>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={isLoading}>
          <Button variant="outline" className="w-[200px] justify-between">
            <div className="flex items-center gap-2 truncate">
              <Building className="h-4 w-4" />
              <span className="truncate">{currentOrganization?.name || 'Select Organization'}</span>
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Organizations</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {session.user.organizations.map((org) => (
            <DropdownMenuItem
              key={org.id}
              onClick={() => handleOrganizationChange(org.id)}
              className="cursor-pointer flex justify-between items-center"
            >
              <span className="truncate">{org.name}</span>
              {currentOrganization?.id === org.id && (
                <Check className="h-4 w-4" />
              )}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => router.push('/organizations')}
            className="cursor-pointer"
          >
            View All Organizations
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 
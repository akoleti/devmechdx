'use client';

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, ArrowRight, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import useSessionStore from '@/app/stores/sessionStore';

interface Organization {
  id: string;
  name: string;
  role: string;
  type?: string;
}

export default function OrganizationsPage() {
  const router = useRouter();
  const { data: session, status: sessionStatus, update } = useSession();
  const { organizations: storeOrganizations, setOrganizations, setCurrentOrganization } = useSessionStore();
  
  const [organizations, setLocalOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const hasAttemptedFetch = useRef(false);

  // Effect to handle organization data
  useEffect(() => {
    const fetchOrganizations = async () => {
      if (hasAttemptedFetch.current) return;
      
      try {
        hasAttemptedFetch.current = true;

        // First check if we have organizations in store
        if (storeOrganizations?.length > 0) {
          setLocalOrganizations(storeOrganizations);
          setPageLoading(false);
          return;
        }

        // If authenticated, try getting them from the API
        if (sessionStatus === 'authenticated') {
          const response = await fetch('/api/organizations');
          if (response.ok) {
            const data = await response.json();
            const orgs = data.organizations || [];
            setOrganizations(orgs);
            setLocalOrganizations(orgs);
          }
          setPageLoading(false);
        }
      } catch (error) {
        console.error('Error fetching organizations:', error);
      } finally {
        setPageLoading(false);
      }
    };

    if (sessionStatus === 'authenticated') {
      fetchOrganizations();
    } 
  }, [sessionStatus, storeOrganizations, setOrganizations, router]);

  // Handle organization selection
  const handleOrganizationSelect = async (orgId: string) => {
    try {
      setLoading(true);
      const selectedOrg = organizations.find(org => org.id === orgId);
      if (selectedOrg) {
        // First update the current organization in the session store
        await setCurrentOrganization(selectedOrg.id);
        
        // Store the selected organization temporarily in localStorage to display on dashboard
        if (typeof window !== 'undefined') {
          localStorage.setItem('selectedOrganizationName', selectedOrg.name);
        }
        
        // Call the API to update the session
        const response = await fetch('/api/user/set-organization', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ organizationId: selectedOrg.id }),
        });
        
        if (!response.ok) {
          console.error('Failed to update organization in session');
        }
        
        // Update the session with the current organization
        await update({
          currentOrganization: {
            id: selectedOrg.id,
            name: selectedOrg.name,
            role: selectedOrg.role
          },
          currentRole: selectedOrg.role,
        });
        
        // Then redirect to dashboard
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error selecting organization:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while session is loading
  if (sessionStatus === 'loading' || pageLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading your organizations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <div className="bg-white shadow-sm py-8 mb-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Organizations</h1>
              <p className="text-gray-500 mt-1">Select an organization to continue</p>
            </div>
            {organizations.length > 0 && (
              <Button 
                onClick={() => router.push('/organizations/new')} 
                className="flex items-center mt-4 md:mt-0"
                type="button"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                New Organization
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4">
        {organizations.length === 0 ? (
          <div className="max-w-md mx-auto text-center p-8 border rounded-lg bg-white shadow-sm">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">No Organizations Found</h3>
            <p className="text-gray-500 mb-6">You don't have any organizations yet. Create one to get started.</p>
            <div className="space-y-3">
              <Button 
                onClick={() => router.push('/organizations/new')} 
                className="w-full"
                type="button"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Organization
              </Button>
              <Button 
                onClick={() => router.push('/contact')} 
                variant="outline" 
                className="w-full"
                type="button"
              >
                Contact Support
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {organizations.map((org) => (
              <Card key={org.id} className="hover:shadow-md transition-shadow bg-white border border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center">
                    <Building className="h-5 w-5 mr-2 text-primary" />
                    {org.name}
                  </CardTitle>
                  <CardDescription>{getRoleDescription(org.role)}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">Type</span>
                      <Badge variant="outline">{formatOrgType(org.type)}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">Role</span>
                      <Badge variant={getRoleBadgeVariant(org.role)}>{formatRole(org.role)}</Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => handleOrganizationSelect(org.id)} 
                    disabled={loading}
                    className="w-full relative"
                    type="button"
                  >
                    {loading ? (
                      <>
                        <span className="opacity-0">Select</span>
                        <span className="absolute inset-0 flex items-center justify-center">
                          <div className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                        </span>
                      </>
                    ) : (
                      <>
                        <span>Select</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper functions to format organization data
function formatOrgType(type?: string): string {
  if (!type) return 'Organization';
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
}

function formatRole(role?: string): string {
  if (!role) return 'User';
  return role.charAt(0) + role.slice(1).toLowerCase();
}

function getRoleDescription(role?: string): string {
  if (!role) return 'Access to organization resources';
  
  switch (role.toUpperCase()) {
    case 'ADMINISTRATOR':
      return 'Full control over organization settings and users';
    case 'MANAGER':
      return 'Manage team members and organization resources';
    case 'TECHNICIAN':
      return 'Technical support and equipment management';
    case 'USER':
      return 'Standard access to organization resources';
    case 'CUSTOMER':
      return 'Customer access to support and services';
    default:
      return 'Access to organization resources';
  }
}

function getRoleBadgeVariant(role?: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (!role) return 'outline';
  
  switch (role.toUpperCase()) {
    case 'ADMINISTRATOR':
      return 'destructive';
    case 'MANAGER':
      return 'default';
    case 'TECHNICIAN':
      return 'secondary';
    default:
      return 'outline';
  }
} 
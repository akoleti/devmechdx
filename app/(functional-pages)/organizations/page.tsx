'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, ArrowRight, LayoutGrid, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Footer from '@/components/navigation/Footer';
import useSessionStore from '@/app/stores/sessionStore';

interface Organization {
  id: string;
  name: string;
  role: string;
  type?: string;
}

export default function OrganizationsPage() {
  const router = useRouter();
  // Get session data from our store
  const { status, user, organizations: storeOrganizations, setOrganizations, setCurrentOrganization } = useSessionStore();

  console.log('status:', status);
  console.log('user:', user);
  console.log('organizations:', storeOrganizations);
  
  const [organizations, setLocalOrganizations] = useState<Organization[]>(storeOrganizations || []);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Set a timeout to ensure we eventually stop loading
  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Force exit loading state after 3 seconds
    timeoutRef.current = setTimeout(() => {
      if (pageLoading) {
        setPageLoading(false);
      }
    }, 3000);
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [pageLoading]);
  
  // Effect to handle organization data
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        // First check if we have organizations in our store or session
        if (storeOrganizations?.length > 0) {
          setLocalOrganizations(storeOrganizations);
          setPageLoading(false);
          return;
        }
        
        if (user?.organizations) {
          const orgs = user.organizations;
          setOrganizations(orgs);
          setLocalOrganizations(orgs);
          setPageLoading(false);
          return;
        }

        // If authenticated but no organizations yet, try getting them from the API
        if (status === 'authenticated') {
          const response = await fetch('/api/user/organizations');
          if (response.ok) {
            const data = await response.json();
            const orgs = data.organizations || [];
            setOrganizations(orgs);
            setLocalOrganizations(orgs);
          }
          setPageLoading(false);
        } else if (status === 'unauthenticated') {
          // If not authenticated, we can exit loading state
          setPageLoading(false);
        }
      } catch (error) {
        console.error('Error fetching organizations:', error);
        setPageLoading(false);
      }
    };

    // Only run if we're authenticated or loading
    if (status !== 'unauthenticated') {
      fetchOrganizations();
    } else {
      setPageLoading(false);
    }
  }, [status, user, storeOrganizations, setOrganizations]);

  // Handle navigation redirection when unauthenticated
  

  const handleSelectOrganization = useCallback(async (organizationId: string) => {
    try {
      // If already loading, prevent multiple calls
     
      // Call API to set the current organization
      const response = await fetch('/api/user/set-organization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ organizationId }),
      });

      if (!response.ok) {
        throw new Error('Failed to select organization');
      }

      // Update current organization in store
      setCurrentOrganization(organizationId);
      
      // Navigate to dashboard
      router.replace('/dashboard');
    } catch (error) {
      console.error('Error selecting organization:', error);
      setLoading(false);
    }
  }, [router, loading, setCurrentOrganization]);

  // Show loading state while session is loading
  if (status === 'loading' || pageLoading) {
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
    <>
      {/* Header */}
        <div className="container mx-auto px-4 py-4 flex justify-end">
          <div className="flex items-center gap-4">
            {organizations.length > 0 && (
              <Button 
                onClick={() => router.push('/organizations/new')} 
                size="sm"
                className="flex items-center ml-auto"
                type="button"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                New Organization
              </Button>
            )}
           
          </div>
        </div>

      {/* Main content */}
      <main className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">Welcome to MechDX</h1>
          <p className="text-gray-600 text-lg mb-2">Please select an organization to continue</p>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            You have access to the following organizations. Choose one to set your working context.
          </p>
        </div>

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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
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
                    onClick={() => handleSelectOrganization(org.id)} 
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
      </main>

     <Footer />
    </>
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
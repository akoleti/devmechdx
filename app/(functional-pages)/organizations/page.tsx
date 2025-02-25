'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, ArrowRight, LayoutGrid, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Footer from '@/components/navigation/Footer';
interface Organization {
  id: string;
  name: string;
  role: string;
  type?: string;
}

export default function OrganizationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If not authenticated, redirect to login
    if (status === 'unauthenticated') {
      router.push('/login');
    }

    // Get organizations from session when available
    if (session?.user?.organizations) {
      setOrganizations(session.user.organizations);
    }
  }, [session, status, router]);

  const handleSelectOrganization = useCallback(async (organizationId: string) => {
    try {
      setLoading(true);
      console.log('Selecting organization:', organizationId);
      
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

      // Redirect to dashboard after selecting organization
      router.push('/dashboard');
    } catch (error) {
      console.error('Error selecting organization:', error);
      setLoading(false);
    }
  }, [router]);

  // Show loading state while session is loading
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading your organizations...</p>
        </div>
      </div>
    );
  }

  // For debugging
  console.log('Session:', session);
  console.log('Organizations:', organizations);

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <LayoutGrid className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">DevMechDX</span>
          </div>
          <div className="flex items-center gap-4">
            {organizations.length > 0 && (
              <Button 
                onClick={() => router.push('/organizations/new')} 
                size="sm"
                className="flex items-center"
                type="button"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                New Organization
              </Button>
            )}
            {session?.user?.name && (
              <span className="text-sm text-gray-600">Hello, {session.user.name}</span>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">Welcome to DevMechDX</h1>
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
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { UserIcon, Building, Search, Users } from "lucide-react";

interface Organization {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  organizationId: string;
  organizationName: string;
}

// This wrapper ensures we only render on the client side
const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return null;
  }
  
  return <>{children}</>;
};

export default function UsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrganizations, setSelectedOrganizations] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch organizations the user belongs to
  useEffect(() => {
    // If not authenticated, redirect to login
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    // Get organizations from session when available
    if (session?.user?.organizations) {
      const orgs = session.user.organizations.map((org: any) => ({
        id: org.id,
        name: org.name
      }));
      setOrganizations(orgs);
      
      // By default, select all organizations
      setSelectedOrganizations(orgs.map(org => org.id));
    }
  }, [session, status, router]);

  // Fetch users based on selected organizations
  useEffect(() => {
    const fetchUsers = async () => {
      if (selectedOrganizations.length === 0) {
        setUsers([]);
        setFilteredUsers([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const promises = selectedOrganizations.map(async orgId => {
          console.log(`Fetching users for organization: ${orgId}`);
          try {
            const response = await fetch(`/api/organizations/${orgId}/users`);
            
            if (!response.ok) {
              console.error(`Error fetching users for organization ${orgId}:`, response.status, response.statusText);
              const errorText = await response.text();
              console.error(`Error response body:`, errorText);
              return { error: true, orgId, status: response.status, message: response.statusText };
            }
            
            const data = await response.json();
            console.log(`Users data for organization ${orgId}:`, data);
            return { error: false, orgId, data };
          } catch (error) {
            console.error(`Exception fetching users for organization ${orgId}:`, error);
            return { error: true, orgId, message: error instanceof Error ? error.message : String(error) };
          }
        });
        
        const results = await Promise.all(promises);
        
        // Check if any requests failed
        const errors = results.filter(result => result.error);
        if (errors.length > 0) {
          console.error('Failed to fetch users for some organizations:', errors);
          setError(`Failed to fetch users for ${errors.length} organization(s)`);
        }
        
        // Flatten and format the successful results
        const allUsers = results
          .filter(result => !result.error && result.data && Array.isArray(result.data.users))
          .flatMap((result) => {
            const orgId = result.orgId;
            const orgName = organizations.find(org => org.id === orgId)?.name || '';
            
            return result.data.users.map((user: any) => ({
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              organizationId: orgId,
              organizationName: orgName
            }));
          });
        
        setUsers(allUsers);
        setFilteredUsers(allUsers);
        setLoading(false);
      } catch (error) {
        console.error('Error in fetchUsers:', error);
        setError('Failed to fetch users. Please try again later.');
        setLoading(false);
      }
    };

    if (organizations.length > 0 && selectedOrganizations.length > 0) {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [selectedOrganizations, organizations]);

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = users.filter(
      user => 
        user.name?.toLowerCase().includes(query) || 
        user.email?.toLowerCase().includes(query) ||
        user.role?.toLowerCase().includes(query) ||
        user.organizationName?.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  // Toggle organization selection
  const toggleOrganization = (orgId: string) => {
    setSelectedOrganizations(prev => {
      if (prev.includes(orgId)) {
        return prev.filter(id => id !== orgId);
      } else {
        return [...prev, orgId];
      }
    });
  };

  // Select all organizations
  const selectAllOrganizations = () => {
    setSelectedOrganizations(organizations.map(org => org.id));
  };

  // Deselect all organizations
  const deselectAllOrganizations = () => {
    setSelectedOrganizations([]);
  };

  // Format role for display
  const formatRole = (role: string) => {
    return role?.charAt(0).toUpperCase() + role?.slice(1).toLowerCase();
  };

  // Show loading state while session is loading
  if (status === 'loading') {
    return null; // Return null initially to prevent server/client mismatch
  }

  return (
    <ClientOnly>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading users...</p>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold flex items-center">
              <Users className="mr-2 h-8 w-8 text-primary" />
              Users
            </h1>
          </div>

          {error && (
            <div className="mb-6 p-4 border border-red-200 bg-red-50 text-red-700 rounded-md">
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Organization Filter Panel */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Building className="mr-2 h-5 w-5" />
                    Organizations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between mb-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={selectAllOrganizations}
                    >
                      Select All
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={deselectAllOrganizations}
                    >
                      Deselect All
                    </Button>
                  </div>
                  <div className="space-y-2 mt-2">
                    {organizations.map(org => (
                      <div key={org.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`org-${org.id}`} 
                          checked={selectedOrganizations.includes(org.id)}
                          onCheckedChange={() => toggleOrganization(org.id)}
                        />
                        <Label htmlFor={`org-${org.id}`} className="cursor-pointer">
                          {org.name}
                        </Label>
                      </div>
                    ))}
                    {organizations.length === 0 && (
                      <p className="text-sm text-gray-500">No organizations found</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Users List */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <CardTitle className="text-lg">
                      Users ({filteredUsers.length})
                    </CardTitle>
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Search users..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredUsers.length > 0 ? (
                    <div className="divide-y">
                      {filteredUsers.map(user => (
                        <div key={`${user.id}-${user.organizationId}`} className="py-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center">
                              <div className="bg-gray-100 rounded-full p-2 mr-3">
                                <UserIcon className="h-5 w-5 text-gray-600" />
                              </div>
                              <div>
                                <h3 className="font-medium">{user.name}</h3>
                                <p className="text-sm text-gray-500">{user.email}</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <Badge className="mb-1">{formatRole(user.role)}</Badge>
                              <span className="text-xs text-gray-500">{user.organizationName}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <UserIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-gray-900">No users found</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {selectedOrganizations.length === 0 
                          ? 'Please select at least one organization to see users.' 
                          : 'No users match your search criteria.'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </ClientOnly>
  );
} 
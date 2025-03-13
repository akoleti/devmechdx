'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  UserPlus, 
  Mail, 
  Filter, 
  MoreHorizontal,
  Info,
  ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Footer from '@/components/navigation/Footer';

// Define invite form schema
const inviteSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  role: z.string({ required_error: "Please select a role." }),
  message: z.string().optional(),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  joinedAt: string;
  image: string | null;
}

interface Invitation {
  id: string;
  email: string;
  role: string;
  token: string;
  status: string;
  expiresAt: string;
  invitedBy: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
}

export default function UsersPage() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('members');
  const [users, setUsers] = useState<User[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [loadingInvitations, setLoadingInvitations] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [resendingInvitation, setResendingInvitation] = useState<string | null>(null);
  const [cancelingInvitation, setCancelingInvitation] = useState<string | null>(null);
  
  // Initialize invite form
  const inviteForm = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: '',
      role: 'USER',
      message: '',
    },
  });

  // Check if user can invite new members
  const canInviteMembers = ['ADMINISTRATOR', 'MANAGER'].includes(session?.user?.currentRole || '');

  // Fetch organization users
  const fetchOrganizationUsers = async () => {
    if (!session?.user?.currentOrganization?.id) return;
    
    setIsLoadingUsers(true);
    try {
      const response = await fetch(`/api/organizations/${session.user.currentOrganization.id}/users`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        console.error('Failed to fetch organization users');
        toast({
          title: "Error",
          description: "Failed to load users",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching organization users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Fetch organization invitations
  const fetchOrganizationInvitations = async () => {
    if (!session?.user?.currentOrganization?.id) return;
    
    setLoadingInvitations(true);
    try {
      const response = await fetch(`/api/organizations/${session.user?.currentOrganization.id}/invitations`);
      if (!response.ok) {
        throw new Error('Failed to fetch invitations');
      }
      const data = await response.json();
      setInvitations(data.invitations || []);
    } catch (error) {
      console.error('Error fetching invitations:', error);
      toast({
        title: "Error",
        description: "Failed to load invitations",
        variant: "destructive",
      });
    } finally {
      setLoadingInvitations(false);
    }
  };

  // Handle invite submission
  const handleInvite = async (data: InviteFormValues) => {
    if (!session?.user?.currentOrganization?.id) {
      toast({
        title: "Error",
        description: "No organization selected. Please select an organization first.",
        variant: "destructive",
      });
      return;
    }

    setIsInviting(true);
    setInviteError(null);

    try {
      const response = await fetch(`/api/organizations/${session.user.currentOrganization.id}/invitations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        toast({
          title: "Invitation Sent",
          description: `An invitation has been sent to ${data.email}.`,
          variant: "default",
          className: "bg-green-50 border-green-200 text-green-800",
        });
        inviteForm.reset();
        setIsInviteDialogOpen(false);
        // Refresh users list
        fetchOrganizationUsers();
        fetchOrganizationInvitations();
      } else {
        setInviteError(responseData.error || 'Failed to send invitation');
        toast({
          title: "Error",
          description: responseData.error || "Failed to send invitation",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
      setInviteError('An unexpected error occurred. Please try again.');
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsInviting(false);
    }
  };

  // Resend invitation
  const resendInvitation = async (invitationId: string) => {
    if (!session?.user?.currentOrganization?.id) return;
    
    setResendingInvitation(invitationId);
    try {
      const response = await fetch(`/api/organizations/${session.user?.currentOrganization.id}/invitations/${invitationId}/resend`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to resend invitation');
      }
      
      toast({
        title: "Success",
        description: "Invitation has been resent",
      });
    } catch (error) {
      console.error('Error resending invitation:', error);
      toast({
        title: "Error",
        description: "Failed to resend invitation",
        variant: "destructive",
      });
    } finally {
      setResendingInvitation(null);
    }
  };

  // Cancel invitation
  const cancelInvitation = async (invitationId: string) => {
    if (!session?.user?.currentOrganization?.id) return;
    
    setCancelingInvitation(invitationId);
    try {
      const response = await fetch(`/api/organizations/${session.user?.currentOrganization.id}/invitations/${invitationId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to cancel invitation');
      }
      
      // Remove the invitation from the list
      setInvitations(invitations.filter(inv => inv.id !== invitationId));
      
      toast({
        title: "Success",
        description: "Invitation has been canceled",
      });
    } catch (error) {
      console.error('Error canceling invitation:', error);
      toast({
        title: "Error",
        description: "Failed to cancel invitation",
        variant: "destructive",
      });
    } finally {
      setCancelingInvitation(null);
    }
  };

  // Handle role changes for members
  const handleRoleChange = async (userId: string, role: string) => {
    if (!session?.user?.currentOrganization?.id) return;
    
    try {
      const response = await fetch(`/api/organizations/${session.user.currentOrganization.id}/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Role Updated",
          description: `${data.userName || 'User'}'s role has been updated to ${getRoleDisplay(role)}.`,
          variant: "default",
          className: "bg-green-50 border-green-200 text-green-800",
        });
        
        // Refresh the users list
        await fetchOrganizationUsers();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update role",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  // Handle role changes for invitations
  const handleInvitationRoleChange = async (invitationId: string, role: string) => {
    if (!session?.user?.currentOrganization?.id) return;
    
    try {
      const response = await fetch(`/api/organizations/${session.user.currentOrganization.id}/invitations/${invitationId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Role Updated",
          description: `Invitation role has been updated to ${getRoleDisplay(role)}.`,
          variant: "default",
          className: "bg-green-50 border-green-200 text-green-800",
        });
        
        // Refresh the invitations list
        await fetchOrganizationInvitations();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update role",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating invitation role:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  // Get role display name
  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'ADMINISTRATOR': return 'Administrator';
      case 'MANAGER': return 'Manager';
      case 'SUPERVISOR': return 'Supervisor';
      case 'TECHNICIAN': return 'Technician';
      case 'DISPATCHER': return 'Dispatcher';
      case 'ESTIMATOR': return 'Estimator';
      case 'CUSTOMER': return 'Customer';
      case 'USER': return 'User';
      default: return role;
    }
  };

  // Get role badge variant
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMINISTRATOR': return 'destructive';
      case 'MANAGER': return 'default';
      case 'SUPERVISOR': return 'secondary';
      case 'TECHNICIAN': return 'outline';
      case 'DISPATCHER': return 'outline';
      case 'ESTIMATOR': return 'outline';
      case 'CUSTOMER': return 'outline';
      case 'USER': return 'outline';
      default: return 'outline';
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInvitations = invitations.filter(invitation =>
    invitation.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Load users and invitations when component mounts or organization changes
  useEffect(() => {
    if (session?.user?.currentOrganization?.id) {
      fetchOrganizationUsers();
      fetchOrganizationInvitations();
    }
  }, [session?.user?.currentOrganization?.id]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Organization Users</h1>
          {canInviteMembers && (
            <Button
              onClick={() => setIsInviteDialogOpen(true)}
              className="flex items-center"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Invite User
            </Button>
          )}
        </div>
        
        {/* Tabs for Members and Invitations */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="invitations">Pending Invitations</TabsTrigger>
          </TabsList>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <TabsContent value="members">
            {isLoadingUsers ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <UserPlus className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-2">No members found</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  {canInviteMembers 
                    ? "Your organization doesn't have any members yet. Invite team members to collaborate."
                    : "Your organization doesn't have any members yet. Ask an administrator to invite team members."}
                </p>
                {canInviteMembers && (
                  <Button
                    onClick={() => setIsInviteDialogOpen(true)}
                    className="flex items-center mx-auto"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite Member
                  </Button>
                )}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={user.image || undefined} alt={user.name || user.email} />
                              <AvatarFallback>
                                {user.name
                                  ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
                                  : user.email.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name || 'Unnamed User'}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {/* Show role selector for admins/managers, badge for others */}
                          {['ADMINISTRATOR', 'MANAGER'].includes(session?.user?.currentRole || '') && 
                           user.id !== session?.user?.id ? (
                            <Select 
                              defaultValue={user.role} 
                              onValueChange={(value) => handleRoleChange(user.id, value)}
                              disabled={
                                // Managers can't change admin roles
                                (session?.user?.currentRole === 'MANAGER' && user.role === 'ADMINISTRATOR') ||
                                // Only admins can change admin roles
                                (user.role === 'ADMINISTRATOR' && session?.user?.currentRole !== 'ADMINISTRATOR')
                              }
                            >
                              <SelectTrigger className="w-[140px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="USER">User</SelectItem>
                                <SelectItem value="MANAGER">Manager</SelectItem>
                                <SelectItem value="SUPERVISOR">Supervisor</SelectItem>
                                <SelectItem value="TECHNICIAN">Technician</SelectItem>
                                <SelectItem value="DISPATCHER">Dispatcher</SelectItem>
                                <SelectItem value="ESTIMATOR">Estimator</SelectItem>
                                <SelectItem value="CUSTOMER">Customer</SelectItem>
                                {session?.user?.currentRole === 'ADMINISTRATOR' && (
                                  <SelectItem value="ADMINISTRATOR">Administrator</SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Badge variant={getRoleBadgeVariant(user.role) as any}>
                              {getRoleDisplay(user.role)}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.isActive ? "default" : "secondary"}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(user.joinedAt)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Send Message</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">Remove from Organization</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="invitations">
            {loadingInvitations ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredInvitations.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-2">No pending invitations</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  {canInviteMembers 
                    ? "You don't have any pending invitations. Invite team members to collaborate."
                    : "There are no pending invitations for this organization."}
                </p>
                {canInviteMembers && (
                  <Button
                    onClick={() => setIsInviteDialogOpen(true)}
                    className="flex items-center mx-auto"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite Member
                  </Button>
                )}
              </div>
            ) : (
              <>
                {canInviteMembers && filteredInvitations.length > 0 && (
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-lg font-medium">Pending Invitations</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Info className="h-4 w-4 mr-1" />
                      <span>You can change roles before or after invitations are accepted</span>
                    </div>
                  </div>
                )}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Invited By</TableHead>
                        <TableHead>Expires</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInvitations.map((invitation) => (
                        <TableRow key={invitation.id}>
                          <TableCell>{invitation.email}</TableCell>
                          <TableCell>
                            {canInviteMembers ? (
                              <Select
                                defaultValue={invitation.role}
                                onValueChange={(value) => handleInvitationRoleChange(invitation.id, value)}
                                disabled={session?.user?.currentRole !== 'ADMINISTRATOR' && invitation.role === 'ADMINISTRATOR'}
                              >
                                <SelectTrigger className="w-[140px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="USER">User</SelectItem>
                                  <SelectItem value="MANAGER">Manager</SelectItem>
                                  <SelectItem value="SUPERVISOR">Supervisor</SelectItem>
                                  <SelectItem value="TECHNICIAN">Technician</SelectItem>
                                  <SelectItem value="DISPATCHER">Dispatcher</SelectItem>
                                  <SelectItem value="ESTIMATOR">Estimator</SelectItem>
                                  <SelectItem value="CUSTOMER">Customer</SelectItem>
                                  {session?.user?.currentRole === 'ADMINISTRATOR' && (
                                    <SelectItem value="ADMINISTRATOR">Administrator</SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                            ) : (
                              <Badge variant={getRoleBadgeVariant(invitation.role) as any}>
                                {getRoleDisplay(invitation.role)}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={invitation.invitedBy.image || undefined} />
                                <AvatarFallback>
                                  {invitation.invitedBy.name
                                    ? invitation.invitedBy.name.split(' ').map(n => n[0]).join('').toUpperCase()
                                    : invitation.invitedBy.email.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{invitation.invitedBy.name || invitation.invitedBy.email}</span>
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(invitation.expiresAt)}</TableCell>
                          <TableCell>
                            {canInviteMembers && (
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => resendInvitation(invitation.id)}
                                  disabled={resendingInvitation === invitation.id}
                                >
                                  {resendingInvitation === invitation.id ? 'Sending...' : 'Resend'}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => cancelInvitation(invitation.id)}
                                  disabled={cancelingInvitation === invitation.id}
                                  className="text-destructive hover:text-destructive"
                                >
                                  {cancelingInvitation === invitation.id ? 'Canceling...' : 'Cancel'}
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Invite User Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation to join your organization. They'll receive an email with instructions.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...inviteForm}>
            <form onSubmit={inviteForm.handleSubmit(handleInvite)} className="space-y-6">
              <FormField
                control={inviteForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        <Input placeholder="colleague@example.com" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={inviteForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USER">User</SelectItem>
                        <SelectItem value="MANAGER">Manager</SelectItem>
                        <SelectItem value="SUPERVISOR">Supervisor</SelectItem>
                        <SelectItem value="TECHNICIAN">Technician</SelectItem>
                        <SelectItem value="DISPATCHER">Dispatcher</SelectItem>
                        <SelectItem value="ESTIMATOR">Estimator</SelectItem>
                        <SelectItem value="CUSTOMER">Customer</SelectItem>
                        {session?.user?.currentRole === 'ADMINISTRATOR' && (
                          <SelectItem value="ADMINISTRATOR">Administrator</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      This determines what permissions they'll have in your organization.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={inviteForm.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Add a personal message..." {...field} />
                    </FormControl>
                    <FormDescription>
                      This message will be included in the invitation email.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {inviteError && (
                <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                  {inviteError}
                </div>
              )}
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsInviteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isInviting}>
                  {isInviting ? "Sending..." : "Send Invitation"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Footer />
    </>
  );
} 
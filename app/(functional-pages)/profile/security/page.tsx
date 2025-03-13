'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Lock, ShieldAlert, ActivityIcon, Loader, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define password change schema with validation
const passwordSchema = z.object({
  currentPassword: z.string().min(1, { message: 'Current password is required' }),
  newPassword: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: 'Password must include uppercase, lowercase and number',
    }),
  confirmPassword: z.string().min(1, { message: 'Please confirm your password' }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

// Mock activity data - in a real app, this would come from an API
const activityData = [
  {
    id: '1',
    activity: 'Password changed',
    ipAddress: '192.168.1.1',
    location: 'San Francisco, CA',
    device: 'Chrome on MacOS',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
  },
  {
    id: '2',
    activity: 'Login successful',
    ipAddress: '192.168.1.1',
    location: 'San Francisco, CA',
    device: 'Chrome on MacOS',
    timestamp: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
  },
  {
    id: '3',
    activity: 'Login successful',
    ipAddress: '192.168.1.1',
    location: 'San Francisco, CA',
    device: 'Chrome on MacOS',
    timestamp: new Date().toISOString(), // Today
  },
];

// Define proper TypeScript interface for activities
interface Activity {
  id: string;
  description: string;
  activityType: string;
  activityDate: string;
  organizationName?: string;
}

export default function SecurityPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    totalActivities: 0,
    totalPages: 0,
    currentPage: 1
  });

  // Initialize form
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Handle form submission
  const onSubmit = async (values: PasswordFormValues) => {
    setIsSubmitting(true);
    setError("");
    console.log('Submitting password change form:', { ...values, newPassword: '***', confirmPassword: '***' });
    
    try {
      // Call the API endpoint to change the password
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      });
      
      console.log('Password change response status:', response.status);
      const data = await response.json();
      console.log('Password change response data:', data);
      
      if (response.ok) {
        setShowSuccess(true);
        setError("");
        
        // Reset form after successful submission
        form.reset();
        
        toast({
          title: "Password Updated",
          description: "Your password has been successfully updated.",
          variant: "default",
          className: "bg-green-50 border-green-200 text-green-800",
        });
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      } else {
        // Show error message from API
        const errorMessage = data.error || "Failed to update password. Please try again.";
        console.error('Password change error:', errorMessage);
        
        // Set the error for display in the form
        setError(errorMessage);
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setError("Failed to connect to the server. Please try again.");
      toast({
        title: "Error",
        description: "Failed to connect to the server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  };

  // Fetch activity history
  useEffect(() => {
    async function fetchActivityHistory() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/user/activity?page=${pagination.currentPage}&limit=10`);
        if (response.ok) {
          const data = await response.json();
          setActivities(data.activities);
          setPagination({
            totalActivities: data.totalActivities,
            totalPages: data.totalPages,
            currentPage: data.currentPage
          });
        } else {
          console.error("Failed to fetch activity history");
        }
      } catch (error) {
        console.error("Error fetching activity history:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchActivityHistory();
  }, [pagination.currentPage]);

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({
      ...prev,
      currentPage: newPage
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-4 p-0 hover:bg-transparent"
          onClick={() => router.push('/profile')}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-3xl font-bold">Security</h1>
      </div>

      <Tabs defaultValue="password" className="space-y-6">
        <TabsList>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="activity">Account Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                Change Password
              </CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              {showSuccess ? (
                <div className="flex items-center p-4 bg-green-50 text-green-700 rounded-md mb-4">
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  <p>Password successfully updated</p>
                </div>
              ) : (
                <Form {...form}>
                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormDescription>
                            Password must be at least 8 characters and include uppercase, lowercase and numbers
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="mt-4"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader className="mr-2 h-4 w-4 animate-spin" />
                          Updating Password...
                        </>
                      ) : (
                        'Change Password'
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ActivityIcon className="h-5 w-5 mr-2" />
                Account Activity
              </CardTitle>
              <CardDescription>
                Recent activity on your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center p-4">Loading activity...</div>
              ) : activities.length > 0 ? (
                <div className="space-y-4">
                  <div className="rounded-md border">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="p-3 text-left font-medium">Activity</th>
                          <th className="p-3 text-left font-medium">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activities.map((activity) => (
                          <tr key={activity.id} className="border-b">
                            <td className="p-3">{activity.description}</td>
                            <td className="p-3">{new Date(activity.activityDate).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination controls */}
                  {pagination.totalPages > 1 && (
                    <div className="flex justify-center space-x-2 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={pagination.currentPage === 1}
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                      >
                        Previous
                      </Button>
                      <span className="py-2 px-3">
                        Page {pagination.currentPage} of {pagination.totalPages}
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={pagination.currentPage === pagination.totalPages}
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center p-4 text-muted-foreground">
                  No activity found for your account.
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm" className="text-xs">
                Export Activity Log
              </Button>
              <div className="text-xs text-muted-foreground">
                Showing last 30 days of activity
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShieldAlert className="h-5 w-5 mr-2" />
              Security Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-md">
                <h3 className="font-semibold mb-1">Enable Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Add an extra layer of security to your account by enabling 2FA.
                </p>
                <Button variant="outline" size="sm">
                  Set Up 2FA
                </Button>
              </div>
              
              <div className="p-4 border rounded-md">
                <h3 className="font-semibold mb-1">Review Connected Devices</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Check and manage devices that are currently logged into your account.
                </p>
                <Button variant="outline" size="sm">
                  View Devices
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
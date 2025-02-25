'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Building, ArrowLeft, LayoutGrid } from "lucide-react";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Organization name must be at least 2 characters.",
  }),
  type: z.enum(['CUSTOMER', 'VENDOR'], {
    required_error: "Please select an organization type.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewOrganizationPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: 'CUSTOMER',
    },
  });

  // Show loading state while session is loading
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  // Handle form submission
  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    setError(null);

    try {
      // Call API to create organization
      const response = await fetch('/api/organizations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create organization');
      }

      const result = await response.json();
      
      // Call API to set this new organization as current
      await fetch('/api/user/set-organization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ organizationId: result.id }),
      });

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating organization:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <LayoutGrid className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">DevMechDX</span>
          </div>
          <div>
            {session?.user?.name && (
              <span className="text-sm text-gray-600">Hello, {session.user.name}</span>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto py-12 px-4">
        <div className="max-w-md mx-auto">
          <Button
            variant="ghost"
            className="mb-6 flex items-center text-gray-500"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="text-center mb-8">
            <Building className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Create New Organization</h1>
            <p className="text-gray-500">
              You'll be assigned as an administrator for this organization.
            </p>
          </div>

          <Card className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter organization name" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select organization type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="CUSTOMER">Customer</SelectItem>
                          <SelectItem value="VENDOR">Vendor</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="opacity-0">Create Organization</span>
                      <span className="absolute inset-0 flex items-center justify-center">
                        <div className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                      </span>
                    </>
                  ) : 'Create Organization'}
                </Button>
              </form>
            </Form>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} DevMechDX. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

function Card({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`bg-white p-6 rounded-lg ${className || ''}`} {...props}>
      {children}
    </div>
  );
} 
'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building, Save, ArrowLeft, Edit, Check, X, CheckCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Define the organization schema
const organizationSchema = z.object({
  name: z.string().min(2, { message: 'Organization name must be at least 2 characters.' }),
  type: z.string(),
  description: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email({ message: 'Please enter a valid email address.' }).optional().or(z.literal('')),
  website: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
});

type OrganizationFormValues = z.infer<typeof organizationSchema>;

// Define available plans
const plans = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for small facilities',
    price: {
      monthly: '299',
      annual: '2990'
    },
    period: '/month',
    features: [
      'Up to 5 HVAC units',
      'Basic monitoring',
      'Email support',
      'Mobile app access',
      'Weekly reports'
    ],
    recommended: false,
    signupUrl: '/signup/starter'
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Ideal for medium-sized buildings',
    price: {
      monthly: '599',
      annual: '5990'
    },
    period: '/month',
    features: [
      'Up to 20 HVAC units',
      'Advanced analytics',
      'Priority support',
      'API access',
      'Custom alerts',
      'Daily reports',
      'Energy optimization',
      'Maintenance scheduling'
    ],
    recommended: true,
    signupUrl: '/signup/professional'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations',
    price: 'Custom',
    features: [
      'Unlimited HVAC units',
      'Predictive maintenance',
      'Dedicated support',
      'Custom integration',
      'Advanced security',
      'Real-time monitoring',
      'Multi-site management',
      'Custom reporting',
      'SLA guarantee'
    ],
    recommended: false,
    signupUrl: '/signup/enterprise'
  }
];

export default function OrganizationPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [organization, setOrganization] = useState<any>(null);
  const hasRefreshedRef = useRef(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  // Create a form with default values
  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: '',
      type: 'BUSINESS',
      description: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      phone: '',
      email: '',
      website: '',
    },
  });

  // Fetch organization data once
  useEffect(() => {
    const fetchOrganizationData = async () => {
      try {
        setIsLoading(true);
        
        // If we don't have organization in session, try to fetch it
        if (!session?.user?.currentOrganization) {
          const response = await fetch('/api/user/current-organization');
          if (response.ok) {
            const data = await response.json();
            if (data.currentOrganization && !session?.user?.currentOrganization) {
              await update({
                currentOrganization: data.currentOrganization,
                currentRole: data.currentRole
              });
            }
          }
          return; // Wait for session update to trigger this effect again
        }
        
        // Get full organization details
        const orgId = session.user.currentOrganization.id;
        const response = await fetch(`/api/organizations/${orgId}`);
        
        if (response.ok) {
          const data = await response.json();
          setOrganization(data.organization);
          
          console.log("Organization data from API:", data.organization);
          
          // Set form values from organization data
          form.reset({
            name: data.organization.name || '',
            type: data.organization.type || 'BUSINESS',
            description: data.organization.description || '',
            address: data.organization.address || '',
            city: data.organization.city || '',
            state: data.organization.state || '',
            zip: data.organization.zip || '',
            country: data.organization.country || '',
            phone: data.organization.phone || '',
            email: data.organization.email || '',
            website: data.organization.website || '',
          });
          
          // Set the current plan if it exists
          if (data.organization.plan) {
            console.log("Found plan in API response:", data.organization.plan);
            
            // Convert the plan to lowercase and normalize it
            let planId = data.organization.plan.toLowerCase();
            
            // Handle potential UPPERCASE plan IDs like "STARTER" -> "starter"
            if (planId === "starter" || planId === "professional" || planId === "enterprise") {
              setSelectedPlan(planId);
            } 
            // Handle potential full plan names like "Starter Plan" -> "starter"
            else if (planId.includes("starter")) {
              setSelectedPlan("starter");
            } 
            else if (planId.includes("professional")) {
              setSelectedPlan("professional");
            } 
            else if (planId.includes("enterprise")) {
              setSelectedPlan("enterprise");
            }
            // If we can't match it, just use what we got
            else {
              setSelectedPlan(planId);
            }
          } else {
            console.log("No plan found in API response, defaulting to free");
            setSelectedPlan('free');
            
            // Also check if plan info might be in the description JSON
            try {
              if (data.organization.description) {
                const descData = JSON.parse(data.organization.description);
                if (descData && descData.plan) {
                  console.log("Found plan in description JSON:", descData.plan);
                  // Set the plan using the same logic as above
                  let planId = descData.plan.toLowerCase();
                  if (planId === "starter" || planId === "professional" || planId === "enterprise") {
                    setSelectedPlan(planId);
                  } else if (planId.includes("starter")) {
                    setSelectedPlan("starter");
                  } else if (planId.includes("professional")) {
                    setSelectedPlan("professional");
                  } else if (planId.includes("enterprise")) {
                    setSelectedPlan("enterprise");
                  } else {
                    setSelectedPlan(planId);
                  }
                }
              }
            } catch (e) {
              console.log("Failed to parse description JSON:", e);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching organization:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch once when session is available and we haven't already fetched
    if (session && !hasRefreshedRef.current) {
      hasRefreshedRef.current = true;
      fetchOrganizationData();
    }
  }, [session, update, form]);

  // Handle form submission
  const onSubmit = async (values: OrganizationFormValues) => {
    if (!session?.user?.currentOrganization?.id) {
      toast({
        title: "Error",
        description: "No organization selected. Please select an organization first.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      console.log("Submitting form with values:", values);
      
      const response = await fetch(`/api/organizations/${session.user.currentOrganization.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      console.log("Response status:", response.status);
      
      let responseData;
      try {
        // Handle possible empty responses
        const text = await response.text();
        responseData = text ? JSON.parse(text) : {};
        console.log("Response data:", responseData);
      } catch (e) {
        console.error("Error parsing response:", e);
        responseData = { error: "Could not parse server response" };
      }
      
      if (response.ok) {
        // Display success toast with more visible styling
        toast({
          title: "Success!",
          description: "Your organization information has been saved successfully.",
          variant: "default",
          duration: 5000, // Show for 5 seconds
          className: "bg-green-50 border-green-200 text-green-800",
        });
        
        // Update the organization name in the session if it changed
        if (values.name !== session.user.currentOrganization.name) {
          await update({
            currentOrganization: {
              ...session.user.currentOrganization,
              name: values.name,
            },
          });
        }
        
        // Reset hasRefreshedRef to allow fetching updated data
        hasRefreshedRef.current = false;
        
        // Fetch data again to show updated values
        if (session) {
          hasRefreshedRef.current = true;
          try {
            // Get full organization details
            const orgId = session.user.currentOrganization.id;
            const refreshResponse = await fetch(`/api/organizations/${orgId}`);
            
            if (refreshResponse.ok) {
              const data = await refreshResponse.json();
              setOrganization(data.organization);
              
              // Set form values from organization data
              form.reset({
                name: data.organization.name || '',
                type: data.organization.type || 'BUSINESS',
                description: data.organization.description || '',
                address: data.organization.address || '',
                city: data.organization.city || '',
                state: data.organization.state || '',
                zip: data.organization.zip || '',
                country: data.organization.country || '',
                phone: data.organization.phone || '',
                email: data.organization.email || '',
                website: data.organization.website || '',
              });
            }
          } catch (error) {
            console.error('Error refreshing organization data:', error);
          }
        }
        
        // Exit edit mode after successful save
        setIsEditMode(false);
      } else {
        // Display error toast with details from the response
        toast({
          title: 'Error',
          description: responseData.error || responseData.message || 'Failed to update organization details.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating organization:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update organization details.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle plan upgrade
  const handleUpgradePlan = async (planId: string) => {
    if (!session?.user?.currentOrganization?.id) {
      toast({
        title: "Error",
        description: "No organization selected. Please select an organization first.",
        variant: "destructive",
      });
      return;
    }

    // If user selects the plan they already have, do nothing
    if (selectedPlan === planId) {
      toast({
        title: "Current Plan",
        description: "You are already on this plan.",
        variant: "default",
      });
      return;
    }

    // Get plan based on ID
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;

    // For Enterprise plan, redirect to contact page
    if (planId === 'enterprise') {
      router.push('/contact');
      return;
    }

    // Get the price amount based on billing period
    let priceAmount = '';
    if (typeof plan.price !== 'string') {
      priceAmount = billingPeriod === 'monthly' ? plan.price.monthly : plan.price.annual;
    }

    // Redirect to the signup URL with billing period and price information
    router.push(
      `${plan.signupUrl}?billing=${billingPeriod}&fromOrg=${session.user.currentOrganization.id}&amount=${priceAmount}`
    );
  };

  // Open plan selection
  const openPlanSelection = () => {
    // Either show dialog or directly redirect to the pricing page
    // Option 1: Show dialog
    setIsUpgradeDialogOpen(true);
    
    // Option 2: Redirect to pricing page
    // router.push('/pricing');
  };

  // Go back to dashboard
  const handleBack = () => {
    router.push('/dashboard');
  };
  
  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    if (!isEditMode) {
      // Reset form with current organization data when entering edit mode
      if (organization) {
        form.reset({
          name: organization.name || '',
          type: organization.type || 'BUSINESS',
          description: organization.description || '',
          address: organization.address || '',
          city: organization.city || '',
          state: organization.state || '',
          zip: organization.zip || '',
          country: organization.country || '',
          phone: organization.phone || '',
          email: organization.email || '',
          website: organization.website || '',
        });
      }
    }
  };
  
  // Cancel edit mode
  const cancelEdit = () => {
    setIsEditMode(false);
    // Reset form with current organization data
    if (organization) {
      form.reset({
        name: organization.name || '',
        type: organization.type || 'BUSINESS',
        description: organization.description || '',
        address: organization.address || '',
        city: organization.city || '',
        state: organization.state || '',
        zip: organization.zip || '',
        country: organization.country || '',
        phone: organization.phone || '',
        email: organization.email || '',
        website: organization.website || '',
      });
    }
  };

  // Get organization type display name
  const getOrganizationTypeDisplay = (type: string) => {
    switch (type) {
      case 'VENDOR': return 'Vendor';
      case 'CUSTOMER': return 'Customer';
      case 'BUSINESS': return 'Business';
      default: return type;
    }
  };

  // Get current plan display name
  const getCurrentPlanDisplay = () => {
    console.log("Current selected plan:", selectedPlan);
    
    if (selectedPlan && selectedPlan !== 'free') {
      const plan = plans.find(p => p.id === selectedPlan);
      if (plan) {
        console.log("Matched plan:", plan.name);
        return plan.name;
      } else {
        console.log("No matching plan found for:", selectedPlan);
      }
    }
    
    // Check if we can parse plan information from the description
    if (organization?.description) {
      try {
        const planData = JSON.parse(organization.description);
        if (planData?.plan) {
          const planId = planData.plan.toLowerCase();
          console.log("Found plan in description:", planId);
          const planFromDesc = plans.find(p => p.id === planId || p.name.toLowerCase() === planId);
          if (planFromDesc) {
            console.log("Matched plan from description:", planFromDesc.name);
            return planFromDesc.name;
          }
        }
      } catch (e) {
        console.log("Failed to parse plan data from description");
      }
    }
    
    console.log("Falling back to Free Plan");
    return 'Free Plan';
  };

  // Get price display based on billing period
  const getPrice = (plan: typeof plans[0]) => {
    if (typeof plan.price === 'string') return plan.price;
    return billingPeriod === 'monthly' 
      ? `$${plan.price.monthly}` 
      : `$${plan.price.annual}`;
  };

  // Get the display period
  const getDisplayPeriod = (plan: typeof plans[0]) => {
    if (typeof plan.price === 'string') return '';
    return billingPeriod === 'monthly' ? '/month' : '/year';
  };

  // Get the monthly equivalent for annual plans for display purposes
  const getMonthlyEquivalent = (plan: typeof plans[0]) => {
    if (typeof plan.price === 'string' || billingPeriod === 'monthly') return null;
    const annualPrice = parseInt(plan.price.annual);
    return `$${Math.round(annualPrice / 12)}`;
  };

  // Get savings amount when switching to annual
  const getSavings = (plan: typeof plans[0]) => {
    if (typeof plan.price === 'string') return null;
    const monthlyCost = parseInt(plan.price.monthly) * 12;
    const annualCost = parseInt(plan.price.annual);
    return monthlyCost - annualCost;
  };

  // Get the billing period for the current plan
  const getPlanBillingPeriod = () => {
    // Try to get billing period from the description field
    if (organization?.description) {
      try {
        const planData = JSON.parse(organization.description);
        if (planData?.billingPeriod) {
          return planData.billingPeriod === 'MONTHLY' ? 'monthly' : 'annually';
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
    
    return null;
  };

  // Get the last updated date for the current plan
  const getPlanLastUpdated = () => {
    // Try to get update timestamp from the description field
    if (organization?.description) {
      try {
        const planData = JSON.parse(organization.description);
        if (planData?.updatedAt) {
          return new Date(planData.updatedAt).toLocaleDateString();
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
    
    // Fallback to organization's update date
    return organization?.updatedAt 
      ? new Date(organization.updatedAt).toLocaleDateString() 
      : new Date().toLocaleDateString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-4 p-0 hover:bg-transparent"
          onClick={handleBack}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-3xl font-bold">Organization</h1>
      </div>

      {!session?.user?.currentOrganization ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12">
              <Building className="h-16 w-16 text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Organization Selected</h2>
              <p className="text-gray-500 mb-6 text-center">
                Please select an organization to manage its details.
              </p>
              <Button onClick={() => router.push('/organizations')}>
                Select Organization
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="details">
          <TabsList className="mb-6">
            <TabsTrigger value="details">Organization Details</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    Organization Details
                  </CardTitle>
                  {!isEditMode ? (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleEditMode}
                      title="Edit Organization"
                      className="transition-all duration-300 hover:scale-105 hover:bg-primary hover:text-primary-foreground"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={cancelEdit}
                        title="Cancel Editing"
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        type="submit"
                        form="org-form"
                        size="icon"
                        title="Save Changes"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  )}
                </div>
                <CardDescription>
                  {isEditMode ? "Edit your organization information and settings" : "View your organization information and settings"}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {isLoading && !organization ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : isEditMode ? (
                  // Edit Mode - Show Form
                  <Form {...form}>
                    <form id="org-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Organization Name*</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter organization name" {...field} />
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
                              <FormLabel>Organization Type*</FormLabel>
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
                                  <SelectItem value="VENDOR">Vendor</SelectItem>
                                  <SelectItem value="CUSTOMER">Customer</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Enter organization description" 
                                className="min-h-[100px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Provide a brief description of your organization
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="contact@organization.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="+1 (123) 456-7890" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="website"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Website</FormLabel>
                              <FormControl>
                                <Input placeholder="https://organization.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Main St" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="City" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State</FormLabel>
                              <FormControl>
                                <Input placeholder="State/Province" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="zip"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ZIP Code</FormLabel>
                              <FormControl>
                                <Input placeholder="ZIP/Postal Code" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <FormControl>
                                <Input placeholder="Country" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </form>
                  </Form>
                ) : (
                  // Read-only Mode - Show Organization Details
                  organization && (
                    <div className="space-y-8">
                      {/* Organization Summary */}
                      <div className="bg-muted/50 rounded-lg p-6">
                        <div className="flex justify-between flex-wrap gap-4 mb-4">
                          <div className="flex-1">
                            <h2 className="text-2xl font-bold mb-2">{organization.name}</h2>
                            <div className="flex items-center space-x-3 mb-4">
                              <Badge variant="outline" className="px-3 py-1 text-sm">
                                {getOrganizationTypeDisplay(organization.type)}
                              </Badge>
                              
                              {/* Plan information */}
                              <Badge variant="secondary" className="px-3 py-1 text-sm">
                                {getCurrentPlanDisplay()}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                              {organization.description || 'No description provided.'}
                            </p>
                          </div>
                          
                          {/* Organization ID */}
                          <div className="shrink-0">
                            <div className="text-xs text-muted-foreground">
                              <span className="font-semibold">ID:</span> {organization.id}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              <span className="font-semibold">Created:</span> {new Date(organization.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Contact Information */}
                      <div>
                        <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                          <div>
                            <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                            <dd className="mt-1">{organization.email || '-'}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
                            <dd className="mt-1">{organization.phone || '-'}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-muted-foreground">Website</dt>
                            <dd className="mt-1">
                              {organization.website ? (
                                <a 
                                  href={organization.website.startsWith('http') ? organization.website : `https://${organization.website}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  {organization.website}
                                </a>
                              ) : '-'}
                            </dd>
                          </div>
                        </dl>
                      </div>
                      
                      {/* Address Information */}
                      <div>
                        <h3 className="text-lg font-medium mb-4">Address</h3>
                        <dl>
                          <dt className="sr-only">Full Address</dt>
                          <dd>
                            {organization.address ? (
                              <address className="not-italic">
                                {organization.address}<br />
                                {organization.city ? `${organization.city}, ` : ''}
                                {organization.state || ''} {organization.zip || ''}<br />
                                {organization.country || ''}
                              </address>
                            ) : (
                              <span className="text-muted-foreground">No address provided</span>
                            )}
                          </dd>
                        </dl>
                      </div>
                      
                      {/* Subscription & Billing Section */}
                      <div>
                        <h3 className="text-lg font-medium mb-4">Subscription & Billing</h3>
                        <div className="bg-muted/30 rounded-lg p-6">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">Current Plan</h4>
                              <div className="text-sm text-muted-foreground mt-1 space-y-1">
                                <p className="font-medium text-primary">
                                  {getCurrentPlanDisplay()}
                                </p>
                                
                                {/* Show billing period if available */}
                                {getPlanBillingPeriod() && (
                                  <p className="text-xs">
                                    Billed {getPlanBillingPeriod()} • 
                                    Updated {getPlanLastUpdated()}
                                  </p>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={openPlanSelection}
                              disabled={!['ADMINISTRATOR', 'MANAGER'].includes(session?.user?.currentRole || '')}
                              className="transition-all hover:bg-primary hover:text-primary-foreground"
                            >
                              Upgrade Plan
                            </Button>
                          </div>
                          
                          {['ADMINISTRATOR', 'MANAGER'].includes(session?.user?.currentRole || '') && (
                            <p className="text-sm text-muted-foreground mt-4 border-t border-muted-foreground/20 pt-4">
                              As an {session?.user?.currentRole === 'ADMINISTRATOR' ? 'administrator' : 'manager'}, 
                              you can upgrade the organization's plan to access more features and capabilities.
                              Click the "Upgrade Plan" button to explore available options.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                )}
              </CardContent>
              
              {isEditMode && (
                <CardFooter className="flex justify-end">
                  <Button 
                    variant="outline"
                    onClick={cancelEdit}
                    className="mr-2"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    form="org-form"
                    disabled={isLoading}
                    className="flex items-center transition-all duration-300 hover:scale-105"
                  >
                    {isLoading ? (
                      <>
                        <span className="mr-2">Saving...</span>
                        <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="members">
            <Card>
              <CardHeader>
                <CardTitle>Organization Members</CardTitle>
                <CardDescription>
                  Manage members and their roles in your organization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-12 text-gray-500">
                  Member management functionality will be implemented in a future update.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Organization Settings</CardTitle>
                <CardDescription>
                  Manage organization settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-12 text-gray-500">
                  Organization settings will be implemented in a future update.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
      
      {/* Plan Upgrade Dialog */}
      <Dialog open={isUpgradeDialogOpen} onOpenChange={setIsUpgradeDialogOpen}>
        <DialogContent className="sm:max-w-3xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Upgrade Your Plan</DialogTitle>
            <DialogDescription>
              Choose the plan that best fits your organization's needs.
            </DialogDescription>
          </DialogHeader>
          
          {/* Billing Toggle */}
          <div className="mt-4 flex justify-center">
            <div className="bg-white rounded-full p-1 shadow-sm border">
              <div className="flex items-center space-x-4 px-4">
                <button
                  onClick={() => setBillingPeriod('monthly')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    billingPeriod === 'monthly'
                      ? 'bg-[#0F62FE] text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingPeriod('annual')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    billingPeriod === 'annual'
                      ? 'bg-[#0F62FE] text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Annual
                  <span className="ml-2 inline-block px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                    Save 16%
                  </span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
            {plans.map((plan) => (
              <div 
                key={plan.id} 
                className={`rounded-lg border p-6 relative ${
                  selectedPlan === plan.id 
                    ? 'border-primary bg-primary/5' 
                    : plan.recommended 
                      ? 'border-primary/50' 
                      : 'border-border'
                }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-3 left-0 right-0 flex justify-center">
                    <span className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="mb-4">
                  <h3 className="font-bold text-lg">{plan.name}</h3>
                  <div className="flex items-baseline mt-2">
                    <span className="text-3xl font-bold">{getPrice(plan)}</span>
                    <span className="text-sm text-muted-foreground ml-1">{getDisplayPeriod(plan)}</span>
                  </div>
                  
                  {/* Show monthly equivalent for annual plans */}
                  {getMonthlyEquivalent(plan) && (
                    <div className="text-sm text-muted-foreground mt-1">
                      ({getMonthlyEquivalent(plan)}/month equivalent)
                    </div>
                  )}
                  
                  {/* Show savings for annual plans */}
                  {billingPeriod === 'annual' && getSavings(plan) !== null && (
                    <div className="text-sm text-green-600 mt-1">
                      Save ${getSavings(plan)?.toLocaleString()} per year
                    </div>
                  )}
                  
                  <p className="text-sm text-muted-foreground mt-2">
                    {plan.description}
                  </p>
                </div>
                
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  variant={selectedPlan === plan.id ? "secondary" : "default"}
                  className={`w-full ${plan.recommended ? 'bg-[#0F62FE] hover:bg-[#0F62FE]/90' : ''}`}
                  disabled={selectedPlan === plan.id}
                  onClick={() => handleUpgradePlan(plan.id)}
                >
                  {selectedPlan === plan.id ? (
                    'Current Plan'
                  ) : plan.id === 'enterprise' ? (
                    'Contact Sales'
                  ) : (
                    'Get Started'
                  )}
                </Button>
              </div>
            ))}
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <p className="text-sm text-muted-foreground sm:mr-auto">
              Have questions about our plans? Contact our sales team at sales@company.com
            </p>
            <Button 
              variant="outline" 
              onClick={() => setIsUpgradeDialogOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
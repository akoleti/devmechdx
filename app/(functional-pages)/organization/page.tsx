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
import { Building, Save, ArrowLeft, Edit, Check, X, CheckCircle, UserPlus, Mail, Info, AlertCircle, XCircle, Loader, Send } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel
} from "@/components/ui/alert-dialog";

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
    id: 'free',
    name: 'Free',
    description: 'Basic features for small operations',
    price: 'Free',
    period: '',
    features: [
      'Up to 2 HVAC units',
      'Basic monitoring',
      'Standard support',
      'Mobile app access',
      'Monthly reports'
    ],
    recommended: false,
    signupUrl: '/signup/free'
  },
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

// Define a type for organization users
type OrganizationUser = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  joinedAt: string;
};

// Define invite form schema
const inviteSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  role: z.string({ required_error: "Please select a role." }),
  message: z.string().optional(),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

// After the OrganizationUser type, add:
type OrganizationInvitation = {
  id: string;
  email: string;
  role: string;
  status: string;
  expiresAt: string;
  createdAt: string;
  invitedBy: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
};

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
  const [planTab, setPlanTab] = useState<'free' | 'paid'>('free');
  const [users, setUsers] = useState<OrganizationUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [invitations, setInvitations] = useState<OrganizationInvitation[]>([]);
  const [loadingInvitations, setLoadingInvitations] = useState(false);
  const [resendingInvitation, setResendingInvitation] = useState<string | null>(null);
  const [cancelingInvitation, setCancelingInvitation] = useState<string | null>(null);

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

  // Initialize invite form
  const inviteForm = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: '',
      role: 'USER',
      message: '',
    },
  });

  // Function to fetch organization data
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
          if (planId === "free" || planId === "starter" || planId === "professional" || planId === "enterprise") {
            setSelectedPlan(planId);
          } 
          // Handle potential full plan names like "Starter Plan" -> "starter"
          else if (planId.includes("free")) {
            setSelectedPlan("free");
          }
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
                if (planId === "free" || planId === "starter" || planId === "professional" || planId === "enterprise") {
                  setSelectedPlan(planId);
                } else if (planId.includes("free")) {
                  setSelectedPlan("free");
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

  useEffect(() => {
    // Only fetch once when session is available and we haven't already fetched
    if (session && !hasRefreshedRef.current) {
      hasRefreshedRef.current = true;
      fetchOrganizationData();
    }
  }, [session, update]);

  // Set the correct tab based on selected plan
  useEffect(() => {
    if (selectedPlan) {
      // If selected plan is free, switch to free tab
      if (selectedPlan === 'free') {
        setPlanTab('free');
      } else {
        // If it's a paid plan, switch to paid tab
        setPlanTab('paid');
      }
    }
  }, [selectedPlan]);

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

    // For free plan, update directly via API
    if (planId === 'free') {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/organizations/${session.user.currentOrganization.id}/plan`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            plan: 'free',
            billingPeriod: 'MONTHLY'
          }),
        });
        
        if (response.ok) {
          setIsUpgradeDialogOpen(false);
          setSelectedPlan('free');
          toast({
            title: "Plan Updated",
            description: "Your organization has been successfully downgraded to the Free plan.",
            variant: "default",
          });
          
          // Refresh organization data
          hasRefreshedRef.current = false;
        } else {
          toast({
            title: "Error",
            description: "Failed to update your plan. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error updating plan:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
      return;
    }

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
    // Set the default tab based on whether the user has a free plan or not
    if (selectedPlan === 'free') {
      setPlanTab('paid');  // If they're on free plan, default to showing paid plans
    } else {
      setPlanTab('free');  // If they're on a paid plan, default to showing free plans
    }
    
    // Show the dialog
    setIsUpgradeDialogOpen(true);
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
    
    if (selectedPlan) {
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

  // Get filtered plans based on tab
  const getFilteredPlans = () => {
    if (planTab === 'free') {
      return plans.filter(plan => plan.id === 'free');
    } else {
      return plans.filter(plan => plan.id !== 'free');
    }
  };

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
      }
    } catch (error) {
      console.error('Error fetching organization users:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Fetch users when tab changes to "members"
  const handleTabChange = (value: string) => {
    if (value === 'members') {
      fetchOrganizationUsers();
    }
    if (value === 'billing') {
      // Ensure we have the latest organization data for billing information
      if (session?.user?.currentOrganization?.id && !hasRefreshedRef.current) {
        fetchOrganizationData();
      }
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
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
      setInviteError('An unexpected error occurred. Please try again.');
    } finally {
      setIsInviting(false);
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

  // Check if user can invite new members
  const canInviteMembers = ['ADMINISTRATOR', 'MANAGER'].includes(session?.user?.currentRole || '');

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

  // Add resendInvitation function
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

  // Add cancelInvitation function
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

  // Fix the useEffect to not depend on selectedTab
  useEffect(() => {
    if (session?.user?.currentOrganization?.id) {
      fetchOrganizationInvitations();
    }
  }, [session?.user?.currentOrganization?.id]);

  // Add a function to handle role changes for members
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

  // Add function to handle invitation role changes
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
          title: "Invitation Role Updated",
          description: `The invitation for ${data.email} has been updated to ${getRoleDisplay(role)}.`,
          variant: "default",
          className: "bg-green-50 border-green-200 text-green-800",
        });
        
        // Refresh invitations list
        await fetchOrganizationInvitations();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update invitation role",
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

  // Add this new function for handling organization deletion
  const handleDeleteOrganization = async () => {
    if (!session?.user?.currentOrganization?.id) {
      toast({
        title: "Error",
        description: "No organization selected",
        variant: "destructive",
      });
      return;
    }

    try {
      // Call the API to delete the organization
      const response = await fetch(`/api/organizations/${session.user.currentOrganization.id}/delete`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Organization Deleted",
          description: "The organization has been permanently deleted",
          variant: "default",
          className: "bg-green-50 border-green-200 text-green-800",
        });

        // Refresh session to update user's organization context
        await update();

        // Redirect to organizations page
        router.push('/organizations');
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to delete organization",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting organization:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
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
        <Tabs defaultValue="details" onValueChange={handleTabChange}>
          <TabsList className="mb-6">
            <TabsTrigger value="details">Organization Details</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
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
                      {(organization.address || organization.city || organization.state || organization.zip || organization.country) && (
                        <div>
                          <h3 className="text-lg font-medium mb-4">Address</h3>
                          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                            {organization.address && (
                              <div className="col-span-2">
                                <dt className="text-muted-foreground">Street Address</dt>
                                <dd className="mt-1 font-medium">{organization.address}</dd>
                              </div>
                            )}
                            
                            {organization.city && (
                              <div>
                                <dt className="text-muted-foreground">City</dt>
                                <dd className="mt-1 font-medium">{organization.city}</dd>
                              </div>
                            )}
                            
                            {organization.state && (
                              <div>
                                <dt className="text-muted-foreground">State / Province</dt>
                                <dd className="mt-1 font-medium">{organization.state}</dd>
                              </div>
                            )}
                            
                            {organization.zip && (
                              <div>
                                <dt className="text-muted-foreground">ZIP / Postal Code</dt>
                                <dd className="mt-1 font-medium">{organization.zip}</dd>
                              </div>
                            )}
                            
                            {organization.country && (
                              <div>
                                <dt className="text-muted-foreground">Country</dt>
                                <dd className="mt-1 font-medium">{organization.country}</dd>
                              </div>
                            )}
                          </dl>
                        </div>
                      )}
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
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Organization Members</CardTitle>
                    <CardDescription>
                      Manage members and their roles in your organization
                    </CardDescription>
                  </div>
                  {canInviteMembers && (
                    <Button
                      onClick={() => setIsInviteDialogOpen(true)}
                      className="flex items-center"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Invite Member
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingUsers ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : users.length === 0 ? (
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
                  <div className="overflow-x-auto">
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
                        {users.map((user) => (
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
                                    // Only the user themselves can change their own role
                                    (user.role === 'ADMINISTRATOR' && user.id !== session?.user?.id)
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
                                <Badge variant={getRoleBadgeVariant(user.role)}>{getRoleDisplay(user.role)}</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {user.isActive ? (
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Active</Badge>
                              ) : (
                                <Badge variant="outline" className="text-gray-500">Inactive</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {new Date(user.joinedAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => resendInvitation(user.id)}
                                  disabled={!!resendingInvitation}
                                >
                                  {resendingInvitation === user.id ? (
                                    <Loader className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Send className="h-4 w-4" />
                                  )}
                                  <span className="sr-only">Resend</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => cancelInvitation(user.id)}
                                  disabled={!!cancelingInvitation}
                                >
                                  {cancelingInvitation === user.id ? (
                                    <Loader className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <XCircle className="h-4 w-4" />
                                  )}
                                  <span className="sr-only">Cancel</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {/* Pending Invitations Section */}
                {canInviteMembers && invitations.length > 0 && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium">Pending Invitations</h3>
                      {canInviteMembers && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Info className="h-4 w-4 mr-1" />
                          <span>You can change roles before or after invitations are accepted</span>
                        </div>
                      )}
                    </div>
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
                          {invitations.map((invitation) => (
                            <TableRow key={invitation.id}>
                              <TableCell className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                {invitation.email}
                              </TableCell>
                              <TableCell>
                                {canInviteMembers ? (
                                  <Select 
                                    defaultValue={invitation.role} 
                                    onValueChange={(value) => handleInvitationRoleChange(invitation.id, value)}
                                    disabled={
                                      // Managers can't set admin role
                                      session?.user?.currentRole === 'MANAGER' && invitation.role === 'ADMINISTRATOR'
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
                                  <Badge variant="outline" className="capitalize">
                                    {invitation.role.toLowerCase()}
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                {invitation.invitedBy.name || invitation.invitedBy.email}
                              </TableCell>
                              <TableCell>
                                {new Date(invitation.expiresAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => resendInvitation(invitation.id)}
                                    disabled={!!resendingInvitation}
                                  >
                                    {resendingInvitation === invitation.id ? (
                                      <Loader className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Send className="h-4 w-4" />
                                    )}
                                    <span className="sr-only">Resend</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => cancelInvitation(invitation.id)}
                                    disabled={!!cancelingInvitation}
                                  >
                                    {cancelingInvitation === invitation.id ? (
                                      <Loader className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <XCircle className="h-4 w-4" />
                                    )}
                                    <span className="sr-only">Cancel</span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

                {/* Loading state for invitations */}
                {loadingInvitations && (
                  <div className="flex justify-center items-center py-4">
                    <Loader className="h-6 w-6 text-primary animate-spin" />
                    <span className="ml-2">Loading invitations...</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="h-5 w-5 mr-2">💳</div>
                  Subscription & Billing
                </CardTitle>
                <CardDescription>
                  Manage your organization's subscription plan and billing settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Current Plan Section */}
                  <div className="bg-muted/30 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-lg font-semibold">Current Plan</h3>
                        <div className="mt-1 space-y-1">
                          <p className="text-2xl font-bold text-primary">
                            {getCurrentPlanDisplay()}
                          </p>
                          
                          {/* Show billing period if available */}
                          {getPlanBillingPeriod() && (
                            <p className="text-sm text-muted-foreground">
                              Billed {getPlanBillingPeriod()} • 
                              Last updated {getPlanLastUpdated()}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        onClick={openPlanSelection}
                        disabled={!['ADMINISTRATOR', 'MANAGER'].includes(session?.user?.currentRole || '')}
                        className="transition-all hover:bg-primary hover:text-primary-foreground"
                      >
                        {selectedPlan === 'free' ? 'Upgrade Plan' : 'Change Plan'}
                      </Button>
                    </div>
                    
                    {/* Payment Method Section */}
                    {selectedPlan !== 'free' && (
                      <div className="mb-6 border-t border-muted-foreground/20 pt-6">
                        <h4 className="text-sm font-medium mb-3">Payment Method</h4>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-muted rounded-md p-2 mr-3">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                                <rect width="20" height="14" x="2" y="5" rx="2" />
                                <line x1="2" x2="22" y1="10" y2="10" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium">Visa ending in 4242</p>
                              <p className="text-xs text-muted-foreground">Expires 12/2025</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-sm">
                            Update
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {/* Plan Features */}
                    <div className={`${selectedPlan !== 'free' ? "border-t border-muted-foreground/20" : ""} pt-6`}>
                      <h4 className="text-sm font-medium mb-3">Features Included in Your Plan</h4>
                      <ul className="space-y-2">
                        {(() => {
                          const currentPlan = plans.find(p => p.id === selectedPlan) || plans[0]; // Default to free plan
                          return currentPlan.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ));
                        })()}
                      </ul>
                    </div>
                  </div>
                  
                  {/* Plan Options Section */}
                  <div className="border-t border-muted pt-8">
                    <h3 className="text-lg font-semibold mb-4">Available Plans</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {plans.slice(0, 3).map((plan) => ( // Show only top 3 plans here
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
                              <span className="text-2xl font-bold">{getPrice(plan)}</span>
                              <span className="text-sm text-muted-foreground ml-1">{getDisplayPeriod(plan)}</span>
                            </div>
                          </div>
                          
                          <Button
                            variant={selectedPlan === plan.id 
                              ? "secondary" 
                              : plan.id === 'free' 
                                ? "outline" 
                                : "default"}
                            className={`w-full mt-4 ${plan.recommended ? 'bg-[#0F62FE] hover:bg-[#0F62FE]/90' : ''}`}
                            disabled={selectedPlan === plan.id && plan.id !== 'free'}
                            onClick={() => handleUpgradePlan(plan.id)}
                          >
                            {selectedPlan === plan.id ? (
                              'Current Plan'
                            ) : plan.id === 'enterprise' ? (
                              'Contact Sales'
                            ) : plan.id === 'free' ? (
                              'Downgrade to Free'
                            ) : (
                              'Upgrade'
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 text-center">
                      <Button
                        variant="ghost"
                        onClick={openPlanSelection}
                        className="text-primary"
                      >
                        View All Plan Options
                      </Button>
                    </div>
                  </div>
                  
                  {/* Plan Management Notice */}
                  {['ADMINISTRATOR', 'MANAGER'].includes(session?.user?.currentRole || '') ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
                      <div className="flex">
                        <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-3 shrink-0" />
                        <div>
                          <h4 className="font-medium text-blue-800">Plan Management Access</h4>
                          <p className="text-sm text-blue-700 mt-1">
                            As an {session?.user?.currentRole === 'ADMINISTRATOR' ? 'administrator' : 'manager'}, 
                            you can manage the organization's subscription plan. Changes to the plan will affect all members
                            of your organization.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-8">
                      <div className="flex">
                        <Info className="h-5 w-5 text-gray-500 mt-0.5 mr-3 shrink-0" />
                        <div>
                          <h4 className="font-medium text-gray-800">Plan Management Restricted</h4>
                          <p className="text-sm text-gray-700 mt-1">
                            Only administrators and managers can change the organization's subscription plan.
                            Please contact your organization administrator for any plan changes.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
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
              <CardContent className="space-y-8">
                {/* Danger Zone */}
                <div className="border border-red-200 rounded-md p-6">
                  <h3 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Actions in this section can lead to irreversible data loss. Please proceed with caution.
                  </p>
                  
                  {session?.user?.currentRole === 'ADMINISTRATOR' ? (
                    <div>
                      <div className="flex items-center justify-between p-4 border border-red-100 rounded-md bg-red-50">
                        <div>
                          <h4 className="font-medium text-red-800">Delete Organization</h4>
                          <p className="text-sm text-red-600 mt-1">
                            This action permanently deletes this organization and all its data. This cannot be undone.
                          </p>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-red-600">
                                Delete organization permanently?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the
                                organization <strong>{organization?.name}</strong> and all associated data including:
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                  <li>All organization members and their access</li>
                                  <li>All pending invitations</li>
                                  <li>All organization settings and preferences</li>
                                </ul>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <Button
                                variant="destructive"
                                onClick={() => handleDeleteOrganization()}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete organization
                              </Button>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
                      <h4 className="font-medium text-gray-800">Delete Organization</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Only administrators can delete organizations.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
      
      {/* Plan Upgrade Dialog */}
      <Dialog open={isUpgradeDialogOpen} onOpenChange={setIsUpgradeDialogOpen}>
        <DialogContent className="sm:max-w-3xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Select Your Plan</DialogTitle>
            <DialogDescription>
              Choose the plan that best fits your organization's needs.
            </DialogDescription>
          </DialogHeader>
          
          {/* Plan Type Tabs */}
          <div className="mt-4">
            <Tabs defaultValue="free" onValueChange={(val) => setPlanTab(val as 'free' | 'paid')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="free">Free Plans</TabsTrigger>
                <TabsTrigger value="paid">Paid Plans</TabsTrigger>
              </TabsList>
              
              <TabsContent value="free" className="pt-4">
                {getFilteredPlans().length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No free plans available at this time.
                  </div>
                ) : null}
              </TabsContent>
              
              <TabsContent value="paid" className="pt-4">
                {/* Billing Toggle - Only show for paid plans */}
                <div className="flex justify-center mb-6">
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
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
            {getFilteredPlans().map((plan) => (
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
                  variant={selectedPlan === plan.id 
                    ? "secondary" 
                    : plan.id === 'free' 
                      ? "outline" 
                      : "default"}
                  className={`w-full ${plan.recommended ? 'bg-[#0F62FE] hover:bg-[#0F62FE]/90' : ''}`}
                  disabled={selectedPlan === plan.id && plan.id !== 'free'}
                  onClick={() => handleUpgradePlan(plan.id)}
                >
                  {selectedPlan === plan.id ? (
                    'Current Plan'
                  ) : plan.id === 'enterprise' ? (
                    'Contact Sales'
                  ) : plan.id === 'free' ? (
                    'Downgrade to Free'
                  ) : (
                    'Upgrade'
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
      
      {/* Invite Member Dialog */}
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
                    <FormLabel>Personal Message (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Optional message to include in the invitation email"
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {inviteError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{inviteError}</AlertDescription>
                </Alert>
              )}
              
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsInviteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isInviting}>
                  {isInviting ? (
                    <>
                      <span className="mr-2">Sending...</span>
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                    </>
                  ) : (
                    'Send Invitation'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
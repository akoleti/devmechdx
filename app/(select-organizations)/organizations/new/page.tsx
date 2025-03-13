'use client';
import { useState, useEffect } from 'react';
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
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, ArrowLeft, LayoutGrid, Check, Info, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Organization name must be at least 2 characters.",
  }),
  type: z.enum(['CUSTOMER', 'VENDOR'], {
    required_error: "Please select an organization type.",
  }),
  planId: z.string({
    required_error: "Please select a plan.",
  }),
});

// Plans data
const PLANS_DATA: Plan[] = [
  {
    id: "2ebc2fa1-1c3c-40db-857c-bb70239cb003",
    name: "Starter 14-day Free Trial",
    description: "For small organizations getting started",
    price: 0,
    trialDays: 14,
    features: [
      "Up to 5 HVAC units",
      "Basic monitoring",
      "Email support",
      "Standard reporting"
    ],
    requiresCard: false,
    isPopular: false,
    isCustom: false
  },
  {
    id: "2a0f5b31-cc79-4b64-a2fd-ed45e79c60ce",
    name: "Professional 30-day Free Trial",
    description: "For medium-sized organizations",
    price:  0,
    trialDays: 30,
      features: [
      "Up to 50 HVAC units",
      "Advanced monitoring",
      "Predictive maintenance",
      "24/7 phone support",
      "Custom reporting",
      "Advanced analytics",
      "Multi-site management"
    ],
    requiresCard: false,
    isPopular: true,
    isCustom: false
  },
  {
    id: "3a1e1a16-a043-4043-bac0-2c117ac00124",
    name: "Starter",
    description: "For growing organizations",
    price: 299,
    features: [
      "Up to 20 HVAC units",
      "Advanced monitoring",
      "Priority email support",
      "Custom reporting",
      "Basic analytics"
    ],
    requiresCard: true,
    isPopular: false,
    isCustom: false
  },
  {
    id: "637a703b-ba7e-4852-803a-bc71a809cd4f",
    name: "Professional",
    description: "For medium-sized organizations",
    price: 599,
    features: [
      "Up to 50 HVAC units",
      "Advanced monitoring",
      "Predictive maintenance",
      "24/7 phone support",
      "Custom reporting",
      "Advanced analytics",
      "Multi-site management"
    ],
    savings: 1000,
    requiresCard: true,
    isPopular: true,
    isCustom: false
  },
  {
    id: "0ab5c742-59ff-4aaa-bc48-e84bc80c21f7",
    name: "Enterprise",
    description: "For large organizations",
    price: 599,
    features: [
      "Unlimited HVAC units",
      "Predictive maintenance",
      "Dedicated support",
      "Custom integration",
      "Advanced security",
      "Real-time monitoring",
      "Multi-site management",
      "Custom reporting",
      "SLA guarantee"
    ],
    requiresCard: true,
    isPopular: false,
    isCustom: true
  }
];

type FormValues = z.infer<typeof formSchema>;

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  trialDays?: number;
  savings?: number;
  requiresCard: boolean;
  isPopular: boolean;
  isCustom: boolean;
}

interface PlanCardProps {
  plan: Plan;
  selected: boolean;
  onSelect: () => void;
}

const PlanCard = ({ plan, selected, onSelect }: PlanCardProps) => {
  return (
    <div 
      className={`border rounded-lg p-4 cursor-pointer transition-all ${
        selected ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-200 hover:border-blue-400'
      }`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{plan.name}</h3>
          <p className="text-sm text-gray-500">{plan.description}</p>
        </div>
        <div className="text-right">
          {plan.isCustom ? (
            <>
              <div className="text-2xl font-bold">Custom</div>
              <div className="text-sm text-gray-500">Contact sales</div>
            </>
          ) : plan.price === 0 ? (
            <div className="text-2xl font-bold">Free</div>
          ) : (
            <>
              <div className="text-2xl font-bold">${plan.price}</div>
              <div className="text-sm text-gray-500">/month</div>
              {plan.trialDays && (
                <div className="text-sm text-blue-600 font-medium mt-1">
                  {plan.trialDays}-day free trial
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <ul className="space-y-2">
        {plan.features?.slice(0, 3).map((feature, index) => (
          <li key={index} className="flex items-center text-sm text-gray-600">
            <Check className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
        {plan.features && plan.features.length > 3 && (
          <li className="text-sm text-gray-500">
            +{plan.features.length - 3} more features
          </li>
        )}
      </ul>
    </div>
  );
};

export default function NewOrganizationPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  
  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: 'CUSTOMER',
      planId: 'free-plan',
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
    console.log(data);
    setIsSubmitting(true);
    setError(null);

    try {
      // Create date objects for plan duration
      const planStartDate = new Date();
      const planEndDate = new Date(planStartDate.getTime() + 15 * 24 * 60 * 60 * 1000);

      // Convert dates to number (timestamp) for JSON serialization
      const requestData = {
        name: data.name,
        type: data.type,
        planId: data.planId
      };

      console.log(requestData);
      // Call API to create organization
      const response = await fetch('/api/organizations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.details) {
          // Handle validation errors
          const errorMessage = Object.entries(errorData.details)
            .map(([key, value]: [string, any]) => {
              if (value._errors && value._errors.length > 0) {
                return `${key}: ${value._errors.join(', ')}`;
              }
              return null;
            })
            .filter(Boolean)
            .join('; ');
          throw new Error(errorMessage || errorData.error || 'Failed to create organization');
        }
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

  // Group plans into free and paid
  const freePlans = PLANS_DATA.filter(plan => plan.price === 0 || plan.trialDays);
  const paidPlans = PLANS_DATA.filter(plan => !plan.isCustom && plan.price > 0 && !plan.trialDays);
  const enterprisePlans = PLANS_DATA.filter(plan => plan.isCustom);

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <div className="bg-white shadow-sm py-8 mb-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Create New Organization</h1>
              <p className="text-gray-500 mt-1">Set up a new organization for your team</p>
            </div>
            <Button 
              variant="outline"
              onClick={() => router.back()} 
              className="flex items-center mt-4 md:mt-0"
              type="button"
            >
              Back to Organizations
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
              <CardDescription>
                Provide the basic information about your new organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Organization name field */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter organization name" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is the name that will be displayed for your organization.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Organization type field */}
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
                            <SelectItem value="PARTNER">Partner</SelectItem>
                            <SelectItem value="SUPPLIER">Supplier</SelectItem>
                            <SelectItem value="INTERNAL">Internal</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          This helps categorize your organization.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Plan selection */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Select a Plan</h3>
                    
                    {/* Free plans */}
                    <div className="mb-8">
                      <h4 className="text-md font-medium mb-3">Free Plans</h4>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {freePlans.map((plan) => (
                          <PlanCard
                            key={plan.id}
                            plan={plan}
                            selected={form.watch('planId') === plan.id}
                            onSelect={() => {
                              form.setValue('planId', plan.id);
                              setSelectedPlan(plan);
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* Paid plans */}
                    <div className="mb-8">
                      <h4 className="text-md font-medium mb-3">Paid Plans</h4>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {paidPlans.map((plan) => (
                          <PlanCard
                            key={plan.id}
                            plan={plan}
                            selected={form.watch('planId') === plan.id}
                            onSelect={() => {
                              form.setValue('planId', plan.id);
                              setSelectedPlan(plan);
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* Enterprise plans */}
                    <div>
                      <h4 className="text-md font-medium mb-3">Enterprise</h4>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {enterprisePlans.map((plan) => (
                          <PlanCard
                            key={plan.id}
                            plan={plan}
                            selected={form.watch('planId') === plan.id}
                            onSelect={() => {
                              form.setValue('planId', plan.id);
                              setSelectedPlan(plan);
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Error display */}
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  {/* Submit button */}
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full sm:w-auto"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="opacity-0">Creating...</span>
                          <span className="absolute inset-0 flex items-center justify-center">
                            <div className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                          </span>
                        </>
                      ) : (
                        'Create Organization'
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 
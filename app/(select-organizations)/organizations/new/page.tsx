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
  FormMessage 
} from '@/components/ui/form';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, ArrowLeft, LayoutGrid, Check, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
    id: "free-plan",
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
    id: "professional-free-trial",
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
    id: "starter-trial",
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
    id: "professional",
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
    id: "enterprise",
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
      planId: '',
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
        body: JSON.stringify({
          ...data,
          planStartDate: new Date(),
          planEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        }),
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

  // Group plans into free and paid
  const freePlans = PLANS_DATA.filter(plan => plan.price === 0 || plan.trialDays);
  const paidPlans = PLANS_DATA.filter(plan => !plan.isCustom && plan.price > 0 && !plan.trialDays);
  const enterprisePlans = PLANS_DATA.filter(plan => plan.isCustom);

  return (
    <>
      {/* Main content */}
      <main className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
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

                <FormField
                  control={form.control}
                  name="planId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Plan</FormLabel>
                      <Tabs defaultValue="free" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                          <TabsTrigger value="free">Free Plans</TabsTrigger>
                          <TabsTrigger value="paid">Paid Plans</TabsTrigger>
                        </TabsList>

                        <TabsContent value="free" className="space-y-4">
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid gap-4"
                          >
                            {freePlans.map((plan) => (
                              <div key={plan.id}>
                                <RadioGroupItem
                                  value={plan.id}
                                  id={plan.id}
                                  className="peer sr-only"
                                />
                                <label
                                  htmlFor={plan.id}
                                  className="block cursor-pointer"
                                >
                                  <Card className={`p-4 transition-all hover:border-primary peer-checked:border-primary peer-checked:ring-2 peer-checked:ring-primary`}>
                                    <div className="flex justify-between items-start mb-4">
                                      <div>
                                        <h3 className="text-lg font-semibold">{plan.name}</h3>
                                        <p className="text-sm text-gray-500">{plan.description}</p>
                                      </div>
                                      <div className="text-right">
                                        {plan.trialDays ? (
                                          <>
                                            <div className="text-2xl font-bold">${plan.price}</div>
                                            <div className="text-sm text-gray-500">/month</div>
                                            <div className="text-sm text-primary font-medium mt-1">
                                              {plan.trialDays}-day free trial
                                            </div>
                                          </>
                                        ) : (
                                          <>
                                            <div className="text-2xl font-bold">Free</div>
                                            <div className="text-sm text-gray-500">forever</div>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                    <ul className="space-y-2">
                                      {plan.features?.map((feature, index) => (
                                        <li key={index} className="flex items-center text-sm text-gray-600">
                                          <Check className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                                          <span className="flex items-center">
                                            {feature}
                                            {(feature.includes('Predictive maintenance') ||
                                              feature.includes('Custom integration') ||
                                              feature.includes('Multi-site management')) && (
                                              <TooltipProvider>
                                                <Tooltip>
                                                  <TooltipTrigger>
                                                    <Info className="h-4 w-4 ml-1 text-gray-400" />
                                                  </TooltipTrigger>
                                                  <TooltipContent>
                                                    <p>
                                                      {feature.includes('Predictive maintenance') && 
                                                        'AI-powered maintenance recommendations based on equipment performance data'}
                                                      {feature.includes('Custom integration') && 
                                                        'Integration with your existing systems and workflows'}
                                                      {feature.includes('Multi-site management') && 
                                                        'Centralized management of multiple locations and facilities'}
                                                    </p>
                                                  </TooltipContent>
                                                </Tooltip>
                                              </TooltipProvider>
                                            )}
                                          </span>
                                        </li>
                                      ))}
                                    </ul>
                                    <Button
                                      type="button"
                                      variant={field.value === plan.id ? "default" : "outline"}
                                      className="w-full mt-4"
                                    >
                                      {plan.trialDays ? `Start ${plan.trialDays}-day free trial` : 'Get Started'}
                                    </Button>
                                  </Card>
                                </label>
                              </div>
                            ))}
                          </RadioGroup>
                        </TabsContent>

                        <TabsContent value="paid" className="space-y-4">
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid gap-4"
                          >
                            {[...paidPlans, ...enterprisePlans].map((plan) => (
                              <div key={plan.id}>
                                <RadioGroupItem
                                  value={plan.id}
                                  id={plan.id}
                                  className="peer sr-only"
                                />
                                <label
                                  htmlFor={plan.id}
                                  className="block cursor-pointer"
                                >
                                  <Card className={`p-4 transition-all hover:border-primary peer-checked:border-primary peer-checked:ring-2 peer-checked:ring-primary`}>
                                    <div className="flex justify-between items-start mb-4">
                                      <div>
                                        <h3 className="text-lg font-semibold">{plan.name}</h3>
                                        <p className="text-sm text-gray-500">{plan.description}</p>
                                      </div>
                                      <div className="text-right">
                                        {plan.isCustom ? (
                                          <>
                                            <div className="text-2xl font-bold">Custom</div>
                                            <div className="text-sm text-gray-500">Contact sales for pricing</div>
                                          </>
                                        ) : (
                                          <>
                                            <div className="text-2xl font-bold">${plan.price}</div>
                                            <div className="text-sm text-gray-500">/month</div>
                                            {plan.savings && (
                                              <div className="text-green-600 text-sm">Save ${plan.savings}</div>
                                            )}
                                          </>
                                        )}
                                      </div>
                                    </div>
                                    <ul className="space-y-2">
                                      {plan.features?.map((feature, index) => (
                                        <li key={index} className="flex items-center text-sm text-gray-600">
                                          <Check className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                                          <span className="flex items-center">
                                            {feature}
                                            {(feature.includes('Predictive maintenance') ||
                                              feature.includes('Custom integration') ||
                                              feature.includes('Multi-site management')) && (
                                              <TooltipProvider>
                                                <Tooltip>
                                                  <TooltipTrigger>
                                                    <Info className="h-4 w-4 ml-1 text-gray-400" />
                                                  </TooltipTrigger>
                                                  <TooltipContent>
                                                    <p>
                                                      {feature.includes('Predictive maintenance') && 
                                                        'AI-powered maintenance recommendations based on equipment performance data'}
                                                      {feature.includes('Custom integration') && 
                                                        'Integration with your existing systems and workflows'}
                                                      {feature.includes('Multi-site management') && 
                                                        'Centralized management of multiple locations and facilities'}
                                                    </p>
                                                  </TooltipContent>
                                                </Tooltip>
                                              </TooltipProvider>
                                            )}
                                          </span>
                                        </li>
                                      ))}
                                    </ul>
                                    {plan.isCustom ? (
                                      <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full mt-4"
                                        onClick={() => window.location.href = 'mailto:sales@example.com'}
                                      >
                                        Contact Sales
                                      </Button>
                                    ) : (
                                      <Button
                                        type="button"
                                        variant={field.value === plan.id ? "default" : "outline"}
                                        className="w-full mt-4"
                                      >
                                        Get Started
                                      </Button>
                                    )}
                                  </Card>
                                </label>
                              </div>
                            ))}
                          </RadioGroup>
                        </TabsContent>
                      </Tabs>
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
    </>
  );
} 
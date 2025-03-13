'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

import * as z from 'zod';
import Layout from '@/components/Layout';

import { useSearchParams, useRouter } from 'next/navigation';

import { toast } from 'sonner';
import { loadStripe } from '@stripe/stripe-js';
import TrialSignup from './TrialSignup';
import AccountForm from './AccountForm';
import BillingForm from './BillingForm';
import ReviewForm from './ReviewForm';
import { cn } from '@/lib/utils';

// Validation schemas
const accountSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  company: z.string().min(2, 'Company name is required'),
  companySize: z.string().min(1, 'Please select company size'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the terms and conditions' })
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

const billingSchema = z.object({
  cardNumber: z.string()
    .min(16, 'Invalid card number')
    .max(16, 'Invalid card number')
    .regex(/^\d+$/, 'Card number must contain only digits')
    .refine((num) => luhnCheck(num), 'Invalid card number'),
  expiry: z.string()
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Invalid expiry date (MM/YY)')
    .refine((date) => {
      const [month, year] = date.split('/');
      const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
      return expiry > new Date();
    }, 'Card has expired'),
  cvc: z.string()
    .min(3, 'Invalid CVC')
    .max(4, 'Invalid CVC')
    .regex(/^\d+$/, 'CVC must contain only digits')
});

// Constants
const COMPANY_SIZES = [
  '1-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-500 employees',
  '501+ employees'
];

const STEPS = [
  { id: 'account', title: 'Account', description: 'Account & Company' },
  { id: 'billing', title: 'Billing', description: 'Payment information' },
  { id: 'review', title: 'Review', description: 'Review your information' }
] as const;

type Step = typeof STEPS[number]['id'];

interface SignupFormProps {
  plan: string;
}

export default function SignupForm({ plan }: SignupFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>('account');
  const [formData, setFormData] = useState<any>({});
  const [isValidating, setIsValidating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if this is an organization upgrade flow
  const fromOrgId = searchParams?.get('fromOrg');
  const isOrgUpgrade = !!fromOrgId;

  // Handle initial mount and fetch organization data if needed
  useEffect(() => {
    const savedData = localStorage.getItem('signup_form_data');
    const savedStep = localStorage.getItem('signup_current_step');
    
    // Only load saved data if not an org upgrade
    if (!isOrgUpgrade && savedData) {
      setFormData(JSON.parse(savedData));
    }
    
    // Only respect saved step if not an org upgrade
    if (!isOrgUpgrade && savedStep && STEPS.some(s => s.id === savedStep)) {
      setCurrentStep(savedStep as Step);
    } else if (isOrgUpgrade) {
      // Start at billing step for org upgrades
      setCurrentStep('billing');
      
      // Fetch organization data
      const fetchOrgData = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/organizations/${fromOrgId}`);
          if (response.ok) {
            const data = await response.json();
            const org = data.organization;
            
            // Pre-populate form data with organization information
            setFormData({
              firstName: '', // Will be filled from user session later
              lastName: '',  // Will be filled from user session later
              email: org.email || '',
              company: org.name,
              companySize: org.size || COMPANY_SIZES[0],
              // No need for password fields in an upgrade flow
              plan,
              billing: searchParams?.get('billing') as 'monthly' | 'annual' || 'monthly',
              amount: searchParams?.get('amount'),
              fromOrganization: true,
              organizationId: fromOrgId,
              organizationData: org
            });
            
            // Try to get user name from session
            try {
              const userResponse = await fetch('/api/user/profile');
              if (userResponse.ok) {
                const userData = await userResponse.json();
                if (userData.user) {
                  setFormData((prev: Record<string, any>) => ({
                    ...prev,
                    firstName: userData.user.firstName || '',
                    lastName: userData.user.lastName || '',
                    email: userData.user.email || prev.email
                  }));
                }
              }
            } catch (error) {
              console.error('Error fetching user data:', error);
              // Continue without user data, will ask in review
            }
          }
        } catch (error) {
          console.error('Error fetching organization data:', error);
          toast.error('Could not fetch organization information');
        } finally {
          setIsLoading(false);
        }
      };
      
      if (fromOrgId) {
        fetchOrgData();
      }
    }
    
    setMounted(true);
  }, [isOrgUpgrade, fromOrgId, plan, searchParams]);

  // Save form data to localStorage - only if not an org upgrade
  useEffect(() => {
    if (mounted && Object.keys(formData).length > 0 && !isOrgUpgrade) {
      localStorage.setItem('signup_form_data', JSON.stringify(formData));
      localStorage.setItem('signup_current_step', currentStep);
    }
  }, [formData, currentStep, mounted, isOrgUpgrade]);

  // Don't render anything until mounted
  if (!mounted) {
    return null;
  }

  // Show loading indicator while fetching org data
  if (isOrgUpgrade && isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading organization information...</p>
        </div>
      </div>
    );
  }

  // Check for trial after mounting
  const isTrial = searchParams?.get('trial') === 'true';
  if (isTrial) {
    return <TrialSignup plan={plan as any} trialDays={14} features={[]} />;
  }

  // Validate current step before navigation
  const validateStep = async (data: any) => {
    setIsValidating(true);
    try {
      const schema = getStepSchema(currentStep);
      await schema.parseAsync(data);
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  // Handle step navigation
  const handleStepChange = async (direction: 'next' | 'back', data?: any) => {
    const currentIndex = STEPS.findIndex(s => s.id === currentStep);
    
    if (direction === 'next') {
      if (!data || !(await validateStep(data))) {
        toast.error('Please fill in all required fields correctly');
        return;
      }
      
      const updatedFormData = { ...formData, ...data };
      setFormData(updatedFormData);
      
      // If this is the billing step and test card is used, skip payment processing
      if (currentStep === 'billing' && data.isTestCard) {
        toast.success('Test card accepted');
        // You might want to mark this as a test transaction in your form data
        setFormData((prev: FormData) => ({
          ...prev,
          ...data,
          isTestTransaction: true
        }));
      }
      
      const nextStep = STEPS[currentIndex + 1];
      if (nextStep) {
        setCurrentStep(nextStep.id);
      }
    } else {
      const prevStep = STEPS[currentIndex - 1];
      
      // For org upgrades, don't allow going back to account step
      if (prevStep && !(isOrgUpgrade && prevStep.id === 'account')) {
        setCurrentStep(prevStep.id);
      } else if (isOrgUpgrade && prevStep?.id === 'account') {
        // If trying to go back from org upgrade, offer to cancel instead
        if (confirm('Going back will cancel the upgrade process. Continue?')) {
          router.push(`/organization`);
        }
      }
    }
  };

  // Handle final submission
  const handleFinalSubmit = async (data: any) => {
    if (!(await validateStep(data))) {
      toast.error('Please review your information');
      return;
    }

    try {
      // If this is a test transaction, just simulate success
      if (formData.isTestTransaction) {
        // For org upgrades, update the organization with the new plan
        if (isOrgUpgrade && fromOrgId) {
          toast.success('Plan upgrade initiated', {
            description: 'Processing your test upgrade...'
          });
          
          // Small delay to show the processing message
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Update the organization with the new plan
          await handleOrganizationPlanUpdate(fromOrgId, plan, data.billing);
          
          return;
        }
        
        // Regular test signup
        toast.success('Test signup completed successfully!');
        router.push('/dashboard');
        return;
      }

      // For real upgrades, update organization plan
      if (isOrgUpgrade && fromOrgId) {
        setIsLoading(true);
        try {
          // Process payment if needed (you'd integrate with your payment processor here)
          // ...
          
          // Update the organization with the new plan
          await handleOrganizationPlanUpdate(fromOrgId, plan, data.billing);
        } finally {
          setIsLoading(false);
        }
        return;
      }

      // Regular Stripe payment flow for new signups
      // ... rest of the payment logic ...
    } catch (error) {
      toast.error('Something went wrong', {
        description: error instanceof Error ? error.message : 'Please try again'
      });
    }
  };
  
  // Function to update organization plan
  const handleOrganizationPlanUpdate = async (orgId: string, planId: string, billingPeriod: string) => {
    try {
      // Show an initial loading toast
      const toastId = toast.loading('Updating organization plan...');
      
      const response = await fetch(`/api/organizations/${orgId}/plan`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: planId.toUpperCase(),
          billingPeriod: billingPeriod.toUpperCase(),
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Dismiss the loading toast and show a success message
        toast.dismiss(toastId);
        toast.success('Plan upgraded successfully!', {
          description: `Your organization has been upgraded to the ${planId.charAt(0).toUpperCase() + planId.slice(1)} plan.`,
          duration: 5000,
        });
        
        // Redirect back to organization page
        router.push('/organization');
      } else {
        // Dismiss the loading toast and show an error message
        toast.dismiss(toastId);
        throw new Error(data.message || data.error || 'Failed to update organization plan');
      }
    } catch (error) {
      console.error('Error updating organization plan:', error);
      toast.error('Failed to update organization plan', {
        description: error instanceof Error ? error.message : 'Please try again or contact support',
        duration: 5000,
      });
      
      // Still redirect to organization page after a delay
      setTimeout(() => {
        router.push('/organization');
      }, 3000);
    }
  };

  // Get the schema based on the current step
  const getStepSchema = (step: Step) => {
    switch (step) {
      case 'account':
        return accountSchema;
      case 'billing':
        return billingSchema;
      case 'review':
        return z.object({});
      default:
        return accountSchema;
    }
  };

  return (
    
      <div className="min-h-screen bg-gray-50 pt-32">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Step indicator - show only billing and review for org upgrades */}
          <div className="mb-8">
            <div className="flex justify-between">
              {STEPS.filter(step => !isOrgUpgrade || step.id !== 'account').map((step, index) => {
                // For org upgrades, renumber steps to start from 1
                const displayIndex = isOrgUpgrade && step.id !== 'account' ? index + 1 : index + 1;
                
                // Calculate if step is active or completed
                const stepIndex = STEPS.findIndex(s => s.id === step.id);
                const currentIndex = STEPS.findIndex(s => s.id === currentStep);
                const isActiveOrCompleted = stepIndex <= currentIndex;
                
                return (
                  <div 
                    key={step.id}
                    className={cn(
                      "flex flex-col items-center",
                      isActiveOrCompleted ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      isActiveOrCompleted ? "bg-primary text-primary-foreground" : "bg-muted"
                    )}>
                      {displayIndex}
                    </div>
                    <span className="mt-2 text-sm">{step.title}</span>
                    <span className="mt-1 text-xs text-muted-foreground">{step.description}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between mb-6">
            {(currentStep !== 'account' || !isOrgUpgrade) && (
              <Button
                variant="outline"
                onClick={() => handleStepChange('back')}
                disabled={isValidating}
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            <div /> {/* Spacer */}
          </div>

          {/* Form steps with animations */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {currentStep === 'account' && !isOrgUpgrade && (
                <AccountForm 
                  onSubmit={(data) => handleStepChange('next', data)}
                  initialData={formData}
                />
              )}
              {currentStep === 'billing' && (
                <BillingForm 
                  onSubmit={(data) => handleStepChange('next', data)}
                  initialData={formData}
                  plan={plan}
                  billing={searchParams?.get('billing') as 'monthly' | 'annual' || 'monthly'}
                />
              )}
              {currentStep === 'review' && (
                <ReviewForm 
                  onSubmit={() => handleFinalSubmit(formData)}
                  data={{
                    ...formData,
                    plan: plan,
                    billing: searchParams?.get('billing') as 'monthly' | 'annual' || 'monthly',
                    amount: formData.amount || searchParams?.get('amount')
                  }}
                  isLoading={isLoading}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
  );
}

function luhnCheck(num: string) {
  const arr = (num + '')
    .split('')
    .reverse()
    .map(x => parseInt(x));
  const sum = arr.reduce((acc, val, i) => {
    if (i % 2 !== 0) {
      const doubled = val * 2;
      return acc + (doubled > 9 ? doubled - 9 : doubled);
    }
    return acc + val;
  }, 0);
  return sum % 10 === 0;
}
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Layout from '@/components/Layout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSearchParams, useRouter } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { loadStripe } from '@stripe/stripe-js';
import { trackEvent } from '@/lib/analytics';
import TrialSignup from './TrialSignup';
import AccountForm from './AccountForm';
import BillingForm from './BillingForm';
import ReviewForm from './ReviewForm';
import { Container } from 'postcss';
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

  // Handle initial mount
  useEffect(() => {
    const savedData = localStorage.getItem('signup_form_data');
    const savedStep = localStorage.getItem('signup_current_step');
    
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
    if (savedStep && STEPS.some(s => s.id === savedStep)) {
      setCurrentStep(savedStep as Step);
    }
    
    setMounted(true);
  }, []);

  // Save form data to localStorage
  useEffect(() => {
    if (mounted && Object.keys(formData).length > 0) {
      localStorage.setItem('signup_form_data', JSON.stringify(formData));
      localStorage.setItem('signup_current_step', currentStep);
    }
  }, [formData, currentStep, mounted]);

  // Don't render anything until mounted
  if (!mounted) {
    return null;
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
      if (prevStep) {
        setCurrentStep(prevStep.id);
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
      if (formData.isTestTransaction) {
        // Handle test transaction completion
        toast.success('Test signup completed successfully!');
        router.push('/dashboard');
        return;
      }

      // Regular Stripe payment flow for real cards
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);
      // ... rest of the payment logic ...
    } catch (error) {
      toast.error('Something went wrong', {
        description: error instanceof Error ? error.message : 'Please try again'
      });
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
    <Layout>
      <div className="min-h-screen bg-gray-50 pt-32">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Step indicator */}
          <div className="mb-8">
            <div className="flex justify-between">
              {STEPS.map((step, index) => (
                <div 
                  key={step.id}
                  className={cn(
                    "flex flex-col items-center",
                    index <= STEPS.findIndex(s => s.id === currentStep) 
                      ? "text-primary" 
                      : "text-muted-foreground"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    index <= STEPS.findIndex(s => s.id === currentStep)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}>
                    {index + 1}
                  </div>
                  <span className="mt-2 text-sm">{step.title}</span>
                  <span className="mt-1 text-xs text-muted-foreground">{step.description}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between mb-6">
            {currentStep !== 'account' && (
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
              {currentStep === 'account' && (
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
                  data={formData}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}

// Utility functions
function calculatePasswordStrength(password: string): number {
  let strength = 0;
  if (password.length >= 8) strength += 20;
  if (/[A-Z]/.test(password)) strength += 20;
  if (/[a-z]/.test(password)) strength += 20;
  if (/[0-9]/.test(password)) strength += 20;
  if (/[^A-Za-z0-9]/.test(password)) strength += 20;
  return strength;
}

function luhnCheck(num: string) {
  let arr = (num + '')
    .split('')
    .reverse()
    .map(x => parseInt(x));
  let sum = arr.reduce((acc, val, i) => {
    if (i % 2 !== 0) {
      const doubled = val * 2;
      return acc + (doubled > 9 ? doubled - 9 : doubled);
    }
    return acc + val;
  }, 0);
  return sum % 10 === 0;
}
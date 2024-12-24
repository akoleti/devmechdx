'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trackEvent } from '@/lib/analytics';

const trialSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address').refine(
    (email) => email.includes('@') && !email.endsWith('@gmail.com'),
    'Please use your work email'
  ),
  company: z.string().min(2, 'Company name is required'),
  companySize: z.string().min(1, 'Please select company size'),
  phone: z.string().min(10, 'Please enter a valid phone number')
});

type TrialFormData = z.infer<typeof trialSchema>;

// Add plan details type
const planDetails = {
  starter: {
    name: 'Starter',
    price: {
      monthly: '299',
      annual: '2990'
    }
  },
  professional: {
    name: 'Professional',
    price: {
      monthly: '599',
      annual: '5990'
    }
  }
} as const;

type PlanType = keyof typeof planDetails;

interface TrialSignupProps {
  plan: PlanType;
  trialDays: number;
  features: string[];
}

const COMPANY_SIZES = [
  '1-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-500 employees',
  '501+ employees'
];

export default function TrialSignup({ plan, trialDays, features }: TrialSignupProps) {
  const [isClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [verificationSent, setVerificationSent] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<TrialFormData>({
    resolver: zodResolver(trialSchema)
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const planName = planDetails[plan].name;

  const onSubmit = async (data: TrialFormData) => {
    setIsSubmitting(true);
    try {
      // Track signup attempt
      trackEvent('trial_signup_started', {
        plan: planDetails[plan].name,
        companySize: data.companySize
      });

      // Create user and send verification email
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          plan,
          trialDays
        })
      });

      if (!response.ok) throw new Error('Signup failed');

      // Send welcome email
      await fetch('/api/email/welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          name: `${data.firstName} ${data.lastName}`,
          plan,
          trialDays
        })
      });

      setVerificationSent(true);
      
      // Track successful signup
      trackEvent('trial_signup_completed', {
        plan: planDetails[plan].name,
        companySize: data.companySize
      });

      toast.success('Account created!', {
        description: 'Please check your email to verify your account.'
      });
    } catch (error) {
      toast.error('Something went wrong', {
        description: 'Please try again or contact support.'
      });
      
      // Track failed signup
      trackEvent('trial_signup_failed', {
        plan: planDetails[plan].name,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isClient) return null;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 pt-32">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href="/pricing"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Pricing
          </Link>

          <div className="mt-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Start your {planDetails[plan].name} Trial
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Try {planDetails[plan].name} free for {trialDays} days. No credit card required.
            </p>

            <div className="mt-8 bg-blue-50 rounded-xl p-6">
              <h2 className="font-semibold text-blue-900">What's included:</h2>
              <ul className="mt-4 space-y-3">
                {features.map((feature) => (
                  <li key={feature} className="flex items-center text-blue-800">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      {...register('firstName')}
                      className={`mt-1 ${errors.firstName ? 'border-red-500' : ''}`}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      {...register('lastName')}
                      className={`mt-1 ${errors.lastName ? 'border-red-500' : ''}`}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <Label htmlFor="email">Work Email</Label>
                  <Input 
                    {...register('email')}
                    type="email"
                    className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div className="mt-6">
                  <Label htmlFor="company">Company Name</Label>
                  <Input 
                    {...register('company')}
                    className={`mt-1 ${errors.company ? 'border-red-500' : ''}`}
                  />
                  {errors.company && (
                    <p className="mt-1 text-sm text-red-500">{errors.company.message}</p>
                  )}
                </div>

                <div className="mt-6">
                  <Label htmlFor="companySize">Company Size</Label>
                  <Select 
                    onValueChange={(value) => {
                      // React Hook Form's setValue
                      setValue('companySize', value);
                    }}
                    defaultValue=""
                  >
                    <SelectTrigger 
                      className={`mt-1 ${errors.companySize ? 'border-red-500' : ''}`}
                    >
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMPANY_SIZES.map(size => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.companySize && (
                    <p className="mt-1 text-sm text-red-500">{errors.companySize.message}</p>
                  )}
                </div>

                <div className="mt-6">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    {...register('phone')}
                    type="tel"
                    className={`mt-1 ${errors.phone ? 'border-red-500' : ''}`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Setting up your trial...' : `Start ${trialDays}-day Free Trial`}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
} 
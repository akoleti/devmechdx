'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Building, ArrowUpCircle } from 'lucide-react';

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

interface BillingFormProps {
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
  plan: string;
  billing?: 'monthly' | 'annual';
}

const TEST_CARDS = [
  {
    number: '1234567887654321',
    expiry: '05/25',
    cvc: '123',
    type: 'Test Card'
  },
  {
    number: '4242424242424242',
    expiry: '12/25',
    cvc: '123',
    type: 'Visa Test'
  },
  {
    number: '5555555555554444',
    expiry: '12/25',
    cvc: '123',
    type: 'Mastercard Test'
  }
] as const;

export default function BillingForm({ onSubmit, initialData, plan, billing = 'monthly' }: BillingFormProps) {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const searchParams = useSearchParams();
  const urlAmount = searchParams?.get('amount');
  const fromOrgId = searchParams?.get('fromOrg');
  const isOrgUpgrade = !!fromOrgId;

  useEffect(() => {
    setMounted(true);
  }, []);

  const planInfo = planDetails[plan as keyof typeof planDetails];
  const amount = urlAmount || planInfo?.price[billing];
  const period = billing === 'monthly' ? '/month' : '/year';
  const formSchema = z.object({
    cardNumber: z.string()
      .length(16, "Card number must be 16 digits")
      .regex(/^\d+$/, 'Card number must contain only digits'),
    expiry: z.string()
      .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Invalid expiry date (MM/YY)'),
    cvc: z.string()
      .length(3, "CVC must be 3 digits")
      .regex(/^\d+$/, 'CVC must contain only digits')
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
  });

  // Watch form values for test card detection
  const cardNumber = watch('cardNumber');
  const expiry = watch('expiry');
  const cvc = watch('cvc');

  // Format inputs on change
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    setValue('cardNumber', value);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setValue('expiry', value);
  };

  const handleCVCChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 3) value = value.slice(0, 3);
    setValue('cvc', value);
  };

  // Check for test cards
  const isTestCard = TEST_CARDS.some(card => 
    cardNumber === card.number && 
    expiry === card.expiry && 
    cvc === card.cvc
  );

  const onSubmitForm = async (data: any) => {
    setIsLoading(true);
    try {
      // Check if test card is being used
      if (
        cardNumber === TEST_CARDS[0].number &&
        expiry === TEST_CARDS[0].expiry &&
        cvc === TEST_CARDS[0].cvc
      ) {
        // For test card, skip actual payment processing
        await onSubmit({
          ...data,
          isTestCard: true,
          plan,
          billing,
          amount,
          fromOrganization: isOrgUpgrade,
          organizationId: fromOrgId
        });
        return;
      }

      // Normal submission for real cards
      await onSubmit({
        ...data,
        plan,
        billing,
        amount,
        fromOrganization: isOrgUpgrade,
        organizationId: fromOrgId
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      {/* Organization upgrade notice - only shown for org upgrades */}
      {isOrgUpgrade && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <ArrowUpCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
            <div>
              <h3 className="font-medium text-blue-800">Organization Plan Upgrade</h3>
              <p className="text-sm text-blue-700 mt-1">
                You're upgrading your organization's plan. This will be billed to your organization's payment method.
              </p>
              <div className="flex items-center mt-3 text-sm">
                <Building className="h-4 w-4 mr-1 text-blue-600" />
                <span className="font-medium">{initialData?.company || 'Your Organization'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Plan Summary */}
      <div className="bg-muted/50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">{planInfo?.name} Plan</h3>
          <div className="text-right">
            <span className="text-2xl font-bold">${amount}</span>
            <span className="text-muted-foreground text-sm">{period}</span>
          </div>
        </div>
        {billing === 'annual' && (
          <p className="text-sm text-muted-foreground">
            Save 16% with annual billing
          </p>
        )}
      </div>

      {/* Test Card Notice */}
      <div className="bg-blue-50 text-blue-700 p-4 rounded-lg text-sm">
        <p className="font-medium">Test Mode Active</p>
        <p className="mt-1">You can use any of these test cards:</p>
        <ul className="mt-2 space-y-1">
          {TEST_CARDS.map((card, index) => (
            <li key={index} className="flex items-center space-x-2">
              <span>{card.type}:</span>
              <code className="bg-blue-100 px-1 rounded">{card.number}</code>
            </li>
          ))}
        </ul>
      </div>

      {/* Payment Details */}
      <div>
        <Label htmlFor="cardNumber">
          Card Number
          <button
            type="button"
            onClick={() => setShowHints(!showHints)}
            className="ml-2 text-xs text-muted-foreground hover:text-primary"
          >
            {showHints ? 'Hide hints' : 'Show hints'}
          </button>
        </Label>
        <Input 
          {...register('cardNumber')}
          placeholder="1234 5678 9012 3456"
          onChange={handleCardNumberChange}
          className={cn(
            "mt-1 font-mono",
            errors.cardNumber && "border-destructive focus-visible:ring-destructive",
            isTestCard && "border-blue-500 focus-visible:ring-blue-500"
          )}
        />
        {showHints && !errors.cardNumber && (
          <p className="mt-1 text-xs text-muted-foreground">
            Enter a 16-digit card number
          </p>
        )}
        {errors.cardNumber && (
          <p className="mt-1 text-sm text-destructive">{errors.cardNumber.message?.toString()}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="expiry">Expiry Date</Label>
          <Input 
            {...register('expiry')}
            placeholder="MM/YY"
            onChange={handleExpiryChange}
            className={cn(
              "mt-1 font-mono",
              errors.expiry && "border-destructive focus-visible:ring-destructive",
              isTestCard && "border-blue-500 focus-visible:ring-blue-500"
            )}
          />
          {showHints && !errors.expiry && (
            <p className="mt-1 text-xs text-muted-foreground">
              Format: MM/YY (e.g., 12/25)
            </p>
          )}
          {errors.expiry && (
            <p className="mt-1 text-sm text-destructive">{errors.expiry.message?.toString()}</p>
          )}
        </div>

        <div>
          <Label htmlFor="cvc">CVC</Label>
          <Input 
            {...register('cvc')}
            placeholder="123"
            onChange={handleCVCChange}
            className={cn(
              "mt-1 font-mono",
              errors.cvc && "border-destructive focus-visible:ring-destructive",
              isTestCard && "border-blue-500 focus-visible:ring-blue-500"
            )}
          />
          {showHints && !errors.cvc && (
            <p className="mt-1 text-xs text-muted-foreground">
              3-digit security code
            </p>
          )}
          {errors.cvc && (
            <p className="mt-1 text-sm text-destructive">{errors.cvc.message?.toString()}</p>
          )}
        </div>
      </div>

      <Button 
        type="submit" 
        className={cn(
          "w-full",
          isTestCard && "bg-blue-500 hover:bg-blue-600",
          isOrgUpgrade && !isTestCard && "bg-green-600 hover:bg-green-700"
        )} 
        disabled={isLoading}
      >
        {isTestCard 
          ? 'Continue with Test Card' 
          : isOrgUpgrade 
            ? `Upgrade to ${planInfo?.name} Plan` 
            : `Pay ${amount} ${billing === 'monthly' ? 'monthly' : 'annually'}`
        }
      </Button>
    </form>
  );
} 
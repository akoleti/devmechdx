'use client';

import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";

interface ReviewFormProps {
  onSubmit: () => void;
  data: {
    firstName: string;
    lastName: string;
    email: string;
    company: string;
    companySize: string;
    cardNumber: string;
    expiry: string;
    plan: string;
    billing: 'monthly' | 'annual';
    isTestCard?: boolean;
  };
}

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

export default function ReviewForm({ onSubmit, data }: ReviewFormProps) {
  const planInfo = planDetails[data.plan as keyof typeof planDetails];
  const amount = planInfo?.price[data.billing];
  const period = data.billing === 'monthly' ? '/month' : '/year';

  return (
    <div className="space-y-8">
      <div className={cn(
        "rounded-xl p-6 shadow-sm",
        "bg-card text-card-foreground"
      )}>
        <h3 className="text-lg font-semibold">Review Your Information</h3>
        <div className="mt-6 space-y-6">
          {/* Account Details */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Account Details</h4>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1">{data.firstName} {data.lastName}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1">{data.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Company</dt>
                <dd className="mt-1">{data.company}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Company Size</dt>
                <dd className="mt-1">{data.companySize}</dd>
              </div>
            </dl>
          </div>

          {/* Plan Details */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Plan Details</h4>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Plan</dt>
                <dd className="mt-1">{planInfo?.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Billing</dt>
                <dd className="mt-1 capitalize">{data.billing}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Amount</dt>
                <dd className="mt-1">
                  ${amount}{period}
                  {data.billing === 'annual' && (
                    <span className="ml-2 text-sm text-green-600">Save 16%</span>
                  )}
                </dd>
              </div>
            </dl>
          </div>

          {/* Billing Information */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Billing Information</h4>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Card Number</dt>
                <dd className="mt-1 font-mono">
                  •••• •••• •••• {data.cardNumber.slice(-4)}
                  {data.isTestCard && (
                    <span className="ml-2 text-xs text-blue-600 font-normal">Test Card</span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Expiry Date</dt>
                <dd className="mt-1 font-mono">{data.expiry}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <Button 
        onClick={onSubmit}
        className={cn(
          "w-full",
          data.isTestCard && "bg-blue-500 hover:bg-blue-600"
        )}
      >
        {data.isTestCard ? 'Complete Test Signup' : 'Complete Signup'}
      </Button>
    </div>
  );
} 
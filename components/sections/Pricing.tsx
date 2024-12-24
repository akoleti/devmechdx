'use client';

import { Button } from '@/components/ui/button';
import { Check, HelpCircle } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { useState } from 'react';
import Link from 'next/link';

type BillingPeriod = 'monthly' | 'annual';
type FeatureKey = keyof typeof featureExplanations;

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for small facilities',
    price: {
      monthly: '299',
      annual: '2990'
    },
    trial: {
      days: 14,
      features: ['Full access to all features', 'No credit card required']
    },
    billing: 'per month',
    features: [
      'Up to 5 HVAC units',
      'Basic monitoring',
      'Email support',
      'Mobile app access',
      'Weekly reports'
    ],
    signupUrl: '/signup/starter',
    trialUrl: '/signup/starter/trial'
  },
  {
    name: 'Professional',
    description: 'Ideal for medium-sized buildings',
    price: {
      monthly: '599',
      annual: '5990'
    },
    trial: {
      days: 30,
      features: ['Full access to all features', 'Onboarding support included']
    },
    billing: 'per month',
    popular: true,
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
    signupUrl: '/signup/professional',
    trialUrl: '/signup/professional/trial'
  },
  {
    name: 'Enterprise',
    description: 'For large organizations',
    price: 'Custom',
    billing: 'contact sales',
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
    signupUrl: '/signup/enterprise'
  }
];

const featureExplanations = {
  'Basic monitoring': 'Real-time temperature and performance monitoring',
  'Advanced analytics': 'AI-powered insights and trend analysis',
  'Predictive maintenance': 'ML algorithms to predict potential failures',
  'Custom integration': 'Integration with existing building management systems',
  'Energy optimization': 'AI-driven energy usage optimization',
  'Multi-site management': 'Centralized control for multiple locations'
};

const Pricing = () => {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');

  const getPrice = (plan: typeof plans[0]) => {
    if (typeof plan.price === 'string') return plan.price;
    return billingPeriod === 'monthly' 
      ? plan.price.monthly 
      : `${plan.price.annual}`;
  };

  const getSavings = (plan: typeof plans[0]) => {
    if (typeof plan.price === 'string') return null;
    const monthlyCost = parseInt(plan.price.monthly);
    const annualCost = parseInt(plan.price.annual);
    const savings = (monthlyCost * 12) - annualCost;
    return savings;
  };

  return (
    <section id="pricing" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Choose the perfect plan for your HVAC management needs
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="mt-12 flex justify-center">
          <div className="bg-white rounded-full p-1 shadow-sm">
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

        {/* Pricing Cards */}
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-2xl p-8 shadow-sm relative ${
                plan.popular ? 'ring-2 ring-[#0F62FE]' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-[#0F62FE] text-white px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {plan.name}
                </h2>
                <p className="mt-2 text-gray-600">
                  {plan.description}
                </p>
                <div className="mt-6">
                  <span className="text-4xl font-bold text-gray-900">
                    ${getPrice(plan)}
                  </span>
                  <span className="text-gray-600 ml-2">
                    {billingPeriod === 'monthly' ? '/month' : '/year'}
                  </span>
                  {getSavings(plan) !== null && (
                    <div className="mt-2 text-sm text-green-600">
                      Save ${getSavings(plan)?.toLocaleString()} 
                    </div>
                  )}
                  {plan.trial && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm font-medium text-[#0F62FE]">
                        {plan.trial.days}-day free trial
                      </div>
                      <ul className="mt-2 space-y-1">
                        {plan.trial.features.map((feature) => (
                          <li key={feature} className="text-xs text-gray-600 flex items-center">
                            <Check className="h-3 w-3 text-[#0F62FE] mr-1 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <ul className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="h-5 w-5 text-[#0F62FE] flex-shrink-0" />
                    <span className="ml-3 text-gray-600">{feature}</span>
                    {featureExplanations[feature as FeatureKey] && (
                      <Tooltip.Provider>
                        <Tooltip.Root>
                          <Tooltip.Trigger asChild>
                            <button className="ml-1.5">
                              <HelpCircle className="h-4 w-4 text-gray-400" />
                            </button>
                          </Tooltip.Trigger>
                          <Tooltip.Portal>
                            <Tooltip.Content
                              className="bg-gray-900 text-white px-3 py-1.5 rounded text-sm max-w-xs"
                              sideOffset={5}
                            >
                              {featureExplanations[feature as FeatureKey]}
                              <Tooltip.Arrow className="fill-gray-900" />
                            </Tooltip.Content>
                          </Tooltip.Portal>
                        </Tooltip.Root>
                      </Tooltip.Provider>
                    )}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-3 mt-8">
                <Button 
                  className={`w-full ${
                    plan.popular ? 'bg-[#0F62FE] hover:bg-[#0F62FE]/90' : ''
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                  asChild
                >
                  <Link 
                    href={plan.price === 'Custom' ? '/contact' : `${plan.signupUrl}?billing=${billingPeriod}`}
                  >
                    {plan.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
                  </Link>
                </Button>
                {plan.trial && (
                  <Button 
                    variant="ghost"
                    className="text-[#0F62FE]"
                    asChild
                  >
                    <Link href={plan.trialUrl}>
                      Start {plan.trial.days}-day free trial
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing; 
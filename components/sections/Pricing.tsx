import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const tiers = [
  {
    name: 'Starter',
    id: 'starter',
    price: '299',
    billing: 'per month',
    description: 'Perfect for small maintenance teams',
    features: [
      'Up to 50 equipment items',
      'Basic maintenance scheduling',
      'Work order management',
      'Mobile app access',
      'Email support',
      '5 team members',
    ],
    cta: 'Start Free Trial',
    href: '/trial',
    mostPopular: false,
  },
  {
    name: 'Professional',
    id: 'professional',
    price: '599',
    billing: 'per month',
    description: 'Ideal for growing organizations',
    features: [
      'Up to 200 equipment items',
      'Advanced maintenance planning',
      'Inventory management',
      'Analytics dashboard',
      'API access',
      'Priority support',
      '15 team members',
      'Custom reporting',
    ],
    cta: 'Start Free Trial',
    href: '/trial',
    mostPopular: true,
  },
  {
    name: 'Enterprise',
    id: 'enterprise',
    price: 'Custom',
    billing: 'contact for pricing',
    description: 'For large-scale operations',
    features: [
      'Unlimited equipment items',
      'Predictive maintenance',
      'Custom integrations',
      'Dedicated support team',
      'SLA guarantees',
      'Unlimited team members',
      'Custom workflows',
      'Training & onboarding',
      'Multi-site management',
    ],
    cta: 'Contact Sales',
    href: '/contact',
    mostPopular: false,
  },
];

const additionalFeatures = [
  'Free data migration',
  'Implementation support',
  'Regular platform updates',
  'Security compliance',
  'Backup & recovery',
  'Training materials',
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan for your maintenance needs. All plans include a 14-day free trial.
          </p>
        </div>

        {/* Pricing Toggle - Monthly/Annual */}
        <div className="mt-8 flex justify-center">
          <div className="relative flex items-center p-1 bg-gray-100 rounded-full">
            <button className="relative w-32 py-2 text-sm font-medium text-white rounded-full bg-blue-600">
              Monthly
            </button>
            <button className="relative w-32 py-2 text-sm font-medium text-gray-700">
              Annual (Save 20%)
            </button>
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={cn(
                "relative rounded-2xl bg-white p-8 shadow-sm transition-shadow hover:shadow-md",
                tier.mostPopular && "border-2 border-blue-600"
              )}
            >
              {tier.mostPopular && (
                <div className="absolute -top-4 left-0 right-0 mx-auto w-32 rounded-full bg-blue-600 px-3 py-1 text-center text-sm font-medium text-white">
                  Most Popular
                </div>
              )}

              <div className="text-center">
                <h3 className="text-lg font-semibold leading-8 text-gray-900">
                  {tier.name}
                </h3>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  {tier.description}
                </p>
                <div className="mt-4 flex items-baseline justify-center gap-x-2">
                  {tier.price === 'Custom' ? (
                    <span className="text-4xl font-bold tracking-tight text-gray-900">
                      {tier.price}
                    </span>
                  ) : (
                    <>
                      <span className="text-4xl font-bold tracking-tight text-gray-900">
                        ${tier.price}
                      </span>
                      <span className="text-sm font-semibold leading-6 text-gray-600">
                        {tier.billing}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <ul className="mt-8 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm leading-6 text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={cn(
                  "mt-8 w-full",
                  !tier.mostPopular && "bg-gray-100 text-gray-900 hover:bg-gray-200"
                )}
                asChild
              >
                <a href={tier.href}>{tier.cta}</a>
              </Button>
            </div>
          ))}
        </div>

        {/* Additional Features */}
        <div className="mt-20 bg-gray-50 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-center mb-8">
            All Plans Include
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {additionalFeatures.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-3"
              >
                <Check className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <span className="text-gray-600">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Enterprise CTA */}
        <div className="mt-20 text-center bg-blue-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold">Need a Custom Solution?</h3>
          <p className="mt-4 text-blue-100 max-w-2xl mx-auto">
            Our enterprise plan is perfect for large organizations with specific requirements. 
            Get in touch with our sales team for a customized quote.
          </p>
          <Button
            variant="secondary"
            size="lg"
            className="mt-8 bg-white text-blue-600 hover:bg-blue-50"
            asChild
          >
            <a href="/contact">Contact Sales</a>
          </Button>
        </div>

        {/* FAQ Link */}
        <div className="mt-12 text-center">
          <a href="/faq" className="text-sm text-gray-600 hover:text-blue-600">
            Have questions? Check out our FAQ →
          </a>
        </div>
      </div>
    </section>
  );
};

export default Pricing; 
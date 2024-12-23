'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Mail, Calendar, PhoneCall } from 'lucide-react';

const CallToAction = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Add newsletter subscription logic here
    setIsSubscribed(true);
    setEmail('');
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main CTA Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Free Trial Card */}
          <div className="bg-blue-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold">Start Your Free Trial</h3>
            <p className="mt-2 text-blue-100">
              Experience the full power of MechDX for 14 days, no credit card required.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                'Full platform access',
                'Sample data and templates',
                'Email support',
                'Up to 5 team members'
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-blue-300 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-blue-100">{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              size="lg"
              className="mt-8 bg-white text-blue-600 hover:bg-blue-50 w-full sm:w-auto"
              asChild
            >
              <a href="/signup">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>

          {/* Schedule Demo Card */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900">Schedule a Demo</h3>
            <p className="mt-2 text-gray-600">
              Get a personalized walkthrough of MechDX tailored to your needs.
            </p>
            <div className="mt-6 space-y-4">
              {[
                { icon: Calendar, text: 'Live product demonstration' },
                { icon: PhoneCall, text: '1-on-1 consultation' },
                { icon: Mail, text: 'Custom implementation plan' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <item.icon className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-gray-600">{item.text}</span>
                </div>
              ))}
            </div>
            <Button
              size="lg"
              variant="outline"
              className="mt-8 w-full sm:w-auto"
              asChild
            >
              <a href="/demo">Schedule Demo</a>
            </Button>
          </div>
        </div>

        {/* Contact Sales & Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Contact Sales */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-gray-900">
              Ready to Transform Your Operations?
            </h3>
            <p className="mt-2 text-gray-600">
              Our team is here to help you find the perfect solution for your organization.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <a href="/contact" className="gap-2">
                  <PhoneCall className="h-4 w-4" />
                  Contact Sales
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="/pricing">View Pricing</a>
              </Button>
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-xl font-semibold text-gray-900">
              Stay Updated
            </h3>
            <p className="mt-2 text-gray-600">
              Get the latest updates, news, and insights from MechDX.
            </p>
            <form onSubmit={handleSubscribe} className="mt-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-grow"
                />
                <Button type="submit" className="whitespace-nowrap">
                  Subscribe
                </Button>
              </div>
              {isSubscribed && (
                <p className="mt-2 text-sm text-green-600">
                  Thanks for subscribing! Check your email for confirmation.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction; 
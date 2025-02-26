'use client';

import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, LifeBuoy, MessageCircle, FileText, Phone, Mail, ArrowRight } from 'lucide-react';

const helpCategories = [
  {
    title: 'Getting Started',
    icon: LifeBuoy,
    articles: [
      'Platform Overview',
      'Account Setup',
      'First Time Configuration',
      'Basic Navigation'
    ]
  },
  {
    title: 'Troubleshooting',
    icon: MessageCircle,
    articles: [
      'Common Issues',
      'Error Messages',
      'Connection Problems',
      'System Status'
    ]
  },
  {
    title: 'Account & Billing',
    icon: FileText,
    articles: [
      'Subscription Management',
      'Payment Methods',
      'Billing History',
      'Usage Reports'
    ]
  }
];

const popularArticles = [
  {
    title: 'How to Connect IoT Sensors',
    category: 'Setup',
    views: '2.5k',
    link: '/help/connect-sensors'
  },
  {
    title: 'Understanding Analytics Dashboard',
    category: 'Usage',
    views: '1.8k',
    link: '/help/analytics-dashboard'
  },
  {
    title: 'Configuring Alert Thresholds',
    category: 'Configuration',
    views: '1.2k',
    link: '/help/alert-thresholds'
  }
];

const supportChannels = [
  {
    icon: Phone,
    title: 'Phone Support',
    description: '24/7 support for urgent issues',
    action: 'Call Now',
    link: 'tel:+1234567890'
  },
  {
    icon: Mail,
    title: 'Email Support',
    description: 'Response within 2 hours',
    action: 'Send Email',
    link: 'mailto:support@mechdx.com'
  },
  {
    icon: MessageCircle,
    title: 'Live Chat',
    description: 'Chat with our support team',
    action: 'Start Chat',
    link: '#'
  }
];

export default function Help() {
  return (
      <div className="min-h-screen bg-gray-50 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              How can we help?
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Search our knowledge base or get in touch with our support team
            </p>
          </div>

          {/* Search */}
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search for answers..."
                className="pl-10 py-6 text-lg"
              />
              <Search className="absolute left-3 top-4 h-6 w-6 text-gray-400" />
            </div>
          </div>

          {/* Help Categories */}
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {helpCategories.map((category) => (
              <div
                key={category.title}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <div className="inline-flex p-3 rounded-lg bg-[#0F62FE]/10">
                  <category.icon className="h-6 w-6 text-[#0F62FE]" />
                </div>
                <h2 className="mt-4 text-xl font-semibold text-gray-900">
                  {category.title}
                </h2>
                <ul className="mt-4 space-y-3">
                  {category.articles.map((article) => (
                    <li key={article}>
                      <a
                        href="#"
                        className="flex items-center text-gray-600 hover:text-[#0F62FE]"
                      >
                        <ArrowRight className="h-4 w-4 mr-2" />
                        {article}
                      </a>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="mt-6 w-full">
                  View All
                </Button>
              </div>
            ))}
          </div>

          {/* Popular Articles */}
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-gray-900">
              Popular Articles
            </h2>
            <div className="mt-8 grid gap-6">
              {popularArticles.map((article) => (
                <a
                  key={article.title}
                  href={article.link}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex justify-between items-center"
                >
                  <div>
                    <span className="text-sm text-[#0F62FE] font-medium">
                      {article.category}
                    </span>
                    <h3 className="mt-1 text-lg font-medium text-gray-900">
                      {article.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                      {article.views} views
                    </span>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Support Channels */}
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-gray-900">
              Get in Touch
            </h2>
            <div className="mt-8 grid gap-8 md:grid-cols-3">
              {supportChannels.map((channel) => (
                <div
                  key={channel.title}
                  className="bg-white rounded-2xl p-6 shadow-sm text-center"
                >
                  <div className="inline-flex p-3 rounded-lg bg-[#0F62FE]/10">
                    <channel.icon className="h-6 w-6 text-[#0F62FE]" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">
                    {channel.title}
                  </h3>
                  <p className="mt-2 text-gray-600">
                    {channel.description}
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6"
                    asChild
                  >
                    <a href={channel.link}>
                      {channel.action}
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Community CTA */}
          <div className="mt-20 bg-[#0F62FE] rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold">Join Our Community</h2>
            <p className="mt-2 text-blue-100 max-w-2xl mx-auto">
              Connect with other MechDX users, share experiences, and get help from the community
            </p>
            <Button 
              variant="secondary"
              size="lg"
              className="mt-6 bg-white text-[#0F62FE] hover:bg-blue-50"
            >
              Join Community Forum
            </Button>
          </div>
        </div>
      </div>
  );
} 
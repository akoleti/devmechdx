'use client';

import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Book, Code, FileText, ArrowRight, Terminal } from 'lucide-react';

const documentation = {
  gettingStarted: [
    {
      title: 'Quick Start Guide',
      description: 'Get up and running with MechDX in minutes',
      icon: Book,
      link: '/docs/quick-start',
      image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780'
    },
    {
      title: 'System Requirements',
      description: 'Hardware and software requirements',
      icon: FileText,
      link: '/docs/requirements',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31'
    },
    {
      title: 'Installation Guide',
      description: 'Step-by-step installation process',
      icon: Terminal,
      link: '/docs/installation',
      image: 'https://images.unsplash.com/photo-1586772680598-d2779618c58a'
    }
  ],
  features: [
    {
      category: 'Core Features',
      items: [
        {
          title: 'HVAC Monitoring',
          description: 'Real-time monitoring and analytics',
          link: '/docs/features/monitoring',
          image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789'
        },
        {
          title: 'Predictive Maintenance',
          description: 'AI-powered maintenance scheduling',
          link: '/docs/features/predictive-maintenance',
          image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837'
        },
        {
          title: 'Energy Optimization',
          description: 'Advanced energy management tools',
          link: '/docs/features/energy',
          image: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952'
        }
      ]
    },
    {
      category: 'Integrations',
      items: [
        {
          title: 'BMS Integration',
          description: 'Connect with building management systems',
          link: '/docs/integrations/bms',
          image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc'
        },
        {
          title: 'IoT Sensors',
          description: 'Setting up and managing sensors',
          link: '/docs/integrations/sensors',
          image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789'
        },
        {
          title: 'Third-party APIs',
          description: 'External system integrations',
          link: '/docs/integrations/apis',
          image: 'https://images.unsplash.com/photo-1581092160607-ee67df9c7ccf'
        }
      ]
    }
  ],
  api: {
    title: 'API Reference',
    description: 'Complete API documentation for developers',
    sections: [
      'Authentication',
      'Equipment Management',
      'Data Collection',
      'Analytics',
      'Alerts & Notifications'
    ]
  }
};

export default function Documentation() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Documentation
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Everything you need to implement and manage your HVAC systems with MechDX
            </p>
          </div>

          {/* Search */}
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search documentation..."
                className="pl-10"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Getting Started */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900">
              Getting Started
            </h2>
            <div className="mt-8 grid gap-8 md:grid-cols-3">
              {documentation.gettingStarted.map((item) => (
                <a
                  key={item.title}
                  href={item.link}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="inline-flex p-3 rounded-lg bg-[#0F62FE]/10">
                    <item.icon className="h-6 w-6 text-[#0F62FE]" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-gray-600">
                    {item.description}
                  </p>
                </a>
              ))}
            </div>
          </div>

          {/* Features Documentation */}
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-gray-900">
              Features & Integrations
            </h2>
            <div className="mt-8 grid gap-12 md:grid-cols-2">
              {documentation.features.map((section) => (
                <div key={section.category}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    {section.category}
                  </h3>
                  <div className="space-y-4">
                    {section.items.map((item) => (
                      <a
                        key={item.title}
                        href={item.link}
                        className="block bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {item.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {item.description}
                            </p>
                          </div>
                          <ArrowRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* API Documentation */}
          <div className="mt-20">
            <div className="bg-[#0F62FE] rounded-2xl p-8 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    {documentation.api.title}
                  </h2>
                  <p className="mt-2 text-blue-100">
                    {documentation.api.description}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {documentation.api.sections.map((section) => (
                      <span
                        key={section}
                        className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-sm"
                      >
                        {section}
                      </span>
                    ))}
                  </div>
                </div>
                <Code className="h-12 w-12 text-blue-100" />
              </div>
              <Button 
                variant="secondary"
                className="mt-8 bg-white text-[#0F62FE] hover:bg-blue-50"
              >
                View API Docs
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 
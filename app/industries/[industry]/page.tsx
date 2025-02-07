import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const industries = {
  'commercial-buildings': {
    title: 'Commercial Buildings',
    description: 'Optimize HVAC systems in office buildings and retail spaces',
    image: '/images/industries/commercial-buildings.jpg',
    features: [
      'Multi-zone temperature control',
      'Energy cost reduction',
      'Tenant comfort management',
      'Building automation integration',
      'Occupancy-based control',
      'Energy usage analytics'
    ],
    benefits: [
      { title: 'Energy Savings', value: '30%' },
      { title: 'Tenant Satisfaction', value: '95%' },
      { title: 'Maintenance Costs', value: '-40%' }
    ],
    useCases: [
      {
        title: 'Office Buildings',
        description: 'Smart temperature control for multi-tenant spaces'
      },
      {
        title: 'Retail Centers',
        description: 'Energy-efficient climate management for shopping areas'
      },
      {
        title: 'Mixed-use Properties',
        description: 'Customized zones for different space requirements'
      }
    ]
  },
  'data-centers': {
    title: 'Data Centers',
    description: 'Critical cooling system management for IT infrastructure',
    image: '/images/industries/data-centers.jpg',
    features: [
      'Precision cooling control',
      '24/7 environment monitoring',
      'Redundancy management',
      'Power usage optimization',
      'Thermal mapping',
      'Critical alerts system'
    ],
    benefits: [
      { title: 'PUE Improvement', value: '25%' },
      { title: 'System Uptime', value: '99.999%' },
      { title: 'Cooling Costs', value: '-35%' }
    ],
    useCases: [
      {
        title: 'Server Rooms',
        description: 'Precise temperature control for optimal server performance'
      },
      {
        title: 'Network Centers',
        description: 'Reliable cooling for network infrastructure'
      },
      {
        title: 'Cloud Facilities',
        description: 'Scalable cooling solutions for cloud computing'
      }
    ]
  },
  'healthcare-facilities': {
    title: 'Healthcare Facilities',
    description: 'Maintain strict environmental controls for medical facilities',
    image: '/images/industries/healthcare-facilities.jpg',
    features: [
      'Operating room HVAC control',
      'Clean room management',
      'Compliance monitoring',
      'Pressure control systems',
      'Air quality monitoring',
      'Temperature mapping'
    ],
    benefits: [
      { title: 'Compliance Rate', value: '100%' },
      { title: 'Energy Efficiency', value: '+40%' },
      { title: 'Air Quality', value: '99.99%' }
    ],
    useCases: [
      {
        title: 'Operating Rooms',
        description: 'Precise environmental control for surgical spaces'
      },
      {
        title: 'Patient Rooms',
        description: 'Comfortable and controlled patient environments'
      },
      {
        title: 'Laboratories',
        description: 'Specialized climate control for medical research'
      }
    ]
  },
  'industrial-plants': {
    title: 'Industrial Plants',
    description: 'Process cooling and industrial HVAC management',
    image: '/images/industries/industrial-plants.jpg',
    features: [
      'Process chiller optimization',
      'Industrial cooling systems',
      'Heat recovery management',
      'Equipment performance monitoring',
      'Energy consumption tracking',
      'Maintenance scheduling'
    ],
    benefits: [
      { title: 'Process Efficiency', value: '+45%' },
      { title: 'Energy Savings', value: '35%' },
      { title: 'Downtime Reduction', value: '-60%' }
    ],
    useCases: [
      {
        title: 'Manufacturing Facilities',
        description: 'Optimize cooling for production processes'
      },
      {
        title: 'Processing Plants',
        description: 'Temperature control for sensitive operations'
      },
      {
        title: 'Warehouses',
        description: 'Large-scale climate management solutions'
      }
    ]
  },
  'educational-institutions': {
    title: 'Educational Institutions',
    description: 'Campus-wide HVAC management and optimization',
    image: '/images/industries/educational-institutions.jpg',
    features: [
      'Classroom comfort control',
      'Schedule-based optimization',
      'Energy efficiency programs',
      'Multi-building management',
      'Indoor air quality monitoring',
      'Budget optimization'
    ],
    benefits: [
      { title: 'Energy Reduction', value: '40%' },
      { title: 'Cost Savings', value: '35%' },
      { title: 'Comfort Rating', value: '4.8/5' }
    ],
    useCases: [
      {
        title: 'Universities',
        description: 'Campus-wide temperature management'
      },
      {
        title: 'K-12 Schools',
        description: 'Efficient classroom climate control'
      },
      {
        title: 'Sports Facilities',
        description: 'Specialized environment management'
      }
    ]
  },
  'hotels-resorts': {
    title: 'Hotels & Resorts',
    description: 'Guest comfort and energy efficiency management',
    image: '/images/industries/hotels-resorts.jpg',
    features: [
      'Guest room automation',
      'Common area control',
      'Peak load management',
      'Occupancy-based control',
      'Energy optimization',
      'Remote monitoring'
    ],
    benefits: [
      { title: 'Guest Satisfaction', value: '96%' },
      { title: 'Energy Savings', value: '30%' },
      { title: 'ROI', value: '24 mo' }
    ],
    useCases: [
      {
        title: 'Hotel Rooms',
        description: 'Individual room comfort control'
      },
      {
        title: 'Conference Centers',
        description: 'Flexible zone management'
      },
      {
        title: 'Resort Facilities',
        description: 'Comprehensive climate solutions'
      }
    ]
  }
  // Add other industries...
};

export default function IndustryPage({ params }: { params: { industry: string } }) {
  const industry = industries[params.industry as keyof typeof industries];

  if (!industry) {
    return (
      <Layout>
        <div className="min-h-screen pt-32 text-center">
          <h1>Industry Not Found</h1>
          <Link href="/">Back to Home</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Navigation */}
          <div className="mb-8">
            <Link 
              href="/#industries"
              className="text-gray-600 hover:text-[#0F62FE] flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Industries
            </Link>
          </div>

          {/* Hero Section */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-8">
            <div className="relative h-[400px]">
              <Image
                src={industry.image}
                alt={industry.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {industry.title}
              </h1>
              <p className="text-xl text-gray-600">
                {industry.description}
              </p>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
              {/* Features */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {industry.features.map((feature) => (
                    <div 
                      key={feature}
                      className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-[#0F62FE] mt-2 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Use Cases */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Use Cases</h2>
                <div className="space-y-6">
                  {industry.useCases.map((useCase) => (
                    <div key={useCase.title} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {useCase.title}
                      </h3>
                      <p className="text-gray-600">
                        {useCase.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Benefits */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Benefits</h2>
                <div className="space-y-6">
                  {industry.benefits.map((benefit) => (
                    <div key={benefit.title} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-3xl font-bold text-[#0F62FE]">
                        {benefit.value}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {benefit.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-[#0F62FE] rounded-2xl p-8 text-white text-center">
                <h3 className="text-xl font-bold mb-4">
                  Ready to optimize your {industry.title.toLowerCase()}?
                </h3>
                <p className="text-blue-100 mb-6">
                  Get a personalized demo of our solution for your facility.
                </p>
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="w-full bg-white text-[#0F62FE] hover:bg-blue-50"
                  asChild
                >
                  <a href="/demo">Schedule Demo</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 
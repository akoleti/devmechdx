import Image from 'next/image';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
const caseStudies = [
  {
    title: "HVAC Optimization for Large Educational Campus",
    client: "CCISD",
    industry: "Education",
    logo: "/images/brands/ccisd.png",
    image: "/images/blog/blog-details-01.jpg",
    metrics: [
      { label: "Energy Savings", value: "35%" },
      { label: "Maintenance Costs", value: "-40%" },
      { label: "System Uptime", value: "99.9%" }
    ],
    summary: "How a large school district optimized their HVAC systems across multiple buildings.",
    challenges: [
      "Managing multiple buildings with different HVAC systems",
      "High energy costs during peak seasons",
      "Reactive maintenance approach"
    ],
    results: [
      "Centralized control system implementation",
      "Predictive maintenance program",
      "Significant cost reduction"
    ]
  },
  {
    title: "Healthcare Facility Temperature Control",
    client: "Regional Medical Center",
    industry: "Healthcare",
    logo: "/images/blog/post-01.jpg",
    image: "/images/blog/blog-details-02.jpg",
    metrics: [
      { label: "Temperature Accuracy", value: "±0.5°C" },
      { label: "Compliance Rate", value: "100%" },
      { label: "Response Time", value: "-60%" }
    ],
    summary: "Implementing precise temperature control for critical healthcare environments.",
    challenges: [
      "Strict regulatory requirements",
      "Critical environment control",
      "24/7 operation requirements"
    ],
    results: [
      "Automated compliance reporting",
      "Real-time monitoring system",
      "Improved patient comfort"
    ]
  }
];

export default function CaseStudies() {
  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Customer Success Stories
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See how leading organizations are transforming their HVAC and chiller management with MechDX
            </p>
          </div>

          {/* Case Studies Grid */}
          <div className="space-y-16">
            {caseStudies.map((study, index) => (
              <div 
                key={study.title}
                className="bg-white rounded-2xl overflow-hidden shadow-sm"
              >
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Image Section */}
                  <div className="relative h-64 md:h-full">
                    <Image
                      src={study.image}
                      alt={study.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Content Section */}
                  <div className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative w-16 h-8">
                        <Image
                          src={study.logo}
                          alt={study.client}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm text-gray-500">{study.industry}</h3>
                        <h2 className="text-xl font-semibold text-gray-900">{study.client}</h2>
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {study.title}
                    </h2>

                    <p className="text-gray-600 mb-6">
                      {study.summary}
                    </p>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {study.metrics.map((metric) => (
                        <div key={metric.label} className="text-center">
                          <div className="text-2xl font-bold text-[#0F62FE]">
                            {metric.value}
                          </div>
                          <div className="text-sm text-gray-500">
                            {metric.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Results Section */}
                <div className="border-t border-gray-100 px-8 py-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Challenges</h3>
                      <ul className="space-y-2">
                        {study.challenges.map((challenge) => (
                          <li key={challenge} className="text-gray-600 flex items-start gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-[#0F62FE] mt-2 flex-shrink-0" />
                            {challenge}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Results</h3>
                      <ul className="space-y-2">
                        {study.results.map((result) => (
                          <li key={result} className="text-gray-600 flex items-start gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-[#0F62FE] mt-2 flex-shrink-0" />
                            {result}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Transform Your HVAC Management?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Join these successful organizations and see how MechDX can help you optimize your operations.
            </p>
            <Button size="lg" asChild>
              <a href="/demo">Schedule a Demo</a>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
} 
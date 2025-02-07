import Image from 'next/image';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// This could be moved to a separate data file
const caseStudies = [
  {
    id: 1,
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
    ],
    fullDescription: `
      CCISD faced significant challenges in managing HVAC systems across their multiple campus buildings. 
      With rising energy costs and an inefficient maintenance approach, they needed a comprehensive solution 
      to optimize their operations.

      Using MechDX, they were able to implement a centralized control system that provided real-time 
      monitoring and predictive maintenance capabilities. This resulted in substantial cost savings and 
      improved system reliability.
    `,
    implementation: [
      "Initial system assessment and planning",
      "Phased deployment across buildings",
      "Staff training and handover",
      "Continuous monitoring and optimization"
    ],
    testimonial: {
      quote: "MechDX has transformed how we manage our HVAC systems. The cost savings and efficiency gains have been remarkable.",
      author: "John Smith",
      position: "Facilities Director",
      image: "/images/testimonials/john-smith.jpg"
    }
  },
  {
    id: 2,
    title: "Healthcare Facility Temperature Control",
    client: "Regional Medical Center",
    industry: "Healthcare",
    logo: "/images/brands/rmc.png",
    image: "/images/blog/blog-details-02.jpg",
    metrics: [
      { label: "Temperature Accuracy", value: "±0.5°C" },
      { label: "Compliance Rate", value: "100%" },
      { label: "Response Time", value: "-60%" }
    ],
    summary: "Implementing precise temperature control for critical healthcare environments.",
    challenges: [
      "Strict regulatory requirements for different medical areas",
      "Critical environment control for operating rooms",
      "24/7 operation requirements with zero downtime",
      "Complex compliance documentation needs"
    ],
    results: [
      "Automated compliance reporting system",
      "Real-time monitoring and alerts",
      "Improved patient comfort levels",
      "Significant energy cost reduction"
    ],
    fullDescription: `
      Regional Medical Center faced unique challenges in maintaining precise temperature control across 
      their various medical facilities, particularly in critical areas like operating rooms and 
      pharmaceutical storage. They needed a solution that could ensure compliance with strict healthcare 
      regulations while optimizing energy usage.

      By implementing MechDX's healthcare-specific HVAC management system, they were able to achieve 
      unprecedented levels of temperature accuracy and maintain perfect compliance records. The automated 
      monitoring and reporting system significantly reduced staff workload while improving response times 
      to any environmental changes.

      The system's predictive maintenance capabilities helped prevent any unexpected system failures, 
      ensuring continuous operation in critical care areas. This resulted in improved patient comfort 
      and significant energy savings without compromising on regulatory requirements.
    `,
    implementation: [
      "Comprehensive facility assessment and compliance review",
      "Custom configuration for different medical areas",
      "Integration with existing building management systems",
      "Staff training on new monitoring protocols",
      "Implementation of automated compliance reporting"
    ],
    testimonial: {
      quote: "MechDX has revolutionized how we manage our critical environments. The precision and reliability are exactly what we needed in healthcare.",
      author: "Dr. Sarah Johnson",
      position: "Director of Facilities",
      image: "/images/testimonials/sarah-johnson.jpg"
    }
  }
];

export default function CaseStudy({ params }: { params: { id: string } }) {
  const study = caseStudies[parseInt(params.id) - 1];
  
  if (!study) {
    return (
      <Layout>
        <div className="min-h-screen pt-32 text-center">
          <h1>Case Study Not Found</h1>
          <Link href="/case-studies">Back to Case Studies</Link>
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
              href="/case-studies"
              className="text-gray-600 hover:text-[#0F62FE] flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Case Studies
            </Link>
          </div>

          {/* Hero Section */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-8">
            <div className="relative h-[400px]">
              <Image
                src={study.image}
                alt={study.title}
                fill
                className="object-cover"
              />
            </div>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {study.title}
              </h1>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
              {/* Overview */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
                <p className="text-gray-600 whitespace-pre-line">
                  {study.fullDescription}
                </p>
              </div>

              {/* Implementation */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Implementation</h2>
                <ul className="space-y-4">
                  {study.implementation.map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0F62FE] text-white flex items-center justify-center text-sm">
                        {index + 1}
                      </div>
                      <span className="text-gray-600">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Results */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Results</h2>
                <div className="grid grid-cols-3 gap-6 mb-8">
                  {study.metrics.map((metric) => (
                    <div key={metric.label} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-3xl font-bold text-[#0F62FE]">
                        {metric.value}
                      </div>
                      <div className="text-sm text-gray-500">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>
                <ul className="space-y-3">
                  {study.results.map((result) => (
                    <li key={result} className="flex items-start gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#0F62FE] mt-2 flex-shrink-0" />
                      <span className="text-gray-600">{result}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Challenges */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Challenges</h2>
                <ul className="space-y-3">
                  {study.challenges.map((challenge) => (
                    <li key={challenge} className="flex items-start gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#0F62FE] mt-2 flex-shrink-0" />
                      <span className="text-gray-600">{challenge}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Testimonial */}
              <div className="bg-[#0F62FE] rounded-2xl p-8 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative h-12 w-12">
                    <Image
                      src={study.testimonial.image}
                      alt={study.testimonial.author}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{study.testimonial.author}</h3>
                    <p className="text-sm text-blue-200">{study.testimonial.position}</p>
                  </div>
                </div>
                <p className="italic text-blue-100">"{study.testimonial.quote}"</p>
              </div>

              {/* CTA */}
              <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Ready to achieve similar results?
                </h3>
                <Button size="lg" className="w-full" asChild>
                  <a href="/demo">Schedule a Demo</a>
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-16 flex justify-between items-center py-8 border-t border-gray-200">
            {study.id > 1 && (
              <Link 
                href={`/case-studies/${study.id - 1}`}
                className="text-gray-600 hover:text-[#0F62FE] flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous Case Study
              </Link>
            )}
            {study.id < caseStudies.length && (
              <Link 
                href={`/case-studies/${study.id + 1}`}
                className="text-gray-600 hover:text-[#0F62FE] flex items-center gap-2 ml-auto"
              >
                Next Case Study
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
} 
'use client';

import Layout from '@/components/Layout';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const sections = [
  {
    title: 'Acceptance of Terms',
    content: `By accessing and using MechDX's platform and services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing our services.`
  },
  {
    title: 'Use License',
    content: `Permission is granted to temporarily access and use MechDX's platform for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
    
    • Modify or copy the materials
    • Use the materials for any commercial purpose
    • Attempt to decompile or reverse engineer any software
    • Remove any copyright or other proprietary notations
    • Transfer the materials to another person or "mirror" the materials on any other server`
  },
  {
    title: 'Service Terms',
    content: `Our platform provides HVAC management and monitoring services. By using our services, you agree to:

    • Provide accurate and complete information
    • Maintain the security of your account credentials
    • Notify us immediately of any unauthorized access
    • Use the services only for their intended purpose
    • Comply with all applicable laws and regulations`
  },
  {
    title: 'Intellectual Property',
    content: `All content, features, and functionality of MechDX's platform, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, data compilations, and software, are the exclusive property of MechDX and protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.`
  },
  {
    title: 'Limitation of Liability',
    content: `MechDX shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:

    • Your access to or use of or inability to access or use the services
    • Any conduct or content of any third party on the services
    • Any content obtained from the services
    • Unauthorized access, use, or alteration of your transmissions or content`
  }
];

export default function Terms() {
  const lastUpdated = 'January 1, 2024';

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 pt-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link 
            href="/"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="mt-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Terms of Service
            </h1>
            <p className="mt-4 text-gray-600">
              Last updated: {lastUpdated}
            </p>
            <p className="mt-6 text-gray-600">
              Please read these Terms of Service carefully before using MechDX&apos;s platform and services.
            </p>
          </div>

          {/* Sections */}
          <div className="mt-12 space-y-12">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-xl font-semibold text-gray-900">
                  {section.title}
                </h2>
                <div 
                  className="mt-4 text-gray-600 prose prose-blue"
                  dangerouslySetInnerHTML={{ __html: section.content.replace(/\n\s*•/g, '<br/>•') }}
                />
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Contact Us
            </h2>
            <p className="mt-4 text-gray-600">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="mt-4 text-gray-600">
              <p>Email: legal@mechdx.com</p>
              <p>Address: 123 Business Avenue, Suite 100, New York, NY 10001</p>
              <p>Phone: +1 (555) 123-4567</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 
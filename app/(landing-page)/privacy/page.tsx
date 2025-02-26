'use client';

import Layout from '@/components/Layout';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const sections = [
  {
    title: 'Information We Collect',
    content: [
      'Personal information you provide to us',
      'Usage data and analytics',
      'Device and browser information',
      'Cookies and tracking technologies',
      'Information from third-party services'
    ]
  },
  {
    title: 'How We Use Your Information',
    content: [
      'Providing and improving our services',
      'Communicating with you about our services',
      'Analyzing usage patterns and trends',
      'Ensuring security and preventing fraud',
      'Complying with legal obligations'
    ]
  },
  {
    title: 'Data Storage and Security',
    content: [
      'Industry-standard security measures',
      'Data encryption in transit and at rest',
      'Regular security audits and assessments',
      'Employee access controls and training',
      'Incident response procedures'
    ]
  },
  {
    title: 'Your Rights and Choices',
    content: [
      'Accessing your personal information',
      'Correcting or updating your data',
      'Opting out of communications',
      'Requesting data deletion',
      'Data portability options'
    ]
  }
];

export default function Privacy() {
  const lastUpdated = 'January 1, 2024';

  return (
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
              Privacy Policy
            </h1>
            <p className="mt-4 text-gray-600">
              Last updated: {lastUpdated}
            </p>
            <p className="mt-6 text-gray-600">
              At MechDX, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform and services.
            </p>
          </div>

          {/* Sections */}
          <div className="mt-12 space-y-12">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-xl font-semibold text-gray-900">
                  {section.title}
                </h2>
                <ul className="mt-4 space-y-3">
                  {section.content.map((item) => (
                    <li 
                      key={item}
                      className="flex items-start"
                    >
                      <div className="h-1.5 w-1.5 mt-2 rounded-full bg-[#0F62FE] flex-shrink-0" />
                      <span className="ml-4 text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Contact Us
            </h2>
            <p className="mt-4 text-gray-600">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="mt-4 text-gray-600">
              <p>Email: privacy@mechdx.com</p>
              <p>Address: 123 Business Avenue, Suite 100, New York, NY 10001</p>
              <p>Phone: +1 (555) 123-4567</p>
            </div>
          </div>
        </div>
      </div>
  );
} 
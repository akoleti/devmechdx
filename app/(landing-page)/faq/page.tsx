'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

const categories = [
  {
    name: 'General',
    questions: [
      {
        question: 'What is MechDX?',
        answer: 'MechDX is an intelligent HVAC and chiller management platform that helps organizations optimize their cooling systems, reduce energy costs, and improve operational efficiency through AI-powered monitoring and predictive maintenance.'
      },
      {
        question: 'How does MechDX help reduce energy costs?',
        answer: 'MechDX uses advanced analytics and machine learning to optimize HVAC operations, automatically adjusting settings based on occupancy, weather, and usage patterns. Our customers typically see 20-35% reduction in energy costs.'
      },
      {
        question: 'Is MechDX suitable for my business size?',
        answer: 'MechDX scales to businesses of all sizes. We offer different plans tailored to various needs, from single-building operations to large multi-site enterprises.'
      }
    ]
  },
  {
    name: 'Technical',
    questions: [
      {
        question: 'What types of HVAC systems does MechDX support?',
        answer: 'MechDX supports a wide range of HVAC and chiller systems, including central plants, VRF systems, packaged units, and split systems. We integrate with most major manufacturers and building automation systems.'
      },
      {
        question: 'How is data collected from our systems?',
        answer: 'MechDX collects data through secure IoT sensors and direct integration with your building management system (BMS). All data is encrypted and transmitted securely to our cloud platform.'
      },
      {
        question: 'What kind of maintenance predictions can the system make?',
        answer: 'Our AI analyzes performance data to predict potential failures before they occur, identify efficiency degradation, and recommend preventive maintenance actions. This includes predictions for component failures, efficiency losses, and maintenance scheduling.'
      }
    ]
  },
  {
    name: 'Implementation',
    questions: [
      {
        question: 'How long does implementation typically take?',
        answer: 'Implementation time varies based on your facility size and system complexity. Typical deployments range from 2-4 weeks for single buildings to 2-3 months for large enterprises. Our team handles the entire process.'
      },
      {
        question: 'Do you provide training for our staff?',
        answer: 'Yes, comprehensive training is included with every implementation. We provide both on-site and online training sessions, along with ongoing support and documentation.'
      },
      {
        question: 'Can MechDX integrate with our existing systems?',
        answer: 'Yes, MechDX is designed to integrate with most building management systems, maintenance software, and enterprise systems through our API and standard protocols like BACnet and Modbus.'
      }
    ]
  },
  {
    name: 'Support & Security',
    questions: [
      {
        question: 'What kind of support do you provide?',
        answer: 'We offer 24/7 technical support for critical issues, regular business hours support for standard inquiries, and dedicated account management for enterprise customers.'
      },
      {
        question: 'How do you handle data security?',
        answer: 'MechDX employs enterprise-grade security measures including end-to-end encryption, regular security audits, and compliance with industry standards. All data is stored in secure, redundant data centers.'
      },
      {
        question: 'What happens if there\'s a system failure?',
        answer: 'Our platform includes automated failover systems and redundancy. In case of any issues, our 24/7 support team is immediately notified and can assist with resolution.'
      }
    ]
  }
];

export default function FAQ() {
  const [openCategory, setOpenCategory] = useState<string>('General');
  const [openQuestions, setOpenQuestions] = useState<string[]>([]);

  const toggleQuestion = (question: string) => {
    setOpenQuestions(prev => 
      prev.includes(question)
        ? prev.filter(q => q !== question)
        : [...prev, question]
    );
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Everything you need to know about MechDX and HVAC management
            </p>
          </div>

          {/* Category Tabs */}
          <div className="mt-16 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setOpenCategory(category.name)}
                  className={cn(
                    "whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm",
                    openCategory === category.name
                      ? "border-[#0F62FE] text-[#0F62FE]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  {category.name}
                </button>
              ))}
            </nav>
          </div>

          {/* FAQ List */}
          <div className="mt-8 space-y-6">
            {categories
              .find(cat => cat.name === openCategory)
              ?.questions.map((item) => (
                <div
                  key={item.question}
                  className="bg-white rounded-2xl shadow-sm"
                >
                  <button
                    onClick={() => toggleQuestion(item.question)}
                    className="w-full text-left px-6 py-4 flex justify-between items-center"
                  >
                    <h3 className="text-lg font-medium text-gray-900">
                      {item.question}
                    </h3>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 text-gray-500 transition-transform",
                        openQuestions.includes(item.question) && "transform rotate-180"
                      )}
                    />
                  </button>
                  {openQuestions.includes(item.question) && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-600">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-16 text-center bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Still have questions?
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Can't find the answer you're looking for? Our team is here to help with any specific questions about our platform.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#0F62FE] hover:bg-[#0F62FE]/90"
              >
                Contact Support
              </a>
              <a
                href="/demo"
                className="inline-flex items-center justify-center px-6 py-3 border border-[#0F62FE] text-base font-medium rounded-md text-[#0F62FE] bg-white hover:bg-[#0F62FE]/10"
              >
                Request Demo
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 
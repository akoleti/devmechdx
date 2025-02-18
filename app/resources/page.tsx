'use client';

import Layout from '@/components/Layout';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Download, BookOpen, FileSpreadsheet, Wrench } from 'lucide-react';

const resources = {
  whitepapers: [
    {
      title: 'The Future of HVAC Management',
      description: 'Explore emerging trends and technologies in HVAC systems',
      image: '/images/resources/whitepaper-future.jpg',
      downloadLink: '/resources/whitepapers/future-hvac.pdf',
      readTime: '15 min read'
    },
    {
      title: 'Energy Optimization Strategies',
      description: 'Comprehensive guide to reducing HVAC energy consumption',
      image: '/images/resources/whitepaper-energy.jpg',
      downloadLink: '/resources/whitepapers/energy-optimization.pdf',
      readTime: '20 min read'
    }
  ],
  technicalGuides: [
    {
      title: 'IoT Sensor Implementation Guide',
      description: 'Step-by-step guide for sensor deployment',
      category: 'Technical',
      downloadLink: '/resources/guides/iot-sensors.pdf',
      pages: 25
    },
    {
      title: 'API Integration Manual',
      description: 'Complete API documentation and integration steps',
      category: 'Development',
      downloadLink: '/resources/guides/api-manual.pdf',
      pages: 45
    },
    {
      title: 'Data Analysis Handbook',
      description: 'Understanding HVAC analytics and reporting',
      category: 'Analytics',
      downloadLink: '/resources/guides/analytics.pdf',
      pages: 30
    }
  ],
  templates: [
    {
      title: 'Maintenance Schedule Template',
      description: 'Customizable maintenance planning spreadsheet',
      format: 'Excel',
      downloadLink: '/resources/templates/maintenance-schedule.xlsx'
    },
    {
      title: 'ROI Calculator',
      description: 'Calculate potential savings and return on investment',
      format: 'Excel',
      downloadLink: '/resources/templates/roi-calculator.xlsx'
    },
    {
      title: 'System Audit Checklist',
      description: 'Comprehensive HVAC system audit template',
      format: 'PDF',
      downloadLink: '/resources/templates/audit-checklist.pdf'
    }
  ],
  tools: [
    {
      title: 'Energy Cost Calculator',
      description: 'Calculate potential energy savings',
      type: 'Web Tool',
      link: '/tools/energy-calculator'
    },
    {
      title: 'System Size Calculator',
      description: 'Determine optimal HVAC system size',
      type: 'Web Tool',
      link: '/tools/system-calculator'
    }
  ]
};

export default function Resources() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Resources
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Access our library of resources to optimize your HVAC management
            </p>
          </div>

          {/* Search */}
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search resources..."
                className="pl-10"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Whitepapers */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900">Whitepapers</h2>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              {resources.whitepapers.map((paper) => (
                <div
                  key={paper.title}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm"
                >
                  <div className="relative h-48">
                    <Image
                      src={paper.image}
                      alt={paper.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {paper.title}
                    </h3>
                    <p className="mt-2 text-gray-600">
                      {paper.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {paper.readTime}
                      </span>
                      <Button asChild>
                        <a href={paper.downloadLink} download>
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Guides */}
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-gray-900">Technical Guides</h2>
            <div className="mt-8 grid gap-6">
              {resources.technicalGuides.map((guide) => (
                <div
                  key={guide.title}
                  className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between"
                >
                  <div className="flex items-center gap-6">
                    <div className="p-3 rounded-lg bg-[#0F62FE]/10">
                      <BookOpen className="h-6 w-6 text-[#0F62FE]" />
                    </div>
                    <div>
                      <span className="text-sm text-[#0F62FE] font-medium">
                        {guide.category}
                      </span>
                      <h3 className="text-lg font-medium text-gray-900">
                        {guide.title}
                      </h3>
                      <p className="text-gray-600">
                        {guide.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                      {guide.pages} pages
                    </span>
                    <Button variant="outline" asChild>
                      <a href={guide.downloadLink} download>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Templates & Tools */}
          <div className="mt-20 grid gap-20 md:grid-cols-2">
            {/* Templates */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Templates</h2>
              <div className="mt-8 space-y-6">
                {resources.templates.map((template) => (
                  <div
                    key={template.title}
                    className="bg-white rounded-xl p-6 shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-[#0F62FE]/10">
                        <FileSpreadsheet className="h-6 w-6 text-[#0F62FE]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {template.title}
                        </h3>
                        <p className="text-gray-600">
                          {template.description}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {template.format} file
                      </span>
                      <Button variant="outline" asChild>
                        <a href={template.downloadLink} download>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tools */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Online Tools</h2>
              <div className="mt-8 space-y-6">
                {resources.tools.map((tool) => (
                  <div
                    key={tool.title}
                    className="bg-white rounded-xl p-6 shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-[#0F62FE]/10">
                        <Wrench className="h-6 w-6 text-[#0F62FE]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {tool.title}
                        </h3>
                        <p className="text-gray-600">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                    <Button className="mt-4 w-full" asChild>
                      <a href={tool.link}>
                        Launch Tool
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 
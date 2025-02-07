'use client';

import Layout from '@/components/Layout';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, PlayCircle, Clock, BookOpen } from 'lucide-react';

const tutorials = {
  featured: {
    title: "Getting Started with MechDX",
    duration: "45 min",
    level: "Beginner",
    description: "Complete walkthrough of MechDX platform setup and basic features",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    chapters: [
      "Platform Overview",
      "Initial Setup",
      "Basic Configuration",
      "First Monitoring Setup"
    ]
  },
  categories: [
    {
      name: "Basic Tutorials",
      tutorials: [
        {
          title: "HVAC System Setup",
          duration: "20 min",
          level: "Beginner",
          description: "Learn how to set up your first HVAC system",
          image: "https://images.unsplash.com/photo-1581091226825-c6a2a5aee158"
        },
        {
          title: "Sensor Configuration",
          duration: "15 min",
          level: "Beginner",
          description: "Configure and connect IoT sensors",
          image: "https://images.unsplash.com/photo-1581091226825-c6a2a5aee158"
        }
      ]
    },
    {
      name: "Advanced Features",
      tutorials: [
        {
          title: "Predictive Analytics",
          duration: "30 min",
          level: "Advanced",
          description: "Deep dive into predictive maintenance features",
          image: "https://images.unsplash.com/photo-1581091226825-c6a2a5aee158"
        },
        {
          title: "Custom Reporting",
          duration: "25 min",
          level: "Intermediate",
          description: "Create customized reports and dashboards",
          image: "https://images.unsplash.com/photo-1581091226825-c6a2a5aee158"
        }
      ]
    },
    {
      name: "Integration Guides",
      tutorials: [
        {
          title: "BMS Integration",
          duration: "35 min",
          level: "Advanced",
          description: "Connect with building management systems",
          image: "https://images.unsplash.com/photo-1581091226825-c6a2a5aee158"
        },
        {
          title: "API Implementation",
          duration: "40 min",
          level: "Advanced",
          description: "Implement MechDX API in your systems",
          image: "https://images.unsplash.com/photo-1581091226825-c6a2a5aee158"
        }
      ]
    }
  ]
};

export default function Tutorials() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Video Tutorials
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Step-by-step guides to help you master MechDX
            </p>
          </div>

          {/* Search */}
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search tutorials..."
                className="pl-10"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Featured Tutorial */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900">Featured Tutorial</h2>
            <div className="mt-8">
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="grid md:grid-cols-2">
                  <div className="relative">
                    <div className="relative h-full">
                      <Image
                        src={tutorials.featured.image}
                        alt={tutorials.featured.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <PlayCircle className="h-16 w-16 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {tutorials.featured.duration}
                      </div>
                      <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-600">
                        {tutorials.featured.level}
                      </span>
                    </div>
                    <h3 className="mt-4 text-2xl font-bold text-gray-900">
                      {tutorials.featured.title}
                    </h3>
                    <p className="mt-2 text-gray-600">
                      {tutorials.featured.description}
                    </p>
                    <div className="mt-6">
                      <h4 className="font-medium text-gray-900">Chapters:</h4>
                      <ul className="mt-2 space-y-2">
                        {tutorials.featured.chapters.map((chapter, index) => (
                          <li key={chapter} className="flex items-center gap-2 text-gray-600">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">
                              {index + 1}
                            </span>
                            {chapter}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button className="mt-8 w-full">
                      Start Tutorial
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tutorial Categories */}
          {tutorials.categories.map((category) => (
            <div key={category.name} className="mt-20">
              <h2 className="text-2xl font-bold text-gray-900">
                {category.name}
              </h2>
              <div className="mt-8 grid gap-8 md:grid-cols-2">
                {category.tutorials.map((tutorial) => (
                  <div
                    key={tutorial.title}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="relative h-48">
                      <Image
                        src={tutorial.image}
                        alt={tutorial.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <PlayCircle className="h-12 w-12 text-white" />
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          {tutorial.duration}
                        </div>
                        <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-600 text-sm">
                          {tutorial.level}
                        </span>
                      </div>
                      <h3 className="mt-4 text-xl font-semibold text-gray-900">
                        {tutorial.title}
                      </h3>
                      <p className="mt-2 text-gray-600">
                        {tutorial.description}
                      </p>
                      <Button className="mt-6 w-full">
                        Watch Tutorial
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Learning Path CTA */}
          <div className="mt-20 bg-[#0F62FE] rounded-2xl p-8 text-white">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold">Learning Path</h2>
                <p className="mt-2 text-blue-100">
                  Follow our structured learning path to become a MechDX expert
                </p>
                <Button 
                  variant="secondary"
                  className="mt-6 bg-white text-[#0F62FE] hover:bg-blue-50"
                >
                  View Learning Path
                </Button>
              </div>
              <BookOpen className="h-12 w-12 text-blue-100" />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 
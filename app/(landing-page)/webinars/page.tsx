'use client';

import Layout from '@/components/Layout';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users } from 'lucide-react';

const webinars = {
  upcoming: [
    {
      id: 1,
      title: 'Advanced HVAC Energy Optimization Strategies',
      date: 'Feb 15, 2024',
      time: '2:00 PM EST',
      duration: '60 min',
      speakers: [
        {
          name: 'Dr. Sarah Chen',
          role: 'Energy Efficiency Expert',
          avatar: '/images/team/sarah-chen.jpg'
        }
      ],
      description: 'Learn cutting-edge techniques for optimizing HVAC energy consumption using AI and predictive analytics.',
      image: '/images/webinars/energy-optimization.jpg',
      attendees: 156
    },
    // Add more upcoming webinars...
  ],
  recorded: [
    {
      id: 101,
      title: 'Predictive Maintenance Best Practices',
      date: 'Jan 10, 2024',
      duration: '55 min',
      speakers: [
        {
          name: 'Michael Rodriguez',
          role: 'Technical Director',
          avatar: '/images/team/michael-rodriguez.jpg'
        }
      ],
      description: 'A comprehensive guide to implementing predictive maintenance for HVAC systems.',
      image: '/images/webinars/predictive-maintenance.jpg',
      views: 1240
    },
    // Add more recorded webinars...
  ]
};

export default function Webinars() {
  return (
      <div className="min-h-screen bg-gray-50 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              HVAC Expert Webinars
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Join live sessions or watch recordings from industry experts
            </p>
          </div>

          {/* Upcoming Webinars */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900">
              Upcoming Webinars
            </h2>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              {webinars.upcoming.map((webinar) => (
                <div
                  key={webinar.id}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden"
                >
                  <div className="relative h-48">
                    <Image
                      src={webinar.image}
                      alt={webinar.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {webinar.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {webinar.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {webinar.attendees} registered
                      </div>
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-gray-900">
                      {webinar.title}
                    </h3>
                    <p className="mt-2 text-gray-600">
                      {webinar.description}
                    </p>
                    <div className="mt-6 flex items-center gap-4">
                      {webinar.speakers.map((speaker) => (
                        <div key={speaker.name} className="flex items-center gap-3">
                          <div className="relative h-10 w-10">
                            <Image
                              src={speaker.avatar}
                              alt={speaker.name}
                              fill
                              className="rounded-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {speaker.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {speaker.role}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button className="mt-6 w-full">
                      Register Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recorded Webinars */}
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-gray-900">
              Recorded Sessions
            </h2>
            <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {webinars.recorded.map((webinar) => (
                <div
                  key={webinar.id}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden"
                >
                  <div className="relative h-48">
                    <Image
                      src={webinar.image}
                      alt={webinar.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Button variant="outline" className="text-white border-white hover:bg-white/20">
                        Watch Now
                      </Button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{webinar.date}</span>
                      <span>{webinar.duration}</span>
                    </div>
                    <h3 className="mt-2 text-lg font-semibold text-gray-900">
                      {webinar.title}
                    </h3>
                    <p className="mt-2 text-gray-600 line-clamp-2">
                      {webinar.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="relative h-8 w-8">
                          <Image
                            src={webinar.speakers[0].avatar}
                            alt={webinar.speakers[0].name}
                            fill
                            className="rounded-full object-cover"
                          />
                        </div>
                        <span className="text-sm text-gray-600">
                          {webinar.speakers[0].name}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {webinar.views} views
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 bg-[#0F62FE] rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold">Host a Custom Webinar</h2>
            <p className="mt-2 text-blue-100 max-w-2xl mx-auto">
              Want a personalized session for your team? We can organize custom webinars tailored to your specific HVAC needs.
            </p>
            <Button 
              variant="secondary" 
              size="lg" 
              className="mt-6 bg-white text-[#0F62FE] hover:bg-blue-50"
            >
              Request Custom Webinar
            </Button>
          </div>
        </div>
      </div>
  );
} 
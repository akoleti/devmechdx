'use client';

import Layout from '@/components/Layout';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Users, Target, Shield, Lightbulb, Award, Building2 } from 'lucide-react';

const stats = [
  { label: 'Clients Worldwide', value: '500+' },
  { label: 'Energy Saved Annually', value: '30M kWh' },
  { label: 'Team Members', value: '100+' },
  { label: 'Countries Served', value: '25+' }
];

const values = [
  {
    icon: Target,
    title: 'Innovation First',
    description: 'Continuously pushing the boundaries of HVAC technology'
  },
  {
    icon: Shield,
    title: 'Reliability',
    description: 'Delivering consistent and dependable solutions'
  },
  {
    icon: Users,
    title: 'Customer Focus',
    description: 'Putting our clients needs at the center of everything'
  },
  {
    icon: Lightbulb,
    title: 'Sustainability',
    description: 'Committed to environmental responsibility'
  }
];

const leadership = [
  {
    name: 'Sarah Chen',
    role: 'Chief Executive Officer',
    image: '/images/team/sarah-chen.jpg',
    bio: 'Former VP of Operations at Siemens Building Technologies'
  },
  {
    name: 'Michael Rodriguez',
    role: 'Chief Technology Officer',
    image: '/images/team/michael-rodriguez.jpg',
    bio: '15+ years experience in IoT and building automation'
  },
  {
    name: 'Emily Thompson',
    role: 'Head of Product',
    image: '/images/team/emily-thompson.jpg',
    bio: 'Led product teams at Johnson Controls and Honeywell'
  }
];

const milestones = [
  {
    year: '2018',
    title: 'Company Founded',
    description: 'MechDX was established with a vision to revolutionize HVAC management'
  },
  {
    year: '2019',
    title: 'First Enterprise Client',
    description: 'Partnered with leading commercial real estate firm'
  },
  {
    year: '2020',
    title: 'AI Platform Launch',
    description: 'Released our flagship AI-powered predictive maintenance platform'
  },
  {
    year: '2022',
    title: 'Global Expansion',
    description: 'Opened offices in Europe and Asia to serve international clients'
  }
];

export default function About() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Revolutionizing HVAC Management
            </h1>
            <p className="mt-6 text-xl text-gray-600">
              We're on a mission to make buildings smarter, more efficient, and sustainable through innovative HVAC management solutions.
            </p>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-2xl p-8 text-center shadow-sm"
              >
                <div className="text-3xl font-bold text-[#0F62FE]">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Mission */}
          <div className="mt-32">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Our Mission
                </h2>
                <p className="mt-6 text-lg text-gray-600">
                  At MechDX, we're dedicated to transforming how buildings manage their HVAC systems. Through innovative technology and data-driven solutions, we help organizations reduce energy consumption, lower operational costs, and create more comfortable environments.
                </p>
                <p className="mt-4 text-lg text-gray-600">
                  Our commitment to sustainability drives us to develop solutions that not only benefit our clients but also contribute to a greener future.
                </p>
              </div>
              <div className="relative h-96 rounded-2xl overflow-hidden">
                <Image
                  src="/images/about/mission.jpg"
                  alt="Our Mission"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="mt-32">
            <h2 className="text-3xl font-bold text-gray-900 text-center">
              Our Values
            </h2>
            <div className="mt-12 grid gap-8 md:grid-cols-4">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="bg-white rounded-2xl p-8 shadow-sm text-center"
                >
                  <div className="inline-flex p-3 rounded-lg bg-[#0F62FE]/10">
                    <value.icon className="h-6 w-6 text-[#0F62FE]" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-gray-900">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-gray-600">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Leadership */}
          <div className="mt-32">
            <h2 className="text-3xl font-bold text-gray-900 text-center">
              Our Leadership
            </h2>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {leadership.map((member) => (
                <div
                  key={member.name}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm"
                >
                  <div className="relative h-80">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {member.name}
                    </h3>
                    <p className="mt-1 text-[#0F62FE] font-medium">
                      {member.role}
                    </p>
                    <p className="mt-4 text-gray-600">
                      {member.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Milestones */}
          <div className="mt-32">
            <h2 className="text-3xl font-bold text-gray-900 text-center">
              Our Journey
            </h2>
            <div className="mt-12 relative">
              <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gray-200" />
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div
                    key={milestone.year}
                    className={`relative flex items-center ${
                      index % 2 === 0 ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    <div className="flex items-center w-1/2">
                      <div
                        className={`bg-white rounded-2xl p-6 shadow-sm ${
                          index % 2 === 0 ? 'mr-8' : 'ml-8'
                        }`}
                      >
                        <div className="text-[#0F62FE] font-bold">
                          {milestone.year}
                        </div>
                        <h3 className="mt-2 text-lg font-semibold text-gray-900">
                          {milestone.title}
                        </h3>
                        <p className="mt-2 text-gray-600">
                          {milestone.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-32 bg-[#0F62FE] rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold">Join Our Team</h2>
            <p className="mt-4 text-xl text-blue-100 max-w-2xl mx-auto">
              We're always looking for talented individuals who share our passion for innovation and sustainability
            </p>
            <Button 
              variant="secondary"
              size="lg"
              className="mt-8 bg-white text-[#0F62FE] hover:bg-blue-50"
            >
              View Open Positions
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
} 
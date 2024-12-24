import { 
  Factory, 
  HardHat, 
  Heart, 
  Building2, 
  Truck, 
  Zap, 
  Server, 
  Building, 
  GraduationCap, 
  Hotel 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const industries = [
  {
    name: 'Commercial Buildings',
    icon: Building2,
    description: 'Optimize HVAC systems in office buildings and retail spaces',
    useCases: [
      'Multi-zone temperature control',
      'Energy cost reduction',
      'Tenant comfort management'
    ],
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    name: 'Data Centers',
    icon: Server,
    description: 'Critical cooling system management for IT infrastructure',
    useCases: [
      'Precision cooling control',
      '24/7 environment monitoring',
      'Redundancy management'
    ],
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    name: 'Healthcare Facilities',
    icon: Building,
    description: 'Maintain strict environmental controls for medical facilities',
    useCases: [
      'Operating room HVAC control',
      'Clean room management',
      'Compliance monitoring'
    ],
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
  },
  {
    name: 'Industrial Plants',
    icon: Factory,
    description: 'Process cooling and industrial HVAC management',
    useCases: [
      'Process chiller optimization',
      'Industrial cooling systems',
      'Heat recovery management'
    ],
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-600',
  },
  {
    name: 'Educational Institutions',
    icon: GraduationCap,
    description: 'Campus-wide HVAC management and optimization',
    useCases: [
      'Classroom comfort control',
      'Schedule-based optimization',
      'Energy efficiency programs'
    ],
    bgColor: 'bg-red-50',
    iconColor: 'text-red-600',
  },
  {
    name: 'Hotels Resorts',
    icon: Hotel,
    description: 'Guest comfort and energy efficiency management',
    useCases: [
      'Guest room automation',
      'Common area control',
      'Peak load management'
    ],
    bgColor: 'bg-teal-50',
    iconColor: 'text-teal-600',
  },
];

const IndustrySolutions = () => {
  return (
    <section id="industries" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Industry Solutions
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Tailored maintenance solutions for every industry, designed to meet your specific needs.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry) => (
            <div
              key={industry.name}
              className="relative overflow-hidden rounded-2xl transition-all hover:shadow-lg"
            >
              <div className={cn("p-8", industry.bgColor)}>
                <div className="flex items-center gap-4">
                  <div className={cn("p-2 rounded-lg", industry.bgColor)}>
                    <industry.icon className={cn("h-6 w-6", industry.iconColor)} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {industry.name}
                  </h3>
                </div>
                
                <p className="mt-4 text-gray-600">
                  {industry.description}
                </p>

                <div className="mt-6 space-y-4">
                  {industry.useCases.map((useCase, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={cn("h-1.5 w-1.5 mt-2 rounded-full", industry.iconColor)} />
                      <span className="text-sm text-gray-600">{useCase}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <a 
                    href={`/industries/${industry.name.replaceAll(' ','-').replaceAll('&','').toLowerCase()}`}
                    className={cn(
                      "inline-flex items-center text-sm font-medium",
                      industry.iconColor
                    )}
                  >
                    Learn more
                    <svg
                      className="ml-2 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IndustrySolutions; 
import { 
  Settings, 
  Calendar, 
  ClipboardList, 
  PackageSearch, 
  BarChart2, 
  Smartphone,
  Thermometer,
  Gauge,
  Activity,
  ShieldCheck
} from 'lucide-react';

const features = [
  {
    name: 'HVAC Monitoring',
    description: 'Real-time monitoring of temperature, humidity, and air quality across all zones',
    benefits: 'Optimize comfort and efficiency',
    icon: Thermometer,
  },
  {
    name: 'Chiller Management',
    description: 'Advanced chiller performance tracking and optimization',
    benefits: 'Reduce energy consumption',
    icon: Gauge,
  },
  {
    name: 'Predictive Maintenance',
    description: 'AI-powered fault detection and maintenance scheduling',
    benefits: 'Prevent system failures',
    icon: Activity,
  },
  {
    name: 'Energy Analytics',
    description: 'Detailed energy consumption analysis and optimization',
    benefits: 'Lower operating costs',
    icon: BarChart2,
  },
  {
    name: 'Compliance Management',
    description: 'Automated compliance tracking and reporting',
    benefits: 'Meet regulatory requirements',
    icon: ShieldCheck,
  },
  {
    name: 'Mobile Control',
    description: 'Remote system access and control from any device',
    benefits: 'Respond quickly to issues',
    icon: Smartphone,
  },
];

const KeyFeatures = () => {
  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Powerful Features for Equipment Management
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Everything you need to manage your equipment efficiently and effectively,
            all in one platform.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="relative group bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all"
            >
              <div className="absolute -inset-px bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="inline-flex items-center justify-center p-2 bg-blue-600/10 rounded-lg">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mt-6 text-xl font-semibold leading-7 tracking-tight text-gray-900">
                  {feature.name}
                </h3>
                <p className="mt-2 text-base leading-7 text-gray-600">
                  {feature.description}
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                  <p className="text-sm leading-6 text-blue-600">
                    {feature.benefits}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures; 
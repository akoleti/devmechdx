import { 
  Cloud, 
  Smartphone, 
  Shield, 
  Code2, 
  Database,
  CheckCircle2,
  Building,
  Wifi,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const integrations = [
  {
    category: 'Building Management Systems',
    icon: Building,
    features: [
      'BACnet Integration',
      'Modbus Support',
      'Johnson Controls',
      'Siemens Building Tech',
      'Schneider Electric'
    ]
  },
  {
    category: 'IoT Sensors',
    icon: Wifi,
    features: [
      'Temperature Sensors',
      'Humidity Sensors',
      'Pressure Sensors',
      'Power Meters',
      'Air Quality Monitors'
    ]
  },
  {
    category: 'Control Systems',
    icon: Settings,
    features: [
      'VFD Integration',
      'PLC Systems',
      'Smart Thermostats',
      'VAV Controllers',
      'Chiller Controls'
    ]
  },
  {
    category: 'Security & Access',
    icon: Shield,
    features: [
      'Role-Based Access',
      'Audit Logging',
      'Data Encryption',
      'API Security',
      'Compliance Tools'
    ]
  }
];

const apiFeatures = [
  'RESTful API Access',
  'GraphQL Support',
  'Webhook Integration',
  'Real-time WebSocket API',
  'Comprehensive API Documentation',
  'Developer SDK & Tools'
];

const Integrations = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Enterprise-Grade Integration & Compatibility
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Seamlessly integrate MechDX with your existing systems and workflows
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2">
          {integrations.map((integration) => (
            <div
              key={integration.category}
              className="relative bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <integration.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {integration.category}
                </h3>
              </div>

              <ul className="space-y-4">
                {integration.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* API Section */}
        <div className="mt-16 bg-blue-600 rounded-2xl p-8 text-white">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-2 bg-white/10 rounded-lg">
              <Code2 className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold">
              Developer-Friendly API
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-blue-100 mb-6">
                Build custom integrations and extend MechDX functionality with our comprehensive API suite.
              </p>
              <ul className="space-y-4">
                {apiFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-blue-300 mt-0.5 flex-shrink-0" />
                    <span className="text-blue-100">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col justify-center">
              <div className="bg-blue-700 rounded-lg p-6">
                <pre className="text-blue-100 text-sm overflow-x-auto">
                  <code>{`// Example API Request
fetch('https://api.mechdx.com/v1/equipment', {
  headers: {
    'Authorization': 'Bearer ${'{token}'}',
    'Content-Type': 'application/json'
  }
})`}</code>
                </pre>
              </div>
              <div className="mt-6 flex justify-center">
                <Button 
                  variant="secondary" 
                  className="bg-white text-blue-600 hover:bg-blue-50"
                  asChild
                >
                  <a href="/developers">
                    View API Documentation
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Integration CTA */}
        <div className="mt-16 text-center">
          <Button asChild>
            <a href="/contact" className="gap-2">
              Schedule Integration Consultation
              <svg
                className="h-4 w-4"
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
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Integrations; 
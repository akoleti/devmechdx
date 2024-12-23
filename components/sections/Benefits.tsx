import { 
  Thermometer, 
  Timer, 
  TrendingDown, 
  Gauge, 
  ShieldCheck, 
  Activity, 
  ArrowUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

const benefits = [
  {
    name: 'Energy Efficiency',
    description: 'Optimize HVAC & chiller performance to reduce energy consumption',
    metric: '30%',
    metricLabel: 'Energy cost reduction',
    icon: TrendingDown,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    name: 'Temperature Control',
    description: 'Maintain precise temperature control across all zones',
    metric: '±0.5°C',
    metricLabel: 'Temperature accuracy',
    icon: Thermometer,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    name: 'System Uptime',
    description: 'Prevent breakdowns with predictive maintenance',
    metric: '99.9%',
    metricLabel: 'System availability',
    icon: Timer,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    name: 'Performance Monitoring',
    description: 'Track COP, kW/ton, and other critical metrics in real-time',
    metric: '24/7',
    metricLabel: 'Continuous monitoring',
    icon: Gauge,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  {
    name: 'Compliance Management',
    description: 'Meet regulatory requirements for HVAC maintenance and operations',
    metric: '100%',
    metricLabel: 'Compliance rate',
    icon: ShieldCheck,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
  },
  {
    name: 'Fault Detection',
    description: 'Early detection of system anomalies and performance issues',
    metric: '-75%',
    metricLabel: 'Response time',
    icon: Activity,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
];

const Benefits = () => {
  return (
    <section id="benefits" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Why Choose MechDX for HVAC & Chillers?
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Optimize your HVAC and chiller systems with intelligent monitoring and management
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <div
              key={benefit.name}
              className="relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <div className={cn("p-2 rounded-lg", benefit.bgColor)}>
                  <benefit.icon className={cn("h-6 w-6", benefit.color)} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {benefit.name}
                </h3>
              </div>

              <p className="mt-4 text-gray-600">
                {benefit.description}
              </p>

              <div className="mt-6 flex items-baseline gap-2">
                <span className={cn("text-4xl font-bold", benefit.color)}>
                  {benefit.metric}
                </span>
                <span className="text-sm text-gray-500">
                  {benefit.metricLabel}
                </span>
              </div>

              <div className="mt-6">
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={cn(
                      "h-2 rounded-full transition-all duration-1000",
                      benefit.color.replace('text', 'bg')
                    )}
                    style={{
                      width: benefit.metric.includes('%') 
                        ? benefit.metric.replace('-', '') 
                        : '100%'
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Success Stories Link */}
        <div className="mt-16 text-center">
          <a
            href="/case-studies"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            View HVAC Success Stories
            <ArrowUp className="ml-2 h-4 w-4 rotate-45" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Benefits; 
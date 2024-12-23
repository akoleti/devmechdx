import Image from 'next/image';
import Link from 'next/link';
import DashboardPreview from './DashboardPreview';

const stats = [
  { id: 1, name: 'Buildings Managed', value: '1000+' },
  { id: 2, name: 'HVAC Systems', value: '5000+' },
  { id: 3, name: 'Energy Savings', value: '30%' },
  { id: 4, name: 'System Uptime', value: '99.9%' },
];

const HeroSection = () => {
  return (
    <div id="home" className="relative isolate overflow-hidden bg-white">
      <svg
        className="absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
            width={200}
            height={200}
            x="50%"
            y={-1}
            patternUnits="userSpaceOnUse"
          >
            <path d="M100 200V.5M.5 .5H200" fill="none" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" strokeWidth={0} fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)" />
      </svg>
      
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
          <div className="mt-24 sm:mt-32 lg:mt-16">
            <a href="/demo" className="inline-flex space-x-6">
              <span className="rounded-full bg-blue-600/10 px-3 py-1 text-sm font-semibold leading-6 text-blue-600 ring-1 ring-inset ring-blue-600/10">
                What's new
              </span>
              <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-600">
                <span>New AI-powered HVAC Analytics</span>
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </span>
            </a>
          </div>
          
          <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Intelligent HVAC & Chiller Management
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Optimize your HVAC and chiller systems with AI-powered monitoring, predictive maintenance, 
            and real-time performance analytics. Reduce energy costs and improve comfort levels.
          </p>
          
          <div className="mt-10 flex items-center gap-x-6">
            <Link
              href="/demo"
              className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Get started
            </Link>
            <Link href="/about" className="text-sm font-semibold leading-6 text-gray-900">
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.id} className="border-l border-gray-200 pl-6">
                <div className="text-2xl font-bold tracking-tight text-blue-600">{stat.value}</div>
                <div className="text-sm font-medium leading-6 text-gray-600">{stat.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <div className="rounded-md shadow-2xl ring-1 ring-gray-200">
              <DashboardPreview />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection; 
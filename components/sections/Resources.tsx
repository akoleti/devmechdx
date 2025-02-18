import { 
  BookOpen, 
  PlayCircle, 
  FileText, 
  Newspaper, 
  Video, 
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';



const resources = [
  {
    title: 'Blog & News',
    description: 'Latest industry insights, updates, and best practices',
    icon: Newspaper,
    items: [
      { title: 'Predictive Maintenance in 2024', date: 'Jan 15, 2024' },
      { title: 'IoT in Equipment Management', date: 'Jan 8, 2024' },
      { title: 'Cost Reduction Strategies', date: 'Jan 2, 2024' },
    ],
    link: '/blog',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'Documentation',
    description: 'Comprehensive guides and API documentation',
    icon: BookOpen,
    items: [
      { title: 'Getting Started Guide', type: 'Guide' },
      { title: 'API Reference', type: 'Technical' },
      { title: 'Integration Tutorials', type: 'Tutorial' },
    ],
    link: '/docs',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    title: 'Video Tutorials',
    description: 'Step-by-step video guides and walkthroughs',
    icon: PlayCircle,
    items: [
      { title: 'Platform Overview', duration: '5 min' },
      { title: 'Advanced Features', duration: '12 min' },
      { title: 'Mobile App Tutorial', duration: '8 min' },
    ],
    link: '/tutorials',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
  {
    title: 'Webinars',
    description: 'Live sessions and recorded presentations',
    icon: Video,
    items: [
      { title: 'Monthly Product Updates', date: 'Every Month' },
      { title: 'Industry Best Practices', date: 'Bi-weekly' },
      { title: 'Q&A Sessions', date: 'Weekly' },
    ],
    link: '/webinars',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    title: 'White Papers',
    description: 'In-depth research and industry reports',
    icon: FileText,
    items: [
      { title: 'ROI of Predictive Maintenance', type: 'Report' },
      { title: 'Industry Benchmarks 2024', type: 'Research' },
      { title: 'Digital Transformation Guide', type: 'Guide' },
    ],
    link: '/resources',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  {
    title: 'Help Center',
    description: '24/7 support and troubleshooting guides',
    icon: HelpCircle,
    items: [
      { title: 'FAQs', type: 'Support' },
      { title: 'Troubleshooting', type: 'Guide' },
      { title: 'Community Forum', type: 'Community' },
    ],
    link: '/help',
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
  },
];

const Resources = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Resources & Support
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Everything you need to get the most out of MechDX
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <div
              key={resource.title}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className={cn("p-2 rounded-lg", resource.bgColor)}>
                  <resource.icon className={cn("h-6 w-6", resource.color)} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {resource.title}
                </h3>
              </div>

              <p className="mt-4 text-gray-600">
                {resource.description}
              </p>

              <div className="mt-6 space-y-4">
                {resource.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                  >
                    <span className="text-sm text-gray-900">{item.title}</span>
                    <span className="text-sm text-gray-500">
                      {(item as any).date || (item as any).type || (item as any).duration}
                    </span>
                  </div>
                ))}
              </div>

              <Button
                variant="ghost"
                className={cn("mt-6 w-full justify-between group", resource.color)}
                asChild
              >
                <a href={resource.link}>
                  View All
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </div>
          ))}
        </div>

        {/* Search Help */}
        <div className="mt-20 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h3 className="text-2xl font-semibold">Can&apos;t find what you need?</h3>
            <p className="mt-2 text-gray-600">
              Search our knowledge base or contact our support team
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <a href="/search" className="gap-2">
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Search Knowledge Base
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/support" className="gap-2">
                  <HelpCircle className="h-4 w-4" />
                  Contact Support
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resources; 
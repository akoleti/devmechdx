'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Menu, X, Book, FileText, Code, HelpCircle, ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/navigation/Footer';

// Documentation sidebar links
const sidebarLinks = [
  {
    title: 'Getting Started',
    icon: Book,
    links: [
      { title: 'Quick Start Guide', href: '/docs/quick-start' },
      { title: 'System Requirements', href: '/docs/requirements' },
      { title: 'Installation Guide', href: '/docs/installation' },
    ],
  },
  {
    title: 'Core Features',
    icon: LayoutGrid,
    links: [
      { title: 'HVAC Monitoring', href: '/docs/features/monitoring' },
      { title: 'Predictive Maintenance', href: '/docs/features/predictive-maintenance' },
      { title: 'Energy Optimization', href: '/docs/features/energy' },
    ],
  },
  {
    title: 'Integrations',
    icon: Code,
    links: [
      { title: 'BMS Integration', href: '/docs/integrations/bms' },
      { title: 'IoT Sensors', href: '/docs/integrations/sensors' },
      { title: 'Third-party APIs', href: '/docs/integrations/apis' },
    ],
  },
  {
    title: 'API Reference',
    icon: FileText,
    href: '/api-docs',
  },
  {
    title: 'Support',
    icon: HelpCircle,
    href: '/docs/support',
  },
];

export default function DocumentationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Use the landing page Navbar */}
      <Navbar />

      <div className="flex flex-1 overflow-hidden pt-20">
        {/* Sidebar for documentation navigation */}
   

        {/* Mobile sidebar toggle button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className={`fixed bottom-4 left-4 z-40 md:hidden bg-[#0F62FE] text-white rounded-full p-3 shadow-lg ${
            sidebarOpen ? 'hidden' : 'flex'
          }`}
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Main content */}
        <main className={`flex-1 overflow-y-auto p-6 ${
          sidebarOpen ? 'md:ml-64' : ''
        }`}>
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Use the landing page Footer */}
      <Footer />
    </div>
  );
} 

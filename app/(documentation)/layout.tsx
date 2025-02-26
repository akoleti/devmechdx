import Link from 'next/link';
import { LayoutGrid, Menu, X, Book, FileText, Code, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

// Documentation sidebar links
const sidebarLinks = [
  { title: 'Getting Started', href: '/docs/getting-started', icon: <Book className="h-4 w-4" /> },
  { title: 'User Guide', href: '/docs/user-guide', icon: <FileText className="h-4 w-4" /> },
  { title: 'API Reference', href: '/docs/api', icon: <Code className="h-4 w-4" /> },
  { title: 'FAQ', href: '/docs/faq', icon: <HelpCircle className="h-4 w-4" /> },
];

export default function DocumentationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Using client-side state via the 'use client' directive would be needed for this
  // For simplicity, we'll assume this is a server component without mobile toggle functionality
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 py-4 px-6 border-b bg-white">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <LayoutGrid className="h-6 w-6 text-primary" />
            <span className="font-semibold text-xl">DevMechDX</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-700 hover:text-primary">
              Login
            </Link>
            <Button size="sm" asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main content with sidebar */}
      <div className="flex-grow flex">
        {/* Sidebar (hidden on mobile) */}
        <aside className="hidden md:block w-64 border-r bg-gray-50 p-6">
          <nav className="space-y-1">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                {link.icon}
                {link.title}
              </Link>
            ))}
          </nav>
        </aside>
        
        {/* Main content */}
        <main className="flex-grow p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      
      {/* Footer */}
      <footer className="py-4 px-6 border-t bg-white text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} DevMechDX. All rights reserved.</p>
      </footer>
    </div>
  );
} 
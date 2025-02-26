import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/navigation/Footer';

const inter = Inter({ subsets: ['latin'] });

// Metadata for landing pages
export const metadata = {
  title: 'DevMechDX - Equipment Management Platform',
  description: 'Streamline your equipment management and maintenance workflows with our comprehensive platform',
  keywords: 'equipment management, maintenance, asset tracking, industrial solutions',
};

export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Landing page header */}
      <Navbar />
      
      {/* Main content */}
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Landing page footer */}
      <Footer />
    </div>
  );
} 
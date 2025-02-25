import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from 'sonner';
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'MechDX - Equipment Management Platform',
  description: 'Comprehensive equipment maintenance and management platform',
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <Providers>
      <main className="flex-grow">
        {children}
      </main>
      <Toaster position="top-center" />
      </Providers>
      </body>
    </html>
  );
}

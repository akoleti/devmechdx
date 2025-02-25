import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t py-6">
      <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} DevMechDX. All rights reserved.</p>
      </div>
    </footer>
  );
} 
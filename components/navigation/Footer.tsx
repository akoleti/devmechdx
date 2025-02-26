import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">MechDX</span>
            </Link>
            <p className="mt-4 text-gray-500">
              Transforming equipment management for the digital age.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Product
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/features" className="text-gray-500 hover:text-blue-600">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-500 hover:text-blue-600">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Company
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/about" className="text-gray-500 hover:text-blue-600">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-500 hover:text-blue-600">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Legal
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/privacy" className="text-gray-500 hover:text-blue-600">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-500 hover:text-blue-600">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 text-center">
            © {new Date().getFullYear()} MechDX. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
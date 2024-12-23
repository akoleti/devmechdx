import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed w-full bg-white/95 backdrop-blur-sm z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-4 md:space-x-10">
          {/* Logo */}
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">MechDX</span>
            </Link>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden md:flex space-x-10">
            <Link to="/features" className="text-gray-700 hover:text-blue-600">
              Features
            </Link>
            <Link to="/solutions" className="text-gray-700 hover:text-blue-600">
              Solutions
            </Link>
            <Link to="/pricing" className="text-gray-700 hover:text-blue-600">
              Pricing
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600">
              About
            </Link>
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <select className="bg-transparent border-none text-gray-700">
              <option value="en">EN</option>
              <option value="es">ES</option>
              <option value="fr">FR</option>
            </select>

            {/* Login Button */}
            <Link
              to="/login"
              className="text-gray-700 hover:text-blue-600 px-4 py-2"
            >
              Login
            </Link>

            {/* Get Started Button */}
            <Link
              to="/demo"
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
            >
              Request Demo
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 
import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="relative pt-32 pb-16 sm:pt-40 sm:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
            <h1>
              <span className="block text-sm font-semibold uppercase tracking-wide text-blue-600">
                Introducing MechDX
              </span>
              <span className="mt-1 block text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
                Transform Your Equipment Management
              </span>
            </h1>
            <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
              Streamline maintenance, reduce downtime, and optimize performance with our 
              comprehensive equipment management platform.
            </p>
            
            {/* Stats Section */}
            <div className="mt-8 grid grid-cols-3 gap-4 sm:gap-6">
              <div className="border-t-2 border-gray-100 pt-4">
                <p className="text-2xl font-bold text-blue-600">500+</p>
                <p className="text-sm text-gray-500">Companies</p>
              </div>
              <div className="border-t-2 border-gray-100 pt-4">
                <p className="text-2xl font-bold text-blue-600">50k+</p>
                <p className="text-sm text-gray-500">Equipment Managed</p>
              </div>
              <div className="border-t-2 border-gray-100 pt-4">
                <p className="text-2xl font-bold text-blue-600">99%</p>
                <p className="text-sm text-gray-500">Uptime</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 sm:mt-12">
              <Link
                to="/demo"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 mr-4"
              >
                Get Started
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50"
              >
                Contact Sales
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
            <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
              <img
                className="w-full"
                src="/path-to-your-dashboard-image.png"
                alt="MechDX Dashboard Preview"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection; 
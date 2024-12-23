import React from 'react';
import { Link } from 'react-router-dom';

// Import components (we'll create these next)
import Header from '../components/landing/Header';
import HeroSection from '../components/landing/HeroSection';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <HeroSection />
    </div>
  );
};

export default LandingPage; 
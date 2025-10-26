"use client"
import React, { useState } from 'react';
import HomepageHeader from './homepage/HomepageHeader';
import HeroSection from './homepage/HeroSection';
import FeaturesOverview from './homepage/FeaturesOverview';
import DemoUploadSection from './homepage/DemoUploadSection';
import PricingSection from './homepage/PricingSection';
import FeatureComparison from './homepage/FeatureComparison';
import TestimonialsSection from './homepage/TestimonialsSection';
import CTASection from './homepage/CTASection';
import HomepageFooter from './homepage/HomepageFooter';
import ValuationApp from './ValuationApp';

const Homepage: React.FC = () => {
  const [showApp, setShowApp] = useState(false);

  const handleNavigateToApp = () => {
    setShowApp(true);
  };

  const handleBackToHomepage = () => {
    setShowApp(false);
  };

  if (showApp) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
            <button 
              onClick={handleBackToHomepage}
              className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
            >
              <span className="mr-2">←</span>
              Back to Homepage
            </button>
          </div>
          <ValuationApp />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <HomepageHeader onNavigateToApp={handleNavigateToApp} />
      <HeroSection onNavigateToApp={handleNavigateToApp} />
      <FeaturesOverview />
      <DemoUploadSection onNavigateToApp={handleNavigateToApp} />
      <PricingSection />
      <FeatureComparison />
      <TestimonialsSection />
      <CTASection onNavigateToApp={handleNavigateToApp} />
      <HomepageFooter />
    </div>
  );
};

export default Homepage;

"use client"
import React from 'react';
import HomepageHeader from './homepage/HomepageHeader';
import HeroSection from './homepage/HeroSection';
import FeaturesOverview from './homepage/FeaturesOverview';
import DemoUploadSection from './homepage/DemoUploadSection';
import PricingSection from './homepage/PricingSection';
import FeatureComparison from './homepage/FeatureComparison';
import TestimonialsSection from './homepage/TestimonialsSection';
import CTASection from './homepage/CTASection';
import HomepageFooter from './homepage/HomepageFooter';

const Homepage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <HomepageHeader />
      <HeroSection />
      <FeaturesOverview />
      <DemoUploadSection />
      <PricingSection />
      <FeatureComparison />
      <TestimonialsSection />
      <CTASection />
      <HomepageFooter />
    </div>
  );
};

export default Homepage;

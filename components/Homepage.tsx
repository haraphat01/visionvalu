import React from 'react';
import HomepageHeader from './homepage/HomepageHeader';
import HeroSection from './homepage/HeroSection';
import DemoUploadSection from './homepage/DemoUploadSection';
import FeaturesOverview from './homepage/FeaturesOverview';
import PricingSection from './homepage/PricingSection';
import FeatureComparison from './homepage/FeatureComparison';
import TestimonialsSection from './homepage/TestimonialsSection';
import CTASection from './homepage/CTASection';

interface HomepageProps {
  onNavigateToApp?: () => void;
}

const Homepage: React.FC<HomepageProps> = ({ onNavigateToApp }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <HomepageHeader onNavigateToApp={onNavigateToApp} />
      <HeroSection onNavigateToApp={onNavigateToApp} />
      <DemoUploadSection onNavigateToApp={onNavigateToApp} />
      <FeaturesOverview />
      <PricingSection />
      <FeatureComparison />
      <TestimonialsSection />
      <CTASection onNavigateToApp={onNavigateToApp} />
    </div>
  );
};

export default Homepage;

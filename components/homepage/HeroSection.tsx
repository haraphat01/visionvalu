import React from 'react';

interface HeroSectionProps {
  onNavigateToApp?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onNavigateToApp }) => {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Hero Content */}
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
              AI-Powered Property
              <span className="block text-blue-600">Valuation in Seconds</span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Get instant, accurate property valuations using advanced AI technology. 
              Upload photos and receive detailed market analysis in minutes, not weeks.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button 
                onClick={onNavigateToApp}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Try Free Demo
              </button>
              <button 
                onClick={() => {
                  const pricingSection = document.getElementById('pricing');
                  if (pricingSection) {
                    pricingSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-200"
              >
                View Pricing
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>No registration required</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Instant results</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Professional accuracy</span>
              </div>
            </div>
          </div>

          {/* Hero Image/Visual */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="bg-slate-100 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="text-sm text-slate-600">Upload Property Photos</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-blue-700">AI Analysis in Progress...</span>
                    </div>
                    <div className="text-sm text-blue-600">Processing images and market data</div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-slate-900 mb-2">$425,000</div>
                    <div className="text-sm text-slate-600 mb-4">Estimated Property Value</div>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="bg-white rounded p-2">
                        <div className="font-semibold text-slate-700">Confidence</div>
                        <div className="text-green-600">92%</div>
                      </div>
                      <div className="bg-white rounded p-2">
                        <div className="font-semibold text-slate-700">Market Trend</div>
                        <div className="text-green-600">+5.2%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

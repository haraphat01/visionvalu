import React from 'react';

interface HeroSectionProps {
  onNavigateToApp?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onNavigateToApp }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 lg:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Hero Content */}
          <div className="max-w-4xl mx-auto fade-in">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-8 animate-pulse">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              AI-Powered Property Valuation
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              <span className="block">AI-Powered</span>
              <span className="block gradient-text">HomeWorth</span>
              <span className="block text-3xl sm:text-4xl lg:text-5xl font-normal text-slate-600 mt-2">Property Valuation</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Get instant, accurate property valuations using advanced AI technology. 
              Upload photos and receive detailed market analysis in minutes, not weeks.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button 
                onClick={onNavigateToApp}
                className="btn-primary text-lg px-8 py-4 hover-lift group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Try Free Demo
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <button 
                onClick={() => {
                  const pricingSection = document.getElementById('pricing');
                  if (pricingSection) {
                    pricingSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="btn-outline text-lg px-8 py-4 hover-lift"
              >
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  View Pricing
                </span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-slate-500 mb-16">
              <div className="flex items-center gap-2 hover:text-slate-700 transition-colors duration-200">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-500 text-xs">✓</span>
                </div>
                <span>No registration required</span>
              </div>
              <div className="flex items-center gap-2 hover:text-slate-700 transition-colors duration-200">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-500 text-xs">✓</span>
                </div>
                <span>Instant results</span>
              </div>
              <div className="flex items-center gap-2 hover:text-slate-700 transition-colors duration-200">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-500 text-xs">✓</span>
                </div>
                <span>Professional accuracy</span>
              </div>
            </div>
          </div>

          {/* Hero Image/Visual */}
          <div className="mt-16 max-w-6xl mx-auto">
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-slate-200/50 hover-lift">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="ml-2 text-sm text-slate-500">Property Photos</span>
                    </div>
                    <div className="text-sm text-slate-600 font-medium">Upload Property Photos</div>
                    <div className="mt-2 text-xs text-slate-500">Drag & drop or click to browse</div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-blue-700">AI Analysis in Progress...</span>
                    </div>
                    <div className="text-sm text-blue-600 mb-3">Processing images and market data</div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full w-3/4 animate-pulse"></div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 border border-slate-200 hover:shadow-lg transition-all duration-200">
                  <div className="text-center">
                    <div className="text-4xl font-bold gradient-text mb-2">$425,000</div>
                    <div className="text-sm text-slate-600 mb-6 font-medium">Estimated Property Value</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-slate-200 hover:shadow-md transition-shadow duration-200">
                        <div className="font-semibold text-slate-700 text-sm mb-1">Confidence</div>
                        <div className="text-2xl font-bold text-green-600">92%</div>
                        <div className="text-xs text-slate-500">High accuracy</div>
                      </div>
                      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-slate-200 hover:shadow-md transition-shadow duration-200">
                        <div className="font-semibold text-slate-700 text-sm mb-1">Market Trend</div>
                        <div className="text-2xl font-bold text-green-600">+5.2%</div>
                        <div className="text-xs text-slate-500">YoY growth</div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <div className="text-xs text-slate-500 mb-2">Property Type</div>
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                        Single Family Home
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

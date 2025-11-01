import React from 'react';

const FeaturesOverview: React.FC = () => {
  const features = [
    {
      icon: '🤖',
      title: 'Advanced AI Technology',
      description: 'Powered by cutting-edge machine learning algorithms trained on millions of property transactions.',
      benefits: ['Market trend analysis', 'Property condition assessment', 'Location-based insights']
    },
    {
      icon: '⚡',
      title: 'Instant Results',
      description: 'Get professional property valuations in seconds, not weeks. No waiting for appraisers.',
      benefits: ['30-second analysis', 'Real-time market data', 'Immediate reports']
    },
    {
      icon: '📊',
      title: 'Comprehensive Reports',
      description: 'Detailed valuation reports with market comparisons, trend analysis, and confidence scores.',
      benefits: ['Market comparisons', 'Historical trends', 'Confidence indicators']
    },
    {
      icon: '🎯',
      title: 'Professional Accuracy',
      description: 'Our AI models achieve 95%+ accuracy compared to traditional appraisals.',
      benefits: ['95%+ accuracy rate', 'Professional standards', 'Market validation']
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Your property data is encrypted and never shared. Complete privacy protection.',
      benefits: ['End-to-end encryption', 'No data sharing', 'GDPR compliant']
    },
    {
      icon: '💰',
      title: 'Cost Effective',
      description: 'Save thousands compared to traditional appraisals. Professional results at a fraction of the cost.',
      benefits: ['90% cost savings', 'No hidden fees', 'Transparent pricing']
    }
  ];

  return (
    <section id="features" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
            Why Choose HomeWorth?
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Our AI-powered platform revolutionizes property valuation with speed, accuracy, and affordability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 hover:-translate-y-1 group">
              <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors duration-200">{feature.title}</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">{feature.description}</p>
              <ul className="space-y-3">
                {feature.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="flex items-center text-sm text-slate-700">
                    <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-green-600 text-xs font-bold">✓</span>
                    </span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 lg:p-12 shadow-lg border border-blue-100">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
              Trusted by Thousands
            </h3>
            <p className="text-slate-600 text-lg">
              Join the growing community of professionals using HomeWorth
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="text-center bg-white/60 backdrop-blur-sm rounded-xl p-6 hover:bg-white/80 transition-all duration-200 hover:scale-105">
              <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">50K+</div>
              <div className="text-slate-600 font-medium">Properties Valued</div>
            </div>
            <div className="text-center bg-white/60 backdrop-blur-sm rounded-xl p-6 hover:bg-white/80 transition-all duration-200 hover:scale-105">
              <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">95%</div>
              <div className="text-slate-600 font-medium">Accuracy Rate</div>
            </div>
            <div className="text-center bg-white/60 backdrop-blur-sm rounded-xl p-6 hover:bg-white/80 transition-all duration-200 hover:scale-105">
              <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">30s</div>
              <div className="text-slate-600 font-medium">Average Analysis Time</div>
            </div>
            <div className="text-center bg-white/60 backdrop-blur-sm rounded-xl p-6 hover:bg-white/80 transition-all duration-200 hover:scale-105">
              <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">$2M+</div>
              <div className="text-slate-600 font-medium">Saved in Appraisal Costs</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesOverview;

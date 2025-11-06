import React from 'react';

const FeaturesOverview: React.FC = () => {
  const features = [
    {
      icon: '⚡',
      title: 'Get Results in 30 Seconds',
      description: 'Stop waiting weeks for appraisers. Upload photos and get professional valuations instantly—perfect for time-sensitive decisions.',
      benefits: ['Instant analysis', 'No scheduling delays', 'Available 24/7']
    },
    {
      icon: '💵',
      title: 'Save Thousands of Dollars',
      description: 'Traditional appraisals cost $300-$600. Get the same accuracy for just $5 per valuation. Save up to 98% on valuation costs.',
      benefits: ['$300 vs $2 per report', 'No hidden fees', 'Pay only what you use']
    },
    {
      icon: '🎯',
      title: '95% Professional Accuracy',
      description: 'Our AI is trained on millions of real transactions. Get appraisal-grade accuracy without the wait or cost.',
      benefits: ['Industry-leading accuracy', 'Validated by experts', 'Trusted by thousands']
    },
    {
      icon: '📈',
      title: 'Smart Market Insights',
      description: 'Get detailed analysis of comparable sales, market trends, and property condition—everything you need to price or negotiate right.',
      benefits: ['Comparable property data', 'Market trend analysis', 'Investment recommendations']
    },
    {
      icon: '🔒',
      title: '100% Private & Secure',
      description: 'Your property data never leaves our secure servers. Complete privacy with bank-level encryption.',
      benefits: ['End-to-end encryption', 'No data sharing', 'GDPR compliant']
    },
    {
      icon: '📄',
      title: 'Professional Reports',
      description: 'Get shareable, professional-grade reports perfect for negotiations, listings, or investment analysis.',
      benefits: ['PDF-ready format', 'Shareable links', 'Professional presentation']
    }
  ];

  return (
    <section id="features" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
            Everything You Need to <span className="gradient-text">Make Smart Decisions</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Professional-grade property valuations in seconds. Save time, money, and stress with AI-powered insights.
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

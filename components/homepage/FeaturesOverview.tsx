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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
              <p className="text-slate-600 mb-6">{feature.description}</p>
              <ul className="space-y-2">
                {feature.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="flex items-center text-sm text-slate-600">
                    <span className="text-green-500 mr-2">✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-white rounded-2xl p-8 lg:p-12 shadow-sm">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
              Trusted by Thousands
            </h3>
            <p className="text-slate-600">
              Join the growing community of professionals using HomeWorth
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-slate-600">Properties Valued</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-slate-600">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">30s</div>
              <div className="text-slate-600">Average Analysis Time</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">$2M+</div>
              <div className="text-slate-600">Saved in Appraisal Costs</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesOverview;

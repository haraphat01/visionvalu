import React from 'react';

const PricingSection: React.FC = () => {
  const creditPackages = [
    {
      name: 'Basic Pack',
      credits: 10,
      price: 10,
      originalPrice: 15,
      popular: false,
      features: [
        '2 property valuations',
        'AI-powered market analysis',
        'Detailed PDF reports',
        'Email support',
        '30-day money-back guarantee'
      ]
    },
    {
      name: 'Starter Pack',
      credits: 35,
      price: 29,
      originalPrice: 39,
      popular: false,
      features: [
        '7 property valuations',
        'AI-powered market analysis',
        'Detailed PDF reports',
        'Email support',
        '30-day money-back guarantee'
      ]
    },
    {
      name: 'Professional Pack',
      credits: 110,
      price: 99,
      originalPrice: 149,
      popular: true,
      features: [
        '22 property valuations',
        'AI-powered market analysis',
        'Detailed PDF reports',
        'Email support',
        '30-day money-back guarantee'
      ]
    }
  ];


  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
            Pay-as-You-Go Pricing
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Purchase credits and use them whenever you need. Each property valuation costs 5 credits. No subscriptions, no monthly commitments.
          </p>
        </div>

        {/* Credit Packages */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {creditPackages.map((pkg, index) => (
              <div 
                key={index} 
                className={`relative bg-white rounded-2xl p-8 shadow-sm border-2 transition-all duration-200 hover:shadow-lg ${
                  pkg.popular 
                    ? 'border-blue-500 shadow-lg' 
                    : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h4 className="text-xl font-bold text-slate-900 mb-2">{pkg.name}</h4>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-4xl font-bold text-slate-900">${pkg.price}</span>
                    <span className="text-slate-500 line-through">${pkg.originalPrice}</span>
                  </div>
                  <div className="text-slate-600 mb-2">{pkg.credits} Credits</div>
                  <div className="text-sm text-slate-500">5 credits per valuation</div>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-slate-600">
                      <span className="text-green-500 mr-3">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button 
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-200 ${
                    pkg.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                  }`}
                >
                  Choose Plan
                </button>
              </div>
            ))}
          </div>
        </div>


        {/* Money Back Guarantee */}
        <div className="mt-16 text-center">
          <div className="bg-green-50 border border-green-200 rounded-xl p-8 max-w-2xl mx-auto">
            <div className="text-green-600 text-4xl mb-4">🛡️</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">30-Day Money-Back Guarantee</h3>
            <p className="text-slate-600">
              Not satisfied with your results? Get a full refund within 30 days, no questions asked.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;

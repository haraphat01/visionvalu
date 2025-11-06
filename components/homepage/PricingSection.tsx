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
            Simple, <span className="gradient-text">Transparent Pricing</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-4">
            Compare: Traditional appraisals cost $300-$600 and take 2-4 weeks. Get the same accuracy for just <strong className="text-slate-900">$5 per valuation</strong> in 30 seconds.
          </p>
          <div className="inline-flex items-center px-5 py-2.5 bg-green-50 border-2 border-green-300 rounded-full">
            <span className="text-green-800 font-bold">🎁 New users: Start with 5 FREE credits ($10 value)</span>
          </div>
        </div>

        {/* Credit Packages */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {creditPackages.map((pkg, index) => (
              <div 
                key={index} 
                className={`relative bg-white rounded-2xl p-6 lg:p-8 shadow-lg border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                  pkg.popular 
                    ? 'border-blue-500 shadow-xl ring-4 ring-blue-100 scale-105' 
                    : 'border-slate-200 hover:border-blue-400'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h4 className="text-2xl font-bold text-slate-900 mb-3">{pkg.name}</h4>
                  <div className="flex items-baseline justify-center gap-3 mb-4">
                    <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">${pkg.price}</span>
                    <span className="text-lg text-slate-400 line-through">${pkg.originalPrice}</span>
                  </div>
                  <div className="text-lg font-semibold text-slate-700 mb-1">{pkg.credits} Credits</div>
                  <div className="text-sm text-slate-500">5 credits per valuation</div>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start text-slate-700">
                      <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <span className="text-green-600 text-xs font-bold">✓</span>
                      </span>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  className={`w-full py-3.5 px-6 rounded-xl font-bold transition-all duration-200 ${
                    pkg.popular
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-900 hover:shadow-md'
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
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 lg:p-10 max-w-2xl mx-auto shadow-lg hover:shadow-xl transition-shadow duration-200">
            <div className="text-5xl mb-4">🛡️</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">30-Day Money-Back Guarantee</h3>
            <p className="text-slate-600 text-lg">
              Not satisfied with your results? Get a full refund within 30 days, no questions asked.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;

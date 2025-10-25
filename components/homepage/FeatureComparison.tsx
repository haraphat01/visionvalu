import React from 'react';

const FeatureComparison: React.FC = () => {
  const features = [
    {
      category: 'Valuations',
      items: [
        { name: 'Property valuations included', basic: '5', professional: '25', enterprise: '100' },
        { name: 'AI analysis accuracy', basic: '95%', professional: '95%', enterprise: '98%' },
        { name: 'Market trend analysis', basic: 'Standard', professional: 'Advanced', enterprise: 'Premium' }
      ]
    },
    {
      category: 'Reports',
      items: [
        { name: 'PDF report generation', basic: '✓', professional: '✓', enterprise: '✓' },
        { name: 'Custom report templates', basic: '✗', professional: '✓', enterprise: '✓' },
        { name: 'White-label reports', basic: '✗', professional: '✗', enterprise: '✓' },
        { name: 'Bulk report generation', basic: '✗', professional: '✓', enterprise: '✓' }
      ]
    },
    {
      category: 'Support',
      items: [
        { name: 'Email support', basic: '✓', professional: '✓', enterprise: '✓' },
        { name: 'Priority support', basic: '✗', professional: '✓', enterprise: '✓' },
        { name: 'Dedicated support', basic: '✗', professional: '✗', enterprise: '✓' },
        { name: 'Phone support', basic: '✗', professional: '✗', enterprise: '✓' }
      ]
    },
    {
      category: 'Advanced Features',
      items: [
        { name: 'API access', basic: '✗', professional: '✗', enterprise: '✓' },
        { name: 'Team collaboration', basic: '✗', professional: '✓', enterprise: '✓' },
        { name: 'Custom integrations', basic: '✗', professional: '✗', enterprise: '✓' },
        { name: 'Advanced analytics', basic: 'Basic', professional: 'Advanced', enterprise: 'Premium' }
      ]
    }
  ];

  const plans = [
    { name: 'Starter Pack', price: '$29', description: '5 property valuations' },
    { name: 'Professional Pack', price: '$99', description: '25 property valuations' },
    { name: 'Enterprise Pack', price: '$299', description: '100 property valuations' }
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
            Compare All Features
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            See exactly what's included in each plan. Choose the one that best fits your needs.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="bg-slate-50 border-b border-slate-200">
          <div className="grid grid-cols-4 gap-4 p-6">
            <div className="text-left">
              <h3 className="font-semibold text-slate-900">Features</h3>
            </div>
            {plans.map((plan, index) => (
              <div key={index} className="text-center">
                <div className="font-bold text-slate-900 mb-1">{plan.name}</div>
                <div className="text-lg font-semibold text-blue-600 mb-1">{plan.price}</div>
                <div className="text-xs text-slate-600">{plan.description}</div>
              </div>
            ))}
          </div>
          </div>

          {/* Feature Rows */}
          {features.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <div className="bg-slate-100 px-6 py-3">
                <h4 className="font-semibold text-slate-900">{category.category}</h4>
              </div>
              {category.items.map((item, itemIndex) => (
                <div key={itemIndex} className="border-b border-slate-200 last:border-b-0">
                  <div className="grid grid-cols-4 gap-4 p-6 items-center">
                    <div className="text-slate-700 font-medium">{item.name}</div>
                    <div className="text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.basic === '✓' 
                          ? 'bg-green-100 text-green-800' 
                          : item.basic === '✗'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        {item.basic}
                      </span>
                    </div>
                    <div className="text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.professional === '✓' 
                          ? 'bg-green-100 text-green-800' 
                          : item.professional === '✗'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        {item.professional}
                      </span>
                    </div>
                    <div className="text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.enterprise === '✓' 
                          ? 'bg-green-100 text-green-800' 
                          : item.enterprise === '✗'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        {item.enterprise}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* CTA Row */}
          <div className="bg-slate-50 p-6">
            <div className="grid grid-cols-4 gap-4">
              <div></div>
              <div className="text-center">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                  Choose Plan
                </button>
              </div>
              <div className="text-center">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                  Choose Plan
                </button>
              </div>
              <div className="text-center">
                <button className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-slate-600 mb-4">
            All credit packages include our 30-day money-back guarantee
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>No monthly commitments</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Credits never expire</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>24/7 support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureComparison;

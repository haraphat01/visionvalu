import React from 'react';

const FeatureComparison: React.FC = () => {
  const features = [
    {
      category: 'Credits & Valuations',
      items: [
        { name: 'Credits included', basic: '10', starter: '35', professional: '110' },
        { name: 'Property valuations', basic: '2', starter: '7', professional: '22' },
        { name: 'Cost per valuation', basic: '5 credits', starter: '5 credits', professional: '5 credits' }
      ]
    },
    {
      category: 'Features',
      items: [
        { name: 'AI-powered analysis', basic: '✓', starter: '✓', professional: '✓' },
        { name: 'Market trend analysis', basic: '✓', starter: '✓', professional: '✓' },
        { name: 'Detailed PDF reports', basic: '✓', starter: '✓', professional: '✓' },
        { name: '95% accuracy rate', basic: '✓', starter: '✓', professional: '✓' }
      ]
    },
    {
      category: 'Support & Guarantees',
      items: [
        { name: 'Email support', basic: '✓', starter: '✓', professional: '✓' },
        { name: '30-day money-back guarantee', basic: '✓', starter: '✓', professional: '✓' },
        { name: 'Credits never expire', basic: '✓', starter: '✓', professional: '✓' }
      ]
    }
  ];

  const plans = [
    { name: 'Basic Pack', price: '$10', description: '10 credits (2 valuations)' },
    { name: 'Starter Pack', price: '$29', description: '35 credits (7 valuations)' },
    { name: 'Professional Pack', price: '$99', description: '110 credits (22 valuations)' }
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
            HomeWorth vs <span className="gradient-text">Traditional Appraisals</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            See why thousands of buyers and sellers choose AI-powered valuations over expensive, slow appraisals.
          </p>
          
          {/* Quick Comparison */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-left">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">❌</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Traditional Appraisals</h3>
                  </div>
                  <ul className="space-y-3 text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">×</span>
                      <span><strong>$300-$600</strong> per valuation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">×</span>
                      <span><strong>2-4 weeks</strong> waiting time</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">×</span>
                      <span>Requires scheduling appointments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">×</span>
                      <span>Limited availability (business hours)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">×</span>
                      <span>No instant access to reports</span>
                    </li>
                  </ul>
                </div>
                
                <div className="text-left">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">✓</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">HomeWorth AI</h3>
                  </div>
                  <ul className="space-y-3 text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span><strong>$2</strong> per valuation (5 credits)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span><strong>30 seconds</strong> instant results</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>Available 24/7, no scheduling needed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>Instant access anywhere, anytime</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>Shareable reports in seconds</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-slate-200">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-300">
                  <p className="text-lg font-bold text-slate-900 mb-2">💰 Save up to <span className="text-green-600">98%</span> on valuation costs</p>
                  <p className="text-slate-600">Get the same professional accuracy in 30 seconds instead of 2-4 weeks.</p>
                </div>
              </div>
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Credit Package Comparison</h3>
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
                        item.starter === '✓' 
                          ? 'bg-green-100 text-green-800' 
                          : item.starter === '✗'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        {item.starter}
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
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                  Choose Plan
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
              <span>5 credits per valuation</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureComparison;

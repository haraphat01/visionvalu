import React from 'react';
import { Home, TrendingUp, DollarSign, Shield, Clock, BarChart3 } from 'lucide-react';

const BuyerSellerSection: React.FC = () => {
  const buyerBenefits = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Avoid Overpaying',
      description: 'Know the true market value before making an offer. Save thousands by negotiating with confidence.',
      stat: 'Save up to $50K'
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Market Insights',
      description: 'Get detailed analysis of comparable properties and market trends in your area.',
      stat: '95% accuracy'
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Fast Decisions',
      description: 'Get instant valuations while viewing properties. No waiting weeks for appraisals.',
      stat: '30 seconds'
    }
  ];

  const sellerBenefits = [
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Price It Right',
      description: 'Set the perfect listing price that attracts buyers while maximizing your profit.',
      stat: 'Sell 25% faster'
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: 'Maximize Value',
      description: 'Discover which improvements increase your home\'s value the most before listing.',
      stat: '+$20K ROI'
    },
    {
      icon: <Home className="h-6 w-6" />,
      title: 'Competitive Edge',
      description: 'Get professional-grade valuations instantly. No expensive appraisals or waiting.',
      stat: '$300 vs $5'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Built for <span className="gradient-text">Buyers & Sellers</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Whether you're buying your dream home or selling your property, get the insights you need to make smart decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Buyers Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 lg:p-10 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Home className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">For Home Buyers</h3>
                <p className="text-slate-600">Make confident purchase decisions</p>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              {buyerBenefits.map((benefit, index) => (
                <div key={index} className="bg-white rounded-xl p-5 border border-blue-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                      {benefit.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-slate-900">{benefit.title}</h4>
                        <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                          {benefit.stat}
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl p-5 border-2 border-blue-300">
              <p className="text-sm font-semibold text-slate-900 mb-2">Perfect For:</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">First-time buyers</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Investment properties</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Quick comparisons</span>
              </div>
            </div>
          </div>

          {/* Sellers Section */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 lg:p-10 border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">For Home Sellers</h3>
                <p className="text-slate-600">Maximize your sale price</p>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              {sellerBenefits.map((benefit, index) => (
                <div key={index} className="bg-white rounded-xl p-5 border border-purple-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                      {benefit.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-slate-900">{benefit.title}</h4>
                        <span className="text-sm font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                          {benefit.stat}
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl p-5 border-2 border-purple-300">
              <p className="text-sm font-semibold text-slate-900 mb-2">Perfect For:</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">Pre-listing prep</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">Competitive pricing</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">Market analysis</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 lg:p-10 shadow-2xl">
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
              Ready to Make Smarter Real Estate Decisions?
            </h3>
            <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
              Join 100+ buyers and sellers who trust HomeWorth for instant, accurate property valuations.
            </p>
            <a 
              href="/signup"
              className="inline-block bg-white text-blue-600 hover:bg-blue-50 font-bold py-4 px-8 rounded-xl text-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Get Your First Valuation Free
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BuyerSellerSection;


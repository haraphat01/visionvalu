'use client'

import React from 'react';

interface DemoUploadSectionProps {}

const DemoUploadSection: React.FC<DemoUploadSectionProps> = () => {

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
            Get Your Property's Value in <span className="gradient-text">3 Simple Steps</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-4">
            No complicated forms. No waiting. Just upload photos and get instant, accurate valuations.
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-full">
            <span className="text-blue-700 font-semibold text-sm">⚡ Average time: 30 seconds • 🎯 95% accuracy</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 lg:p-12 text-center border border-blue-100 shadow-lg">
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl text-white">📸</span>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">
                Upload & Analyze in 3 Simple Steps
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-200 hover:-translate-y-1 border border-slate-100">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">Upload Photos</h4>
                  <p className="text-sm text-slate-600">Add 3-5 clear property images</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-200 hover:-translate-y-1 border border-slate-100">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">AI Analysis</h4>
                  <p className="text-sm text-slate-600">Our AI analyzes your property</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-200 hover:-translate-y-1 border border-slate-100">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">Get Results</h4>
                  <p className="text-sm text-slate-600">Receive detailed valuation report</p>
                </div>
              </div>
            </div>
            
            <a 
              href="/signup"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-200 shadow-lg hover:shadow-xl inline-block hover:scale-105"
            >
              Get Started
            </a>
            
            <p className="text-sm text-slate-600 mt-4 font-medium">
              Professional accuracy • Instant results • Detailed reports
            </p>
          </div>
        </div>

        {/* Demo Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 text-xl">⚡</span>
            </div>
            <h4 className="font-semibold text-slate-900 mb-2">Lightning Fast</h4>
            <p className="text-sm text-slate-600">Get results in under 30 seconds</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 text-xl">🎯</span>
            </div>
            <h4 className="font-semibold text-slate-900 mb-2">Highly Accurate</h4>
            <p className="text-sm text-slate-600">Professional-grade valuation models</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 text-xl">📊</span>
            </div>
            <h4 className="font-semibold text-slate-900 mb-2">Detailed Reports</h4>
            <p className="text-sm text-slate-600">Comprehensive market analysis</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 text-xl">🔒</span>
            </div>
            <h4 className="font-semibold text-slate-900 mb-2">Secure & Private</h4>
            <p className="text-sm text-slate-600">Your data is protected</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoUploadSection;

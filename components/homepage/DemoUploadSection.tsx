import React, { useState } from 'react';

interface DemoUploadSectionProps {
  onNavigateToApp?: () => void;
}

const DemoUploadSection: React.FC<DemoUploadSectionProps> = ({ onNavigateToApp }) => {
  const [isDemoActive, setIsDemoActive] = useState(false);

  const handleDemoStart = () => {
    if (onNavigateToApp) {
      onNavigateToApp();
    } else {
      setIsDemoActive(true);
      // Scroll to main app functionality
      setTimeout(() => {
        const mainApp = document.querySelector('[data-main-app]');
        if (mainApp) {
          mainApp.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
            Try Our AI Valuation Engine
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Experience the power of AI-driven property valuation. Upload your property photos 
            and see how our advanced algorithms analyze market data in real-time.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {!isDemoActive ? (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 lg:p-12 text-center">
              <div className="mb-8">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl text-white">📸</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Upload & Analyze in 3 Simple Steps
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-blue-600 font-bold">1</span>
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-2">Upload Photos</h4>
                    <p className="text-sm text-slate-600">Add 3-5 clear property images</p>
                  </div>
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-blue-600 font-bold">2</span>
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-2">AI Analysis</h4>
                    <p className="text-sm text-slate-600">Our AI analyzes your property</p>
                  </div>
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-blue-600 font-bold">3</span>
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-2">Get Results</h4>
                    <p className="text-sm text-slate-600">Receive detailed valuation report</p>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={handleDemoStart}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Start Free Demo
              </button>
              
              <p className="text-sm text-slate-500 mt-4">
                No registration required • Instant results • Professional accuracy
              </p>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">✓</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Demo Started!
              </h3>
              <p className="text-slate-600 mb-6">
                Scroll down to upload your property photos and see our AI in action.
              </p>
              <button 
                onClick={() => setIsDemoActive(false)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Back to Demo Info
              </button>
            </div>
          )}
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

import React from 'react';

interface HomepageHeaderProps {
  onNavigateToApp?: () => void;
}

const HomepageHeader: React.FC<HomepageHeaderProps> = ({ onNavigateToApp }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">🏠</span>
            <h1 className="text-2xl font-bold text-slate-800">
              VisionValu
            </h1>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-slate-600 hover:text-slate-900 font-medium transition-colors duration-200">
              Features
            </a>
            <a href="#pricing" className="text-slate-600 hover:text-slate-900 font-medium transition-colors duration-200">
              Pricing
            </a>
            <a href="#testimonials" className="text-slate-600 hover:text-slate-900 font-medium transition-colors duration-200">
              Reviews
            </a>
            <a href="/login" className="text-slate-600 hover:text-slate-900 font-medium transition-colors duration-200">
              Sign In
            </a>
            <a href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200">
              Get Started
            </a>
            <button 
              onClick={onNavigateToApp}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Try Free Demo
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default HomepageHeader;

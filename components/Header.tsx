
import React from 'react';

interface HeaderProps {
  onNavigateToHomepage?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigateToHomepage }) => {
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
          {onNavigateToHomepage && (
            <button 
              onClick={onNavigateToHomepage}
              className="text-slate-600 hover:text-slate-900 font-medium transition-colors duration-200"
            >
              ← Back to Homepage
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

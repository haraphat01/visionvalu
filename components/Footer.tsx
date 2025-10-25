
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} VisionValu. All rights reserved.</p>
        <p className="mt-1">Valuations are AI-generated estimates and not official appraisals.</p>
      </div>
    </footer>
  );
};

export default Footer;

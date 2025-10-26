'use client'

import React, { useState, useEffect } from 'react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportText: string | null;
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, reportText }) => {
  const [copyButtonText, setCopyButtonText] = useState('Copy Text');
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setCopyButtonText('Copy Text'), 300);
    }
  }, [isOpen]);
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => setShowContent(true), 10);
      return () => {
        document.body.style.overflow = 'unset';
        clearTimeout(timer);
      };
    } else {
      setShowContent(false);
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const handleCopy = () => {
    if (reportText) {
      navigator.clipboard.writeText(reportText);
      setCopyButtonText('Copied!');
      setTimeout(() => setCopyButtonText('Copy Text'), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  const formatReportText = (text: string) => {
    if (!text) return '';
    const blocks = text.split(/\n\s*\n/);
    return blocks.map(block => {
        let processedBlock = block.trim();
        processedBlock = processedBlock.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-700">$1</strong>');
        if (processedBlock.startsWith('## ')) {
            return `<h2 class="text-xl font-bold text-slate-800 mt-6 mb-3">${processedBlock.substring(3)}</h2>`;
        }
        if (processedBlock.match(/^\s*-\s/m)) {
            const listItems = processedBlock.split('\n').map(item => {
                const content = item.trim().replace(/^- \s*/, '');
                return `<li class="ml-5 list-disc text-slate-600">${content}</li>`;
            }).join('');
            return `<ul class="space-y-1 mb-4">${listItems}</ul>`;
        }
        if (processedBlock) {
            const paragraphContent = processedBlock.replace(/\n/g, '<br />');
            return `<p class="text-slate-600 mb-4 leading-relaxed">${paragraphContent}</p>`;
        }
        return '';
    }).join('');
  };

  return (
    <div 
      className={`fixed inset-0 bg-black z-50 flex items-center justify-center p-4 transition-opacity duration-300 print:static print:p-0 print:bg-transparent ${showContent ? 'bg-opacity-60' : 'bg-opacity-0'}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-title"
    >
      <div 
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col transform transition-all duration-300 print:shadow-none print:max-h-full print:rounded-none print:h-full ${showContent ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        onClick={e => e.stopPropagation()}
      >
        <header className="p-6 border-b flex justify-between items-center print:hidden">
          <h2 id="report-title" className="text-2xl font-bold text-slate-800">Sharable Property Report</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600" aria-label="Close">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </header>

        <main id="print-area" className="flex-grow p-8 overflow-y-auto print:overflow-visible print:p-0">
          {reportText ? (
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: formatReportText(reportText) }} />
          ) : (
             <div className="text-center py-12">
                <svg className="animate-spin mx-auto h-8 w-8 text-sky-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-4 text-slate-500">Loading report...</p>
             </div>
          )}
        </main>

        <footer className="p-6 border-t bg-slate-50 flex flex-col sm:flex-row justify-end items-center gap-4 rounded-b-2xl print:hidden">
          <button 
            onClick={handleCopy}
            className="w-full sm:w-auto px-6 py-2 bg-slate-200 text-slate-800 font-semibold rounded-lg hover:bg-slate-300 transition-colors"
          >
            {copyButtonText}
          </button>
          <button 
            onClick={handlePrint}
            className="w-full sm:w-auto px-6 py-2 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 transition-colors flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7V9h6v3z" clipRule="evenodd" />
            </svg>
            Print / Save as PDF
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ReportModal;

import React from 'react';
import type { ValuationResult } from '../types';

interface HistoryPanelProps {
  history: ValuationResult[];
  onSelect: (report: ValuationResult) => void;
  onClear: () => void;
  currentReportId?: string;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect, onClear, currentReportId }) => {
  if (history.length === 0) {
    return null;
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-slate-200 mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-slate-800">Valuation History</h2>
        <button 
          onClick={onClear} 
          className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
        >
          Clear History
        </button>
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2 -mr-2">
        {history.slice().reverse().map(item => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className={`w-full text-left p-4 rounded-lg flex items-center space-x-4 transition-all duration-200 ${
              item.id === currentReportId ? 'bg-sky-100 border-sky-500 shadow-md' : 'bg-slate-50 hover:bg-slate-100'
            } border`}
          >
            <img 
              src={item.previewImage} 
              alt="Property thumbnail" 
              className="w-16 h-16 rounded-md object-cover flex-shrink-0 bg-slate-200"
            />
            <div className="flex-grow">
              <p className="font-semibold text-slate-700">{item.propertyType}</p>
              <p className="text-sm text-slate-500">
                {new Date(item.timestamp).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg text-sky-700">
                {formatCurrency(item.estimatedValueRange.min, item.currency)} - {formatCurrency(item.estimatedValueRange.max, item.currency)}
              </p>
              <p className="text-xs text-slate-500">Confidence: {item.confidenceScore}%</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HistoryPanel;

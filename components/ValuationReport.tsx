import React from 'react';
import type { ValuationResult, SuggestedUpgrade, PropertyDetails, GroundingSource } from '../types';

interface ValuationReportProps {
  report: ValuationResult;
  onGenerateReport: (report: ValuationResult) => void;
  isGeneratingReport: boolean;
}

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const ConfidenceBar: React.FC<{ score: number }> = ({ score }) => {
    const width = `${score}%`;
    const colorClass = score > 75 ? 'bg-emerald-500' : score > 50 ? 'bg-yellow-500' : 'bg-red-500';
    return (
        <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div className={`${colorClass} h-2.5 rounded-full`} style={{ width }}></div>
        </div>
    );
};

const InfoPill: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="bg-sky-100 text-sky-800 px-3 py-1 rounded-full text-sm">
        <span className="font-semibold">{label}:</span> {value}
    </div>
);

const FeatureListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-start">
        <svg className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span className="text-slate-600">{children}</span>
    </li>
);

const UpgradeCard: React.FC<{ upgrade: SuggestedUpgrade }> = ({ upgrade }) => {
    const getPillColor = (value: string) => {
        switch (value?.toLowerCase()) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-emerald-100 text-emerald-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };
    return (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h4 className="font-semibold text-slate-800">{upgrade.upgrade}</h4>
            <p className="text-sm text-slate-600 mt-1 mb-3">{upgrade.reasoning}</p>
            <div className="flex items-center space-x-2">
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getPillColor(upgrade.estimatedCost)}`}>
                    Cost: {upgrade.estimatedCost}
                </span>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getPillColor(upgrade.impactOnValue)}`}>
                    Value Impact: {upgrade.impactOnValue}
                </span>
            </div>
        </div>
    );
};

const PropertyDetailsSection: React.FC<{ details?: PropertyDetails }> = ({ details }) => {
    if (!details || Object.values(details).every(v => !v)) return null;

    return (
        <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-700 mb-3">Property Details</h3>
            <div className="bg-slate-50 border p-4 rounded-lg">
                {details.address && <p className="text-slate-700"><strong>Address:</strong> {details.address}</p>}
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                    {details.propertySize && <p className="text-sm text-slate-600"><strong>Size:</strong> {details.propertySize} sqft</p>}
                    {details.bedrooms && <p className="text-sm text-slate-600"><strong>Bedrooms:</strong> {details.bedrooms}</p>}
                    {details.bathrooms && <p className="text-sm text-slate-600"><strong>Bathrooms:</strong> {details.bathrooms}</p>}
                </div>
                 {details.additionalNotes && <p className="text-sm text-slate-600 mt-2"><strong>Notes:</strong> {details.additionalNotes}</p>}
            </div>
        </div>
    );
};

const SourcesSection: React.FC<{ sources?: GroundingSource[] }> = ({ sources }) => {
    if (!sources || sources.length === 0) return null;

    return (
        <div className="mt-8 border-t pt-8">
            <h3 className="text-xl font-semibold text-slate-700 mb-4">Sources</h3>
            <p className="text-sm text-slate-500 mb-4 -mt-2">The AI used the following sources to improve the valuation accuracy.</p>
            <ol className="list-decimal list-inside space-y-2">
                {sources.map((source, index) => (
                    <li key={index} className="text-slate-600">
                        <a 
                            href={source.uri} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-sky-600 hover:text-sky-800 hover:underline transition-colors break-words"
                        >
                            {source.title}
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </li>
                ))}
            </ol>
        </div>
    );
};

const ValuationReport: React.FC<ValuationReportProps> = ({ report, onGenerateReport, isGeneratingReport }) => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-slate-200 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
                <img src={report.previewImage} alt="Property Preview" className="rounded-lg object-cover w-full h-full aspect-square shadow-md" />
            </div>
            <div className="md:col-span-2">
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Valuation Report</h2>
                <p className="text-sm text-slate-500 mb-6">Generated on {new Date(report.timestamp).toLocaleString()}</p>
                
                <PropertyDetailsSection details={report.propertyDetails} />

                <div className="bg-slate-50 border border-slate-200 p-6 rounded-lg mb-6">
                    <p className="text-sm font-medium text-slate-500">Estimated Value Range</p>
                    <p className="text-4xl font-extrabold text-sky-600 tracking-tight">
                        {formatCurrency(report.estimatedValueRange.min, report.currency)} - {formatCurrency(report.estimatedValueRange.max, report.currency)}
                    </p>
                </div>

                <div className="mb-6">
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-medium text-slate-600">Confidence Score</p>
                        <p className="text-sm font-bold text-slate-800">{report.confidenceScore}%</p>
                    </div>
                    <ConfidenceBar score={report.confidenceScore} />
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                    <InfoPill label="Type" value={report.propertyType} />
                    <InfoPill label="Condition" value={report.propertyCondition} />
                </div>
            </div>
        </div>
        
        <div className="mt-8 border-t pt-8 text-center">
            <button
                onClick={() => onGenerateReport(report)}
                disabled={isGeneratingReport}
                className="w-full sm:w-auto px-8 py-3 bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-700 disabled:bg-slate-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 transform hover:scale-105 flex items-center justify-center mx-auto"
            >
                {isGeneratingReport ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                    </>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v10a1 1 0 01-1 1H2a1 1 0 01-1-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5a1.5 1.5 0 013 0V4H7v-.5a1.5 1.5 0 013 0z" />
                            <path d="M10 8a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1z" />
                        </svg>
                        Generate Sharable Report
                    </>
                )}
            </button>
        </div>


        <div className="mt-8 border-t pt-8">
             <h3 className="text-xl font-semibold text-slate-700 mb-4">AI Analysis & Reasoning</h3>
             <p className="text-slate-600 leading-relaxed prose">{report.reasoning}</p>
        </div>

        <div className="mt-8 border-t pt-8">
            <h3 className="text-xl font-semibold text-slate-700 mb-4">Detected Features</h3>
            <ul className="space-y-3">
                {report.detectedFeatures.map((feature, index) => (
                    <FeatureListItem key={index}>{feature}</FeatureListItem>
                ))}
            </ul>
        </div>

        {report.suggestedUpgrades && report.suggestedUpgrades.length > 0 && (
            <div className="mt-8 border-t pt-8">
                <h3 className="text-xl font-semibold text-slate-700 mb-4">Suggested Upgrades</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {report.suggestedUpgrades.map((upgrade, index) => (
                        <UpgradeCard key={index} upgrade={upgrade} />
                    ))}
                </div>
            </div>
        )}

        <SourcesSection sources={report.sources} />
    </div>
  );
};

export default ValuationReport;
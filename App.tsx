import React, { useState, useCallback } from 'react';
import { getPropertyValuation, generateDetailedReport } from './services/geminiService';
import type { ValuationResult, PropertyDetails } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import Header from './components/Header';
import Footer from './components/Footer';
import Homepage from './components/Homepage';
import ImageUploader from './components/ImageUploader';
import Loader from './components/Loader';
import ValuationReport from './components/ValuationReport';
import HistoryPanel from './components/HistoryPanel';
import ReportModal from './components/ReportModal';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URI prefix: e.g., "data:image/jpeg;base64,"
      resolve(result.split(',')[1]);
    };
    reader.onerror = error => reject(error);
  });
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'homepage' | 'app'>('homepage');
  const [images, setImages] = useState<File[]>([]);
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails>({});
  const [currentValuation, setCurrentValuation] = useState<ValuationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useLocalStorage<ValuationResult[]>('valuationHistory', []);

  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [detailedReport, setDetailedReport] = useState<string | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const handleImagesChange = useCallback((files: File[]) => {
    setImages(files);
  }, []);

  const handleDetailsChange = useCallback((details: PropertyDetails) => {
    setPropertyDetails(details);
  }, []);

  const handleGetValuation = async () => {
    if (images.length === 0) {
      setError("Please upload at least one image.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setCurrentValuation(null);

    try {
      const base64Images = await Promise.all(images.map(fileToBase64));
      const valuationData = await getPropertyValuation(base64Images, propertyDetails);

      const newReport: ValuationResult = {
        ...valuationData,
        id: new Date().toISOString() + Math.random(),
        timestamp: new Date().toISOString(),
        previewImage: `data:image/jpeg;base64,${base64Images[0]}`,
        propertyDetails: propertyDetails,
      };

      setCurrentValuation(newReport);
      setHistory(prevHistory => [...prevHistory, newReport]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(`Valuation failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = async (report: ValuationResult) => {
    setIsGeneratingReport(true);
    setError(null);
    try {
      const narrativeReport = await generateDetailedReport(report);
      setDetailedReport(narrativeReport);
      setIsReportModalOpen(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(`Failed to generate detailed report: ${errorMessage}`);
    } finally {
      setIsGeneratingReport(false);
    }
  };


  const handleSelectHistoryItem = (report: ValuationResult) => {
    setCurrentValuation(report);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleClearHistory = () => {
    setHistory([]);
    setCurrentValuation(null);
  };

  const handleNavigateToApp = () => {
    setCurrentView('app');
  };

  const handleNavigateToHomepage = () => {
    setCurrentView('homepage');
  };

  if (currentView === 'homepage') {
    return (
      <div className="min-h-screen">
        <Homepage onNavigateToApp={handleNavigateToApp} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <div className="print:hidden">
        <Header onNavigateToHomepage={handleNavigateToHomepage} />
      </div>
      <main className="flex-grow container mx-auto px-4 py-8 sm:py-12 print:hidden" data-main-app>
        <ImageUploader 
          onImagesChange={handleImagesChange}
          onDetailsChange={handleDetailsChange}
          onSubmit={handleGetValuation}
          isLoading={isLoading}
        />

        {error && (
          <div className="max-w-4xl mx-auto mt-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {isLoading && (
          <div className="max-w-4xl mx-auto mt-8">
            <Loader />
          </div>
        )}

        {currentValuation && (
          <ValuationReport 
            report={currentValuation}
            onGenerateReport={handleGenerateReport}
            isGeneratingReport={isGeneratingReport}
          />
        )}
        
        <HistoryPanel 
          history={history}
          onSelect={handleSelectHistoryItem}
          onClear={handleClearHistory}
          currentReportId={currentValuation?.id}
        />
      </main>
      <div className="print:hidden">
        <Footer />
      </div>
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        reportText={detailedReport}
      />
    </div>
  );
};

export default App;
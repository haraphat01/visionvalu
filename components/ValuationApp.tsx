'use client'

import React, { useState, useCallback } from 'react';
import { getPropertyValuation, generateDetailedReport } from '../services/geminiService';
import { v4 as uuidv4 } from 'uuid';
import type { ValuationResult, PropertyDetails } from '../types';
import ImageUploader from './ImageUploader';
import Loader from './Loader';
import ValuationReport from './ValuationReport';
import ReportModal from './ReportModal';

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

const ValuationApp: React.FC = () => {
  const [images, setImages] = useState<File[]>([]);
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails>({});
  const [currentValuation, setCurrentValuation] = useState<ValuationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        previewImage: `data:image/jpeg;base64,${base64Images[0]}`,
        propertyDetails: propertyDetails,
      };

      setCurrentValuation(newReport);
      
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

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-200/50">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold gradient-text mb-1">HomeWorth AI Valuation</h2>
              <p className="text-gray-600">
                Upload property images and get an instant AI-powered valuation
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          <ImageUploader 
            onImagesChange={handleImagesChange}
            onDetailsChange={handleDetailsChange}
            onSubmit={handleGetValuation}
            isLoading={isLoading}
          />

          {error && (
            <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-2xl">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-red-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-lg font-semibold text-red-800 mb-2">Valuation Error</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="mt-8">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 text-center">
                <Loader />
                <p className="text-gray-600 mt-4 font-medium">Analyzing your property...</p>
              </div>
            </div>
          )}

          {currentValuation && (
            <div className="mt-8 fade-in">
              <ValuationReport 
                report={currentValuation}
                onGenerateReport={handleGenerateReport}
                isGeneratingReport={isGeneratingReport}
              />
            </div>
          )}
        </div>
      </div>

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        reportText={detailedReport}
      />
    </div>
  );
};

export default ValuationApp;

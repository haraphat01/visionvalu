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
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Valuation</h2>
          <p className="text-gray-600">
            Upload property images and get an AI-powered valuation.
          </p>
        </div>

        <ImageUploader 
          onImagesChange={handleImagesChange}
          onDetailsChange={handleDetailsChange}
          onSubmit={handleGetValuation}
          isLoading={isLoading}
        />

        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {isLoading && (
          <div className="mt-6">
            <Loader />
          </div>
        )}

        {currentValuation && (
          <div className="mt-6">
            <ValuationReport 
              report={currentValuation}
              onGenerateReport={handleGenerateReport}
              isGeneratingReport={isGeneratingReport}
            />
          </div>
        )}
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

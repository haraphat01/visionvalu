'use client'

import React, { useState, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import ImageUploader from '../ImageUploader'
import ValuationReport from '../ValuationReport'
import ReportModal from '../ReportModal'
import Loader from '../Loader'
import type { ValuationResult, PropertyDetails } from '@/types'

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

export default function DashboardValuation() {
  const { user } = useAuth()
  const [images, setImages] = useState<File[]>([])
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails>({})
  const [currentValuation, setCurrentValuation] = useState<ValuationResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [detailedReport, setDetailedReport] = useState<string | null>(null)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)

  const handleImagesChange = useCallback((files: File[]) => {
    setImages(files)
  }, [])

  const handleDetailsChange = useCallback((details: PropertyDetails) => {
    setPropertyDetails(details)
  }, [])

  const handleGetValuation = async () => {
    if (images.length === 0) {
      setError("Please upload at least one image.")
      return
    }

    if (!user || user.credits < 5) {
      setError("Insufficient credits. You need 5 credits for a property valuation.")
      return
    }

    setIsLoading(true)
    setError(null)
    setCurrentValuation(null)

    try {
      const base64Images = await Promise.all(images.map(fileToBase64))
      
      // Call the API endpoint instead of direct service
      const response = await fetch('/api/valuation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          images: base64Images,
          propertyDetails,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to get valuation')
      }

      const data = await response.json()
      setCurrentValuation(data.report)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred."
      setError(`Valuation failed: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateReport = async (report: ValuationResult) => {
    setIsGeneratingReport(true)
    setError(null)
    try {
      const response = await fetch('/api/valuation/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ report }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate report')
      }

      const data = await response.json()
      setDetailedReport(data.report)
      setIsReportModalOpen(true)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred."
      setError(`Failed to generate detailed report: ${errorMessage}`)
    } finally {
      setIsGeneratingReport(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Property Valuation</h1>
          <p className="text-gray-600 mb-6">
            Upload property images and get an AI-powered valuation. This will use 5 credits.
          </p>
          
          {user && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    You have <strong>{user.credits} credits</strong> remaining.
                  </p>
                </div>
              </div>
            </div>
          )}

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
      </div>

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        reportText={detailedReport}
      />
    </div>
  )
}

'use client'

import React, { useEffect, useState } from 'react'
import { FileText, Download, Trash2, Eye, X, Share2 } from 'lucide-react'
import type { ValuationResult } from '@/types'

export default function ReportsSection() {
  const [reports, setReports] = useState<ValuationResult[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState<ValuationResult | null>(null)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/reports')
      if (response.ok) {
        const data = await response.json()
        setReports(data.reports || [])
      }
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteReport = async (reportId: string) => {
    if (!confirm('Are you sure you want to delete this report?')) {
      return
    }

    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setReports(reports.filter(report => report.id !== reportId))
      }
    } catch (error) {
      console.error('Error deleting report:', error)
    }
  }

  const handleViewReport = (report: ValuationResult) => {
    setSelectedReport(report)
  }

  const handleDownloadReport = async (report: ValuationResult) => {
    try {
      // Fetch the HTML version of the report
      const response = await fetch(`/api/reports/${report.id}/pdf`)
      
      if (!response.ok) {
        throw new Error('Failed to generate PDF')
      }

      const html = await response.text()
      
      // Convert HTML to PDF using jsPDF and html2canvas
      const { jsPDF } = await import('jspdf')
      const { default: html2canvas } = await import('html2canvas')
      
      // Create a temporary container with the HTML
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = html
      tempDiv.style.position = 'absolute'
      tempDiv.style.left = '-9999px'
      tempDiv.style.width = '800px'
      document.body.appendChild(tempDiv)

      // Convert to canvas then to PDF
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        logging: false,
      })
      
      document.body.removeChild(tempDiv)

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 297 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`property-valuation-${report.id}.pdf`)
    } catch (error) {
      console.error('Error downloading PDF:', error)
      alert('Failed to download PDF. Please try again.')
    }
  }

  const handleShareReport = async (report: ValuationResult) => {
    try {
      // Generate shareable link
      const response = await fetch(`/api/reports/${report.id}/share`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to generate share link')
      }

      const { shareUrl } = await response.json()

      // Try to use Web Share API first
      if (navigator.share) {
        try {
          await navigator.share({
            title: `Property Valuation Report - ${report.propertyDetails?.address || report.property_address || 'Property'}`,
            text: `Check out this property valuation report from HomeWorth!`,
            url: shareUrl,
          })
          return
        } catch (shareError) {
          // User cancelled or error, fall through to clipboard
        }
      }

      // Fallback: copy shareable link to clipboard
      await navigator.clipboard.writeText(shareUrl)
      alert('Shareable link copied to clipboard!')
    } catch (error) {
      console.error('Error sharing report:', error)
      alert('Unable to generate share link. Please try again.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Reports</h1>
          <p className="text-gray-600 mb-6">
            View and manage all your property valuation reports.
          </p>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : reports.length > 0 ? (
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <FileText className="h-5 w-5 text-gray-400 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          {report.propertyDetails?.address || report.property_address || 'Property Valuation'}
                        </h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Property Type</p>
                          <p className="font-medium">{report.propertyType || report.property_type || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Condition</p>
                          <p className="font-medium">{report.propertyCondition || report.property_condition || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Date</p>
                          <p className="font-medium">
                            {(report.timestamp || report.created_at) ? new Date(report.timestamp || report.created_at || '').toLocaleDateString() : 'Not available'}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-500">Estimated Value</p>
                        {(report.estimatedValueRange || (report.estimated_value_min && report.estimated_value_max)) ? (
                          <p className="text-2xl font-bold text-green-600">
                            {report.estimatedValueRange 
                              ? `$${report.estimatedValueRange.min.toLocaleString()} - $${report.estimatedValueRange.max.toLocaleString()}`
                              : `$${report.estimated_value_min?.toLocaleString() || '0'} - $${report.estimated_value_max?.toLocaleString() || '0'}`
                            }
                          </p>
                        ) : (
                          <p className="text-2xl font-bold text-gray-500">
                            Value not available
                          </p>
                        )}
                        <p className="text-sm text-gray-500">
                          {(report.confidenceScore || report.confidence_score || 0)}% confidence
                        </p>
                      </div>

                      {report.detailed_report ? (
                        <div className="bg-gray-50 rounded-lg p-4 max-h-32 overflow-y-auto">
                          <div 
                            className="text-sm text-gray-700 prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ 
                              __html: report.detailed_report
                                .replace(/\n/g, '<br>')
                                .replace(/## (.*?)(<br>|$)/g, '<h3 class="font-semibold text-gray-900 mt-2 mb-1">$1</h3>')
                                .replace(/### (.*?)(<br>|$)/g, '<h4 class="font-medium text-gray-800 mt-1 mb-1">$1</h4>')
                                .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
                                .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
                                .replace(/- (.*?)(<br>|$)/g, '<li class="ml-4">$1</li>')
                            }}
                          />
                        </div>
                      ) : (
                        <p className="text-gray-700 text-sm line-clamp-2">
                          {report.reasoning || 'No detailed report available'}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      <button
                        onClick={() => handleViewReport(report)}
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </button>
                      <button
                        onClick={() => handleShareReport(report)}
                        className="flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-white border border-blue-300 rounded-md hover:bg-blue-50"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </button>
                      <button
                        onClick={() => handleDownloadReport(report)}
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </button>
                      <button
                        onClick={() => handleDeleteReport(report.id)}
                        className="flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No reports yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first property valuation.
              </p>
              <div className="mt-6">
                <a
                  href="/dashboard/valuation"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Create Valuation
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Report Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setSelectedReport(null)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Property Valuation Report
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => selectedReport && handleShareReport(selectedReport)}
                      className="flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </button>
                    <button
                      onClick={() => setSelectedReport(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Property Details</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Address:</span> {selectedReport.propertyDetails?.address || selectedReport.property_address || 'Not provided'}</p>
                        <p><span className="font-medium">Type:</span> {selectedReport.propertyType || selectedReport.property_type || 'Not specified'}</p>
                        <p><span className="font-medium">Condition:</span> {selectedReport.propertyCondition || selectedReport.property_condition || 'Not specified'}</p>
                        <p><span className="font-medium">Size:</span> {selectedReport.propertyDetails?.propertySize ? `${selectedReport.propertyDetails.propertySize} sqft` : 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Valuation</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Estimated Value:</span> {
                          selectedReport.estimatedValueRange 
                            ? `$${selectedReport.estimatedValueRange.min.toLocaleString()} - $${selectedReport.estimatedValueRange.max.toLocaleString()}`
                            : (selectedReport.estimated_value_min && selectedReport.estimated_value_max)
                            ? `$${selectedReport.estimated_value_min.toLocaleString()} - $${selectedReport.estimated_value_max.toLocaleString()}`
                            : 'Not available'
                        }</p>
                        <p><span className="font-medium">Confidence:</span> {selectedReport.confidenceScore || selectedReport.confidence_score || 0}%</p>
                        <p><span className="font-medium">Currency:</span> {selectedReport.currency || 'USD'}</p>
                      </div>
                    </div>
                  </div>
                  
                  {selectedReport.detailed_report ? (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Detailed Report</h4>
                      <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                        <div 
                          className="text-sm text-gray-700 prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ 
                            __html: selectedReport.detailed_report
                              .replace(/\n/g, '<br>')
                              .replace(/## (.*?)(<br>|$)/g, '<h3 class="font-semibold text-gray-900 mt-4 mb-2">$1</h3>')
                              .replace(/### (.*?)(<br>|$)/g, '<h4 class="font-medium text-gray-800 mt-3 mb-1">$1</h4>')
                              .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
                              .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
                              .replace(/- (.*?)(<br>|$)/g, '<li class="ml-4">$1</li>')
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Analysis</h4>
                        <p className="text-sm text-gray-700">{selectedReport.reasoning}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Detected Features</h4>
                        <ul className="text-sm text-gray-700 list-disc list-inside">
                          {selectedReport.detectedFeatures && selectedReport.detectedFeatures.length > 0 ? (
                            selectedReport.detectedFeatures.map((feature, index) => (
                              <li key={index}>{feature}</li>
                            ))
                          ) : (
                            <li>No features detected</li>
                          )}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Suggested Upgrades</h4>
                        <div className="space-y-3">
                          {selectedReport.suggestedUpgrades && selectedReport.suggestedUpgrades.length > 0 ? (
                            selectedReport.suggestedUpgrades.map((upgrade, index) => (
                              <div key={index} className="border border-gray-200 rounded-lg p-3">
                                <h5 className="font-medium text-gray-900">{upgrade.upgrade}</h5>
                                <p className="text-sm text-gray-700 mt-1">{upgrade.reasoning}</p>
                                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                                  <span>Cost: {upgrade.estimatedCost}</span>
                                  <span>Impact: {upgrade.impactOnValue}</span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500">No upgrade suggestions available</p>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

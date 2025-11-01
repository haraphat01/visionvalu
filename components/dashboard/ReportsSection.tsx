'use client'

import React, { useEffect, useState } from 'react'
import { FileText, Trash2, Eye, X, Share2, MapPin, Calendar, TrendingUp, Award } from 'lucide-react'
import type { ValuationResult } from '@/types'
import { formatMarkdown } from '@/lib/markdownFormatter'

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
            <div className="space-y-6">
              {reports.map((report) => (
                <div key={report.id} className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-start gap-3 mb-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                            <FileText className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-slate-900 mb-1 truncate">
                              {report.propertyDetails?.address || report.property_address || 'Property Valuation'}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {(report.timestamp || report.created_at) 
                                    ? new Date(report.timestamp || report.created_at || '').toLocaleDateString('en-US', { 
                                        year: 'numeric', 
                                        month: 'short', 
                                        day: 'numeric' 
                                      })
                                    : 'Not available'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Key Info Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Property Type</p>
                            <p className="text-base font-semibold text-slate-900">{report.propertyType || report.property_type || 'Not specified'}</p>
                          </div>
                          <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Condition</p>
                            <p className="text-base font-semibold text-slate-900">{report.propertyCondition || report.property_condition || 'Not specified'}</p>
                          </div>
                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                            <p className="text-xs font-medium text-green-700 uppercase tracking-wide mb-1">Confidence</p>
                            <p className="text-base font-bold text-green-700">{(report.confidenceScore || report.confidence_score || 0)}%</p>
                          </div>
                        </div>

                        {/* Valuation Display */}
                        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6 mb-6 border border-blue-200">
                          <p className="text-sm font-medium text-slate-600 mb-2 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Estimated Value Range
                          </p>
                          {(report.estimatedValueRange || (report.estimated_value_min && report.estimated_value_max)) ? (
                            <p className="text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                              {report.estimatedValueRange 
                                ? `$${report.estimatedValueRange.min.toLocaleString()} - $${report.estimatedValueRange.max.toLocaleString()}`
                                : `$${report.estimated_value_min?.toLocaleString() || '0'} - $${report.estimated_value_max?.toLocaleString() || '0'}`
                              }
                            </p>
                          ) : (
                            <p className="text-2xl font-bold text-slate-500">
                              Value not available
                            </p>
                          )}
                        </div>

                        {/* Report Preview */}
                        {report.detailed_report ? (
                          <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                            <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                              <Award className="h-4 w-4 text-blue-600" />
                              Report Preview
                            </h4>
                            <div 
                              className="text-sm text-slate-700 max-h-40 overflow-hidden relative prose prose-sm max-w-none"
                              dangerouslySetInnerHTML={{ 
                                __html: formatMarkdown(report.detailed_report.substring(0, 500) + (report.detailed_report.length > 500 ? '...' : ''))
                              }}
                            />
                            {report.detailed_report.length > 500 && (
                              <p className="text-xs text-blue-600 mt-2 font-medium">Click View to see full report</p>
                            )}
                          </div>
                        ) : (
                          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                            <p className="text-slate-700 text-sm line-clamp-3 leading-relaxed">
                              {report.reasoning || 'No detailed report available'}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-3 lg:min-w-[140px]">
                        <button
                          onClick={() => handleViewReport(report)}
                          className="flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Report
                        </button>
                        <button
                          onClick={() => handleShareReport(report)}
                          className="flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </button>
                        <button
                          onClick={() => handleDeleteReport(report.id)}
                          className="flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </button>
                      </div>
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
            
            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">
                    Property Valuation Report
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => selectedReport && handleShareReport(selectedReport)}
                      className="flex items-center px-4 py-2 text-sm font-semibold text-blue-600 bg-white rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </button>
                    <button
                      onClick={() => setSelectedReport(null)}
                      className="text-white hover:text-blue-200 transition-colors p-2"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white px-6 py-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                <div className="space-y-6">
                  {/* Property Details & Valuation Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                      <h4 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-blue-600" />
                        Property Details
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Address</p>
                          <p className="text-slate-900 font-medium">{selectedReport.propertyDetails?.address || selectedReport.property_address || 'Not provided'}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Type</p>
                            <p className="text-slate-900 font-medium">{selectedReport.propertyType || selectedReport.property_type || 'Not specified'}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Condition</p>
                            <p className="text-slate-900 font-medium">{selectedReport.propertyCondition || selectedReport.property_condition || 'Not specified'}</p>
                          </div>
                        </div>
                        {selectedReport.propertyDetails?.propertySize && (
                          <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Size</p>
                            <p className="text-slate-900 font-medium">{selectedReport.propertyDetails.propertySize} sqft</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-5 border border-blue-200">
                      <h4 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        Valuation
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-medium text-blue-700 uppercase tracking-wide mb-2">Estimated Value</p>
                          {(selectedReport.estimatedValueRange || (selectedReport.estimated_value_min && selectedReport.estimated_value_max)) ? (
                            <p className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                              {selectedReport.estimatedValueRange 
                                ? `$${selectedReport.estimatedValueRange.min.toLocaleString()} - $${selectedReport.estimatedValueRange.max.toLocaleString()}`
                                : `$${selectedReport.estimated_value_min?.toLocaleString()} - $${selectedReport.estimated_value_max?.toLocaleString()}`
                              }
                            </p>
                          ) : (
                            <p className="text-xl font-bold text-slate-500">Not available</p>
                          )}
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-blue-200">
                          <span className="text-xs font-medium text-slate-600">Confidence</span>
                          <span className="text-base font-bold text-green-600">{selectedReport.confidenceScore || selectedReport.confidence_score || 0}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-slate-600">Currency</span>
                          <span className="text-sm font-semibold text-slate-700">{selectedReport.currency || 'USD'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Detailed Report */}
                  {selectedReport.detailed_report ? (
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                      <h4 className="text-lg font-bold text-slate-900 mb-4">Detailed Analysis</h4>
                      <div 
                        className="text-slate-700 leading-relaxed prose prose-slate max-w-none"
                        dangerouslySetInnerHTML={{ 
                          __html: formatMarkdown(selectedReport.detailed_report)
                        }}
                      />
                    </div>
                  ) : (
                    <>
                      {selectedReport.reasoning && (
                        <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
                          <h4 className="text-lg font-bold text-slate-900 mb-3">AI Analysis</h4>
                          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedReport.reasoning}</p>
                        </div>
                      )}
                      
                      {selectedReport.detectedFeatures && selectedReport.detectedFeatures.length > 0 && (
                        <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
                          <h4 className="text-lg font-bold text-slate-900 mb-3">Detected Features</h4>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {selectedReport.detectedFeatures.map((feature, index) => (
                              <li key={index} className="flex items-center gap-2 text-slate-700">
                                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {selectedReport.suggestedUpgrades && selectedReport.suggestedUpgrades.length > 0 && (
                        <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
                          <h4 className="text-lg font-bold text-slate-900 mb-4">Suggested Upgrades</h4>
                          <div className="space-y-4">
                            {selectedReport.suggestedUpgrades.map((upgrade, index) => (
                              <div key={index} className="bg-white rounded-lg p-4 border border-slate-200 hover:shadow-md transition-shadow">
                                <h5 className="font-semibold text-slate-900 mb-2">{upgrade.upgrade}</h5>
                                <p className="text-sm text-slate-700 mb-3">{upgrade.reasoning}</p>
                                <div className="flex gap-4 text-xs">
                                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded font-medium">Cost: {upgrade.estimatedCost}</span>
                                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded font-medium">Impact: {upgrade.impactOnValue}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
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

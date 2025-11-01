'use client'

import React, { useEffect, useState } from 'react'
import { useUser } from '@/hooks/useUser'
import { Coins, Plus, Minus, Clock } from 'lucide-react'
import type { CreditTransaction, CreditPackage } from '@/types'

export default function CreditsSection() {
  const { data: user, isLoading: userLoading } = useUser()
  const [transactions, setTransactions] = useState<CreditTransaction[]>([])
  const [creditPackages, setCreditPackages] = useState<CreditPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchTransactions()
    fetchCreditPackages()
    
    // Check for success/cancel messages in URL
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('success') === 'true') {
      setMessage({ type: 'success', text: 'Payment successful! Your credits have been added to your account.' })
      // Refresh user data and transactions
      fetchTransactions()
      // Clear URL params
      window.history.replaceState({}, '', window.location.pathname)
    } else if (urlParams.get('canceled') === 'true') {
      setMessage({ type: 'error', text: 'Payment was canceled. You can try again anytime.' })
      // Clear URL params
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/credits/transactions')
      if (response.ok) {
        const data = await response.json()
        setTransactions(data.transactions || [])
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
    }
  }

  const fetchCreditPackages = async () => {
    try {
      const response = await fetch('/api/credits/packages', { 
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Error fetching credit packages:', response.status, errorData)
        setMessage({ type: 'error', text: errorData.error || 'Failed to load credit packages. Please refresh the page.' })
        setCreditPackages([])
        return
      }
      
      const data = await response.json()
      if (data.packages && Array.isArray(data.packages)) {
        setCreditPackages(data.packages)
      } else {
        console.error('Invalid data format from API:', data)
        setCreditPackages([])
        setMessage({ type: 'error', text: 'Invalid data received. Please try again.' })
      }
    } catch (error) {
      console.error('Error fetching credit packages:', error)
      setMessage({ type: 'error', text: 'Failed to load credit packages. Please check your connection and try again.' })
      setCreditPackages([])
    } finally {
      setLoading(false)
    }
  }

  const handlePurchaseCredits = async (packageId: string) => {
    setPurchasing(packageId)
    setMessage(null)
    
    try {
      const response = await fetch('/api/credits/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ packageId }),
      })

      const data = await response.json()

      if (response.ok) {
        // Redirect to Stripe Checkout using the provided URL
        window.location.href = data.url || `https://checkout.stripe.com/c/pay/${data.sessionId}`
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to initiate payment. Please try again.' })
      }
    } catch (error) {
      console.error('Error purchasing credits:', error)
      setMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' })
    } finally {
      setPurchasing(null)
    }
  }


  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-200/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text mb-1">Credits Management</h1>
              <p className="text-gray-600">
                Manage your credits and view your transaction history
              </p>
            </div>
          </div>
        </div>
        
        <div className="px-8 py-6">

          {/* Message Display */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {message.type === 'success' ? (
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{message.text}</p>
                </div>
                <div className="ml-auto pl-3">
                  <div className="-mx-1.5 -my-1.5">
                    <button
                      type="button"
                      className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        message.type === 'success'
                          ? 'text-green-500 hover:bg-green-100 focus:ring-green-600'
                          : 'text-red-500 hover:bg-red-100 focus:ring-red-600'
                      }`}
                      onClick={() => setMessage(null)}
                    >
                      <span className="sr-only">Dismiss</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Current Credits */}
          <div className="mb-8 p-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200/50 rounded-2xl hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                  <Coins className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-4xl font-bold gradient-text mb-2">
                    {user?.credits || 0}
                  </h3>
                  <p className="text-lg text-gray-600 font-medium">
                    Credits Available
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Each valuation uses 5 credits
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 mb-1">Estimated valuations</div>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.floor((user?.credits || 0) / 5)}
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Credits */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Purchase Credits</h3>
            {loading || userLoading ? (
              <div className="text-center py-12">
                <div className="spinner w-12 h-12 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading packages...</p>
              </div>
            ) : creditPackages.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coins className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Credit Packages Available</h3>
                <p className="text-gray-500 mb-6">
                  We're currently setting up credit packages. Please check back soon or contact support.
                </p>
                <button
                  onClick={() => fetchCreditPackages()}
                  className="btn-outline"
                >
                  Refresh
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {creditPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`card-elevated relative overflow-hidden ${
                      pkg.popular ? 'ring-2 ring-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50' : ''
                    }`}
                  >
                    {pkg.popular && (
                      <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                        Most Popular
                      </div>
                    )}
                    <div className="text-center pt-4">
                      <h4 className="text-xl font-bold text-gray-900 mb-3">{pkg.name}</h4>
                      <div className="flex items-center justify-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mr-3">
                          <Coins className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <span className="text-4xl font-bold gradient-text">
                            {pkg.credits}
                          </span>
                          <span className="text-gray-500 ml-1 text-lg">credits</span>
                        </div>
                      </div>
                      <div className="mb-6">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <span className="text-3xl font-bold text-gray-900">
                            ${(pkg.price_cents / 100).toFixed(0)}
                          </span>
                          {pkg.original_price_cents && (
                            <span className="text-lg text-gray-500 line-through">
                              ${(pkg.original_price_cents / 100).toFixed(0)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {Math.floor(pkg.credits / 5)} valuations
                        </p>
                        {pkg.original_price_cents && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                              Save ${((pkg.original_price_cents - pkg.price_cents) / 100).toFixed(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handlePurchaseCredits(pkg.id)}
                        disabled={purchasing === pkg.id}
                        className={`w-full font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover-lift ${
                          pkg.popular
                            ? 'btn-primary'
                            : 'btn-outline'
                        }`}
                      >
                        {purchasing === pkg.id ? (
                          <div className="flex items-center justify-center">
                            <div className="spinner w-5 h-5 mr-2"></div>
                            Processing...
                          </div>
                        ) : (
                          'Purchase Now'
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Transaction History */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Transaction History</h3>
            {loading || userLoading ? (
              <div className="text-center py-12">
                <div className="spinner w-12 h-12 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading transactions...</p>
              </div>
            ) : transactions.length > 0 ? (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="card hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          transaction.type === 'spent' 
                            ? 'bg-red-100 text-red-600' 
                            : 'bg-green-100 text-green-600'
                        }`}>
                          {transaction.type === 'spent' ? (
                            <Minus className="h-6 w-6" />
                          ) : (
                            <Plus className="h-6 w-6" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-lg">
                            {transaction.description}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(transaction.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${
                          transaction.type === 'spent' ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {transaction.type === 'spent' ? '-' : '+'}{Math.abs(transaction.amount)}
                        </p>
                        <p className="text-sm text-gray-500 capitalize font-medium">
                          {transaction.type}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No transactions yet</h3>
                <p className="text-gray-500 mb-6">
                  Your credit transactions will appear here once you make a purchase or use credits.
                </p>
                <button
                  onClick={() => document.querySelector('[data-section="purchase"]')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn-outline"
                >
                  Purchase Credits
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

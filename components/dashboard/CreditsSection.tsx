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

  useEffect(() => {
    fetchTransactions()
    fetchCreditPackages()
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
      const response = await fetch('/api/credits/packages')
      if (response.ok) {
        const data = await response.json()
        setCreditPackages(data.packages || [])
      }
    } catch (error) {
      console.error('Error fetching credit packages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePurchaseCredits = async (packageId: string) => {
    try {
      const response = await fetch('/api/credits/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ packageId }),
      })

      if (response.ok) {
        const { sessionId } = await response.json()
        const stripe = await import('@stripe/stripe-js').then(({ loadStripe }) =>
          loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
        )
        
        if (stripe) {
          await stripe.redirectToCheckout({ sessionId })
        }
      }
    } catch (error) {
      console.error('Error purchasing credits:', error)
    }
  }


  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Credits Management</h1>
          <p className="text-gray-600 mb-6">
            Manage your credits and view your transaction history.
          </p>

          {/* Current Credits */}
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <Coins className="h-8 w-8 text-blue-600 mr-4" />
              <div>
                <h3 className="text-2xl font-bold text-blue-900">
                  {user?.credits || 0} Credits
                </h3>
                <p className="text-blue-700">
                  Each valuation uses 5 credits
                </p>
              </div>
            </div>
          </div>

          {/* Purchase Credits */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Purchase Credits</h3>
            {loading || userLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {creditPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`border rounded-lg p-6 hover:border-blue-300 transition-colors ${
                      pkg.popular ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    {pkg.popular && (
                      <div className="text-center mb-4">
                        <span className="inline-flex items-center rounded-full bg-blue-500 px-3 py-1 text-xs font-medium text-white">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <div className="text-center">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{pkg.name}</h4>
                      <div className="flex items-center justify-center mb-4">
                        <Coins className="h-6 w-6 text-yellow-500 mr-2" />
                        <span className="text-3xl font-bold text-gray-900">
                          {pkg.credits}
                        </span>
                        <span className="text-gray-500 ml-1">credits</span>
                      </div>
                      <div className="mb-4">
                        <p className="text-2xl font-bold text-gray-900">
                          ${(pkg.price_cents / 100).toFixed(0)}
                        </p>
                        {pkg.original_price_cents && (
                          <p className="text-sm text-gray-500 line-through">
                            ${(pkg.original_price_cents / 100).toFixed(0)}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 mt-1">
                          {Math.floor(pkg.credits / 5)} valuations
                        </p>
                      </div>
                      <button
                        onClick={() => handlePurchaseCredits(pkg.id)}
                        className={`w-full font-medium py-2 px-4 rounded-md transition-colors ${
                          pkg.popular
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                        }`}
                      >
                        Purchase
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Transaction History */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction History</h3>
            {loading || userLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center">
                      {transaction.type === 'spent' ? (
                        <Minus className="h-5 w-5 text-red-500 mr-3" />
                      ) : (
                        <Plus className="h-5 w-5 text-green-500 mr-3" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">
                          {transaction.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === 'spent' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {transaction.type === 'spent' ? '-' : '+'}{Math.abs(transaction.amount)}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">
                        {transaction.type}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Your credit transactions will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

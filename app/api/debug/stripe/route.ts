import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test basic Stripe connection
    const account = await stripe.accounts.retrieve()
    
    return NextResponse.json({
      success: true,
      account: {
        id: account.id,
        country: account.country,
        default_currency: account.default_currency,
        details_submitted: account.details_submitted,
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled
      },
      environment: {
        stripe_key_prefix: process.env.STRIPE_SECRET_KEY?.substring(0, 8) + '...',
        app_url: process.env.NEXT_PUBLIC_APP_URL,
        node_env: process.env.NODE_ENV
      }
    })
  } catch (error) {
    console.error('Stripe debug error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: {
        stripe_key_prefix: process.env.STRIPE_SECRET_KEY?.substring(0, 8) + '...',
        app_url: process.env.NEXT_PUBLIC_APP_URL,
        node_env: process.env.NODE_ENV
      }
    }, { status: 500 })
  }
}
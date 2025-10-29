import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Create a minimal test checkout session without customer
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Test Credit Package',
            },
            unit_amount: 500, // $5.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://homeworth.tech/dashboard/credits?success=true',
      cancel_url: 'https://homeworth.tech/dashboard/credits?canceled=true',
    })

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
      directLink: `https://checkout.stripe.com/c/pay/${session.id}`
    })
  } catch (error) {
    console.error('Test Stripe error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
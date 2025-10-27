import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.user_id
        const type = session.metadata?.type

        if (userId && type === 'credits') {
          // Handle credit purchase
          const packageId = session.metadata?.package_id
          const credits = parseInt(session.metadata?.credits || '0')
          
          if (credits > 0) {
            // Get the payment intent ID for tracking
            const paymentIntentId = session.payment_intent as string
            
            // Use the database function to add credits
            const { error: addCreditsError } = await supabase.rpc('add_credits', {
              user_id: userId,
              amount: credits,
              description: `Purchased ${credits} credits`,
              package_id: packageId
            })

            if (addCreditsError) {
              console.error('Error adding credits:', addCreditsError)
            } else {
              // Update the transaction with payment intent ID
              if (paymentIntentId) {
                await supabase
                  .from('credit_transactions')
                  .update({ stripe_payment_intent_id: paymentIntentId })
                  .eq('user_id', userId)
                  .eq('package_id', packageId)
                  .eq('type', 'purchased')
                  .order('created_at', { ascending: false })
                  .limit(1)
              }
              console.log(`Successfully added ${credits} credits for user ${userId}`)
            }
          }
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Find user by Stripe customer ID
        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (user) {
          await supabase
            .from('users')
            .update({
              subscription_status: subscription.status,
            })
            .eq('id', user.id)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Find user by Stripe customer ID
        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (user) {
          await supabase
            .from('users')
            .update({
              subscription_status: 'canceled',
            })
            .eq('id', user.id)
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

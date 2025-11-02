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
        
        console.log('Processing checkout.session.completed:', {
          sessionId: session.id,
          customerId: session.customer,
          metadata: session.metadata,
          paymentStatus: session.payment_status
        })

        // Only process if payment is successful
        if (session.payment_status !== 'paid') {
          console.log('Payment not completed, skipping credit addition. Status:', session.payment_status)
          break
        }

        let userId = session.metadata?.user_id
        const type = session.metadata?.type
        const packageId = session.metadata?.package_id
        let credits = parseInt(session.metadata?.credits || '0')

        // If metadata is missing, try to get from payment intent
        if ((!userId || !credits) && session.payment_intent) {
          console.log('Metadata missing from session, retrieving from payment intent:', session.payment_intent)
          try {
            const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent as string)
            console.log('Payment intent metadata:', paymentIntent.metadata)
            userId = userId || paymentIntent.metadata?.user_id
            credits = credits || parseInt(paymentIntent.metadata?.credits || '0')
          } catch (error) {
            console.error('Error retrieving payment intent:', error)
          }
        }

        // Fallback: find user by customer ID if metadata is missing
        let finalUserId = userId
        if (!finalUserId && session.customer) {
          console.log('User ID not in metadata, looking up by customer ID:', session.customer)
          const { data: user } = await supabase
            .from('users')
            .select('id')
            .eq('stripe_customer_id', session.customer as string)
            .single()
          
          if (user) {
            finalUserId = user.id
            console.log('Found user by customer ID:', finalUserId)
          } else {
            console.log('User not found by customer ID, trying email lookup...')
            // Try by customer email
            try {
              const customer = await stripe.customers.retrieve(session.customer as string)
              if (!customer.deleted && (customer as any).email) {
                const { data: emailUser } = await supabase
                  .from('users')
                  .select('id')
                  .eq('email', (customer as any).email)
                  .single()
                
                if (emailUser) {
                  finalUserId = emailUser.id
                  console.log('Found user by email:', finalUserId)
                }
              }
            } catch (error) {
              console.error('Error retrieving customer:', error)
            }
          }
        }

        // Verify this is a credit purchase and we have required data
        if (type !== 'credits') {
          console.log('Skipping: Not a credit purchase. Type:', type)
          break
        }

        if (!finalUserId) {
          console.error('Cannot process credit purchase: User ID not found', {
            sessionId: session.id,
            customerId: session.customer,
            metadata: session.metadata
          })
          // Return 500 to trigger Stripe retry
          throw new Error('User ID not found in checkout session')
        }

        if (!credits || credits <= 0) {
          console.error('Cannot process credit purchase: Invalid credits amount', {
            credits,
            sessionId: session.id
          })
          throw new Error('Invalid credits amount')
        }

        // Get payment intent ID for tracking
        const paymentIntentId = typeof session.payment_intent === 'string'
          ? session.payment_intent
          : (session.payment_intent as any)?.id

        // Check if credits were already added (prevent double-crediting)
        if (paymentIntentId) {
          const { data: existingTransaction } = await supabase
            .from('credit_transactions')
            .select('id, amount')
            .eq('stripe_payment_intent_id', paymentIntentId)
            .maybeSingle()

          if (existingTransaction) {
            console.log('Credits already added for this payment intent. Skipping.', {
              paymentIntentId,
              transactionId: existingTransaction.id
            })
            // Already processed, return success
            break
          }
        }

        // Get current user credits
        const { data: currentUser, error: fetchError } = await supabase
          .from('users')
          .select('credits, total_credits_purchased')
          .eq('id', finalUserId)
          .single()

        if (fetchError || !currentUser) {
          console.error('Error fetching user:', fetchError)
          throw new Error(`Failed to fetch user: ${fetchError?.message}`)
        }

        console.log('Adding credits:', {
          userId: finalUserId,
          currentCredits: currentUser.credits,
          creditsToAdd: credits,
          packageId
        })

        // Update credits directly in users table
        const { error: updateError } = await supabase
          .from('users')
          .update({
            credits: (currentUser.credits || 0) + credits,
            total_credits_purchased: (currentUser.total_credits_purchased || 0) + credits
          })
          .eq('id', finalUserId)

        if (updateError) {
          console.error('Error updating user credits:', updateError)
          throw new Error(`Failed to update credits: ${updateError.message}`)
        }

        // Create transaction record
        const { error: transactionError } = await supabase
          .from('credit_transactions')
          .insert({
            user_id: finalUserId,
            type: 'purchased',
            amount: credits,
            description: `Purchased ${credits} credits`,
            package_id: packageId || null,
            stripe_payment_intent_id: paymentIntentId || null
          })

        if (transactionError) {
          console.error('Error creating transaction record:', transactionError)
          // Transaction record creation failed, but credits were added
          // Log it but don't throw (credits are already added)
          console.warn('Credits added but transaction record creation failed')
        }

        console.log(`Successfully added ${credits} credits for user ${finalUserId}`)
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

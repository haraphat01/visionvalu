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
    console.error('Invalid Stripe signature:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        if (session.payment_status !== 'paid') break

        let userId = session.metadata?.user_id
        const type = session.metadata?.type
        const packageId = session.metadata?.package_id
        let credits = parseInt(session.metadata?.credits || '0')

        if ((!userId || !credits) && session.payment_intent) {
          try {
            const paymentIntent = await stripe.paymentIntents.retrieve(
              session.payment_intent as string
            )
            userId = userId || paymentIntent.metadata?.user_id
            credits = credits || parseInt(paymentIntent.metadata?.credits || '0')
          } catch (error) {
            console.error('Failed to retrieve payment intent metadata:', error)
          }
        }

        let finalUserId = userId

        if (!finalUserId && session.customer) {
          const { data: user } = await supabase
            .from('users')
            .select('id')
            .eq('stripe_customer_id', session.customer as string)
            .single()

          if (user) {
            finalUserId = user.id
          } else {
            try {
              const customer = await stripe.customers.retrieve(
                session.customer as string
              )
              if (!customer.deleted && (customer as any).email) {
                const { data: emailUser } = await supabase
                  .from('users')
                  .select('id')
                  .eq('email', (customer as any).email)
                  .single()
                if (emailUser) finalUserId = emailUser.id
              }
            } catch (error) {
              console.error('Error retrieving Stripe customer:', error)
            }
          }
        }

        if (type !== 'credits' || !finalUserId || !credits || credits <= 0) {
          console.error('Invalid credit purchase data', {
            userId: finalUserId,
            credits,
            type,
          })
          throw new Error('Invalid credit purchase data')
        }

        const paymentIntentId =
          typeof session.payment_intent === 'string'
            ? session.payment_intent
            : (session.payment_intent as any)?.id

        if (paymentIntentId) {
          const { data: existingTransaction } = await supabase
            .from('credit_transactions')
            .select('id')
            .eq('stripe_payment_intent_id', paymentIntentId)
            .maybeSingle()

          if (existingTransaction) break
        }

        const { data: currentUser, error: fetchError } = await supabase
          .from('users')
          .select('credits, total_credits_purchased')
          .eq('id', finalUserId)
          .single()

        if (fetchError || !currentUser) {
          console.error('Failed to fetch user:', fetchError)
          throw new Error(`User fetch failed: ${fetchError?.message}`)
        }

        const { error: updateError } = await supabase
          .from('users')
          .update({
            credits: (currentUser.credits || 0) + credits,
            total_credits_purchased:
              (currentUser.total_credits_purchased || 0) + credits,
          })
          .eq('id', finalUserId)

        if (updateError) {
          console.error('Failed to update user credits:', updateError)
          throw new Error(`Credit update failed: ${updateError.message}`)
        }

        const { error: transactionError } = await supabase
          .from('credit_transactions')
          .insert({
            user_id: finalUserId,
            type: 'purchased',
            amount: credits,
            description: `Purchased ${credits} credits`,
            package_id: packageId || null,
            stripe_payment_intent_id: paymentIntentId || null,
          })

        if (transactionError) {
          console.error(
            'Credit transaction record creation failed:',
            transactionError
          )
        }

        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (user) {
          await supabase
            .from('users')
            .update({ subscription_status: subscription.status })
            .eq('id', user.id)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (user) {
          await supabase
            .from('users')
            .update({ subscription_status: 'canceled' })
            .eq('id', user.id)
        }
        break
      }

      default:
        // silently ignore other events
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Stripe webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

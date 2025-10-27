import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.error('Auth error:', authError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { packageId } = body

    if (!packageId) {
      return NextResponse.json({ error: 'Package ID is required' }, { status: 400 })
    }

    // Check if Stripe is properly configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not configured')
      return NextResponse.json({ error: 'Payment system not configured' }, { status: 500 })
    }

    if (!process.env.NEXT_PUBLIC_APP_URL) {
      console.error('NEXT_PUBLIC_APP_URL is not configured')
      return NextResponse.json({ error: 'App URL not configured' }, { status: 500 })
    }

    // Get the credit package
    const { data: creditPackage, error: packageError } = await supabase
      .from('credit_packages')
      .select('*')
      .eq('id', packageId)
      .eq('active', true)
      .single()

    if (packageError) {
      console.error('Package error:', packageError)
      return NextResponse.json({ error: 'Failed to fetch credit package' }, { status: 500 })
    }

    if (!creditPackage) {
      return NextResponse.json({ error: 'Credit package not found' }, { status: 404 })
    }

    // Ensure user exists in users table (in case trigger didn't work)
    const { data: existingUser, error: userCheckError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (userCheckError || !existingUser) {
      console.log('User not found in users table, creating profile...')
      // Create user profile if it doesn't exist
      const { error: createUserError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0],
          credits: 5,
          total_credits_purchased: 0,
          stripe_customer_id: null,
          subscription_status: 'inactive',
        })

      if (createUserError) {
        console.error('Error creating user profile:', createUserError)
        return NextResponse.json({ error: 'Failed to create user profile' }, { status: 500 })
      }
    }

    // Get or create Stripe customer
    let customerId = existingUser?.stripe_customer_id

    if (!customerId) {
      try {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: {
            supabase_user_id: user.id,
          },
        })
        customerId = customer.id

        // Update user with Stripe customer ID
        const { error: updateError } = await supabase
          .from('users')
          .update({ stripe_customer_id: customerId })
          .eq('id', user.id)

        if (updateError) {
          console.error('Error updating user with Stripe customer ID:', updateError)
          // Continue anyway, we have the customer ID
        }
      } catch (stripeError) {
        console.error('Error creating Stripe customer:', stripeError)
        return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 })
      }
    }

    // Create checkout session for credit purchase
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${creditPackage.name} - ${creditPackage.credits} Credits`,
              description: `${creditPackage.credits} credits for property valuations (5 credits per valuation)`,
            },
            unit_amount: creditPackage.price_cents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/credits?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/credits?canceled=true`,
      metadata: {
        user_id: user.id,
        type: 'credits',
        package_id: packageId,
        credits: creditPackage.credits.toString(),
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Error creating credit purchase session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

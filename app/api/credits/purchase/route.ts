import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    console.log('Starting credit purchase request...')
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.error('Auth error:', authError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    console.log('User authenticated:', { id: user.id, email: user.email })

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
    console.log('Fetching credit package:', packageId)
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
      console.error('Credit package not found for ID:', packageId)
      return NextResponse.json({ error: 'Credit package not found' }, { status: 404 })
    }
    
    console.log('Credit package found:', { 
      name: creditPackage.name, 
      credits: creditPackage.credits, 
      price: creditPackage.price_cents 
    })

    // Ensure user exists in users table (in case trigger didn't work)
    console.log('Checking if user exists in users table...')
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
      console.log('User profile created successfully')
    } else {
      console.log('User profile found:', { 
        id: existingUser.id, 
        email: existingUser.email, 
        credits: existingUser.credits,
        stripe_customer_id: existingUser.stripe_customer_id 
      })
    }

    // Get or create Stripe customer
    let customerId = existingUser?.stripe_customer_id
    console.log('Stored Stripe customer ID:', customerId)

    if (!customerId) {
      console.log('Creating new Stripe customer...')
      try {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: {
            supabase_user_id: user.id,
          },
        })
        customerId = customer.id
        console.log('Stripe customer created:', customerId)

        // Update user with new Stripe customer ID
        const { error: updateError } = await supabase
          .from('users')
          .update({ stripe_customer_id: customerId })
          .eq('id', user.id)

        if (updateError) {
          console.error('Error updating user with Stripe customer ID:', updateError)
          // Continue anyway, we have the customer ID
        } else {
          console.log('User updated with new Stripe customer ID')
        }
      } catch (stripeError) {
        console.error('Error creating Stripe customer:', stripeError)
        return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 })
      }
    } else {
      console.log('Using existing Stripe customer:', customerId)
    }

    // Create checkout session for credit purchase
    console.log('Creating Stripe checkout session with:', {
      customerId,
      packageId,
      credits: creditPackage.credits,
      price: creditPackage.price_cents,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/credits?success=true`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/credits?canceled=true`
    })

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

    console.log('Stripe checkout session created successfully:', session.id)

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Error creating credit purchase session:', error)
    
    // Handle specific Stripe errors
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      })
      
      // Check for specific Stripe error types
      if (error.message.includes('No such customer')) {
        console.error('Stripe customer not found - this might be a test/live mode mismatch')
      }
      if (error.message.includes('Invalid API Key')) {
        console.error('Invalid Stripe API key - check environment variables')
      }
      if (error.message.includes('testmode')) {
        console.error('Test/Live mode mismatch detected')
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to create checkout session',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

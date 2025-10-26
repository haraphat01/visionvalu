import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get user's current credits
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('credits, total_credits_purchased')
      .eq('id', user.id)
      .single()

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 })
    }

    // Check if user has enough credits for a valuation (5 credits)
    const hasEnoughCredits = userData.credits >= 5

    return NextResponse.json({
      credits: userData.credits,
      totalCreditsPurchased: userData.total_credits_purchased,
      hasEnoughCredits,
      creditsNeeded: hasEnoughCredits ? 0 : 5 - userData.credits
    })
  } catch (error) {
    console.error('Error checking user credits:', error)
    return NextResponse.json(
      { error: 'Failed to check credits' },
      { status: 500 }
    )
  }
}

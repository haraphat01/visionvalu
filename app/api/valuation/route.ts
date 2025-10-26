import { createClient } from '@/lib/supabase/server'
import { getPropertyValuation } from '@/services/geminiService'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import type { PropertyDetails, ValuationResult } from '@/types'

export async function POST(request: Request) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { images, propertyDetails } = body as { 
    images: string[]
    propertyDetails: PropertyDetails 
  }

  // Check if user has enough credits (5 credits per valuation)
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('credits')
    .eq('id', user.id)
    .single()

  if (userError || !userData) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  if (userData.credits < 5) {
    return NextResponse.json({ 
      error: 'Insufficient credits. You need 5 credits for a property valuation.',
      creditsNeeded: 5 - userData.credits
    }, { status: 400 })
  }

  try {
    // Get valuation from Gemini
    const valuationData = await getPropertyValuation(images, propertyDetails)

    const newReport: ValuationResult = {
      ...valuationData,
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      previewImage: `data:image/jpeg;base64,${images[0]}`,
      propertyDetails: propertyDetails,
      userId: user.id,
    }

    // Save the report
    const { data: savedReport, error: reportError } = await supabase
      .from('reports')
      .insert({
        user_id: user.id,
        report_data: newReport,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (reportError) {
      return NextResponse.json({ error: reportError.message }, { status: 500 })
    }

    // Deduct 5 credits using the database function
    const { error: spendCreditsError } = await supabase.rpc('spend_credits', {
      user_id: user.id,
      amount: 5,
      description: 'Property valuation report'
    })

    if (spendCreditsError) {
      return NextResponse.json({ error: spendCreditsError.message }, { status: 500 })
    }

    return NextResponse.json({ report: newReport })
  } catch (error) {
    console.error('Error getting valuation:', error)
    return NextResponse.json(
      { error: 'Failed to get property valuation' },
      { status: 500 }
    )
  }
}

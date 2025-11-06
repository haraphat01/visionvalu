import { createClient } from '@/lib/supabase/server'
import { getPropertyValuation } from '@/services/geminiService'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import type { PropertyDetails, ValuationResult } from '@/types'
import crypto from 'crypto'

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

  // Basic user-facing input validation
  const MIN_IMAGES = 3
  if (!Array.isArray(images) || images.length < MIN_IMAGES) {
    return NextResponse.json({ 
      error: `Please upload at least ${MIN_IMAGES} photos (exterior, kitchen, and bathroom recommended).`,
      hint: 'More diverse, well-lit photos improve accuracy and confidence.'
    }, { status: 400 })
  }
  const hasEmptyImage = images.some(img => typeof img !== 'string' || img.trim().length === 0)
  if (hasEmptyImage) {
    return NextResponse.json({ 
      error: 'One or more images are invalid. Ensure photos are uploaded correctly.',
      hint: 'Try re-uploading the images and avoid duplicates or zero-byte files.'
    }, { status: 400 })
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
      creditsNeeded: 5 - userData.credits,
      currentCredits: userData.credits
    }, { status: 400 })
  }

  try {
    // Compute idempotency hash from inputs
    const inputHash = crypto
      .createHash('sha256')
      .update(JSON.stringify({ images, propertyDetails }))
      .digest('hex')

    // Return existing report if same input already processed
    const { data: existingReport } = await supabase
      .from('reports')
      .select('id, report_data')
      .eq('user_id', user.id)
      .contains('report_data', { inputHash })
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (existingReport?.report_data) {
      return NextResponse.json({ report: existingReport.report_data })
    }

    // Get valuation from Gemini
    const valuationData = await getPropertyValuation(images, propertyDetails)

    const newReport: ValuationResult = {
      ...valuationData,
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      previewImage: `data:image/jpeg;base64,${images[0]}`,
      propertyDetails: propertyDetails,
      userId: user.id,
      inputHash,
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
    const { data: spendResult, error: spendCreditsError } = await supabase.rpc('spend_credits', {
      user_id: user.id,
      amount: 5,
      description: 'Property valuation report'
    })

    if (spendCreditsError) {
      // Compensating delete if credit deduction fails
      if (savedReport?.id) {
        await supabase.from('reports').delete().eq('id', savedReport.id)
      }
      return NextResponse.json({ error: spendCreditsError.message }, { status: 500 })
    }

    // spend_credits returns boolean; if false, user no longer has enough credits (race condition)
    if (spendResult === false) {
      if (savedReport?.id) {
        await supabase.from('reports').delete().eq('id', savedReport.id)
      }
      const { data: refreshedUser } = await supabase.from('users').select('credits').eq('id', user.id).single()
      return NextResponse.json({ 
        error: 'Insufficient credits. You need 5 credits for a property valuation.',
        creditsNeeded: 5 - (refreshedUser?.credits ?? 0),
        currentCredits: refreshedUser?.credits ?? 0
      }, { status: 400 })
    }

    return NextResponse.json({ report: newReport })
  } catch (error) {
    console.error('Error getting valuation:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    if (message.startsWith('Valuation validation failed:')) {
      // Surface actionable guidance to the user
      const guidance: string[] = []
      if (message.includes('too wide')) guidance.push('Try adding the property address for market comps.')
      if (message.includes('tight')) guidance.push('Upload additional rooms and exterior angles to broaden context.')
      if (message.includes('Confidence score')) guidance.push('Ensure photos are sharp and well-lit.')
      return NextResponse.json(
        { 
          error: 'We could not produce a reliable valuation from the current inputs.',
          details: message.replace('Valuation validation failed: ', ''),
          suggestions: guidance
        },
        { status: 422 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to get property valuation. Please try again with clearer photos or add an address.' },
      { status: 500 }
    )
  }
}

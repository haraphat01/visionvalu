import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { ValuationResult } from '@/types'

export async function GET() {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: reports, error } = await supabase
    .from('reports')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Extract report_data from each record and add the database id
  const processedReports = reports.map(report => {
    const reportData = report.report_data
    
    // Check if this is a detailed report (has detailed_report field)
    if (reportData.detailed_report) {
      return {
        id: report.id, // Use the database ID
        property_address: reportData.property_address,
        property_type: reportData.property_type,
        property_condition: reportData.property_condition,
        estimated_value_min: reportData.estimated_value_min,
        estimated_value_max: reportData.estimated_value_max,
        confidence_score: reportData.confidence_score,
        currency: reportData.currency,
        detailed_report: reportData.detailed_report,
        preview_image: reportData.preview_image,
        created_at: report.created_at,
        updated_at: report.updated_at
      }
    } else {
      // This is an old valuation result, return as is
      return {
        id: report.id,
        ...reportData,
        created_at: report.created_at,
        updated_at: report.updated_at
      }
    }
  })

  return NextResponse.json({ reports: processedReports })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { report } = body as { report: ValuationResult }

  // Check if user has enough credits
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('credits')
    .eq('id', user.id)
    .single()

  if (userError || !userData) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  if (userData.credits < 1) {
    return NextResponse.json({ error: 'Insufficient credits' }, { status: 400 })
  }

  // Save the report
  const { data: savedReport, error: reportError } = await supabase
    .from('reports')
    .insert({
      user_id: user.id,
      report_data: report,
      created_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (reportError) {
    return NextResponse.json({ error: reportError.message }, { status: 500 })
  }

  // Deduct credit
  const { error: creditError } = await supabase
    .from('users')
    .update({ credits: userData.credits - 1 })
    .eq('id', user.id)

  if (creditError) {
    return NextResponse.json({ error: creditError.message }, { status: 500 })
  }

  // Log credit transaction
  await supabase
    .from('credit_transactions')
    .insert({
      user_id: user.id,
      amount: -1,
      type: 'spent',
      description: 'Property valuation report',
    })

  return NextResponse.json({ report: savedReport })
}

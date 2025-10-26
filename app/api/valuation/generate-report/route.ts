import { createClient } from '@/lib/supabase/server'
import { generateDetailedReport } from '@/services/geminiService'
import { NextResponse } from 'next/server'
import type { ValuationResult } from '@/types'

export async function POST(request: Request) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { report } = body as { report: ValuationResult }

  try {
    const detailedReport = await generateDetailedReport(report)

    // Create a new report entry with the detailed report as the main content
    const reportData = {
      id: report.id, // Use the same ID as the valuation result
      user_id: user.id,
      property_address: report.propertyDetails?.address || 'Not specified',
      property_type: report.propertyType,
      property_condition: report.propertyCondition,
      estimated_value_min: report.estimatedValueRange.min,
      estimated_value_max: report.estimatedValueRange.max,
      confidence_score: report.confidenceScore,
      currency: report.currency,
      detailed_report: detailedReport, // This is now the main content
      preview_image: report.previewImage,
      created_at: new Date().toISOString(),
    }

    // Save the detailed report as a new report entry
    const { data: savedReport, error: reportError } = await supabase
      .from('reports')
      .insert({
        user_id: user.id,
        report_data: reportData,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (reportError) {
      return NextResponse.json({ error: reportError.message }, { status: 500 })
    }

    return NextResponse.json({ report: detailedReport })
  } catch (error) {
    console.error('Error generating detailed report:', error)
    return NextResponse.json(
      { error: 'Failed to generate detailed report' },
      { status: 500 }
    )
  }
}

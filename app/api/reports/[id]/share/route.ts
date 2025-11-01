import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { randomBytes } from 'node:crypto'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify the report belongs to the user
  const { data: report, error: reportError } = await supabase
    .from('reports')
    .select('id, user_id')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (reportError || !report) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 })
  }

  // Generate a unique share token
  const shareToken = randomBytes(32).toString('hex')
  
  // Update the report with the share token (we'll add this column to the database)
  // For now, we'll store it in report_data
  const { data: fullReport, error: fetchError } = await supabase
    .from('reports')
    .select('report_data')
    .eq('id', params.id)
    .single()

  if (fetchError || !fullReport) {
    return NextResponse.json({ error: 'Error fetching report' }, { status: 500 })
  }

  // Update report_data to include share_token
  const updatedReportData = {
    ...fullReport.report_data,
    share_token: shareToken,
    share_token_created_at: new Date().toISOString()
  }

  const { error: updateError } = await supabase
    .from('reports')
    .update({ report_data: updatedReportData })
    .eq('id', params.id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  const shareUrl = `${request.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/share/${shareToken}`

  return NextResponse.json({ shareUrl, shareToken })
}


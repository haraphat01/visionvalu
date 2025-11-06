import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: report, error } = await supabase
    .from('reports')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!report) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 })
  }

  return NextResponse.json({ report })
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // First try by database id
  let { data, error } = await supabase
    .from('reports')
    .delete()
    .eq('id', params.id)
    .eq('user_id', user.id)
    .select('id')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // If nothing deleted, attempt fallback by embedded valuation id in report_data
  if (!data || data.length === 0) {
    const { data: rowsByEmbedded, error: findErr } = await supabase
      .from('reports')
      .select('id')
      .eq('user_id', user.id)
      .contains('report_data', { id: params.id })

    if (findErr) {
      return NextResponse.json({ error: findErr.message }, { status: 500 })
    }

    if (!rowsByEmbedded || rowsByEmbedded.length === 0) {
      return NextResponse.json({ error: 'Report not found or not owned by user' }, { status: 404 })
    }

    const ids = rowsByEmbedded.map(r => r.id)
    const { error: deleteByEmbeddedErr } = await supabase
      .from('reports')
      .delete()
      .in('id', ids)
      .eq('user_id', user.id)

    if (deleteByEmbeddedErr) {
      return NextResponse.json({ error: deleteByEmbeddedErr.message }, { status: 500 })
    }
  }

  return NextResponse.json({ message: 'Report deleted successfully' })
}

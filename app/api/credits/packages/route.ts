import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: packages, error } = await supabase
      .from('credit_packages')
      .select('id,name,credits,price_cents,original_price_cents,popular,active')
      .eq('active', true)
      .order('credits', { ascending: true })

    if (error) {
      console.error('Error fetching credit packages:', error)
      return NextResponse.json({ error: error.message, packages: [] }, { status: 500 })
    }

    return NextResponse.json({ packages: packages || [] })
  } catch (error) {
    console.error('Unexpected error in credit packages API:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch credit packages',
      packages: [] 
    }, { status: 500 })
  }
}

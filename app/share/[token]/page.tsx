import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ReportShareView from '@/components/ReportShareView'

export default async function SharePage({ 
  params 
}: { 
  params: { token: string } 
}) {
  const supabase = await createClient()
  
  // Find report by share token
  const { data: reports, error } = await supabase
    .from('reports')
    .select('*')
    .limit(1000) // We need to search through reports to find the one with matching token

  if (error || !reports) {
    notFound()
  }

  // Find the report with matching share token
  const report = reports.find((r: any) => {
    const reportData = r.report_data
    return reportData?.share_token === params.token
  })

  if (!report) {
    notFound()
  }

  // Check if token is expired (optional - 30 days)
  const reportData = report.report_data as any
  if (reportData?.share_token_created_at) {
    const tokenAge = Date.now() - new Date(reportData.share_token_created_at).getTime()
    const daysSinceCreation = tokenAge / (1000 * 60 * 60 * 24)
    
    if (daysSinceCreation > 30) {
      notFound() // Token expired
    }
  }

  return <ReportShareView report={report} />
}


import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import ReportsSection from '@/components/dashboard/ReportsSection'

export default async function ReportsPage() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/login')
  }

  return (
    <DashboardLayout>
      <ReportsSection />
    </DashboardLayout>
  )
}

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import DashboardValuation from '@/components/dashboard/DashboardValuation'

export default async function ValuationPage() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/login')
  }

  return (
    <DashboardLayout>
      <DashboardValuation />
    </DashboardLayout>
  )
}

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import CreditsSection from '@/components/dashboard/CreditsSection'

export default async function CreditsPage() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/login')
  }

  return (
    <DashboardLayout>
      <CreditsSection />
    </DashboardLayout>
  )
}

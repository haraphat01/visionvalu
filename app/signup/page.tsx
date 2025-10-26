import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SignupForm from '@/components/auth/SignupForm'

export default async function SignupPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
    redirect('/dashboard')
  }

  return <SignupForm />
}

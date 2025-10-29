'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@/types'

export function useUser() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['user'],
    queryFn: async (): Promise<User | null> => {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !authUser) {
        return null
      }

      // Get user profile from database
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (userError) {
        console.error('Error fetching user profile:', userError)
        return null
      }

      return userData
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
}

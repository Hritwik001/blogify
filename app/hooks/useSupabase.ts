'use client'

import { useMemo } from 'react'
import { supabase } from '@/supabase/supabaseClient'

export const useSupabase = () => {
  return useMemo(() => ({ supabase }), [])
}

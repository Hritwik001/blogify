'use client'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!


const supabase = typeof window !== 'undefined'
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export function useSupabase() {
  if (!supabase) {
    throw new Error('Supabase must be used on the client side only.')
  }

  return supabase;
}

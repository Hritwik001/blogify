import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Safe fallback in case env vars are missing
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    const { data, error } = await supabaseAdmin.auth.admin.listUsers()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const user = data.users.find((u) => u.email === email)

    return NextResponse.json({
      exists: !!user,
      confirmed: user?.email_confirmed_at !== null,
    })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// app/api/check-user/route.ts

import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Use server-only environment variables (no NEXT_PUBLIC_)
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Only safe in backend
)

export async function POST(req: Request) {
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
}

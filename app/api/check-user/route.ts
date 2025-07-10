import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Safe to use only in backend
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 500 })
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 })
  }
}


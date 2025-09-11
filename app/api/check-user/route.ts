// app/api/check-user/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function badRequest(msg: string) {
  return NextResponse.json({ error: msg }, { status: 400 });
}
function serverError(msg: string) {
  return NextResponse.json({ error: msg }, { status: 500 });
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY for /api/check-user.'
  );
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const email = typeof body?.email === 'string' ? body.email.trim() : '';

    if (!email) return badRequest('Invalid email');

    // Case-insensitive compare helper
    const eq = (a?: string | null, b?: string | null) =>
      (a ?? '').toLowerCase() === (b ?? '').toLowerCase();

    // Use listUsers with pagination (works across SDK versions)
    const PER_PAGE = 100;
    let page = 1;
    let foundUser: any = null;
    let total = 0;
    let totalPages = 1; // will update after first call

    while (page <= totalPages && !foundUser) {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers({
        page,
        perPage: PER_PAGE,
      });

      if (error) {
        return serverError(error.message);
      }

      const users = data?.users ?? [];
      total = data?.total ?? users.length;
      totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

      const match = users.find((u) => eq(u.email, email));
      if (match) {
        foundUser = match;
        break;
      }

      // If fewer than perPage returned, we’re at the end
      if (users.length < PER_PAGE) break;

      page += 1;
    }

    return NextResponse.json({
      exists: !!foundUser,
      confirmed: !!foundUser?.email_confirmed_at,
    });
  } catch (e: any) {
    return serverError(e?.message ?? 'Unknown error');
  }
}

// ❌ No console.log of env/secrets

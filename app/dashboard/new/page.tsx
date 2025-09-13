// app/dashboard/new/page.tsx
'use client'

// keep this: it's fine on a client page and tells Next not to prerender
export const dynamic = 'force-dynamic'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import PostForm from '@/app/components/PostForm'
import { MotionDiv, variants } from '@/app/providers/Motionprovider'

// ⛔ remove: useSupabase import (it can drag Supabase into server path)
// import { useSupabase } from '@/supabase/useSupabase'

export default function NewPostPage() {
  // ✅ create Supabase only in the browser
  const supabase = useMemo(() => {
    const { createClient } = require('@supabase/supabase-js')
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }, [])

  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (title: string, content: string) => {
    setSubmitting(true)
    try {
      const { data: userData, error: userErr } = await supabase.auth.getUser()
      if (userErr) throw userErr
      const user = userData?.user

      const { error } = await supabase.from('blogs').insert({
        title,
        content,
        user_id: user?.id ?? null,
      })
      if (error) throw error

      router.push('/dashboard')
    } catch (e) {
      console.error(e)
      // TODO: show toast if you want
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <MotionDiv
      variants={variants.popIn}
      initial="hidden"
      animate="show"
      className="max-w-2xl mx-auto p-6"
    >
      <h1 className="text-2xl font-semibold mb-4">Create New Post</h1>
      <PostForm onSubmit={handleSubmit} isSubmitting={submitting} />
    </MotionDiv>
  )
}

// app/dashboard/new/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PostForm from '@/app/components/PostForm';
import { MotionDiv, variants } from '@/app/providers/Motionprovider';
import { useSupabase } from '@/supabase/useSupabase';

export default function NewPostPage() {
  const supabase = useSupabase();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (title: string, content: string) => {
    setSubmitting(true);
    const user = (await supabase.auth.getUser()).data.user;
    const { error } = await supabase.from('blogs').insert({
      title,
      content,
      user_id: user?.id,
    });
    setSubmitting(false);
    if (!error) router.push('/dashboard');
  };

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
  );
}

// app/dashboard/edit/[id]/page.tsx
'use client';



import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PostForm from '@/app/components/PostForm';
import { MotionDiv, variants } from '@/app/providers/Motionprovider';
import { useSupabase } from '@/supabase/useSupabase';

type Blog = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
};

export default function EditPostPage() {
  const supabase = useSupabase();
  const router = useRouter();
  const params = useParams();
  const blogId = params?.id as string;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', blogId)
        .single();
      if (!error) setBlog(data as Blog);
      setLoading(false);
    };
    if (blogId) load();
  }, [blogId, supabase]);

  const handleSubmit = async (title: string, content: string) => {
    setSubmitting(true);
    const { error } = await supabase
      .from('blogs')
      .update({ title, content })
      .eq('id', blogId);
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
      <h1 className="text-2xl font-semibold mb-4">Edit Post</h1>

      {loading || !blog ? (
        <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="h-40 rounded-xl bg-black/5 animate-pulse" />
        </MotionDiv>
      ) : (
        <PostForm
          initialTitle={blog.title}
          initialContent={blog.content}
          onSubmit={handleSubmit}
          isSubmitting={submitting}
        />
      )}
    </MotionDiv>
  );
}

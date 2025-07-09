'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/supabase/supabaseClient';
import { useRouter, useParams } from 'next/navigation';

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const blogId = params?.id as string;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', blogId)
        .eq('user_id', user.id)
        .single();

      if (data) {
        setTitle(data.title);
        setContent(data.content);
      }

      setLoading(false);
    };

    checkAuthAndLoad();
  }, [blogId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from('blogs')
      .update({ title, content })
      .eq('id', blogId)
      .eq('user_id', user.id);

    if (!error) {
      router.push('/dashboard');
    }
  };

  if (loading) {
    return <p className="p-6 text-center text-gray-500">Loading blog...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Edit Blog</h1>
        <form onSubmit={handleUpdate} className="space-y-5">
          <div>
            <label className="block mb-1 text-gray-700 font-medium">Title</label>
            <input
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter blog title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-700 font-medium">Content</label>
            <textarea
              className="w-full h-48 border border-gray-300 px-4 py-2 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write your blog content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Update Blog
          </button>
        </form>
      </div>
    </div>
  );
}

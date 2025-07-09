'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/supabase/supabaseClient';
import { useRouter } from 'next/navigation';

export default function NewBlogPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
      }
    };

    checkAuth();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase.from('blogs').insert([
      {
        title,
        content,
        user_id: user.id,
      },
    ]);

    if (!error) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Create New Blog</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 space-y-6">
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">Title</label>
          <input
            type="text"
            placeholder="Enter blog title"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">Content</label>
          <textarea
            placeholder="Write your content here..."
            className="w-full h-40 px-4 py-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
        >
          Publish Blog
        </button>
      </form>
    </div>
  );
}

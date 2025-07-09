'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/supabase/supabaseClient';
import { useRouter } from 'next/navigation';
import BlogCard from '../components/BlogCard';

interface Blog {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
}

export default function DashboardPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBlogs = async () => {
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
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching blogs:', error.message);
      } else {
        setBlogs(data as Blog[]);
      }

      setLoading(false);
    };

    fetchBlogs();
  }, [router]); // ✅ FIXED: added router dependency

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('blogs').delete().eq('id', id);
    if (error) {
      console.error('Error deleting blog:', error.message);
      return;
    }
    setBlogs((prev) => prev.filter((blog) => blog.id !== id));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return <p className="p-6 text-center text-gray-500">Loading blogs...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Your Blogs</h1>
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/dashboard/new')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + New Blog
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      {blogs.length === 0 ? (
        <p className="text-gray-600">You haven’t written any blogs yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

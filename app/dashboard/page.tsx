'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/supabase/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BlogCard from '../components/BlogCard';

import { m } from 'framer-motion';
import { MotionDiv, MotionButton, variants } from '@/app/providers/Motionprovider';

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
  }, [router]);

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

  // Stagger + item variants
  const container = { show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } };
  const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };

  if (loading) {
    return (
      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 text-center text-gray-500"
      >
        Loading blogs…
      </MotionDiv>
    );
  }

  return (
    <MotionDiv
      variants={variants.fadeIn}
      initial="hidden"
      animate="show"
      className="min-h-screen bg-gray-100 p-6"
    >
      {/* Header row with Add + Logout (restored) */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Your Blogs</h1>
        <div className="flex gap-3">
          <MotionButton
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/dashboard/new')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
          >
            + New Blog
          </MotionButton>
          <MotionButton
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer"
          >
            Logout
          </MotionButton>
        </div>
      </div>

      {blogs.length === 0 ? (
        <MotionDiv variants={variants.popIn} initial="hidden" animate="show" className="text-gray-600">
          You haven’t written any blogs yet.{' '}
          <Link href="/dashboard/new" className="text-blue-600 hover:underline">
            Create your first one
          </Link>
          .
        </MotionDiv>
      ) : (
        <m.ul
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {blogs.map((blog) => (
            <m.li key={blog.id} variants={item}>
              <BlogCard blog={blog} onDelete={handleDelete} />
            </m.li>
          ))}
        </m.ul>
      )}
    </MotionDiv>
  );
}

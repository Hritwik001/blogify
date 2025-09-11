'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/supabase/useSupabase';
import { MotionDiv, MotionButton, variants } from '@/app/providers/Motionprovider';

export default function Sidebar() {
  const supabase = useSupabase();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <MotionDiv
      variants={variants.slideUp}
      initial="hidden"
      animate="show"
      className="w-64 bg-gray-100 p-6 border-r border-gray-300 h-screen"
    >
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>
      <nav className="space-y-4">
        <MotionDiv whileHover={{ x: 4 }}>
          <Link href="/dashboard" className="block text-blue-600">
            Home
          </Link>
        </MotionDiv>
        <MotionDiv whileHover={{ x: 4 }}>
          <Link href="/dashboard/new" className="block text-blue-600">
            New Post
          </Link>
        </MotionDiv>
        <MotionButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="text-red-500 mt-4"
        >
          Logout
        </MotionButton>
      </nav>
    </MotionDiv>
  );
}

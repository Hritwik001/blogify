'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MotionDiv, MotionButton, variants } from '@/app/providers/Motionprovider';

//this is Blog card component
interface Blog {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

interface BlogCardProps {
  blog: Blog;
  onDelete: (id: string) => void;
}

export default function BlogCard({ blog, onDelete }: BlogCardProps) {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  return (
    <MotionDiv
      variants={{ ...variants.popIn, hover: { y: -3, scale: 1.005 } }}
      initial="hidden"
      animate="show"
      whileHover="hover"
      whileTap={{ scale: 0.985 }}
      className="bg-white rounded-xl shadow-md p-5 flex flex-col justify-between"
    >
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {blog.title}
        </h2>

        <p className="text-gray-700 text-sm mb-3 whitespace-pre-line">
          {expanded || blog.content.length <= 300
            ? blog.content
            : blog.content.slice(0, 300) + '...'}
        </p>

        {blog.content.length > 300 && (
          <MotionButton
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-blue-600 hover:underline bg-transparent p-0"
          >
            {expanded ? 'Show Less' : 'Read More'}
          </MotionButton>
        )}

        <p className="text-xs text-gray-500 mt-2">
          🕒 {new Date(blog.created_at).toLocaleString()}
        </p>
      </div>

      <div className="mt-4 flex gap-3">
        <MotionButton
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push(`/dashboard/edit/${blog.id}`)}
          className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Edit
        </MotionButton>
        <MotionButton
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onDelete(blog.id)}
          className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
        >
          Delete
        </MotionButton>
      </div>
    </MotionDiv>
  );
}

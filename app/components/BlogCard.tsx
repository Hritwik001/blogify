'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
    <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition duration-200 flex flex-col justify-between">
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
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-blue-600 hover:underline"
          >
            {expanded ? 'Show Less' : 'Read More'}
          </button>
        )}

        <p className="text-xs text-gray-500 mt-2">
          🕒 {new Date(blog.created_at).toLocaleString()}
        </p>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={() => router.push(`/dashboard/edit/${blog.id}`)}
          className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(blog.id)}
          className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { MotionDiv, MotionButton, variants } from '@/app/providers/Motionprovider';

type PostFormProps = {
  initialTitle?: string;
  initialContent?: string;
  onSubmit: (title: string, content: string) => void;
  isSubmitting?: boolean;
};

export default function PostForm({
  initialTitle = '',
  initialContent = '',
  onSubmit,
  isSubmitting = false,
}: PostFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(title, content);
  };

  return (
    <MotionDiv
      variants={variants.popIn}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="w-full border border-gray-300 p-2 rounded h-40"
          />
        </div>

        <MotionButton
          type="submit"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isSubmitting ? 'Saving…' : 'Submit'}
        </MotionButton>
      </form>
    </MotionDiv>
  );
}

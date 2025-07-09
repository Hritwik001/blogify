// app/page.tsx

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-xl">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome to Blogify</h1>
        <p className="text-lg text-gray-600 mb-6">
          A simple blog app where you can write, edit, and manage your own blogs.
        </p>
        <div className="space-x-4">
          <Link
            href="/login"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Login
          </Link>
          <Link
            href="/dashboard"
            className="border border-blue-600 text-blue-600 px-6 py-2 rounded hover:bg-blue-50"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

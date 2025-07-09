'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/app/hooks/useSupabase';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { supabase } = useSupabase();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else if (!data.user?.confirmed_at) {
      setMessage('Please confirm your email before logging in.');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Welcome Back</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {message && <p className="text-yellow-600 text-sm">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{' '}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/"
            className="inline-block text-sm text-gray-500 hover:text-gray-700 hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

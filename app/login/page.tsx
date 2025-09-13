'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { FormEvent, useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AnimatePresence, m } from 'framer-motion';

import { useSupabase } from '@/app/hooks/useSupabase';
import { MotionDiv, MotionButton, variants } from '@/app/providers/Motionprovider';

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function LoginPage() {
  const { supabase } = useSupabase();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const emailValid = useMemo(() => validateEmail(email), [email]);
  const canSubmit = emailValid && password.length >= 6 && !loading;

  // ✅ Clean Supabase hash on /login
  useEffect(() => {
    if (window.location.hash.includes('access_token')) {
      window.history.replaceState({}, '', '/login');
    }
  }, []);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!canSubmit) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (!data.user?.confirmed_at) {
        setMessage('Please confirm your email before logging in.');
        return;
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MotionDiv
      variants={variants.fadeIn}
      initial="hidden"
      animate="show"
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4"
    >
      <div className="w-full max-w-md">
        <MotionDiv
          variants={variants.popIn}
          initial="hidden"
          animate="show"
          className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-xl shadow-xl shadow-gray-200/60"
        >
          <div className="relative p-6 sm:p-8">
            <h1 className="text-xl font-semibold mb-4">Welcome back</h1>

            <AnimatePresence>
              {error && <m.div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-2 text-red-700">{error}</m.div>}
              {message && <m.div className="mb-4 rounded border border-yellow-200 bg-yellow-50 px-4 py-2 text-yellow-700">{message}</m.div>}
            </AnimatePresence>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded border px-3 py-2"
                  required
                />
              </div>
              <div>
                <label>Password</label>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded border px-3 py-2"
                  required
                />
                <button type="button" onClick={() => setShowPw((s) => !s)} className="text-xs mt-1 text-blue-500">
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </div>

              <MotionButton type="submit" disabled={!canSubmit} className="w-full rounded bg-indigo-600 text-white py-2">
                {loading ? 'Logging in…' : 'Log in'}
              </MotionButton>
            </form>

            <p className="mt-4 text-sm text-gray-600">
              Don’t have an account? <Link href="/signup" className="text-blue-600 hover:underline">Sign up</Link>
            </p>
          </div>
        </MotionDiv>
      </div>
    </MotionDiv>
  );
}

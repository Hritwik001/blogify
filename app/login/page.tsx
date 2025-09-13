'use client';
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
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

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
      setError(err?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MotionDiv
      variants={variants.fadeIn}
      initial="hidden"
      animate="show"
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-rose-50 p-4"
    >
      {/* Spotlight background */}
      <m.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1 }}
        className="absolute -top-40 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-200 via-fuchsia-200 to-rose-200 blur-3xl"
      />

      <div className="w-full max-w-md">
        <MotionDiv
          variants={variants.popIn}
          initial="hidden"
          animate="show"
          className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-xl shadow-xl"
        >
          <m.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
            style={{ transformOrigin: 'left' }}
            className="h-1 w-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500"
          />

          <div className="p-6 sm:p-8">
            <h1 className="text-2xl font-semibold text-gray-800 mb-1">Welcome back</h1>
            <p className="text-sm text-gray-500 mb-6">Log in to continue 🚀</p>

            <AnimatePresence>
              {error && (
                <m.div
                  key="err"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700"
                >
                  {error}
                </m.div>
              )}
              {message && (
                <m.div
                  key="msg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-2 text-sm text-yellow-700"
                >
                  {message}
                </m.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full rounded-xl border px-3.5 py-2.5 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-indigo-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type={showPw ? 'text' : 'password'}
                  className="w-full rounded-xl border px-3.5 py-2.5 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-indigo-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="text-xs mt-1 text-indigo-600 hover:underline"
                >
                  {showPw ? 'Hide password' : 'Show password'}
                </button>
              </div>

              <MotionButton
                type="submit"
                disabled={!canSubmit}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:from-indigo-500 hover:to-fuchsia-500 focus:outline-none"
              >
                {loading ? 'Logging in…' : 'Log in'}
                <span className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-white/10 group-hover:translate-x-0 transition-transform" />
              </MotionButton>
            </form>

            <p className="mt-4 text-sm text-gray-600">
              Don’t have an account?{' '}
              <Link href="/signup" className="text-indigo-600 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </MotionDiv>
      </div>
    </MotionDiv>
  );
}

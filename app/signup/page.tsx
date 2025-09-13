'use client';
import { FormEvent, useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, m } from 'framer-motion';

import { useSupabase } from '@/app/hooks/useSupabase';
import { MotionDiv, MotionButton, variants } from '@/app/providers/Motionprovider';

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
function passwordScore(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/\d|[!@#$%^&*(),.?":{}|<>]/.test(pw)) score++;
  return score;
}

export default function SignupPage() {
  const { supabase } = useSupabase();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);

  const base = (
    typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || ''
  ).replace(/\/+$/, '');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const emailValid = useMemo(() => validateEmail(email), [email]);
  const pwScore = useMemo(() => passwordScore(password), [password]);
  const pwLabel = ['Too short', 'Weak', 'Okay', 'Strong'][pwScore];
  const canSubmit = emailValid && password.length >= 6 && !loading;

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!canSubmit) return;

    setLoading(true);
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${base}/login` },
      });

      if (signUpError) setError(signUpError.message);
      else {
        setMessage('Signup successful! Please check your email to confirm your account.');
        setEmail('');
        setPassword('');
      }
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
          {/* Accent bar */}
          <m.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
            style={{ transformOrigin: 'left' }}
            className="h-1 w-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500"
          />

          <div className="p-6 sm:p-8">
            <h1 className="text-2xl font-semibold text-gray-800 mb-1">Create your account</h1>
            <p className="text-sm text-gray-500 mb-6">Welcome to Blogify ✨</p>

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
                  className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700"
                >
                  {message}
                </m.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSignup} className="space-y-4">
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
                <p className="mt-1 text-xs text-gray-500">Strength: {pwLabel}</p>
              </div>

              <MotionButton
                type="submit"
                disabled={!canSubmit}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:from-indigo-500 hover:to-fuchsia-500 focus:outline-none"
              >
                {loading ? 'Signing up…' : 'Create account'}
                <span className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-white/10 group-hover:translate-x-0 transition-transform" />
              </MotionButton>
            </form>

            <p className="mt-4 text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-indigo-600 hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </MotionDiv>
      </div>
    </MotionDiv>
  );
}

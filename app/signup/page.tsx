'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

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

  // ✅ Clean base URL (strip trailing slash)
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
        options: {
          emailRedirectTo: `${base}/login`, // ✅ redirect to /login
        },
      });

      if (signUpError) {
        setError(signUpError.message);
      } else {
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
            <h1 className="text-xl font-semibold mb-4">Create your account</h1>

            <AnimatePresence>
              {error && <m.div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-2 text-red-700">{error}</m.div>}
              {message && <m.div className="mb-4 rounded border border-green-200 bg-green-50 px-4 py-2 text-green-700">{message}</m.div>}
            </AnimatePresence>

            <form onSubmit={handleSignup} className="space-y-4">
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
                <p className="text-xs text-gray-500 mt-1">Strength: {pwLabel}</p>
              </div>

              <MotionButton type="submit" disabled={!canSubmit} className="w-full rounded bg-indigo-600 text-white py-2">
                {loading ? 'Signing up…' : 'Create account'}
              </MotionButton>
            </form>

            <p className="mt-4 text-sm text-gray-600">
              Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Log in</Link>
            </p>
          </div>
        </MotionDiv>
      </div>
    </MotionDiv>
  );
}

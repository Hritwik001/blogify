'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { FormEvent, useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, m } from 'framer-motion';

import { useSupabase } from '@/app/hooks/useSupabase';
import { MotionDiv, MotionButton, variants } from '@/app/providers/Motionprovider';

type CheckResp = { exists: boolean; confirmed: boolean };

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
function passwordScore(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/\d|[!@#$%^&*(),.?":{}|<>]/.test(pw)) score++;
  return score; // 0..3
}

export default function SignupPage() {
  const { supabase } = useSupabase();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);

  // ✅ FIX: clean base URL (strip trailing slash)
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

  async function checkIfUserExists(email: string): Promise<CheckResp> {
    const res = await fetch('/api/check-user', {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: { 'Content-Type': 'application/json' },
    });
    return res.json();
  }

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!canSubmit) return;

    setLoading(true);
    try {
      const check = await checkIfUserExists(email);
      if (check.exists && check.confirmed) {
        setError('This email is already registered. Please log in instead.');
        return;
      }

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${base}/login`, // ✅ clean redirect
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
      {/* ✅ Your full UI stays here */}
      <m.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.75, scale: 1 }}
        transition={{ duration: 0.9 }}
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -top-20 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-200 via-fuchsia-200 to-rose-200 blur-3xl opacity-40" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,\
          <svg xmlns=\'http://www.w3.org/2000/svg\' width=\'160\' height=\'160\' viewBox=\'0 0 160 160\'>\
            <filter id=\'n\'>\
              <feTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'2\' stitchTiles=\'stitch\'/>\
              <feColorMatrix type=\'saturate\' values=\'0\'/>\
              <feComponentTransfer><feFuncA type=\'table\' tableValues=\'0 0 0 0.04\'/></feComponentTransfer>\
            </filter>\
            <rect width=\'100%\' height=\'100%\' filter=\'url(%23n)\'/>\
          </svg>')] opacity-40" />
      </m.div>

      <div className="w-full max-w-md">
        <MotionDiv
          variants={variants.popIn}
          initial="hidden"
          animate="show"
          className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-xl shadow-xl shadow-gray-200/60"
        >
          <div className="relative p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <m.div className="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center text-white font-bold shadow-md">
                Z
              </m.div>
              <div>
                <h1 className="text-[1.25rem] font-semibold">Create your account</h1>
                <p className="text-sm text-gray-500">Welcome to Blogify</p>
              </div>
            </div>

            {/* Alerts */}
            <AnimatePresence mode="popLayout">
              {error && <m.div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</m.div>}
              {message && <m.div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</m.div>}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label htmlFor="email">Email</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <label htmlFor="password">Password</label>
                <input id="password" type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <MotionButton type="submit" disabled={!canSubmit}>
                {loading ? 'Signing up…' : 'Create account'}
              </MotionButton>
              <p className="text-center text-sm">Already have an account? <Link href="/login">Log in</Link></p>
            </form>
          </div>
        </MotionDiv>
      </div>
    </MotionDiv>
  );
}

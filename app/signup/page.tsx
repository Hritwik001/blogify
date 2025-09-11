// app/signup/page.tsx
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

  // Use your configured base URL for email redirect (non-localhost when deployed)
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (typeof window !== 'undefined' ? window.location.origin : '');

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
          emailRedirectTo: `${base}/login`, // adjust if using a dedicated callback route
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
      {/* Decorative spotlight + subtle noise */}
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
          {/* Animated top accent bar */}
          <m.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            style={{ transformOrigin: 'left' }}
            className="h-1 w-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500"
          />

          {/* Soft inner glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -inset-24 bg-gradient-to-br from-white/10 to-transparent blur-2xl" />
          </div>

          <div className="relative p-6 sm:p-8">
            {/* Brand / Heading */}
            <div className="mb-6 flex items-center gap-3">
              <m.div
                initial={{ opacity: 0, scale: 0.95, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center text-white font-bold shadow-md"
              >
                Z
              </m.div>
              <div>
                <h1 className="text-[1.25rem] font-semibold leading-tight tracking-tight">
                  Create your account
                </h1>
                <p className="text-sm text-gray-500">Welcome to Blogify</p>
              </div>
            </div>

            {/* Animated alerts */}
            <AnimatePresence mode="popLayout">
              {error ? (
                <m.div
                  key="err"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {error}
                </m.div>
              ) : null}
              {message ? (
                <m.div
                  key="msg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
                >
                  {message}
                </m.div>
              ) : null}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSignup} className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    required
                    className={`peer w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm outline-none transition placeholder:text-gray-400
                      ${
                        email.length === 0
                          ? 'border-gray-200 focus:border-gray-300 focus:ring-2 focus:ring-gray-200/60'
                          : emailValid
                          ? 'border-emerald-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200'
                          : 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-200'
                      }`}
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {/* subtle focus glow */}
                  <span className="pointer-events-none absolute inset-0 -z-10 rounded-xl opacity-0 peer-focus:opacity-100 transition ring-2 ring-indigo-500/0 peer-focus:ring-indigo-500/10" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPw ? 'text' : 'password'}
                    required
                    className="peer w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-gray-300 focus:ring-2 focus:ring-gray-200/60"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <MotionButton
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowPw((s) => !s)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    {showPw ? 'Hide' : 'Show'}
                  </MotionButton>
                  <span className="pointer-events-none absolute inset-0 -z-10 rounded-xl opacity-0 peer-focus:opacity-100 transition ring-2 ring-indigo-500/0 peer-focus:ring-indigo-500/10" />
                </div>

                {/* Password strength (animated bars) */}
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <m.span
                        key={i}
                        initial={{ scaleX: 0.2, opacity: 0.4 }}
                        animate={{
                          scaleX: pwScore > i ? 1 : 0.6,
                          opacity: pwScore > i ? 1 : 0.4,
                        }}
                        transition={{ type: 'spring', stiffness: 240, damping: 22 }}
                        className={`origin-left h-1.5 w-full rounded-full ${
                          pwScore > i
                            ? pwScore === 3
                              ? 'bg-emerald-500'
                              : 'bg-amber-500'
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <m.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1 text-xs text-gray-500"
                  >
                    {pwLabel}
                  </m.p>
                </div>
              </div>

              {/* Submit */}
              <MotionButton
                type="submit"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                disabled={!canSubmit}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:from-indigo-500 hover:to-fuchsia-500 focus:outline-none disabled:from-gray-300 disabled:to-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed cursor-pointer"
              >
                <span className="relative z-10">
                  {loading ? 'Signing up…' : 'Create account'}
                </span>
                {/* sheen */}
                <span className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-white/10 group-hover:translate-x-0 transition-transform" />
              </MotionButton>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
                >
                  Log in
                </Link>
              </p>
            </form>
          </div>
        </MotionDiv>
      </div>
    </MotionDiv>
  );
}

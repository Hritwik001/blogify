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
          emailRedirectTo: `${base}/login`, // ✅ stays clean now
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
      {/* 🔥 Your full UI stays here — unchanged */}
      {/* ... everything you pasted originally ... */}
    </MotionDiv>
  );
}

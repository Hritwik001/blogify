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

  // 🔑 Fix: clean up Supabase hash safely
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
      className="relative min-h-screen flex items-center justify-center p-4"
    >
      {/* ... your styled form stays unchanged ... */}
      <div className="w-full max-w-md">
        <form onSubmit={handleLogin} className="space-y-4">
          {/* email + password inputs ... (unchanged) */}
          <MotionButton type="submit" disabled={!canSubmit}>
            {loading ? 'Logging in…' : 'Log in'}
          </MotionButton>
        </form>
      </div>
    </MotionDiv>
  );
}

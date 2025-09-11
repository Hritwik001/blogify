// app/page.tsx
'use client';

import Link from "next/link";
import { MotionDiv, variants } from "./providers/Motionprovider";
import { m } from "framer-motion";

export default function HomePage() {
  return (
    <MotionDiv
      variants={variants.fadeIn}
      initial="hidden"
      animate="show"
      className="relative min-h-screen flex items-center justify-center bg-gray-50 px-4 overflow-hidden"
    >
      {/* Decorative spotlight (purely visual) */}
      <m.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -top-24 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-200 via-fuchsia-200 to-rose-200 blur-3xl opacity-40" />
      </m.div>

      <MotionDiv
        variants={variants.popIn}
        initial="hidden"
        animate="show"
        className="relative text-center max-w-xl"
      >
        <h1 className="text-4xl font-bold mb-3 text-gray-900">
          Welcome to Blogify
        </h1>

        {/* Animated accent under title */}
        <m.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          style={{ transformOrigin: "center" }}
          className="mx-auto mb-5 h-1 w-24 rounded-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500"
        />

        <p className="text-lg text-gray-600 mb-7">
          A simple blog app where you can write, edit, and manage your own blogs.
        </p>

        <div className="space-x-4">
          <MotionDiv whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="inline-block">
            <Link
              href="/login"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Login
            </Link>
          </MotionDiv>
          <MotionDiv whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="inline-block">
            <Link
              href="/dashboard"
              className="border border-blue-600 text-blue-600 px-6 py-2 rounded hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              Go to Dashboard
            </Link>
          </MotionDiv>
        </div>
      </MotionDiv>
    </MotionDiv>
  );
}

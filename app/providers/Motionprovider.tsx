'use client';

import { PropsWithChildren } from 'react';
import { LazyMotion, domAnimation, MotionConfig, m } from 'framer-motion';

// Feature flag: set NEXT_PUBLIC_MOTION_ON=false to turn off animations
const motionOn = process.env.NEXT_PUBLIC_MOTION_ON !== 'false';

export function MotionProvider({ children }: PropsWithChildren) {
  if (!motionOn) {
    return <>{children}</>;
  }
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig
        reducedMotion="user"
        transition={{ type: 'spring', stiffness: 220, damping: 26, mass: 0.6 }}
      >
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}

// Shorthands
export const MotionDiv = m.div;
export const MotionSpan = m.span;
export const MotionButton = m.button;

// Reusable motion variants
export const variants = {
  fadeIn:  { hidden: { opacity: 0 }, show: { opacity: 1 } },
  popIn:   { hidden: { opacity: 0, scale: 0.98, y: 6 }, show: { opacity: 1, scale: 1, y: 0 } },
  slideUp: { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } },
  overlay: { hidden: { opacity: 0 }, show: { opacity: 1 } },
  hoverLift: { rest: { y: 0 }, hover: { y: -3 } },
};

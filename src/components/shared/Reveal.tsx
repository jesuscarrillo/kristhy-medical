"use client";

import { LazyMotion, domAnimation, m, useReducedMotion, type Variants } from "framer-motion";
import { ReactNode } from "react";

const baseVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const reducedVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
};

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        className={className}
        variants={prefersReducedMotion ? reducedVariants : baseVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ delay: prefersReducedMotion ? 0 : delay }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}

"use client";

import { motion } from "framer-motion";

type Props = {
  text: string;
  className?: string;
  loaded?: boolean;
};

export default function LineRevealOnScroll({ text, className,loaded=true }: Props) {
  const lines = text.split("\n");

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const line = {
    hidden: { y: "110%", opacity: 0 },
    show: {
      y: "0%",
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.625, 0.05, 0, 1],
      },
    },
  };

  return (
    <motion.span
      className={className}
      variants={container}
      initial="hidden"
      animate={loaded ? "show":"hidden"}
      viewport={{ once: true, margin: "-10% 0px" }}
    >
      {lines.map((lineText, i) => (
        <span key={i} className="overflow-hidden block">
          <motion.span
            variants={line as any}
            className="inline-block"
          >
            {lineText}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
"use client";

import { motion } from "framer-motion";

type HoverSlideTextProps = {
  text: string;
  className?: string;
  activeClassName?: string;
};

export default function HoverSlideText({
  text,
  className = "",
  activeClassName = "",
}: HoverSlideTextProps) {
  return (
    <motion.span
      initial="rest"
      whileHover="hover"
      animate="rest"
      className={`relative inline-grid h-[1.2em] overflow-hidden leading-none ${className}`}
    >
      {/* Normal text */}
      <motion.span
        variants={{
          rest: { y: "0%" },
          hover: { y: "-100%" },
        }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="col-start-1 row-start-1"
      >
        {text}
      </motion.span>

      {/* Hover text */}
      <motion.span
        variants={{
          rest: { y: "100%" },
          hover: { y: "0%" },
        }}
        transition={{
          duration: 0.45,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={`col-start-1 row-start-1 ${activeClassName}`}
      >
        {text}
      </motion.span>
    </motion.span>
  );
}
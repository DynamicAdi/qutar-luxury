"use client";

import React from "react";
import { motion } from "framer-motion";

type HoverSlideTextProps = {
  text: React.ReactNode;
  className?: string;
  activeClassName?: string;

  /** set true when parent is hovered */
  hovered?: boolean;
};

export default function HoverSlideText({
  text,
  className = "",
  activeClassName = "",
  hovered = false,
}: HoverSlideTextProps) {
  return (
    <motion.span
      initial={false}
      animate={hovered ? "hover" : "rest"}
      whileHover="hover"
      className={`relative inline-grid h-[1.2em] overflow-hidden leading-none ${className}`}
    >
      {/* Normal Text */}
      <motion.span
        variants={{
          rest: { y: "0%" },
          hover: { y: "-100%" },
        }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="col-start-1 row-start-1 flex items-center gap-2"
      >
        {text}
      </motion.span>

      {/* Hover Text */}
      <motion.span
        variants={{
          rest: { y: "100%" },
          hover: { y: "0%" },
        }}
        transition={{
          duration: 0.45,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={`col-start-1 row-start-1 flex items-center gap-2 ${activeClassName}`}
      >
        {text}
      </motion.span>
    </motion.span>
  );
}
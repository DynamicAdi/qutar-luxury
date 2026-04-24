"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export type Service = {
  id: number;
  number: string;
  title: string;
  description: string;
  image: string;
};

export function ServiceCard({ service }: { service: Service }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 90,
        scale: 0.96,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover="hover"
      animate="rest"
      className="relative min-h-[200px] overflow-hidden border-t border-white/10 md:min-h-[300px]"
    >
      {/* Whole Card Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover scale-105"
        />

        <div className="absolute inset-0 bg-black/35" />

        <motion.div
          variants={{
            rest: { scaleY: 1 },
            hover: { scaleY: 0 },
          }}
          transition={{
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ originY: 0 }}
          className="absolute inset-0 md:bg-[#151717]"
        />
      </div>

      {/* Whole Card Content */}
      <div className="relative z-10 grid min-h-[340px] lg:grid-cols-2">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="flex gap-6 px-6 py-10 md:px-10 md:py-14"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/40 text-sm text-white">
            {service.number}
          </div>

          <p className="max-w-sm text-lg font-medium leading-relaxed text-white md:text-xl">
            {service.description}
          </p>
        </motion.div>

        {/* Right */}
        <div className="flex items-start justify-between gap-6 px-6 py-10 md:px-10 md:py-14">
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.22,
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
              variants={{
                rest: { y: 0 },
                hover: { y: -4 },
              }}
              className="text-6xl font-light leading-none tracking-tight text-white md:text-[12rem]"
            >
              {service.title}
            </motion.h3>

            {/* underline bar */}
            <motion.div
              variants={{
                rest: { scaleX: 0 },
                hover: { scaleX: 1 },
              }}
              transition={{
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ originX: 0 }}
              className="mt-4 h-[6px] w-full bg-white"
            />
          </div>

          {/* right arrow */}
          <motion.div
            variants={{
              rest: { opacity: 0, x: -20 },
              hover: { opacity: 1, x: 0 },
            }}
            transition={{
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-3 self-center text-white"
          >
            <ArrowRight className="size-40" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, Variants } from "framer-motion";
import {fadeUp,lineReveal,staggerWrap} from "@/animations";
const STEPS = [
  {
    number: "01",
    title: "Talk to a Real Human.",
    text: "We match you with an expert who actually listens.",
  },
  {
    number: "02",
    title: "Get Clarity.",
    text: "We define what you really need, not just what’s available.",
  },
  {
    number: "03",
    title: "Move Forward.",
    text: "We find what fits — and make it happen.",
  },
];


export default function RealEstateRewiredSection() {
  return (
    <section className="px-6 max-w-[1400px] mx-auto py-20 md:px-10 lg:px-16 xl:px-24 overflow-hidden">
      <motion.div
        variants={staggerWrap}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid gap-16 lg:grid-cols-[0.7fr_1.3fr]"
      >
        {/* Left */}
        <div className="flex flex-col justify-start">
          <motion.h2
            variants={fadeUp}
            className="text-5xl font-medium leading-[0.95] tracking-tight text-black md:text-5xl"
          >
            Real Estate,
            <br />
            <span className="text-black/20">Rewired.</span>
          </motion.h2>

          <motion.div variants={fadeUp}>
            <Link
              href="#"
              className="mt-10 inline-flex w-fit items-center gap-3 rounded-full bg-black px-8 py-4 text-sm font-medium text-white transition hover:translate-x-1"
            >
              Start Your Search
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>

        {/* Right */}
        <div>
          <motion.p
            variants={fadeUp}
            className="mb-10 text-3xl font-medium tracking-tight text-black md:text-3xl"
          >
            Steps:
          </motion.p>

          <div className="relative">
            <motion.div
              variants={lineReveal}
              className="absolute top-0 left-0 h-px w-full bg-black/10"
            />

            <motion.div
              variants={staggerWrap}
              className="relative"
            >
              {STEPS.map((step, i) => (
                <motion.div
                  key={step.number}
                  variants={fadeUp}
                  whileHover="hover"
                  initial="rest"
                  animate="rest"
                  className="group grid gap-5 border-b border-black/10 py-10 md:grid-cols-[60px_1fr]"
                >
                  {/* Number */}
                  <motion.div
                    variants={{
                      rest: { opacity: 0.3, x: 0 },
                      hover: { opacity: 1, x: 6 },
                    }}
                    transition={{ duration: 0.35 }}
                    className="text-2xl font-semibold text-black/25 md:text-xl"
                  >
                    {step.number}
                  </motion.div>

                  {/* Text */}
                  <motion.div
                    variants={{
                      rest: { x: 0 },
                      hover: { x: 10 },
                    }}
                    transition={{
                      duration: 0.45,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="text-3xl font-medium leading-tight tracking-tight md:text-4xl"
                  >
                    <span className="text-black">{step.title} </span>
                    <span className="text-black/20">{step.text}</span>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
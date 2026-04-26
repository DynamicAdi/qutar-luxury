"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { fadeUp,staggerWrap,imageReveal } from "@/animations";

export default function ForAgents() {
  return (
    <section className="px-6 py-20 md:px-10 lg:px-16 xl:px-24 overflow-hidden">
      <motion.div
        variants={staggerWrap}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.18 }}
        className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]"
      >
        {/* Left Side */}
        <div className="flex h-full flex-col">
          {/* top */}
          <motion.p
            variants={fadeUp}
            className="max-md:text-2xl md:text-sm uppercase font-semibold mb-10 text-black"
          >
            For Agents
          </motion.p>

          {/* center */}
          <div className="flex flex-1 items-center justify-start">
            <motion.div
              variants={imageReveal}
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.5 }}
              className="relative h-[260px] w-[220px] overflow-hidden md:h-[340px] md:w-[260px]"
            >
              <Image
                src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop"
                alt="Agent Success"
                fill
                className="object-cover transition duration-700 hover:scale-105"
              />
            </motion.div>
          </div>
        </div>

        {/* Right Side */}
        <div>
          {/* Heading */}
          <motion.h2
            variants={fadeUp}
            className="max-w-5xl text-4xl font-medium leading-[0.95] tracking-tight text-black md:text-4xl lg:text-5xl"
          >
            Don’t Rent Your Career.{" "}
            <span className="text-black/25">Own It.</span>
          </motion.h2>

          {/* Main Image */}
          <motion.div
            variants={imageReveal}
            whileHover={{ scale: 1.015 }}
            transition={{ duration: 0.55 }}
            className="relative mt-10 h-[400px] overflow-hidden md:h-[420px] lg:h-[500px]"
          >
            <Image
              src="https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=1600&auto=format&fit=crop"
              alt="Neighborhood Aerial View"
              fill
              className="object-cover transition duration-700 hover:scale-105"
            />
          </motion.div>

          {/* Text */}
          <motion.div variants={staggerWrap} className="mt-10 max-w-4xl">
            <motion.p
              variants={fadeUp}
              className="text-xl font-medium leading-snug text-black md:text-3xl"
            >
              At QLP, our agents don’t just work for the brand—they own a part
              of it.
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="mt-4 text-lg leading-relaxed text-black/28 md:text-2xl"
            >
              We give top performers real equity, so they’re invested in more
              than just your transaction—they’re invested in your outcome.
              Agents are certified, supported, and equipped to deliver five-star
              service—because their success is tied to yours. You’re not just
              here to close deals — you’re building a career, a life, a legacy.
              We help agents find the company that gives them the support,
              tools, and leadership to thrive.
            </motion.p>

            {/* CTA */}
            <motion.div variants={fadeUp}>
              <Link
                href="#"
                className="mt-8 inline-flex items-center gap-3 rounded-full bg-black px-7 py-4 text-sm font-medium text-white transition hover:translate-x-1"
              >
                Join The Movement
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
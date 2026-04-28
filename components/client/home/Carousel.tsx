"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { fadeUp, staggerWrap, imageReveal } from "@/animations";
type Testimonial = {
  id: number;
  name: string;
  role: string;
  review: string;
  rating: number;
};

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Bernadette Hogan",
    role: "Home Buyer",
    review:
      "Michael was a great realtor. Such a hard worker, dedicated to helping us find the perfect neighborhood, price point and home.",
    rating: 5,
  },
  {
    id: 2,
    name: "Daniel Brooks",
    role: "Seller",
    review:
      "Our apartment sold above asking in less than a week. Communication and strategy were exceptional throughout.",
    rating: 5,
  },
  {
    id: 3,
    name: "Olivia Reed",
    role: "Investor",
    review:
      "They helped us secure a strong investment property with honest guidance and elite negotiation support.",
    rating: 5,
  },
  {
    id: 4,
    name: "Marcus Lee",
    role: "First Time Buyer",
    review:
      "Every question was answered clearly. They made the entire process feel simple and stress-free.",
    rating: 5,
  },
  {
    id: 5,
    name: "Sophia Turner",
    role: "Relocation Client",
    review:
      "Moving cities felt overwhelming, but they handled every detail and found us the perfect place fast.",
    rating: 5,
  },
];
export default function TestimonialsSection() {
  const [active, setActive] = useState(0);

  return (
    <section className="bg-[#ececec] text-black overflow-x-hidden">
      <motion.div
        variants={staggerWrap}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.18 }}
        className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 md:px-10 py-16 md:py-24 space-y-10 overflow-hidden"
      >
        {/* Heading */}
        <motion.h2
          variants={fadeUp}
          className="max-w-full break-words text-3xl sm:text-4xl md:text-6xl font-medium tracking-tight leading-tight"
        >
          Don’t Take <span className="text-black/25">Our Word for It.</span>
        </motion.h2>

        {/* Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-start w-full overflow-hidden">
          {/* Image */}
          <motion.div
            variants={imageReveal}
            whileHover={{ scale: 1.015 }}
            transition={{ duration: 0.5 }}
            className="relative w-full min-w-0 h-[260px] sm:h-[360px] md:h-[520px] rounded-xl overflow-hidden"
          >
            <Image
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1600&auto=format&fit=crop"
              alt="Happy Clients"
              fill
              className="object-cover"
            />
          </motion.div>

          {/* Right */}
          <motion.div
            variants={fadeUp}
            className="w-full min-w-0 overflow-hidden"
          >
            <div className="border-t border-black/30 pt-6 md:pt-10" />

            {/* Controls */}
            <div className="mb-6 md:mb-10 flex flex-wrap items-center gap-2 w-full">
              {TESTIMONIALS.map((t, index) => (
                <button
                  key={t.id}
                  onClick={() => setActive(index)}
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm transition-all ${
                    active === index
                      ? "border-black bg-black text-white"
                      : "border-black/20 text-black/40"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <span className="ml-auto shrink-0 text-3xl sm:text-4xl md:text-5xl leading-none">
                ”
              </span>
            </div>

            {/* Slider */}
            <div className="relative w-full overflow-hidden min-h-[250px]">
              <motion.div
                animate={{ x: `-${active * 100}%` }}
                transition={{
                  type: "spring",
                  stiffness: 70,
                  damping: 18,
                }}
                className="flex w-full"
              >
                {TESTIMONIALS.map((item) => (
                  <div
                    key={item.id}
                    className="w-full min-w-full shrink-0 pr-1"
                  >
                    <p className="w-full break-words text-base sm:text-lg md:text-2xl leading-relaxed">
                      “{item.review}”
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2 text-[10px] sm:text-xs uppercase tracking-[0.18em] text-black/75">
                      <span>{item.name}</span>
                      <span>/</span>
                      <span>{item.role}</span>
                      <span>/</span>
                      <span>{"★".repeat(item.rating)}</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

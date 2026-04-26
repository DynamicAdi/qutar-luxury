"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { fadeUp,staggerWrap,imageReveal } from "@/animations";
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
    <section className="bg-[#ececec] text-black overflow-hidden">
      <motion.div
        variants={staggerWrap}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.18 }}
        className="mx-auto md:max-w-[1400px] space-y-10 px-6 py-24 md:px-10"
      >
        {/* Heading */}
        <motion.h2
          variants={fadeUp}
          className="text-4xl font-medium tracking-tight md:text-6xl"
        >
          Don’t Take <span className="text-black/25">Our Word for It.</span>
        </motion.h2>

        <div className="grid gap-10 md:grid-cols-2">
          {/* Image */}
          <motion.div
            variants={imageReveal}
            whileHover={{ scale: 1.015 }}
            transition={{ duration: 0.5 }}
            className="relative max-md:max-w-lg h-[520px] overflow-hidden"
          >
            <Image
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1600&auto=format&fit=crop"
              alt="Happy Clients"
              fill
              className="object-cover transition duration-700 hover:scale-105"
            />
          </motion.div>

          {/* Right */}
          <motion.div
            variants={fadeUp}
            className="max-w-lg justify-self-end"
          >
            <div className="border-t border-black/30 pt-10" />

            {/* Controls */}
            <div className="mb-10 flex items-center gap-4 flex-wrap">
              {TESTIMONIALS.map((t, index) => (
                <button
                  key={t.id}
                  onClick={() => setActive(index)}
                  className={`flex h-11 w-11 items-center justify-center rounded-full border text-sm transition-all duration-300 ${
                    active === index
                      ? "border-black bg-black text-white scale-105"
                      : "border-black/20 text-black/35 hover:border-black/40 hover:text-black"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <span className="ml-auto text-5xl leading-none">”</span>
            </div>

            {/* Carousel */}
            <div className="relative overflow-hidden min-h-[260px]">
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
                    className="w-full shrink-0 pr-2"
                  >
                    <p className="max-w-xl text-xl leading-relaxed md:text-2xl">
                      “{item.review}”
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.25em] text-black/75">
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
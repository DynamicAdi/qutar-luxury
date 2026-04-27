"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import useZoomScroll, { fadeUp, stagger } from "@/animations";
const CONTENT = [
  {
    image:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2200&auto=format&fit=crop",
    title: "Find Your Identity",
    desc: "A home that reflects your ambition, growth, and future.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2200&auto=format&fit=crop",
    title: "Move Forward",
    desc: "Every next chapter begins with the right foundation.",
  },
];
export default function WhyFindSection() {
  const containerRef = useZoomScroll();
  return (
    <div className="grid">
      {/* SECTION 1 */}
      <section className="px-6 py-20 md:px-10 lg:px-16 xl:px-24 overflow-hidden">
        <div className="grid gap-12 lg:grid-cols-[0.42fr_1fr]">
          {/* Left Label */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.6 }}
          >
            <p className="text-2xl md:text-sm font-semibold uppercase text-black">
              Why QLP
            </p>
          </motion.div>

          {/* Right Heading */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
            className="max-w-xl ml-auto"
          >
            <h2 className="text-4xl font-medium leading-[1.02] tracking-tight text-black md:text-6xl lg:text-4xl">
              Your life’s changing. Don’t just find a place — find what’s next.{" "}
              <span className="text-black/22">
                We help you move forward with clarity, confidence, and the right
                agent by your side.
              </span>
            </h2>
          </motion.div>
        </div>

        {/* Large Image */}
        <motion.div
          initial={{ opacity: 0, scale: 1.08, y: 60 }}
          whileInView={{
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
              duration: 1.3,
              ease: [0.22, 1, 0.36, 1],
            },
          }}
          viewport={{ once: true, amount: 0.3 }}
          className="relative mt-16 h-[320px] overflow-hidden md:h-[520px] lg:h-[680px]"
        >
          <Image
            src="https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?q=80&w=1800&auto=format&fit=crop"
            alt="New York skyline"
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      </section>

      {/* SECTION 2 */}
      <section ref={containerRef} className="bg-black">
        {CONTENT.map((item, index) => (
          <div
            key={index}
            className="zoom-card relative h-screen w-full overflow-hidden"
          >
            <div className="zoom-image absolute inset-0">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>

            <div className="zoom-overlay absolute inset-0 z-10 flex items-center justify-center px-6">
              <div className="max-w-3xl text-center text-white">
                <p className="mb-4 text-sm uppercase tracking-[0.35em] text-white/70">
                  Chapter {index + 1}
                </p>

                <h2 className="text-5xl font-semibold md:text-7xl">
                  {item.title}
                </h2>

                <p className="mt-6 text-lg text-white/80 md:text-xl">
                  {item.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* SECTION 3 */}
      <section className="px-6 py-20 md:px-10 lg:px-16 xl:px-24 overflow-hidden">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            },
          }}
          viewport={{ once: true, amount: 0.5 }}
          className="mx-auto max-w-7xl text-center"
        >
          <h2 className="text-4xl font-medium leading-[0.95] tracking-tight text-black md:text-6xl lg:text-7xl">
            This isn’t just{" "}
            <span className="text-black/20">about real estate.</span>
          </h2>
        </motion.div>

        {/* Arrow Images */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="relative mx-auto mt-16 grid max-w-6xl grid-cols-4"
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: {
                  opacity: 0,
                  y: 70,
                  scale: 0.9,
                },
                show: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1],
                  },
                },
              }}
              whileHover={{
                y: -8,
                scale: 1.03,
                transition: { duration: 0.35 },
              }}
              className="relative h-[150px] overflow-hidden md:h-[300px] lg:h-[310px]"
              style={{
                clipPath:
                  "polygon(0 0, 65% 0, 100% 50%, 65% 100%, 0 100%, 35% 50%)",
              }}
            >
              <Image
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2200&auto=format&fit=crop"
                alt="Real estate lifestyle"
                fill
                className="object-cover transition duration-700 hover:scale-110"
                style={{
                  objectPosition: `${index * 33}% center`,
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Text */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.9,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            },
          }}
          viewport={{ once: true, amount: 0.4 }}
          className="mx-auto mt-16 max-w-2xl text-center"
        >
          <p className="text-2xl font-medium leading-tight text-black md:text-2xl">
            It’s about identity. Progress. Getting unstuck.
            <br />
            You’re not just looking for a place.{" "}
            <span className="text-black/20">
              You’re looking for alignment. That’s what we help you find.
            </span>
          </p>
        </motion.div>
      </section>
    </div>
  );
}

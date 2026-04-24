"use client";

import { motion, Variants } from "framer-motion";
import { Service, ServiceCard } from "./ServiceCard";
import SupportSection from "./Support";
import { fadeUp,staggerWrap } from "@/animations";
const SERVICES: Service[] = [
  {
    id: 1,
    number: "1",
    title: "Buy",
    description:
      "Buy smarter with expert agents backed by mortgage, legal, and appraisal pros—dialed in to get you the best deal, fast. We’ve done this over 10,000 times, and we know what wins.",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: 2,
    number: "2",
    title: "Sell",
    description:
      "Sell fast, sell high. Your listing gets pro staging, strategic pricing, constant open houses, and agents who never stop working.",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: 3,
    number: "3",
    title: "Rent",
    description:
      "Find the right rental faster with access to exclusive listings, smart tours, and agents who negotiate in your favor.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop",
  },
];

export default function ServicesSection() {
  return (
    <section className="bg-[#151717] text-white overflow-hidden">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerWrap}
        className="mx-auto"
      >
        {/* Heading */}
        <div className="grid max-w-7xl gap-10 px-6 py-16 md:px-10 md:py-20 lg:grid-cols-2">
          <motion.div variants={fadeUp}>
            <p className="text-lg font-semibold">Services</p>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h2 className="text-5xl font-light leading-[0.95] tracking-tight md:text-6xl">
              How FIND
              <br />
              <span className="text-white/45">Can Help You</span>
            </h2>
          </motion.div>
        </div>

        {/* Cards */}
        <motion.div
          variants={staggerWrap}
          className="space-y-0"
        >
          {SERVICES.map((service) => (
            <motion.div
              key={service.id}
              variants={fadeUp}
            >
              <ServiceCard service={service} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom Section */}
      <motion.div
        initial={{ opacity: 0, y: 70 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{
          duration: 1,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <SupportSection />
      </motion.div>
    </section>
  );
}
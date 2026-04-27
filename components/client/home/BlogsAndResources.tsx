"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Blog, BlogCard } from "./BlogCard";

const BLOGS: Blog[] = [
  {
    id: 1,
    date: "2026-04-13",
    title: "Q1 2026 NYC Market Report",
    description:
      "Q1 2026 saw strong rental demand, active sales, and shifting pricing across NYC. Here's what it means heading into the spring market.",
    image:
      "https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1600&auto=format&fit=crop",
    href: "#",
  },
  {
    id: 2,
    date: "2026-04-08",
    title: "5 Tips for First-Time Home Buyers",
    description:
      "Learn how to prepare financially, choose the right neighborhood, and avoid common mistakes during your first purchase.",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1600&auto=format&fit=crop",
    href: "#",
  },
  {
    id: 3,
    date: "2026-04-01",
    title: "Why Luxury Rentals Are Booming",
    description:
      "Demand for premium rentals continues to rise as flexibility and amenities drive tenant preferences.",
    image:
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=1600&auto=format&fit=crop",
    href: "#",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 70 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
    },
  },
};

export default function BlogsAndResourcesSection() {
  return (
  <section className="bg-[#f1f1f1] text-black overflow-hidden">
  <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 sm:py-20 md:px-10 md:py-24 lg:py-28">
    {/* Top Intro */}
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      className="grid gap-10 md:gap-14 lg:grid-cols-2 lg:gap-16 lg:items-start"
    >
      <motion.div variants={fadeUp}>
        <h2 className="text-4xl font-medium leading-[0.95] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Blog<span className="text-black/25"> &</span>
          <br />
          <span className="text-black/25">Resources</span>
        </h2>
      </motion.div>

      <motion.div variants={fadeUp}>
        <p className="max-w-4xl text-base font-medium leading-snug sm:text-lg md:text-xl lg:text-2xl">
          See how we’ve helped clients achieve their real estate dreams,
          one successful move at a time.
        </p>

        <Button className="mt-8 h-12 rounded-full bg-black px-6 text-sm font-medium sm:h-14 sm:px-8 sm:text-base">
          Visit Our Blog
          <ArrowRight className="ml-3 h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </motion.div>
    </motion.div>

    {/* Blog Cards */}
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      className="mt-16 space-y-10 sm:mt-20 sm:space-y-12 md:mt-24 md:space-y-16"
    >
      {BLOGS.map((blog) => (
        <motion.div
          key={blog.id}
          variants={fadeUp}
          whileHover={{ y: -6 }}
          transition={{ duration: 0.35 }}
        >
          <BlogCard blog={blog} />
        </motion.div>
      ))}
    </motion.div>
  </div>
</section>
  );
}
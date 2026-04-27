"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export type Blog = {
  id: number;
  date: string;
  title: string;
  description: string;
  image: string;
  href: string;
};

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 70,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function BlogCard({ blog }: { blog: Blog }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      whileHover="hover"
      className="flex max-h-none flex-col-reverse gap-8 border-t border-black/10 pt-8 md:max-h-[400px] md:gap-10 lg:flex-row lg:gap-20"
    >
      {/* Left */}
      <motion.div
        variants={{
          hidden: { opacity: 0, x: -50 },
          show: {
            opacity: 1,
            x: 0,
            transition: {
              delay: 0.12,
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            },
          },
        }}
        className="flex w-full flex-col justify-between gap-8 lg:w-md lg:gap-10"
      >
        <div>
          <p className="text-sm font-medium text-black/70">{blog.date}</p>

          <motion.h3
            variants={{
              hidden: { opacity: 0, y: 30 },
              show: {
                opacity: 1,
                y: 0,
                transition: { delay: 0.2, duration: 0.75 },
              },
            }}
            className="mt-8 text-2xl font-medium tracking-tight sm:text-3xl md:mt-12 md:text-3xl lg:mt-16"
          >
            {blog.title}
          </motion.h3>

          <p className="mt-4 max-w-xl text-sm font-medium leading-relaxed sm:text-base md:mt-6">
            {blog.description}
          </p>
        </div>

        <motion.div whileHover={{ x: 6 }} transition={{ duration: 0.25 }}>
          <Button
            variant="outline"
            className="h-12 w-fit rounded-full border-black/20 bg-transparent px-6 text-sm sm:h-14 sm:px-8 sm:text-base"
          >
            Read More
            <ArrowRight className="ml-3 h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </motion.div>
      </motion.div>

      {/* Right */}
      <motion.div
        variants={{
          hidden: { opacity: 0, x: 70, scale: 0.95 },
          show: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: {
              delay: 0.18,
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            },
          },
        }}
        className="relative aspect-[16/10] w-full overflow-hidden rounded-sm min-h-[220px] sm:min-h-[280px] md:min-h-[340px] lg:flex-1"
      >
        <motion.div
          variants={{
            hover: { scale: 1.05 },
          }}
          transition={{ duration: 0.7 }}
          className="h-full w-full"
        >
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="object-cover"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const pressItems = [
  {
    id: 1,
    date: "December 1, 2025",
    title:
      "Oxford, Spire, & Level Group Unite to Launch FIND Real Estate, Creating One of NYC’s Largest Independent Brokerages",
    image: "/press.png", // place image in public folder
    href: "#",
  },
];

export default function PressMediaPage() {
  return (
    <main className="min-h-screen bg-[#ececec] text-black">
      <section className="mx-auto max-w-[1240px] px-6 py-20 md:px-10 lg:px-16">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-5xl font-semibold tracking-tight md:text-7xl lg:text-8xl">
            Press & Media
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-black/80 md:text-xl">
            FIND is making waves in the real estate industry with our
            client-focused approach, innovative agent empowerment, and
            commitment to excellence. Explore our latest media mentions,
            press releases, and features that highlight how we’re moving
            the real estate experience forward.
          </p>
        </div>

        {/* Featured Article */}
        <div className="mt-24">
          {pressItems.map((item) => (
            <article key={item.id} className="max-w-4xl">
              {/* Image */}
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  priority
                  className="object-cover"
                />
              </div>

              {/* Date */}
              <p className="mt-6 text-sm font-medium text-black/70">
                {item.date}
              </p>

              {/* Title */}
              <h2 className="mt-6 text-3xl font-medium leading-tight tracking-tight md:text-5xl">
                {item.title}
              </h2>

              {/* Button */}
              <Button
                asChild
                variant="outline"
                className="mt-10 h-12 rounded-full border-black/20 bg-transparent px-7 text-sm hover:bg-black hover:text-white"
              >
                <Link href={item.href}>
                  Read More
                  <ArrowRight className="ml-3 h-4 w-4" />
                </Link>
              </Button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
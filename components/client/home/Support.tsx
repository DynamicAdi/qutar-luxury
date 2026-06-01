"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
type ServiceItem = {
  title: string;
  image: string;
  href: string;
  description: string;
};
const SERVICES: ServiceItem[] = [
  {
    title: "COMMERCIAL",
    href: "#",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1600&auto=format&fit=crop",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe iure officiis dolore tenetur quidem fugiat ab molestiae autem quae nulla. Beatae aut voluptatibus cumque rerum iste. Voluptatem, quas quasi qui cumque saepe sapiente asperiores tenetur vero odio in pariatur facere ratione iste? Dignissimos perferendis sapiente molestias repellat aperiam provident aut!",
  },
  {
    title: "RESIDENTIAL",
    href: "#",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1600&auto=format&fit=crop",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe iure officiis dolore tenetur quidem fugiat ab molestiae autem quae nulla. Beatae aut voluptatibus cumque rerum iste. Voluptatem, quas quasi qui cumque saepe sapiente asperiores tenetur vero odio in pariatur facere ratione iste? Dignissimos perferendis sapiente molestias repellat aperiam provident aut!",
  },
];
function ServiceCard({ item }: { item: ServiceItem }) {
  return (
    <div className="group relative block overflow-hidden bg-[#111315] transition-all duration-500 hover:flex-[1.15]">
      {" "}
      <div className="relative h-[320px] w-full">
        {" "}
        {/* Image */}{" "}
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
        />{" "}
        {/* Overlay */}{" "}
        <div className="absolute inset-0 bg-black/35 transition duration-500 group-hover:bg-black/20" />{" "}
        {/* Content */}{" "}
        <div className="absolute h-full inset-0 flex flex-col justify-between gap-5 p-6">
          {" "}
          {/* Title */}{" "}
          <h3 className="text-4xl font-medium tracking-tight text-white">
            {" "}
            {item.title}{" "}
          </h3>{" "}
          {/* Description Reveal */}{" "}
          <div className="overflow-hidden">
            {" "}
            <p className="max-w-sm opacity-0 line-clamp-3 text-base leading-relaxed text-white/90 transition-all duration-500 max-md:opacity-100 group-hover:opacity-100">
              {" "}
              {item.description}{" "}
            </p>{" "}
          </div>{" "}
          <Button className="bg-transparent border-border rounded-full justify-self-end self-start">
            {" "}
            Learn More <ArrowRight className="size-4" />{" "}
          </Button>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
export default function SupportSection() {
  return (
    <section>
      {" "}
      <div className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 lg:px-12">
        {" "}
        <div className="flex max-md:flex-col gap-16 lg:gap-24">
          {" "}
          <div className="space-y-8 min-w-sm">
            {" "}
            <h2 className="max-w-xl text-5xl font-light leading-[0.95] tracking-tight md:text-5xl">
              {" "}
              We Work on <br /> {" "}
              <span className="text-white/35">Buying</span> {" "}
              <span className="text-white/35">and Selling of </span>{" "}
            </h2>{" "}
          </div>{" "}
        </div>{" "}
        {/* Cards */}{" "}
        <div className="mt-20 flex flex-col gap-6 md:flex-row">
          {" "}
          {SERVICES.map((item) => (
            <div
              key={item.title}
              className="flex-1 transition-all duration-500 hover:flex-[1.15]"
            >
              {" "}
              <ServiceCard item={item} />{" "}
            </div>
          ))}{" "}
        </div>{" "}
      </div>{" "}
    </section>
  );
}

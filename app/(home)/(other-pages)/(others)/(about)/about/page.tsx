"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Plus } from "lucide-react";
import { useState } from "react";
const features = [
  {
    id: "01",
    title: "Agent-Owned and Client-Focused",
    content:
      "Our model aligns success with both agents and clients, creating better experiences and long-term trust.",
  },
  {
    id: "02",
    title: "Certified Agents with Local Expertise",
    content:
      "Work with knowledgeable professionals who understand neighborhoods, pricing, and market trends.",
  },
  {
    id: "03",
    title: "Flexible Membership Plans",
    content:
      "Choose plans built for different goals, whether you're scaling a team or growing independently.",
  },
  {
    id: "04",
    title: "Innovative Tools and Technology",
    content:
      "Modern workflows, automation, and data-driven tools help agents move faster and smarter.",
  },
];

const team = [
  {
    name: "Adam Mahfouda",
    role: "Founder and Chief Executive Officer",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Jules Borbely",
    role: "Chief Operating Officer",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Dina Tango",
    role: "Chief Financial Officer",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Molly Concannon",
    role: "Chief of Staff",
    image:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Christina Alexander",
    role: "Agent Success Manager",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=800&auto=format&fit=crop",
  },
];

export default function AboutPage() {
     const [open, setOpen] = useState<string | null>("01");
  return (
    <main className="min-h-screen bg-zinc-100 text-black">
      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            About Us
          </h1>

          <p className="mt-3 text-sm md:text-base text-zinc-600">
            Our Mission: Moving You Forward in Real Estate
          </p>
        </motion.div>

        {/* Large Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mt-10 overflow-hidden"
        >
          <Image
            src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1600&auto=format&fit=crop"
            alt="About team event"
            width={1400}
            height={700}
            className="h-[260px] md:h-[500px] w-full object-cover"
          />
        </motion.div>

        {/* Intro Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-10 max-w-5xl"
        >
          <p className="text-2xl md:text-4xl font-medium leading-tight">
            At FIND, we're more than a real estate brokerage; we're a movement
            dedicated to helping our clients and agents move forward.
          </p>

          <p className="mt-3 text-lg md:text-2xl text-zinc-500 leading-relaxed">
            From finding the perfect property to empowering agents to build
            thriving careers, our mission is simple: make every step in real
            estate a positive one.
          </p>
        </motion.div>
      </section>

      {/* Who We Are */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-16 md:grid-cols-[300px_1fr]">
          {/* Left Label */}
          <div className="flex-1 h-full gap-5 flex flex-col">
            {/* Top Text */}
            <p className="text-xs uppercase tracking-[0.25em] font-bold">
              Who We Are
            </p>

            {/* Center Image */}
            <div className="flex-1 flex items-center justify-center">
              <Card className="py-0 overflow-hidden border-none rounded-none shadow-none">
                <CardContent className="p-0">
                  <Image
                    src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop"
                    alt="Office meeting"
                    width={300}
                    height={400}
                    className="h-[220px] w-full object-cover"
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
              viewport={{ once: true }}
              className="overflow-hidden"
            >
              <Image
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1600&auto=format&fit=crop"
                alt="Founders"
                width={1200}
                height={800}
                className="h-[300px] md:h-[430px] w-full object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.65 }}
              viewport={{ once: true }}
              className="max-w-3xl"
            >
              <p className="text-2xl md:text-4xl font-medium leading-tight">
                Founded on the belief that real estate should be empowering for
                everyone involved, FIND combines innovative tools, a
                client-centered approach, and an agent-owned model.
              </p>

              <p className="mt-3 text-lg md:text-2xl text-zinc-500 leading-relaxed">
                Redefining what a modern brokerage can be. Today, we're proud to
                support over 1,000 agents and countless clients on their
                journeys.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

          <section className="bg-zinc-100 px-6 py-24">
      <div className="mx-auto max-w-6xl space-y-28">
        {/* What Sets FIND Apart */}
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="text-5xl font-semibold leading-none tracking-tight">
              <span className="text-zinc-400">What</span> Sets <br />
              FIND Apart
            </h2>
          </div>

          <div className="space-y-1">
            {features.map((item) => {
              const active = open === item.id;

              return (
                <div key={item.id} className="border-b border-zinc-300">
                  <button
                    onClick={() => setOpen(active ? null : item.id)}
                    className="flex w-full items-center gap-4 py-5 text-left"
                  >
                    <span className="w-8 text-xs text-zinc-400">
                      {item.id}
                    </span>

                    <span className="flex-1 text-xl font-medium">
                      {item.title}
                    </span>

                    <Plus
                      className={`h-4 w-4 transition-transform duration-300 ${
                        active ? "rotate-45" : ""
                      }`}
                    />
                  </button>

                  {active && (
                    <div className="pb-5 pl-12 pr-8 text-zinc-600">
                      {item.content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Team */}
        <div className="space-y-10">
          <h2 className="text-5xl font-semibold leading-none tracking-tight">
            <span className="text-zinc-400">Meet the</span> FIND Team
          </h2>

          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {team.map((member) => (
              <div key={member.name}>
                <div className="overflow-hidden bg-white">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={400}
                    height={500}
                    className="h-[260px] w-full object-cover"
                  />
                </div>

                <div className="mt-3">
                  <h3 className="text-sm font-semibold">{member.name}</h3>
                  <p className="text-xs text-zinc-500">{member.role}</p>
                </div>
              </div>
            ))}
          </div>

          <Separator className="mt-10 bg-zinc-900" />
        </div>

        {/* Culture Section */}
        <div className="space-y-8">
          <div className="overflow-hidden rounded-sm">
            <Image
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1600&auto=format&fit=crop"
              alt="Team culture"
              width={1400}
              height={700}
              className="h-[260px] md:h-[500px] w-full object-cover"
            />
          </div>

          <div className="max-w-5xl space-y-6">
            <p className="text-2xl md:text-4xl font-medium leading-tight">
              Our team is as diverse as our clients and as driven as our
              mission.
            </p>

            <p className="text-lg md:text-2xl text-zinc-500 leading-relaxed">
              From experienced agents and support staff to forward-thinking
              leaders, everyone at FIND is united in creating meaningful real
              estate experiences.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button className="rounded-full px-6">
                Learn More About Our Agents
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                className="rounded-full px-6 border-zinc-400"
              >
                Join Our Team
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
    </main>
  );
}

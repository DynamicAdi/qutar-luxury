"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import HoverSlideText from "@/components/HoverSlideText";

export default function Footer() {
  return (
    <footer className="bg-[var(--secondary-foreground)] min-h-screen text-white">
      <div className="mx-auto max-w-[1400px] px-6 max-md:pb-5 md:pb-0 h-full pt-15">
        {/* Top */}
        <div className="flex max-md:flex-col w-full justify-between gap-16 items-stretch">
          {/* Newsletter */}
          <div className="flex gap-6 h-full w-full max-w-3xl flex-col justify-between space-y-4">
            <h2 className="text-sm font-semibold tracking-tight md:text-2xl">
              Subscribe to our Newsletter!
            </h2>

            <div className="border-b border-white/30 pb-4">
              <div className="flex items-center gap-4">
                <Input
                  placeholder="Enter address"
                  className="h-12 border-0 bg-transparent px-0 pb-0 text-lg text-white placeholder:text-white/45 focus-visible:ring-0 focus-visible:ring-offset-0"
                />

                <button className="shrink-0 transition hover:translate-x-1">
                  <ArrowRight className="h-7 w-7" />
                </button>
              </div>
            </div>

            <div className="grid gap-10 md:grid-cols-3">
              <div>
                <p className="text-sm text-white/45">Head Office</p>
                <p className="mt-4 text-md whitespace-nowrap font-medium leading-snug">
                  5 West 37th Street, 12th Floor,
                  <br />
                  New York, NY 10018
                </p>
              </div>

              <div>
                <p className="text-sm text-white/45">Email Us</p>
                <p className="mt-4 text-md font-medium">
                  hello@findrealestate.com
                </p>
              </div>

              <div>
                <p className="text-sm text-white/45">Call Us</p>
                <p className="mt-4 text-md font-medium">+1 212 994 9965</p>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex h-full w-full md:max-w-3xl md:justify-end gap-20">
            <div className="space-y-5 text-4xl md:text-2xl font-medium">
              <Link href="#" className="block hover:text-white/70">
                <HoverSlideText text="Search" />
              </Link>

              <Link href="#" className="block hover:text-white/70">
                <HoverSlideText text="Agents" />
              </Link>

              <Link href="#" className="block hover:text-white/70">
                <HoverSlideText text="Join" />
              </Link>

              <Link href="#" className="block hover:text-white/70">
                <HoverSlideText text="About Us" />
              </Link>

              <Link href="#" className="block hover:text-white/70">
                <HoverSlideText text="Agent Portal" />
              </Link>
            </div>

            <div className="space-y-5 text-xl md:text-md font-medium text-right">
              <Link href="#" className="block hover:text-white/70">
                Facebook
              </Link>

              <Link href="#" className="block hover:text-white/70">
                Instagram
              </Link>

              <Link href="#" className="block hover:text-white/70">
                Youtube
              </Link>

              <Link href="#" className="block hover:text-white/70">
                Linkedin
              </Link>
            </div>
          </div>
        </div>

        {/* Huge Logo */}
        <div className="mt-12">
          <h1 className="select-none text-[22vw] font-[800] font-black leading-none tracking-tight text-white font-bold md:text-[20rem]">
            QLP
          </h1>
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-6 text-sm text-white/45 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex max-md:flex-col max-lg:flex-wrap gap-y-10 mt-3 gap-x-4 gap-y-3">
            <Link href="#">Terms</Link>
            <Link href="#">Privacy policy</Link>
            <Link href="#">Fair Housing Notice</Link>
            <Link href="#">Operating Procedure</Link>
            <Link href="#">Press</Link>
            <Link href="#">Housing Choice Vouchers Welcome</Link>
            <Link href="#">Se Aceptan Vales de Elección de Vivienda</Link>
          </div>

          <div className="flex max-lg:flex-wrap gap-8">
            <span>QLP Real Estate</span>
            <span>Copyright © 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

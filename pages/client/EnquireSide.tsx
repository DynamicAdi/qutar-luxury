"use client";

import { Property } from "@/store/cms";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EnquiryForm from "@/components/client/properties/EnquiryForm";
import { ShieldCheck } from "lucide-react";


export default function StickySidebar({ property }: {property: Property}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY;
      const max =
        doc.scrollHeight - window.innerHeight;

      const percent = (scrollTop / max) * 100;
      setProgress(percent);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  const showAgents = progress >= 65;
  const fullySwap = progress >= 65;

  return (
    <div className="lg:sticky lg:top-4 space-y-4 overflow-hidden">
      {/* FORM */}
      <AnimatePresence mode="wait">
        {!fullySwap && (
          <motion.div
            key="form"
            initial={{ opacity: 1, y: 0 }}
            animate={{
              opacity: showAgents ? 0 : 1,
              y: showAgents ? -40 : 0,
            }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <EnquiryForm
              property={property?.id}
              price={property?.price}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* AGENTS */}
      <AnimatePresence>
        {showAgents && (
          <motion.div
            key="agents"
            initial={{ opacity: 0, y: 60 }}
            animate={{
              opacity: fullySwap ? 1 : 0.65,
              y: fullySwap ? 0 : 30,
            }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="space-y-4"
          >
            <h1 className="font-display text-3xl">Associated Agents</h1>
            {property.agent?.map((agent, idx) => (
              <div
                key={idx}
                className="bg-card border border-border p-5 flex items-center gap-4"
              >
                <div className="size-14 rounded-full bg-gradient-to-br from-emerald to-emerald-deep text-white flex items-center justify-center text-xl font-bold shrink-0">
                  {agent.name.charAt(0)}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                    Listing agent
                  </p>

                  <p className="font-display text-lg font-bold leading-tight">
                    {agent.name}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {agent.phone} · {agent.email}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

              <div className="bg-secondary/50  p-4 flex items-start gap-3">
                <ShieldCheck className="size-5 text-emerald shrink-0 mt-0.5" />
                <div>
                  <p className="font-display text-sm font-bold">
                    Verified listing
                  </p>
                  <p className="font-body text-xs text-muted-foreground mt-0.5">
                    Documents reviewed and ownership confirmed by our legal
                    team.
                  </p>
                </div>
              </div>
    </div>
  );
}
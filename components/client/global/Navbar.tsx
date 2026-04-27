"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/config";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { NAV_ITEMS } from "@/config";
import Link from "next/link";
import HoverSlideText from "@/components/HoverSlideText";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Navbar() {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrolled,setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // show/hide logic (unchanged)
      if (currentScrollY > lastScrollY) {
        setShow(false);
      } else {
        setShow(true);
      }
      // NEW: check if crossed 100vh
      if (currentScrollY > window.innerHeight) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);
  const initial = {
    y: -40,
    opacity: 0,
  };
  const animated = {
    y: 0,
    opacity: 1,
  };
  return (
    <div
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-transform duration-1000",
        show ? "translate-y-0" : "-translate-y-full",
      )}
    >
      <div
        className={cn(
          " transition-all duration-500",
          scrolled ? "bg-white dark:bg-black":"bg-transparent" 
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-2 py-2">
          {/* Logo */}
          <div className="flex items-center gap-2 font-semibold text-lg">
            <Link href={"/"}>
              <motion.div
                initial={initial}
                transition={{ duration: 1 }}
                animate={animated}
                className="text-2xl font-extrabold"
              >
                {SITE_NAME}
              </motion.div>
            </Link>
          </div>

          <div
            className={cn(
              "hidden md:flex items-center gap-8 text-md font-medium transition-colors duration-300",
              "text-black dark:text-white"
            )}
          >
            <NavigationMenu>
              <NavigationMenuList className="flex items-center gap-8">
                {NAV_ITEMS.map((item, index) => {
                  return <NavItem key={index} index={index} item={item} />;
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* CTA */}
          <motion.div
            initial={initial}
            animate={animated}
            transition={{ duration: 1, delay: 0.7 }}
          >
            <Button
              size={"lg"}
              className={cn(
                "rounded-full bg-black text-md p-6 transition-all duration-300"
              )}
            >
              Sign in
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

type Item = {
  label: string;
  href?: string;
  dropdown?: {
    label: string;
    href: string;
  }[];
};

type Props = {
  item: Item;
  index: number;
};

function NavItem({ item,index }: Props) {
  const [open, setOpen] = useState(false);
  const initial = {
    y: -40,
    opacity: 0,
  };
  const animated = {
    y: 0,
    opacity: 1,
  };
  if (!item.dropdown) {
    return (
      <motion.div
        initial={initial}
        transition={{ duration: 1, delay: 0.1 * index }}
        animate={animated}
      >
        <Link href={item.href || "#"}>
          <HoverSlideText text={item.label} />
        </Link>
      </motion.div>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <motion.button
        initial={initial}
        transition={{ duration: 1, delay: 0.1 * index }}
        animate={animated}
        className="text-base flex items-center gap-2 font-medium"
      >
        <HoverSlideText text={item.label} />{" "}
        {open ? (
          <ChevronUp className="size-4" />
        ) : (
          <ChevronDown className="size-4" />
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            transition={{
              duration: 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute left-0 top-full z-50 mt-4 min-w-[220px] border border-border bg-background shadow-xl"
          >
            <div className="flex flex-col">
              {item.dropdown.map((sub, i) => (
                <motion.div
                  key={sub.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{
                    delay: i * 0.04,
                    duration: 0.2,
                  }}
                >
                  <Link
                    href={sub.href}
                    className="block border-b border-border px-5 py-3 text-sm transition hover:bg-muted last:border-b-0"
                  >
                    {sub.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

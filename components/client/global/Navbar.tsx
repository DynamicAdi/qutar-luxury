"use client";

import HoverSlideText from "@/components/HoverSlideText";
import {
    NavigationMenu,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { NAV_ITEMS } from "@/config";
import { cn } from "@/lib/utils";
import logo from "@/public/logo.png";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function Navbar() {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        setShow(false);
      } else {
        setShow(true);
      }

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
        mobileOpen ? "bg-white!" : ""
      )}
    >
      <div
        className={cn(
          "transition-all duration-500",
          scrolled ? "bg-white dark:bg-black shadow-sm" : "bg-transparent"
        )}
      >
        <div className="max-w-9xl md:px-14 px-4 py-2">
          {/* TOP BAR */}
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2 font-semibold text-lg">
              <Link href={"/"}>
                <motion.div
                  initial={initial}
                  transition={{ duration: 1 }}
                  animate={animated}
                  className="text-2xl h-13 w-20 relative font-extrabold"
                >
                  <Image src={logo.src} alt={"Loading..."} fill/>
                </motion.div>
              </Link>
            </div>

            {/* Desktop Nav */}
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

            {/* Desktop CTA */}
            {/* <motion.div
              initial={initial}
              animate={animated}
              transition={{ duration: 1, delay: 0.7 }}
              className="hidden md:block"
            >
              <Button
                size={"lg"}
                onClick={() => {
                  router.push("/login");
                }}
                className="rounded-full bg-black text-md p-6 transition-all duration-300"
              >
                Sign in
              </Button>
            </motion.div> */}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2"
            >
              {mobileOpen ? (
                <X className="size-6" />
              ) : (
                <Menu className="size-6" />
              )}
            </button>
          </div>

          {/* MOBILE MENU */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "100vh", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
                className="md:hidden bg-white overflow-hidden fixed pb-10 left-0 w-full z-40"
              >
                <div className="h-full px-4 pt-6 pb-8 flex flex-col">
                  <div className="space-y-2">
                    {NAV_ITEMS.map((item, index) => (
                      <MobileNavItem
                        key={index}
                        item={item}
                        closeMenu={() => setMobileOpen(false)}
                      />
                    ))}
                  </div>

                  {/* <div className="mt-auto pt-6">
                    <Button
                      onClick={() => {
                        router.push("/login");
                      }}
                      className="w-full rounded-full bg-black text-white py-7 text-base font-medium"
                    >
                      Sign in
                    </Button>
                  </div> */}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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

function NavItem({ item, index }: Props) {
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
        <HoverSlideText text={item.label} />
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

/* MOBILE NAV ITEM */
function MobileNavItem({
  item,
  closeMenu,
}: {
  item: Item;
  closeMenu: () => void;
}) {
  const [open, setOpen] = useState(false);

  if (!item.dropdown) {
    return (
      <Link
        href={item.href || "#"}
        onClick={closeMenu}
        className="block rounded-md px-2 py-3 text-base font-medium hover:bg-muted"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div className="border-b border-border pb-1">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-md px-2 py-3 text-left text-base font-medium hover:bg-muted"
      >
        <span>{item.label}</span>
        {open ? (
          <ChevronUp className="size-4" />
        ) : (
          <ChevronDown className="size-4" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden pl-3"
          >
            {item.dropdown.map((sub) => (
              <Link
                key={sub.label}
                href={sub.href}
                onClick={closeMenu}
                className="block px-2 py-2 text-sm text-muted-foreground hover:text-foreground"
              >
                {sub.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

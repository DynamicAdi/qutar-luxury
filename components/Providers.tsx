"use client";

import { useTheme } from "next-themes";
import SmoothScroll from "./providers/SmoothScroll";
import { useEffect } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme("light");
  }, []);
  return <SmoothScroll>{children}</SmoothScroll>;
}
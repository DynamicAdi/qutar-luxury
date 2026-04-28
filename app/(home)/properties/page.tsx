"use client";
import LoaderScreen from "@/misc/LoaderScreen";
import Properties from "@/pages/client/Properties";
import { Suspense } from "react";

export default function page() {
  return (
    <Suspense fallback={<LoaderScreen />}>
      <Properties />
    </Suspense>
  );
}

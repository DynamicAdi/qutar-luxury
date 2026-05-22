"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Link from "next/link";


const categoryStyles: Record<string, { bg: string; glow: string }> = {
  All: {
    bg: "bg-gradient-to-br from-zinc-100 to-zinc-200",
    glow: "group-hover:shadow-zinc-400/30",
  },
  BUY: {
    bg: "bg-gradient-to-br from-emerald-100 to-emerald-200",
    glow: "group-hover:shadow-emerald-500/30",
  },
  RENT: {
    bg: "bg-gradient-to-br from-blue-100 to-blue-200",
    glow: "group-hover:shadow-blue-500/30",
  },
  SELL: {
    bg: "bg-gradient-to-br from-purple-100 to-purple-200",
    glow: "group-hover:shadow-purple-500/30",
  },
  PLOTS: {
    bg: "bg-gradient-to-br from-orange-100 to-orange-200",
    glow: "group-hover:shadow-orange-500/30",
  },
};

type Props = {
  title: keyof typeof categoryStyles;
  href: string;
  description?: string;
};

export function CategoryCard({ title, href, description }: Props) {
  const style = categoryStyles[title] || categoryStyles.All;

  return (
    <Link href={href}>
      <Card
        className={cn(
          "group relative aspect-square max-h-[180px] w-full overflow-hidden rounded-none border-0 p-6 shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl",
          style.bg,
          style.glow
        )}
      >
        {/* glow orb */}
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/40 blur-3xl opacity-60 group-hover:opacity-90 transition" />

        {/* inner glass layer */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-md" />

        {/* content */}
        <div className="relative z-10 flex h-full flex-col justify-end">
          <h3 className="text-xl font-bold tracking-tight text-black">
            {title}
          </h3>

          {description && (
            <p className="mt-1 text-sm text-black/60 line-clamp-2">
              {description}
            </p>
          )}

          {/* underline animation */}
          <div className="mt-4 h-[2px] w-0 bg-black transition-all duration-500 group-hover:w-2/3" />
        </div>
      </Card>
    </Link>
  );
}


export function CategoryCardSkeleton() {
  return (
    <Card className="aspect-square max-h-[180px] w-full rounded-none border-0 bg-zinc-100 p-6">
      <div className="flex h-full flex-col justify-end space-y-3">
        <Skeleton className="h-6 w-2/3 rounded-md" />
        <Skeleton className="h-4 w-1/2 rounded-md" />
        <div className="h-1 w-1/3 bg-zinc-300 rounded-full" />
      </div>
    </Card>
  );
}
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
// import Image from "next/image";
import { useRouter } from "next/navigation";

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    description: string;
    price: number;
    images: string[];
    category: string;
    propertyType: string;
    Area: number;
  };
}

export default function CheaperPropertyCard({ property }: PropertyCardProps) {
  const router = useRouter();

  return (
    <Card
      onClick={() => router.push(`/properties/${property.id}`)}
      className={cn(
        "group cursor-pointer overflow-hidden rounded-2xl py-0 border bg-white shadow-sm transition-all hover:shadow-lg"
      )}
    >
      {/* IMAGE */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={property.images?.[0] || "/placeholder.jpg"}
          alt={property.title}
          // fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <Badge className="absolute left-3 top-3 bg-black/70 text-white">
          {property.category}
        </Badge>
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-2">
        <h3 className="line-clamp-1 text-lg font-semibold">
          {property.title}
        </h3>

        <p className="line-clamp-2 text-sm text-muted-foreground">
          {property.description}
        </p>

        <div className="flex items-center justify-between pt-2">
          <span className="text-base font-bold text-emerald-700">
            ${property.price.toLocaleString()}
          </span>

          <span className="text-xs text-muted-foreground">
            {property.Area} sqft
          </span>
        </div>

        <Button
          className="w-full mt-2"
          size="sm"
        >
          View Details
        </Button>
      </div>
    </Card>
  );
}

export function CheaperPropertyCardSkeleton() {
  return (
    <Card className="overflow-hidden rounded-2xl border bg-white animate-pulse">
      {/* IMAGE */}
      <div className="h-48 w-full bg-gray-200" />

      {/* CONTENT */}
      <div className="p-4 space-y-3">
        <div className="h-4 w-3/4 bg-gray-200 rounded" />

        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-200 rounded" />
          <div className="h-3 w-5/6 bg-gray-200 rounded" />
        </div>

        <div className="flex justify-between pt-2">
          <div className="h-4 w-20 bg-gray-200 rounded" />
          <div className="h-3 w-12 bg-gray-200 rounded" />
        </div>

        <div className="h-8 w-full bg-gray-200 rounded" />
      </div>
    </Card>
  );
}
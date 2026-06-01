"use client";

import { Button } from "@/components/ui/button";
import { formatQAR } from "@/lib/properties";
import { Property } from "@/store/cms";
import { motion } from "framer-motion";
import { ArrowUpRight, Bath, BedDouble, MapPin, Maximize } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
  property: Property;
  index?: number;
}

const SimplePropertyCard = ({ property, index = 0 }: Props) => {

  const router = useRouter();
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.55,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -8 }}
      className="overflow-hidden border border-border bg-card cursor-pointer"
      onClick={() => router.push(`/properties/${property.id}`)}
    >
      {/* Image */}
      <div className="relative aspect-[4/2.6] overflow-hidden bg-muted">
        <motion.img
          src={property.images?.[0]}
          alt={property.title}
          loading="lazy"
          className="h-full w-full object-cover"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.6 }}
        />

        <div className="absolute left-3 top-3 flex gap-2">
          <span className="rounded-full bg-emerald px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.18em] text-white">
            {property.propertyType}
          </span>

          <span className="rounded-full bg-black/70 px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
            {property.status?.replaceAll("_"," ")}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2.5 p-3.5">
        <div>
          <h3 className="line-clamp-1 text-xl font-semibold text-foreground">
            {property.title}
          </h3>

          <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">
            {property.description}
          </p>
        </div>

        <p className="flex items-center gap-1 text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
          <MapPin className="size-3" />
          {property.address?.city}, {property.address?.state}
        </p>

        {/* Specs */}
        <div className="flex flex-wrap items-center gap-2.5 border-y border-border py-2 text-[11px] text-muted-foreground">
          {property.BedRooms ? (
            <span className="flex items-center gap-1">
              <BedDouble className="size-3" />
              {property.BedRooms}
            </span>
          ) : null}

          {property.Bathrooms ? (
            <span className="flex items-center gap-1">
              <Bath className="size-3" />
              {property.Bathrooms}
            </span>
          ) : null}

          <span className="flex items-center gap-1">
            <Maximize className="size-3" />
            {property.Area.toLocaleString()}
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2">
          <div className="text-lg font-bold text-emerald">
            {formatQAR(property.price)}
            {property.category === "RENT" && (
              <span className="ml-1 text-[9px] font-normal text-muted-foreground">
                /mo
              </span>
            )}
          </div>

          <Link href={`/properties/${property.id}`}>
            <Button
              size="sm"
              className="group h-9 rounded-full px-5 text-[11px] font-medium"
            >
              View
              <motion.span
                whileHover={{ x: 4, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowUpRight className="ml-1.5 size-3" />
              </motion.span>
            </Button>
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

export default SimplePropertyCard;

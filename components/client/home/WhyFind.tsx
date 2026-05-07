"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import useZoomScroll, { fadeUp, stagger } from "@/animations";
import { useEffect } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import PropertyCard from "@/components/client/properties/PropertyCard";
import { Property } from "@/store/cms";
import SimplePropertyCard from "../properties/SimplePropertyCard";
const CONTENT = [
  {
    image:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2200&auto=format&fit=crop",
    title: "Find Your Identity",
    desc: "A home that reflects your ambition, growth, and future.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2200&auto=format&fit=crop",
    title: "Move Forward",
    desc: "Every next chapter begins with the right foundation.",
  },
];
const options = {
  revalidateOnFocus: false,
  dedupingInterval: 15000,
};
export default function WhyFindSection() {
  const containerRef = useZoomScroll();
  const {
    data,
    error,
    isLoading: propertiesLoading,
  } = useSWR<{ data: Property[] }>(
    "/api/featured?targetType=PROPERTY",
    fetcher,
    options
  );
  const featuredProperties = data?.data ?? [];
  const {
    data: projectsData,
    error: projectsError,
    isLoading: projectsLoading,
  } = useSWR<{ data: Property[] }>(
    "/api/featured?targetType=PROJECT",
    fetcher,
    options
  );
  const featuredProjects = projectsData?.data ?? [];
  return (
    <div className="grid h-auto">
      {/* SECTION 1 */}
      <section className="overflow-hidden px-6 py-20 md:px-10 lg:px-16 xl:px-24">
        <div className="grid gap-12 lg:grid-cols-[0.42fr_1fr]">
          {/* Left Label */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.6 }}
          >
            <p className="text-2xl font-semibold uppercase text-black md:text-sm">
              Featured Properties
            </p>
          </motion.div>

          {/* Right Heading */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
            className="ml-auto max-w-xl"
          >
            <h2 className="text-2xl font-medium leading-[1.02] tracking-tight text-black md:text-6xl lg:text-3xl">
              Featured properties curated for your next chapter.{" "}
              <span className="text-black/22">
                Explore premium homes, high-potential investments, and standout
                listings carefully selected to help you buy, invest, or move
                with confidence.
              </span>
            </h2>
          </motion.div>
        </div>
        {/* Property Cards */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: {
              duration: 1,
              ease: [0.22, 1, 0.36, 1],
            },
          }}
          viewport={{ once: true, amount: 0.2 }}
          className="mt-16 grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
        >
          {/* Loading */}
          {propertiesLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-3xl border border-zinc-200 bg-white"
              >
                <div className="h-[240px] animate-pulse bg-zinc-100" />
                <div className="space-y-3 p-5">
                  <div className="h-5 w-2/3 animate-pulse rounded bg-zinc-100" />
                  <div className="h-4 w-full animate-pulse rounded bg-zinc-100" />
                  <div className="h-4 w-4/5 animate-pulse rounded bg-zinc-100" />
                  <div className="mt-4 h-10 animate-pulse rounded-xl bg-zinc-100" />
                </div>
              </div>
            ))}

          {/* Error */}
          {!propertiesLoading && error && (
            <div className="col-span-full rounded-3xl border border-red-200 bg-red-50 px-6 py-12 text-center">
              <p className="text-lg font-semibold text-red-700">
                Failed to load featured properties
              </p>
              <p className="mt-2 text-sm text-red-500">
                Please try again in a moment.
              </p>
            </div>
          )}

          {/* Empty */}
          {!propertiesLoading && !error && featuredProperties.length === 0 && (
            <div className="col-span-full rounded-3xl border border-zinc-200 bg-zinc-50 px-6 py-12 text-center">
              <p className="text-lg font-semibold text-black">
                No featured properties available
              </p>
              <p className="mt-2 text-sm text-zinc-500">
                Check back soon for new listings.
              </p>
            </div>
          )}

          {/* Data */}
          {!propertiesLoading &&
            !error &&
            featuredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.06,
                }}
                viewport={{ once: true }}
              >
                <PropertyCard index={index} property={property} />
              </motion.div>
            ))}
        </motion.div>
      </section>

      {/* SECTION 2 */}
      <section ref={containerRef} className="bg-black">
        <FirstSection
          data={featuredProjects}
          loading={projectsLoading}
          error={projectsError}
          index={1}
          item={CONTENT[0]}
        />

        <SecondSection
          data={featuredProjects}
          loading={projectsLoading}
          error={projectsError}
          index={2}
          item={CONTENT[1]}
        />
      </section>

      {/* SECTION 3 */}
      <section className="px-6 py-20 md:px-10 lg:px-16 xl:px-24 overflow-hidden">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            },
          }}
          viewport={{ once: true, amount: 0.5 }}
          className="mx-auto max-w-7xl text-center"
        >
          <h2 className="text-4xl font-medium leading-[0.95] tracking-tight text-black md:text-6xl lg:text-7xl">
            This isn’t just{" "}
            <span className="text-black/20">about real estate.</span>
          </h2>
        </motion.div>

        {/* Arrow Images */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="relative mx-auto mt-16 grid max-w-6xl grid-cols-4"
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: {
                  opacity: 0,
                  y: 70,
                  scale: 0.9,
                },
                show: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1],
                  },
                },
              }}
              whileHover={{
                y: -8,
                scale: 1.03,
                transition: { duration: 0.35 },
              }}
              className="relative h-[150px] overflow-hidden md:h-[300px] lg:h-[310px]"
              style={{
                clipPath:
                  "polygon(0 0, 65% 0, 100% 50%, 65% 100%, 0 100%, 35% 50%)",
              }}
            >
              <Image
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2200&auto=format&fit=crop"
                alt="Real estate lifestyle"
                fill
                className="object-cover transition duration-700 hover:scale-110"
                style={{
                  objectPosition: `${index * 33}% center`,
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Text */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.9,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            },
          }}
          viewport={{ once: true, amount: 0.4 }}
          className="mx-auto mt-16 max-w-2xl text-center"
        >
          <p className="text-2xl font-medium leading-tight text-black md:text-2xl">
            It’s about identity. Progress. Getting unstuck.
            <br />
            You’re not just looking for a place.{" "}
            <span className="text-black/20">
              You’re looking for alignment. That’s what we help you find.
            </span>
          </p>
        </motion.div>
      </section>
    </div>
  );
}

interface Props {
  index: number;
  item: any;
  data: Property[];
  error: string;
  loading: boolean;
}
function FirstSection({ index, item, data, error, loading }: Props) {
  return (
    <div
      key={index}
      className="zoom-card relative h-screen w-full overflow-hidden"
    >
      <div className="zoom-image absolute inset-0">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover"
          priority={index === 0}
        />
      </div>

      <div className="zoom-overlay absolute inset-0 z-10 flex items-center justify-center px-6">
        <section className="max-w-[1600px] px-6 md:px-10 lg:px-10 w-full">
          <div className="mx-auto">
            <div className="mb-12 text-center">
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-zinc-400">
                Featured Projects
              </p>

              <h2 className="text-4xl font-medium tracking-tight text-zinc-300 md:text-5xl">
                Landmark developments worth your attention
              </h2>
            </div>

            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[420px] animate-pulse rounded-3xl bg-zinc-100"
                  />
                ))}
              </div>
            ) : error ? (
              <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
                Failed to load featured projects.
              </div>
            ) : data.length === 0 ? (
              <div className="rounded-3xl border border-zinc-200 bg-white p-10 text-center text-zinc-500">
                No featured projects available right now.
              </div>
            ) : (
              <div className="grid w-full gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {data.map((project: Property) => (
                  <PropertyCard key={project.id} property={project} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function SecondSection({ index, item, data, error, loading }: Props) {
  return (
    <div
      key={index}
      className="zoom-card relative h-screen w-full overflow-hidden"
    >
      <div className="zoom-image absolute inset-0">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover"
          priority={index === 0}
        />
      </div>

      <div className="zoom-overlay absolute inset-0 z-10 flex items-center justify-center px-6">
        <section className="max-w-[1600px] px-6 md:px-10 lg:px-10 w-full">
          <div className="mx-auto">
            <div className="mb-12 text-center">
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-zinc-900">
                Featured Listings
              </p>

              <h2 className="text-4xl font-medium tracking-tight text-zinc-800 md:text-5xl">
                Landmark developments worth your attention
              </h2>
            </div>

            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[420px] animate-pulse rounded-3xl bg-zinc-100"
                  />
                ))}
              </div>
            ) : error ? (
              <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
                Failed to load featured projects.
              </div>
            ) : data.length === 0 ? (
              <div className="rounded-3xl border border-zinc-200 bg-white p-10 text-center text-zinc-500">
                No featured projects available right now.
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {data.map((project: Property) => (
                  <SimplePropertyCard key={project.id} property={project} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

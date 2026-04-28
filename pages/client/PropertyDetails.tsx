"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import {
  BedDouble,
  Bath,
  Maximize,
  Car,
  Calendar,
  MapPin,
  Play,
  ZoomIn,
  Home,
  Building2,
  Share2,
  Heart,
  ChevronRight,
  Compass,
  Wallet,
  Ruler,
  FileText,
  ShieldCheck,
  Clock,
  TrendingUp,
  Layers,
  Pyramid,
  CircleCheckBig,
} from "lucide-react";


import ImageLightbox from "@/components/client/properties/ImageLightbox";

import Link from "next/link";
import { formatPrice, Property } from "@/store/cms";
import axios from "axios";
import LoaderScreen from "@/misc/LoaderScreen";
import StickySidebar from "./EnquireSide";

const ytId = (url?: string) => {
  if (!url) return null;
  const m = url.match(/(?:v=|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : null;
};

const PropertyDetails = ({ id }: { id: string }) => {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [bldgTilt, setBldgTilt] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  const [property, setProperty] = useState<Property>();
  const [load, startLoad] = useTransition();

  const fetchData = () =>
    startLoad(async () => {
      const req = await axios.get(
        `/api/properties?id=${id}&details=${Boolean("true")}`,
      );
      if (req.status === 200) {
        console.log(req.data.data[0]);
        setProperty(req.data.data[0]);
      }
    });

  useEffect(() => {
    fetchData();
  }, []);

  const onHeroMove = (e: React.MouseEvent) => {
    const el = heroRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setBldgTilt({ x: -py * 14, y: px * 22 });
  };
  const onHeroLeave = () => setBldgTilt({ x: 0, y: 0 });

  if (load) {
    return <LoaderScreen />;
  }
  if (!property) {
    return (
      <>
        <div className="px-4 md:md:px-24 px-4 mx-auto py-32 text-center">
          <h1 className="text-giant font-display">Property not found</h1>
          <Link
            href="/properties"
            className="inline-block mt-6 px-6 py-3 bg-emerald text-primary-foreground font-display tracking-widest"
          >
            Back to listings
          </Link>
        </div>
      </>
    );
  }

  const youtubeId = ytId(property.youtubeLink);
  const pricePerSqft = Math.round(property.price / property.Area);
  // Mock financing breakdown — 20% down, ~0.5% monthly placeholder
  const downPayment = Math.round(property.price * 0.2);
  const loanAmount = property.price - downPayment;
  const monthlyEstimate = Math.round(loanAmount * 0.005);

  return (
    <>
      <main className="animate-fade-in mt-12">
        {/* Breadcrumb */}
        <div className="md:px-24 px-4 mx-auto pt-6 pb-4">
          <nav className="flex items-center gap-2 text-xs font-body text-muted-foreground">
            <Link
              href="/properties"
              className="hover:text-emerald transition-colors uppercase tracking-[0.2em]"
            >
              Listings
            </Link>
            <ChevronRight className="size-3" />
            <span className="uppercase tracking-[0.2em]">
              {property?.address?.city}
            </span>
            <ChevronRight className="size-3" />
            <span className="uppercase tracking-[0.2em] text-emerald truncate">
              {property.title}
            </span>
          </nav>
        </div>

        {/* HERO — title block with large interactive floating building */}
        <section className="md:px-24 px-4 mx-auto pb-10">
          <div
            // ref={heroRef}
            // onMouseMove={onHeroMove}
            // onMouseLeave={onHeroLeave}
            className="relative bg-gradient-to-br from-emerald-deep via-emerald to-emerald-deep text-primary-foreground overflow-hidden p-8 md:p-14 min-h-[520px]"
            style={{ perspective: "1400px" }}
          >
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 50%, hsl(var(--gold)) 0%, transparent 50%)",
              }}
            />

            <div
              className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
              }}
            />
            <div className="relative flex justify-between items-center gap-8 flex-col-reverse md:flex-row">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-gold text-gold-foreground font-display text-xs tracking-[0.25em] uppercase">
                    {property.category}
                  </span>
                  <span className="px-3 py-1 border border-primary-foreground/30 font-display text-xs tracking-[0.25em] uppercase">
                    {property.status}
                  </span>
                  <span className="inline-flex items-center gap-1 text-primary-foreground/70 text-xs ml-2 uppercase tracking-[0.2em]">
                    <MapPin className="size-3.5" /> {property?.address?.label},{" "}
                    {property?.address?.city}
                  </span>
                </div>
                <h1 className="text-giant font-display font-bold leading-[0.95]">
                  {property.title}
                </h1>
                <p className="mt-4 text-primary-foreground/80 max-w-2xl text-base md:text-lg leading-relaxed">
                  {property.description.split(".")[0]}.
                </p>
                <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 mt-6">
                  <span className="font-display text-4xl md:text-5xl text-gold font-bold">
                    {formatPrice(property.price)}
                    {property.category === "RENT" && (
                      <span className="text-lg text-primary-foreground/60 font-normal">
                        /month
                      </span>
                    )}
                  </span>
                  <span className="text-sm text-primary-foreground/60 uppercase tracking-[0.2em]">
                    QAR {pricePerSqft.toLocaleString()} / sqft
                  </span>
                </div>
              </div>
              <div
                className="w-[600px] h-[380px] max-h-[380px] relative"
                style={{ transformStyle: "preserve-3d" }}
              >
                <img
                  src={property.pngImage}
                  alt=""
                  aria-hidden
                  className="w-full h-full object-cover animate-float"
                  style={{
                    transform: `rotateX(${bldgTilt.x}deg) rotateY(${bldgTilt.y}deg) translateZ(60px)`,
                    transition: "transform 250ms ease-out",
                    filter:
                      "drop-shadow(30px 40px 50px hsl(var(--emerald-deep) / 0.8))",
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* <div className="md:px-24 px-4 mx-auto pb-10">

        </div> */}

        {/* Body — 60/40 layout */}
        <section className="md:px-24 px-4 mx-auto grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 lg:gap-12 pb-24">
          {/* MAIN — 60% */}
          <div className="space-y-16 min-w-0">
            {/* Image gallery — proper aspect ratios so nothing stretches */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="font-display tracking-[0.3em] text-emerald text-xs uppercase">
                  Gallery · {property.images.length} photos
                </p>
                <div className="flex gap-2">
                  <button className="size-9 border border-border flex items-center justify-center text-muted-foreground hover:text-emerald hover:border-emerald transition-colors">
                    <Share2 className="size-4" />
                  </button>
                  <button className="size-9 border border-border flex items-center justify-center text-muted-foreground hover:text-emerald hover:border-emerald transition-colors">
                    <Heart className="size-4" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 aspect-[16/10]">
                <button
                  onClick={() => setLightboxIdx(0)}
                  className="col-span-4 sm:col-span-3 row-span-2 relative group overflow-hidden bg-secondary"
                >
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-emerald-deep/0 group-hover:bg-emerald-deep/30 transition-colors flex items-center justify-center">
                    <ZoomIn className="size-10 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
                {property.images.slice(1, 3).map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setLightboxIdx(i + 1)}
                    className="hidden sm:block col-span-1 relative group overflow-hidden bg-secondary"
                  >
                    <img
                      src={img}
                      alt={`${property.title} ${i + 2}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </button>
                ))}
              </div>
              {property.images.length > 3 && (
                <button
                  onClick={() => setLightboxIdx(0)}
                  className="mt-3 text-xs font-display tracking-[0.25em] text-emerald uppercase hover:text-emerald-deep"
                >
                  View all {property.images.length} photos →
                </button>
              )}
            </div>

            {/* Quick stats — airy, light card row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                {
                  icon: BedDouble,
                  label: "Bedrooms",
                  value: property.BedRooms ?? "—",
                },
                {
                  icon: Bath,
                  label: "Bathrooms",
                  value: property.Bathrooms ?? "—",
                },
                {
                  icon: Maximize,
                  label: "Area · sqft",
                  value: property.Area.toLocaleString(),
                },
                { icon: Car, label: "Parking", value: property.parking ?? "—" },
                {
                  icon: Calendar,
                  label: "Year built",
                  value: property.yearBuilt ?? "—",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-secondary/40  p-5 text-center hover:bg-secondary transition-colors"
                >
                  <s.icon
                    className="size-5 mx-auto text-emerald mb-2.5"
                    strokeWidth={1.5}
                  />
                  <p className="font-display text-3xl font-bold leading-none text-foreground">
                    {s.value}
                  </p>
                  <p className="font-body text-[10px] tracking-[0.2em] text-muted-foreground uppercase mt-2">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 mb-3">
              <Building2 className="size-4 text-emerald" />
              <p className="font-display tracking-[0.3em] text-emerald text-xs uppercase">
                Location
              </p>
            </div>
            <h3 className="font-display text-3xl font-bold mb-2">
              {property?.address?.label}, {property?.address?.city}
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              {property?.address?.street}, {property?.address?.state},{" "}
              {property?.address?.zipCode}
            </p>
            {
              property.address?.gmaps && (
            <div className="h-96 w-full">
                <iframe
                    title="Maps"
                      src={property.address?.gmaps || undefined}
                      loading="lazy"
                      className="w-full h-full my-2"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
            </div>
              )
            }
            {/* Description — light, breathable */}
            <div>
              <p className="font-display tracking-[0.3em] text-emerald text-xs uppercase mb-3">
                Overview
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-5 leading-[1.05]">
                A residence worth{" "}
                <span className="text-emerald">arriving to.</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-[1.8] max-w-3xl">
                {property.description}
              </p>
              <p className="text-base text-muted-foreground/90 leading-[1.8] max-w-3xl mt-4">
                Set within {property?.address?.label}, this{" "}
                {property.category.toLowerCase()} offering spans{" "}
                {property.Area.toLocaleString()} sqft of considered living
                space. Every room has been designed for natural light, calm
                sightlines, and the unhurried rhythm of life in{" "}
                {property?.address?.city}. Premium materials, refined finishes,
                and a layout that flows effortlessly between private retreat and
                shared moments.
              </p>
            </div>

            <div className="flex flex-col w-full gap-4">
              {[
                {
                  icon: Wallet,
                  label: "Asking price",
                  value: formatPrice(property.price),
                  sub: property.category === "RENT" ? "per month" : "freehold",
                },
                {
                  icon: Ruler,
                  label: "Price per sqft",
                  value: `QAR ${pricePerSqft.toLocaleString()}`,
                  sub: "based on built-up area",
                },
                {
                  icon: Compass,
                  label: "Location",
                  value: property?.address?.label,
                  sub: property?.address?.city,
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="p-5  border border-border/70 bg-background flex items-start gap-4"
                >
                  <span className="size-14 bg-emerald/10 text-emerald flex items-center justify-center shrink-0">
                    <s.icon className="size-8" strokeWidth={1.6} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                      {s.label}
                    </p>
                    <p className="font-display text-xl font-bold leading-tight truncate">
                      {s.value}
                    </p>
                    <p className="font-body text-xs text-muted-foreground mt-0.5">
                      {s.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Property highlights — clean two-column key/value list, no heavy borders */}
            <div>
              <p className="font-display tracking-[0.3em] text-emerald text-xs uppercase mb-3">
                Specifications
              </p>
              <h3 className="font-display text-3xl md:text-4xl font-bold mb-2">
                Everything you need to know
              </h3>
              <p className="text-muted-foreground mb-7 max-w-2xl">
                A clear breakdown of the technical details — no fine print, no
                surprises.
              </p>
              <div className="grid sm:grid-cols-2 gap-x-12 gap-y-1">
                {[
                  ["Property Type", property.category],
                  ["Listing Status", property.status],
                  ["Furnishing", property.furnishing ?? "Unfurnished"],
                  ["Year Built", property.yearBuilt?.toString() ?? "—"],
                  [
                    "Total Built-up Area",
                    `${property.Area.toLocaleString()} sqft`,
                  ],
                  ["Price per sqft", `QAR ${pricePerSqft.toLocaleString()}`],
                  [
                    "HOA / Service Fees",
                    property.hoaFee
                      ? `QAR ${property.hoaFee.toLocaleString()} / year`
                      : "None",
                  ],
                  ["Parking Spaces", property.parking?.toString() ?? "—"],
                  ["Bedrooms", property.BedRooms?.toString() ?? "—"],
                  ["Bathrooms", property.Bathrooms?.toString() ?? "—"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex justify-between items-baseline py-3.5 border-b border-border/50"
                  >
                    <span className="font-body text-sm text-muted-foreground">
                      {k}
                    </span>
                    <span className="font-display text-base font-semibold text-foreground text-right">
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment plan / mortgage estimate */}
            {property.category !== "RENT" && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="size-4 text-emerald" />
                  <p className="font-display tracking-[0.3em] text-emerald text-xs uppercase">
                    Financing
                  </p>
                </div>
                <h3 className="font-display text-3xl md:text-4xl font-bold mb-2">
                  An indicative payment plan
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl">
                  A simple breakdown based on a 20% down payment and a 25-year
                  mortgage. Final terms vary by lender.
                </p>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    {
                      label: "Down payment (20%)",
                      value: formatPrice(downPayment),
                      sub: "Paid at closing",
                    },
                    {
                      label: "Loan amount",
                      value: formatPrice(loanAmount),
                      sub: "Financed over 25 yrs",
                    },
                    {
                      label: "Monthly est.",
                      value: formatPrice(monthlyEstimate),
                      sub: "Indicative only",
                    },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="p-5 bg-card border border-border "
                    >
                      <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                        {s.label}
                      </p>
                      <p className="font-display text-2xl font-bold mt-1.5 text-foreground">
                        {s.value}
                      </p>
                      <p className="font-body text-xs text-muted-foreground mt-1">
                        {s.sub}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3D Unit / Floor plan preview */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Layers className="size-4 text-emerald" />
                <p className="font-display tracking-[0.3em] text-emerald text-xs uppercase">
                  3D Preview
                </p>
              </div>
              <h3 className="font-display text-3xl md:text-4xl font-bold mb-2">
                {property.propertyType === "BUILDING"
                  ? "The building, in 3D."
                  : property.propertyType === "APARTMENT"
                    ? "Inside the unit, in 3D."
                    : "The plot, in 3D."}
              </h3>
              <p className="text-muted-foreground mb-5 max-w-2xl">
                An isometric render to help you picture scale, layout, and
                orientation before you visit.
              </p>
              <div className="relative bg-gradient-to-br from-secondary to-secondary/40  p-8 md:p-12 flex items-center justify-center min-h-[340px] overflow-hidden">
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage:
                      "linear-gradient(hsl(var(--emerald) / 0.2) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--emerald) / 0.2) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                  }}
                />
                <img
                  src={property.pngImage}
                  alt={`${property.title} 3D view`}
                  loading="lazy"
                  className="relative max-h-[400px] w-auto object-contain animate-float"
                  style={{
                    filter:
                      "drop-shadow(0 30px 40px hsl(var(--emerald-deep) / 0.3))",
                  }}
                />
              </div>
            </div>

            {/* Ownership / Legal */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="size-4 text-emerald" />
                <p className="font-display tracking-[0.3em] text-emerald text-xs uppercase">
                  Ownership &amp; Legal
                </p>
              </div>
              <h3 className="font-display text-3xl md:text-4xl font-bold mb-2">
                Clear title, clear process.
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl">
                All paperwork verified with the Ministry of Justice. Foreign
                ownership permitted in this zone.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  {
                    icon: FileText,
                    label: "Title Deed",
                    value: "Verified · Freehold",
                  },
                  {
                    icon: ShieldCheck,
                    label: "Foreign Ownership",
                    value: "Permitted",
                  },
                  {
                    icon: Clock,
                    label: "Handover",
                    value:
                      property.status === "AVAILABLE"
                        ? "Ready to move"
                        : property.status === "RESERVED"
                          ? "Reserved"
                          : "Sold",
                  },
                  {
                    icon: FileText,
                    label: "Listing ID",
                    value: property.id.toUpperCase(),
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="flex items-center gap-4 p-4 bg-card border border-border "
                  >
                    <span className="size-10  bg-emerald/10 text-emerald flex items-center justify-center shrink-0">
                      <s.icon className="size-5" strokeWidth={1.6} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                        {s.label}
                      </p>
                      <p className="font-display text-base font-semibold">
                        {s.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Pyramid className="size-4 text-gold" />
                  <p className="font-display tracking-[0.3em] text-emerald text-xs uppercase">
                    Features
                  </p>
                </div>
                <h3 className="font-display text-3xl md:text-4xl font-bold mb-2">
                  Signature touches
                </h3>
                <p className="text-muted-foreground text-sm mb-5">
                  Defining details that set this home apart.
                </p>
                <ul className="grid gap-1.5">
                  {property.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-3 py-2.5 font-body text-base text-foreground/90"
                    >
                      <CircleCheckBig
                        className="size-4 text-gold shrink-0"
                        strokeWidth={2}
                      />{" "}
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Home className="size-4 text-emerald" />
                  <p className="font-display tracking-[0.3em] text-emerald text-xs uppercase">
                    Amenities
                  </p>
                </div>
                <h3 className="font-display text-3xl md:text-4xl font-bold mb-2">
                  Lifestyle &amp; comfort
                </h3>
                <p className="text-muted-foreground text-sm mb-5">
                  Every day made easier, more enjoyable.
                </p>
                <ul className="grid gap-1.5">
                  {property.amenities.map((a) => (
                    <li
                      key={a}
                      className="flex items-center gap-3 py-2.5 font-body text-base text-foreground/90"
                    >
                      <CircleCheckBig
                        className="size-4 text-emerald shrink-0"
                        strokeWidth={2}
                      />{" "}
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* YouTube */}
            {youtubeId && (
              <div>
                <p className="font-display tracking-[0.3em] text-emerald text-xs uppercase mb-2">
                  Video tour
                </p>
                <h3 className="font-display text-3xl font-bold mb-5">
                  Walk inside.
                </h3>
                <button
                  onClick={() => setShowVideo(true)}
                  className="relative w-full aspect-video bg-emerald-deep overflow-hidden group"
                >
                  {showVideo ? (
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                      title="Property Video"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      <img
                        src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
                        alt="Video thumbnail"
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="size-20 rounded-full gradient-gold flex items-center justify-center shadow-gold group-hover:scale-110 transition-transform">
                          <Play className="size-8 text-emerald-deep fill-current ml-1" />
                        </span>
                      </div>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Address & nearby */}
            <div>
              <p className="font-display tracking-[0.25em] text-muted-foreground text-xs uppercase mb-3">
                Nearby
              </p>
              <div className="grid sm:grid-cols-2 gap-2">
                {property.NearByLocations.map((np) => (
                  <div
                    key={np.name}
                    className="flex items-center justify-between p-4 border border-border bg-card hover:border-emerald transition-colors"
                  >
                    <div>
                      <p className="font-body text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
                        {np.type}
                      </p>
                      <p className="font-display text-lg font-semibold">
                        {np.name}
                      </p>
                    </div>
                    {/* <span className="font-display text-sm text-emerald font-bold">
                      {np.distance}
                    </span> */}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SIDEBAR — 40% sticky */}
          <aside className="min-w-0">
            <StickySidebar property={property} />
          </aside>
        </section>
      </main>

      <ImageLightbox
        images={property.images}
        startIndex={lightboxIdx ?? 0}
        open={lightboxIdx !== null}
        onClose={() => setLightboxIdx(null)}
      />
    </>
  );
};

export default PropertyDetails;

import { useRef, useState } from "react";
import { ArrowUpRight, BedDouble, Bath, Maximize, MapPin } from "lucide-react";
import { Property, formatQAR } from "@/lib/properties";
import Link from "next/link";

interface Props {
  property: Property;
  index?: number;
}

const PropertyCard = ({ property, index = 0 }: Props) => {
  const [hover, setHover] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50 });
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({
      rx: -py * (hover ? 10 : 6),
      ry: px * (hover ? 10 : 8),
      gx: (px + 0.5) * 400,
      gy: (py + 0.5) * 400,
    });
  };

  const onLeave = () => {
    setHover(false);
    setTilt({ rx: 0, ry: 0, gx: 50, gy: 50 });
  };

  return (
    <Link
      href={`/properties/${property.id}`}
      className="group block animate-fade-in"
      style={{
        animationDelay: `${index * 80}ms`,
        perspective: "1800px",
        perspectiveOrigin: "50% 40%",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={onLeave}
      onMouseMove={onMove}
    >
      <article
        ref={ref}
        className="relative w-full aspect-[4/5] preserve-3d transition-3d will-change-transform"
        style={{
          // On hover the card tilts back to a fixed ground plane (no extra sway).
          // Idle: subtle mouse-tracked tilt.
          transform: hover
            ? `rotateX(70deg) rotateY(0deg) translateY(30px) scale(0.92)`
            : `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transformStyle: "preserve-3d",
          transformOrigin: "50% 75%",
        }}
      >
        {/* ============ FLAT CARD (idle = full card with image) ============ */}
        <div
          className="absolute inset-0 overflow-hidden border border-border preserve-3d transition-3d"
          style={{
            transformStyle: "preserve-3d",
            boxShadow: hover
              ? "0 60px 100px -40px hsl(var(--emerald-deep) / 0.5)"
              : "0 4px 20px -8px hsl(var(--emerald-deep) / 0.15)",
          }}
        >
          {/* Image layer — fades to a neutral base on hover */}
          <div
            className="absolute inset-0 transition-opacity duration-500"
            style={{ opacity: hover ? 0 : 1 }}
          >
            <div className="relative w-full aspect-[5/6] bg-secondary overflow-hidden">
              <img
                src={property.images[0]}
                alt={property.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.08]"
              />
              {/* <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, hsl(var(--emerald-deep) / 0) 45%, hsl(var(--emerald-deep) / 0.65) 100%)",
                }}
              /> */}
              {/* Mouse sheen on the photo */}
              {/* <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300 mix-blend-overlay"
                style={{
                  background: `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, hsl(0 0% 100% / 0.35) 0%, transparent 45%)`,
                  opacity: hover ? 0 : 1,
                }}
              /> */}
            </div>

            {/* Bottom info block (idle state) */}
            <div className="absolute inset-x-0 bottom-0 top-auto p-5 bg-card">
              <div className="flex items-baseline justify-between gap-2 mb-1">
                <h3 className="font-display text-2xl leading-tight truncate">{property.title}</h3>
              </div>
                <p className="text-sm font-sans text-gray-400 font-light pb-4 line-clamp-2">{property.description.slice(0, 110)}... <span className="text-gold-glow">Read More</span></p>
              <p className="font-body text-xs text-muted-foreground uppercase tracking-[0.2em]">
                {property.address.label}, {property.address.city}
              </p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <span className="font-jakarta text-xl text-emerald font-bold">
                  {formatQAR(property.price)}
                  {property.category === "RENT" && (
                    <span className="text-xs text-muted-foreground font-normal">/mo</span>
                  )}
                </span>
                <div className="flex items-center gap-3 text-muted-foreground text-xs">
                  {property.BedRooms ? (
                    <span className="flex items-center gap-1"><BedDouble className="size-3.5" />{property.BedRooms}</span>
                  ) : null}
                  {property.Bathrooms ? (
                    <span className="flex items-center gap-1"><Bath className="size-3.5" />{property.Bathrooms}</span>
                  ) : null}
                  <span className="flex items-center gap-1"><Maximize className="size-3.5" />{property.Area.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Idle badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 bg-emerald text-primary-foreground font-display text-xs tracking-[0.2em] uppercase">
                {property.category}
              </span>
              {property.status !== "AVAILABLE" && (
                <span className="px-3 py-1 bg-gold text-gold-foreground font-display text-xs tracking-[0.2em] uppercase">
                  {property.status}
                </span>
              )}
            </div>
            <div className="absolute top-4 right-4 size-10 rounded-full bg-background/95 flex items-center justify-center text-emerald">
              <ArrowUpRight className="size-5" />
            </div>
          </div>

          {/* Ground-plane base — visible only on hover (the "plot" the building sits on) */}
          <div
            className="absolute inset-0 transition-opacity duration-500"
            style={{ opacity: hover ? 1 : 0 }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 40%, hsl(var(--secondary)) 0%, hsl(var(--muted)) 60%, hsl(var(--emerald-deep) / 0.2) 100%)",
              }}
            />
            {/* Heavy grain texture */}
            <div
              className="absolute inset-0 opacity-[0.55] mix-blend-multiply"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.05 0 0 0 0 0.12 0 0 0 0 0.08 0 0 0 0.7 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
                backgroundSize: "240px 240px",
              }}
            />
            {/* Secondary fine grain */}
            <div
              className="absolute inset-0 opacity-30 mix-blend-overlay"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n2'><feTurbulence type='fractalNoise' baseFrequency='1.6' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n2)'/></svg>\")",
                backgroundSize: "160px 160px",
              }}
            />
            {/* Grid lines for ground feel */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "linear-gradient(hsl(var(--emerald) / 0.14) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--emerald) / 0.14) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            {/* Vignette */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 50%, transparent 40%, hsl(var(--emerald-deep) / 0.35) 100%)",
              }}
            />
          </div>
        </div>

        {/* ============ 3D ASSET — type-aware: BUILDING stands up, APARTMENT/PLOT stay isometric ============ */}
        {(() => {
          const t = property.propertyType;
          // Buildings stand vertically (counter the parent's tilt).
          // Apartments are isometric cutaways — keep them flat-on-ground with a slight lift.
          // Plots are flat patches — minimal lift, follow the ground plane.
          const counterRotX = t === "BUILDING" ? -80 : t === "APARTMENT" ? -100 : -80;
          const liftZ = t === "BUILDING" ? 2 : t === "APARTMENT" ? 10 : 6;
          const scaleHover = t === "PLOT" ? 1.0 : 1.08;
          const sizeClass =
            t === "BUILDING"
              ? "w-[80%] aspect-[5/6]"
              : t === "APARTMENT"
              ? "w-full aspect-[7/6]"
              : "w-[88%] aspect-[6/5]";
          const bottomClass = t === "BUILDING" ? "bottom-[0%]" : "bottom-[34%]";
          return (
            <div
              className={`pointer-events-none absolute left-1/2 ${bottomClass} ${sizeClass}`}
              style={{
                transform: hover
                  ? `translate(calc(-50% + ${tilt.ry * 1.2}px), calc(8% + ${-tilt.rx * 1}px)) rotateX(${counterRotX}deg) rotateY(${tilt.ry * (t === "BUILDING" ? 2 : 2.4)}deg) rotateZ(${tilt.ry * 1.2}deg) translateZ(${liftZ}px) scale(${scaleHover})`
                  : "translate(-50%, 30%) rotateX(0deg) translateZ(0) scale(0.5)",
                transformOrigin: "50% 100%",
                opacity: hover ? 1 : 0,
                transition: hover
                  ? "transform 200ms ease-out, opacity 500ms ease, filter 500ms ease"
                  : "transform 600ms cubic-bezier(.2,.8,.2,1), opacity 500ms ease, filter 500ms ease",
                filter: hover
                  ? "drop-shadow(0 14px 12px hsl(var(--emerald-deep) / 0.65))"
                  : "none",
              }}
            >
              <img
                src={property.buildingImage}
                alt=""
                aria-hidden
                loading="lazy"
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>
          );
        })()}

        {/* ============ Floating glass info plate — sits ABOVE the building on hover ============ */}
        <div
          className="pointer-events-none absolute left-[58%] bottom-4 transition-3d w-full"
          style={{
            transform: hover
              ? `translate(-50%, -110%) rotateX(-68deg) rotateY(${tilt.ry * 0.4}deg) translateZ(220px)`
              : "translate(-50%, -50%) rotateX(0deg) translateZ(0)",
            transformOrigin: "50% 100%",
            opacity: hover ? 1 : 0,
          }}
        >
          <div
            className="px-4 py-2 text-center border border-white/20 rounded-sm flex justify-between w-5/6 gap-4 items-center"
            style={{
              background: "hsl(162 70% 8%) / 0.70)",
              backdropFilter: "saturate(160%)",
              WebkitBackdropFilter: "saturate(160%)",
              boxShadow:
                "0 20px 50px -10px hsl(var(--emerald-deep) / 0.55), inset 0 1px 0 hsl(0 0% 100% / 0.25)",
            }}
          >
            <p className="font-display font-medium text-white text-base leading-tight truncate">{property.title}</p>
            <p className="font-body text-[10px] tracking-[0.25em] uppercase text-white inline-flex items-center gap-1 mt-0.5">
              <MapPin className="size-3" /> {property.address.city}
            </p>
            {/* <p className="font-display text-emerald font-bold text-base mt-0.5">
              {formatQAR(property.price)}
            </p> */}
          </div>
        </div>

        {/* Ground shadow under building — tight contact shadow */}
        <div
          className="pointer-events-none absolute left-1/2 bottom-[42%] rounded-[50%] bg-emerald-deep blur-xl transition-3d"
          style={{
            transform: "translate(-50%, 30%)",
            width: hover ? "48%" : "0%",
            height: hover ? "14px" : "0px",
            opacity: hover ? 1 : 0,
          }}
        />
      </article>
    </Link>
  );
};

export default PropertyCard;

"use client";

import { useEffect, useRef, useState } from "react";
import { Award, Globe2, Users, Sparkles, ArrowRight, Quote } from "lucide-react";
import building1 from "@/assets/building-1.png";
import building3 from "@/assets/building-3.png";
import building5 from "@/assets/building-5.png";
import interior1 from "@/assets/interior-1.jpg";
import interior2 from "@/assets/interior-2.jpg";
import interior3 from "@/assets/interior-3.jpg";
import Link from "next/link";

// Reveal-on-scroll hook
const useReveal = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.18 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, visible };
};

const Reveal = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"} ${className}`}
    >
      {children}
    </div>
  );
};

// Parallax hook — returns offset in px based on element's position in viewport
const useParallax = (speed = 0.3) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      setOffset(-center * speed);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [speed]);
  return { ref, offset };
};

const Parallax = ({ children, speed = 0.15, className = "" }: { children: React.ReactNode; speed?: number; className?: string }) => {
  const { ref, offset } = useParallax(speed);
  return (
    <div ref={ref} className={className} style={{ transform: `translate3d(0, ${offset}px, 0)`, willChange: "transform" }}>
      {children}
    </div>
  );
};

const Counter = ({ to, suffix = "" }: { to: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      const start = performance.now();
      const dur = 1800;
      const tick = (t: number) => {
        const p = Math.min((t - start) / dur, 1);
        setVal(Math.floor(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      io.disconnect();
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
};

const About = () => {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onHeroMove = (e: React.MouseEvent) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouse({ x, y });
  };

  const stats = [
    { label: "Properties Sold", value: 1240, suffix: "+" },
    { label: "Years of Excellence", value: 18, suffix: "" },
    { label: "Happy Clients", value: 3500, suffix: "+" },
    { label: "Cities Covered", value: 12, suffix: "" },
  ];

  const values = [
    { icon: Award, title: "Uncompromising Quality", desc: "Every listing is hand-curated and verified by our architectural team to meet a singular standard of excellence." },
    { icon: Globe2, title: "Global Perspective", desc: "Operating across Doha, Lusail and beyond — our reach connects discerning buyers with iconic properties worldwide." },
    { icon: Users, title: "Client Devotion", desc: "A dedicated advisor walks with you from first viewing to final keys. White-glove, end-to-end, always." },
    { icon: Sparkles, title: "Future-Forward", desc: "We pioneered immersive 3D property experiences in the Gulf — bringing real estate into a new dimension." },
  ];

  const team = [
    { name: "Yusuf Al-Mansoori", role: "Founder & CEO", img: interior1 },
    { name: "Layla Hassan", role: "Head of Architecture", img: interior2 },
    { name: "Khalid Rahman", role: "Director of Sales", img: interior3 },
  ];

  const milestones = [
    { year: "2008", title: "The Foundation", desc: "Qatar·Estate is born in the heart of West Bay with a single boutique office and a vision for elevated real estate." },
    { year: "2014", title: "Lusail Expansion", desc: "We become the first agency to specialize exclusively in Lusail's emerging skyline, shaping a new luxury frontier." },
    { year: "2019", title: "International Reach", desc: "Opening representation in London and Dubai, connecting Qatari investors to global landmark properties." },
    { year: "2024", title: "The 3D Revolution", desc: "Launch of our signature immersive 3D property platform — a first for the Middle East." },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* HERO */}
      <section
        ref={heroRef}
        onMouseMove={onHeroMove}
        className="relative min-h-[90vh] flex items-center overflow-hidden gradient-hero text-primary-foreground"
      >
        {/* Grain */}
        <div
          className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E\")",
          }}
        />
        {/* Floating buildings parallax */}
        <img
          src={building1.src}
          alt=""
          className="absolute -right-10 bottom-0 w-[40vw] max-w-[600px] opacity-90 pointer-events-none"
          style={{
            transform: `translate3d(${mouse.x * -30}px, ${scrollY * 0.25 + mouse.y * -20}px, 0) rotate(${mouse.x * 2}deg)`,
            filter: "drop-shadow(0 40px 60px hsl(var(--emerald-deep) / 0.6))",
          }}
        />
        <img
          src={building3.src}
          alt=""
          className="absolute left-[5%] bottom-0 w-[24vw] max-w-[340px] opacity-80 pointer-events-none hidden md:block"
          style={{
            transform: `translate3d(${mouse.x * 20}px, ${scrollY * 0.4 + mouse.y * 10}px, 0)`,
            filter: "drop-shadow(0 30px 40px hsl(var(--emerald-deep) / 0.5))",
          }}
        />

        <div className="md:px-24 px-4 relative z-10 py-32">
          <Reveal>
            <p className="font-display tracking-[0.4em] text-gold text-sm mb-6">EST · 2008 · DOHA</p>
          </Reveal>
          <Reveal delay={150}>
            <h1 className="text-giant font-display">
              Building <span className="text-gold italic">legacy</span><br />
              one address at a time.
            </h1>
          </Reveal>
          <Reveal delay={350}>
            <p className="mt-8 max-w-2xl text-base md:text-lg text-primary-foreground/80 leading-relaxed">
              For nearly two decades, Qatar·Estate has been the definitive name in the Gulf's most coveted properties — pairing architectural mastery with uncompromising service.
            </p>
          </Reveal>
          <Reveal delay={500}>
            <div className="mt-12 flex items-center gap-2 text-sm tracking-[0.3em] text-primary-foreground/60 font-display">
              <span className="h-px w-12 bg-gold" /> SCROLL TO EXPLORE
            </div>
          </Reveal>
        </div>
      </section>

      {/* MEGA STATEMENT */}
      <section className="py-32 md:py-48 bg-background relative overflow-hidden">
        <Parallax speed={0.25} className="absolute -right-20 top-10 w-[28vw] max-w-[360px] opacity-[0.07] pointer-events-none">
          <img src={building5.src} alt="" className="w-full" />
        </Parallax>
        <div className="md:px-24 px-4 mx-auto relative">
          <Reveal>
            <p className="font-display tracking-[0.4em] text-emerald text-sm mb-8">— OUR PHILOSOPHY</p>
          </Reveal>
          <Parallax speed={0.08}>
            <Reveal delay={100}>
              <h2 className="text-huge font-display max-w-5xl">
                We don't sell <span className="italic text-emerald">square meters.</span> We deliver the chapters where your finest stories will unfold.
              </h2>
            </Reveal>
          </Parallax>
          <div className="mt-16 grid md:grid-cols-2 gap-12">
            <Reveal delay={150}>
              <p className="text-base text-muted-foreground leading-relaxed">
                Founded in 2008 by a small circle of Qatari architects and investors, Qatar·Estate emerged from a singular conviction: that the Gulf deserved a real estate practice as ambitious as its skyline. Today, we represent the most distinguished addresses in Doha, Lusail and the wider region.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <p className="text-base text-muted-foreground leading-relaxed">
                Our work begins where typical brokerages end — with research, restoration, architectural review and a relentless commitment to detail. The result is a portfolio in which every listing has been earned, never just acquired.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* STATS — sticky scrolling band */}
      <section className="py-24 bg-emerald text-primary-foreground relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
        <div className="md:px-24 px-4 mx-auto relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 100}>
                <div>
                  <div className="text-5xl md:text-6xl font-display text-gold">
                    <Counter to={s.value} suffix={s.suffix} />
                  </div>
                  <div className="mt-4 font-display tracking-[0.2em] text-sm text-primary-foreground/70">
                    {s.label.toUpperCase()}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-32 bg-secondary">
        <div className="md:px-24 px-4 mx-auto">
          <div className="flex items-end justify-between mb-20 flex-wrap gap-8">
            <Reveal>
              <div>
                <p className="font-display tracking-[0.4em] text-emerald text-sm mb-6">— WHAT WE STAND FOR</p>
                <h2 className="text-4xl md:text-5xl font-display max-w-2xl">Four principles. Zero compromise.</h2>
              </div>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-border">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 120}>
                <div className="bg-secondary p-12 h-full group hover:bg-background transition-colors duration-500">
                  <v.icon className="size-8 text-gold mb-6 group-hover:scale-110 transition-transform duration-500" />
                  <h3 className="text-2xl font-display mb-3">{v.title}</h3>
                  <p className="text-muted-foreground text-base leading-relaxed">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE — sticky milestones */}
      <section className="py-32 bg-background relative">
        <div className="md:px-24 px-4 mx-auto">
          <Reveal>
            <p className="font-display tracking-[0.4em] text-emerald text-sm mb-6">— OUR JOURNEY</p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="text-4xl md:text-5xl font-display mb-20 max-w-3xl">A timeline of bold decisions.</h2>
          </Reveal>

          <div className="relative">
            {/* vertical line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-20">
              {milestones.map((m, i) => (
                <Reveal key={m.year} delay={i * 80}>
                  <div className={`relative flex flex-col md:flex-row items-start gap-8 ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
                    <div className="md:w-1/2 pl-20 md:pl-0 md:px-12">
                      <Parallax speed={0.12}>
                        <div className="text-4xl md:text-5xl font-display text-gold mb-2">{m.year}</div>
                      </Parallax>
                      <h3 className="text-2xl font-display mb-3">{m.title}</h3>
                      <p className="text-muted-foreground text-base leading-relaxed">{m.desc}</p>
                    </div>
                    <div className="hidden md:block md:w-1/2" />
                    <div className="absolute left-8 md:left-1/2 top-2 -translate-x-1/2 size-4 rounded-full bg-emerald ring-4 ring-background" />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="py-32 bg-secondary">
        <div className="md:px-24 px-4 mx-auto">
          <Reveal>
            <p className="font-display tracking-[0.4em] text-emerald text-sm mb-6">— THE PEOPLE</p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="text-4xl md:text-5xl font-display mb-20 max-w-3xl">Behind every address, an extraordinary team.</h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((p, i) => (
              <Reveal key={p.name} delay={i * 150}>
                <div className="group cursor-pointer" style={{ transform: `translateY(${i % 2 === 0 ? 0 : 40}px)` }}>
                  <Parallax speed={i % 2 === 0 ? 0.08 : -0.08}>
                    <div className="relative overflow-hidden bg-muted aspect-[3/4]">
                      <img
                        src={p.img.src}
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep/80 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
                    </div>
                  </Parallax>
                  <div className="pt-6">
                    <h3 className="text-xl font-display">{p.name}</h3>
                    <p className="font-display tracking-[0.2em] text-xs text-emerald mt-2">{p.role.toUpperCase()}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="py-32 bg-background">
        <div className="md:px-24 px-4 mx-auto max-w-5xl">
          <Reveal>
            <Quote className="size-12 text-gold mb-8" />
          </Reveal>
          <Reveal delay={100}>
            <blockquote className="text-3xl md:text-5xl font-display leading-tight">
              "They didn't show us a property. They <span className="italic text-emerald">curated a future</span> for our family."
            </blockquote>
          </Reveal>
          <Reveal delay={300}>
            <div className="mt-12 flex items-center gap-4">
              <div className="size-14 rounded-full bg-emerald flex items-center justify-center text-gold font-display text-xl">A</div>
              <div>
                <div className="font-display text-lg">Amira Al-Thani</div>
                <div className="text-sm text-muted-foreground tracking-wider">Private Client · Lusail Marina</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 bg-emerald-deep text-primary-foreground overflow-hidden">
        <Parallax speed={0.35} className="absolute -right-20 -bottom-10 w-[50vw] max-w-[600px] opacity-25 pointer-events-none">
          <img src={building5.src} alt="" className="w-full" />
        </Parallax>
        <div className="md:px-24 px-4 mx-auto relative">
          <Reveal>
            <h2 className="text-huge font-display max-w-4xl">
              Ready to find an address <span className="italic text-gold">worth your name?</span>
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <Link
              href="/properties"
              className="inline-flex items-center gap-3 mt-10 px-8 py-5 bg-gold text-emerald-deep font-display tracking-[0.2em] text-sm hover:bg-gold-glow transition-colors group"
            >
              EXPLORE THE PORTFOLIO
              <ArrowRight className="size-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default About;

"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function FragmentFadeSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const grid = gridRef.current;
            const section = sectionRef.current;

            if (!grid || !section) return;

            const cols = 16;
            const rows = 10;

            // clear old fragments
            grid.innerHTML = "";

            // create fragments
            for (let i = 0; i < cols * rows; i++) {
                const box = document.createElement("div");

                const col = i % cols;
                const row = Math.floor(i / cols);

                box.className =
                    "fragment absolute bg-white/10 border border-white/5 backdrop-blur-sm";

                box.style.width = `${100 / cols}%`;
                box.style.height = `${100 / rows}%`;

                box.style.left = `${(100 / cols) * col}%`;
                box.style.top = `${(100 / rows) * row}%`;

                grid.appendChild(box);
            }

            const fragments = gsap.utils.toArray<HTMLElement>(".fragment");

            // hidden initially
            gsap.set(fragments, {
                opacity: 0,
                x: 0,
                y: 0,
                scale: 1,
            });

            gsap.set(".main-content", {
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
            });

            gsap.set(section, {
                opacity: 1,
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: "+=2200",
                    scrub: true,
                    pin: true,
                },
            });

            // hold normal section
            tl.to({}, { duration: 2 });

            // content fade
            tl.to(
                ".main-content",
                {
                    opacity: 0,
                    filter: "blur(25px)",
                    scale: 0.96,
                    ease: "none",
                    duration: 1.5,
                },
                2
            );

            // fragments appear gradually
            tl.to(
                fragments,
                {
                    opacity: 1,
                    stagger: {
                        amount: 0.8,
                        from: "random",
                    },
                    ease: "none",
                    duration: 0.5,
                },
                2
            );

            // fragments move + disappear
            tl.to(
                fragments,
                {
                    opacity: 0,
                    x: () => gsap.utils.random(-80, 80),
                    y: () => gsap.utils.random(-80, 80),
                    scale: () => gsap.utils.random(0.8, 1.2),
                    ease: "none",
                    stagger: {
                        amount: 1,
                        from: "random",
                    },
                    duration: 2,
                },
                2.4
            );

            // section fade
            tl.to(
                section,
                {
                    opacity: 0,
                    ease: "none",
                    duration: 1,
                },
                3
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative h-screen overflow-hidden bg-black text-white"
        >
            {/* Main Content */}
            <div className="main-content absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
                <Image
                    src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
                    alt="demo"
                    width={500}
                    height={300}
                    className="mb-8 rounded-3xl object-cover"
                />

                <h1 className="text-7xl font-black tracking-tight md:text-9xl">
                    PIXEL FADE
                </h1>

                <p className="mt-6 max-w-2xl text-lg text-white/60">
                    Section dissolves into animated square fragments while scrolling.
                </p>
            </div>

            {/* Fragment Grid */}
            <div
                ref={gridRef}
                className="absolute inset-0 z-20 overflow-hidden"
            />
        </section>
    );
}
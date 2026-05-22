"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

type BlurRevealTextProps = {
    text: string;
    className?: string;
};

export default function BlurRevealText({
    text,
    className = "",
}: BlurRevealTextProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const chars = gsap.utils.toArray<HTMLElement>(".char");

            // 1. Set the initial hidden state for all characters
            gsap.set(chars, {
                scale: 0,
                opacity: 0,
                filter: "blur(50px)",
            });

            // 2. Reveal Animation
            gsap.to(chars, {
                scale: 1,
                opacity: 1,
                filter: "blur(0px)",
                ease: "none",
                stagger: 0.05, // Replaces the forEach loop and index * 0.15 math
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 85%",
                    end: "top 40%", // Finishes revealing comfortably before it reaches the top
                    scrub: true,
                },
            });

            // 3. Fade Out Animation
            // We use fromTo with immediateRender: false so it doesn't overwrite the initial hidden state on page load.
            gsap.fromTo(
                chars,
                {
                    scale: 1,
                    opacity: 1,
                    filter: "blur(0px)",
                },
                {
                    scale: 0,
                    opacity: 0,
                    filter: "blur(50px)",
                    ease: "none",
                    stagger: 0.05,
                    immediateRender: false, 
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 15%", // Triggers exactly when the container is 15% away from the top
                        end: "top 0%",    // Finishes fading out completely as it hits the top edge
                        scrub: true,
                    },
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            className={`flex flex-wrap overflow-hidden text-6xl md:text-8xl font-black tracking-tight ${className}`}
        >
            {text.split("").map((char, index) => (
                <span
                    key={`${char}-${index}`}
                    className="char inline-block"
                    style={{
                        transformOrigin: "center",
                        whiteSpace: char === " " ? "pre" : "normal",
                    }}
                >
                    {char === " " ? "\u00A0" : char}
                </span>
            ))}
        </div>
    );
}
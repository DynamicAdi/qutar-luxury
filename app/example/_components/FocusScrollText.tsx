"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText } from "@/lib/gsap";

type FocusScrollTextProps = {
    text: string;
};

export default function FocusScrollText({
    text,
}: FocusScrollTextProps) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        if (!textRef.current || !sectionRef.current) return;

        const ctx = gsap.context(() => {
            const split = new SplitText(textRef.current!, {
                type: "words",
            });

            const words = split.words;

            // initial state
            gsap.set(words, {
                opacity: 0.08,
                filter: "blur(8px)",
            });

            const groupSize = 10;

            // single timeline
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: `+=${words.length * 180}`,
                    scrub: true,
                    pin: true,
                },
            });

            words.forEach((_, index) => {
                const currentWords = words.slice(index, index + groupSize);

                // show words
                tl.to(
                    currentWords,
                    {
                        opacity: 1,
                        filter: "blur(0px)",
                        stagger: 0.03,
                        ease: "power2.out",
                        duration: 0.5,
                    },
                    index * 0.15
                );

                // hide words
                tl.to(
                    currentWords,
                    {
                        opacity: 0.08,
                        filter: "blur(8px)",
                        stagger: 0.02,
                        ease: "power2.out",
                        duration: 0.5,
                    },
                    index * 0.15 + 0.6
                );
            });

            return () => {
                split.revert();
            };
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative flex h-screen items-center overflow-hidden bg-black px-8 text-white"
        >
            <div className="mx-auto max-w-6xl">
                <p
                    ref={textRef}
                    className="text-3xl font-medium leading-[1.8] tracking-tight md:text-5xl"
                >
                    {text}
                </p>
            </div>
        </section>
    );
}
"use client";

import { useEffect, useRef, useState } from "react";
import { CategoryCard } from "../CategoryCard";

export default function CategorySlider({
  categories,
}: {
  categories: any[];
}) {
  const [current, setCurrent] = useState(0);

  const startX = useRef(0);
  const endX = useRef(0);

  // Duplicate data for seamless looping
  const items = [...categories, ...categories];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => {
        const next = prev + 1;

        if (next >= categories.length) {
          return 0;
        }

        return next;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [categories.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    endX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = startX.current - endX.current;

    if (Math.abs(diff) < 50) return;

    if (diff > 0) {
      // Swipe Left
      setCurrent((prev) => (prev + 1) % categories.length);
    } else {
      // Swipe Right
      setCurrent((prev) =>
        prev === 0 ? categories.length - 1 : prev - 1
      );
    }
  };

  return (
    <div
      className="overflow-hidden w-full mt-8"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex transition-transform duration-500 ease-in-out will-change-transform backface-hidden slider-track"
        style={{
          transform: `translate3d(-${current * 20}%, 0, 0)`,
        }}
      >
        {items.map((cat, index) => (
          <div
            key={`${cat.title}-${index}`}
            className="flex-shrink-0 w-1/5 px-2"
          >
            <CategoryCard
              title={cat.title}
              description={cat.description}
              href={cat.href}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
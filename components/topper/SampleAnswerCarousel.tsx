"use client";

import { useState, useEffect, useCallback } from "react";

const SAMPLE_COUNT = 4;

interface Props {
  topperName: string;
  year: number;
  rank: number;
  onImageClick?: (src: string) => void;
}

export default function SampleAnswerCarousel({ topperName, year, rank, onImageClick }: Props) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((c) => (c + 1) % SAMPLE_COUNT), []);

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  const imgSrc = `/sample-answers/${current + 1}.png`;

  return (
    <div className="relative cursor-pointer" onClick={() => onImageClick?.(imgSrc)}>
      <div className="relative overflow-hidden rounded-xl bg-black/[0.02]">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {Array.from({ length: SAMPLE_COUNT }).map((_, i) => (
            <div key={i} className="min-w-0 w-full shrink-0">
              <img
                src={`/sample-answers/${i + 1}.png`}
                alt={`Sample answer copy page ${i + 1}`}
                className="w-full object-contain max-h-[500px]"
              />
            </div>
          ))}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

        <div className="absolute bottom-0 left-0 right-0 p-5 pointer-events-none">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-white/20 backdrop-blur-sm px-3 py-1.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-white/80">{year}</p>
              <p className="text-sm font-bold text-white">AIR {rank}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-3 right-3 z-10 flex gap-1.5 pointer-events-none">
        {Array.from({ length: SAMPLE_COUNT }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? "w-5 bg-white" : "w-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

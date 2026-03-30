"use client";

import React, { useEffect, useState } from "react";

const stats = [
  { label: "Students Supported", value: 12500, suffix: "+" },
  { label: "Volunteers Active", value: 4800, suffix: "+" },
  { label: "Sessions Completed", value: 85000, suffix: "+" },
];

export default function StatsBar() {
  return (
    <section className="relative -mt-12 mb-24 z-20">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="glass p-12 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] flex flex-col md:flex-row items-center justify-around gap-12 border-white/60">
          {stats.map((stat, idx) => (
            <StatItem key={idx} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatItem({ label, value, suffix }: { label: string; value: number; suffix: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="flex flex-col items-center text-center group">
      <div className="text-5xl md:text-6xl font-black text-primary mb-3 tabular-nums drop-shadow-sm transition-transform group-hover:scale-110">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-foreground/50 font-bold text-sm md:text-base uppercase tracking-[0.2em] px-4">
        {label}
      </div>
      <div className="w-12 h-1 bg-primary/20 rounded-full mt-4 group-hover:w-24 transition-all duration-500"></div>
    </div>
  );
}

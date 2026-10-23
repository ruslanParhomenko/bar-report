"use client";

import { useShowAnimation } from "@/providers/show-animation";
import { useEffect, useState } from "react";

type Flake = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  opacity: number;
  blur: number;
};

export default function PumpkinSnow({ count = 30 }: { count?: number }) {
  const [flakes, setFlakes] = useState<Flake[]>([]);

  const { isShow } = useShowAnimation();

  console.log(isShow);

  useEffect(() => {
    setFlakes(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 16 + Math.random() * 14,
        duration: 8 + Math.random() * 10,
        delay: -Math.random() * 15,
        drift: (Math.random() - 0.5) * 80,
        opacity: Math.random() * 0.65,
        blur: Math.random() * 0.5,
      })),
    );
  }, [count]);

  if (!isShow) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {flakes.map((f) => (
        <span
          key={f.id}
          className="pumpkin-flake absolute top-0"
          style={{
            left: `${f.left}%`,
            fontSize: `${f.size}px`,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
            ["--drift" as string]: `${f.drift}px`,
          }}
        >
          <img
            src="/pumpkin.svg"
            width={f.size}
            alt=""
            style={{ opacity: f.opacity, filter: `blur(${f.blur}px)` }}
          />
        </span>
      ))}
    </div>
  );
}

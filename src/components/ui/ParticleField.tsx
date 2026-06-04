"use client";

import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

const COUNT = 60;

export function ParticleField({
  count = COUNT,
  className = "",
  color = "rgba(255,255,255,0.4)",
}: {
  count?: number;
  className?: string;
  color?: string;
}) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const arr: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      delay: Math.random() * 6,
      duration: 6 + Math.random() * 8,
      opacity: Math.random() * 0.6 + 0.2,
    }));
    setParticles(arr);
  }, [count]);

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: color,
            boxShadow: `0 0 ${p.size * 4}px ${color}`,
            opacity: p.opacity,
            animation: `floatParticle ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes floatParticle {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(${Math.random() * 20 - 10}px, ${Math.random() * 40 - 20}px, 0); }
        }
      `}</style>
    </div>
  );
}

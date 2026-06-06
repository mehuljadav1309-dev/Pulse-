"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(true);
  const [variant, setVariant] = useState<"default" | "hover" | "text">("default");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (document.body.classList.contains("dash")) return;

    document.body.classList.add("has-custom-cursor");
    setHidden(false);

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const dot = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    let rafId = 0;

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const loop = () => {
      // Ring follows with easing
      ring.x += (mouse.x - ring.x) * 0.18;
      ring.y += (mouse.y - ring.y) * 0.18;
      // Dot follows quickly
      dot.x += (mouse.x - dot.x) * 0.55;
      dot.y += (mouse.y - dot.y) * 0.55;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(loop);
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t) return;
      const interactive = t.closest("a, button, [data-cursor='hover']");
      const text = t.closest("input, textarea, [data-cursor='text']");
      if (text) setVariant("text");
      else if (interactive) setVariant("hover");
      else setVariant("default");
    };

    const onLeave = () => {
      document.body.style.cursor = "auto";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafId);
      document.body.classList.remove("has-custom-cursor");
    };
  }, []);

  if (hidden) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
        style={{ willChange: "transform" }}
      >
        <div
          className={`relative -translate-x-1/2 -translate-y-1/2 rounded-full transition-[width,height,opacity,border-color,background-color] duration-300 ease-spring-smooth ${
            variant === "hover"
              ? "h-12 w-12 border border-accent/60 bg-accent/10"
              : variant === "text"
              ? "h-6 w-6 border border-mint/70 bg-mint/10"
              : "h-9 w-9 border border-white/25"
          }`}
        >
          {variant === "hover" && (
            <span className="absolute inset-0 m-auto h-1.5 w-1.5 rounded-full bg-accent" />
          )}
        </div>
      </div>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
        style={{ willChange: "transform" }}
      >
        <div
          className={`relative -translate-x-1/2 -translate-y-1/2 rounded-full transition-[width,height,background-color] duration-200 ${
            variant === "text" ? "h-1 w-1 bg-mint" : "h-1.5 w-1.5 bg-white"
          }`}
        />
      </div>
    </>
  );
}

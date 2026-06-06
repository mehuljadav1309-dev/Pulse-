"use client";

import { useEffect, useState } from "react";

export function NoiseOverlay() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (document.body.classList.contains("dash")) return;
    setEnabled(true);
  }, []);

  if (!enabled) return null;
  return <div aria-hidden className="noise" />;
}

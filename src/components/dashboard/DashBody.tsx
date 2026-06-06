"use client";

import { useEffect } from "react";

export function DashBody() {
  useEffect(() => {
    document.body.classList.add("dash");
    return () => {
      document.body.classList.remove("dash");
    };
  }, []);

  return null;
}

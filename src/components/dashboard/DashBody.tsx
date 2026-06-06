"use client";

import { useEffect } from "react";

export function DashBody() {
  useEffect(() => {
    document.body.classList.add("dash-dark");
    return () => {
      document.body.classList.remove("dash-dark");
    };
  }, []);

  return null;
}

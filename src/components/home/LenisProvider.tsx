"use client";

import "lenis/dist/lenis.css";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

type LenisProviderProps = {
  children: ReactNode;
};

export default function LenisProvider({ children }: LenisProviderProps) {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.1,
        smoothWheel: true,
        touchMultiplier: 1,
      }}
    >
      {children}
    </ReactLenis>
  );
}

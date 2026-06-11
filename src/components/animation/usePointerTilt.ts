"use client";

import { useRef } from "react";
import { useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

export function usePointerTilt(maxTilt = 16) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const rotateX = useSpring(useMotionValue(0), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 150, damping: 20 });

  const glowPosition = useTransform(
    [rotateX, rotateY],
    ([rx, ry]: number[]) => `${50 + ry * 2}% ${50 - rx * 2}%`
  );

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * maxTilt);
    rotateX.set(-py * maxTilt);
  };

  const onPointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return { ref, rotateX, rotateY, glowPosition, onPointerMove, onPointerLeave };
}

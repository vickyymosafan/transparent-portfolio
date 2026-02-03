"use client";

import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils"; // Assuming you have a utils/cn or similar. If not, I'll use template literals or clsx directly.

interface TextRevealProps {
  children: string;
  className?: string;
  range?: [number, number]; // [start, end] scroll progress (0-1)
  variant?: "blur" | "simple"; 
}

export function TextReveal({
  children,
  className,
  range = [0.2, 0.8], // Default: reveal between 20% and 80% of container visibility
  variant = "blur"
}: TextRevealProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const words = children.split(" ");

  return (
    <span ref={containerRef} className={cn("inline-block relative custom-cursor-text", className)}>
      {words.map((word, i) => {
        const start = range[0] + (i / words.length) * (range[1] - range[0]);
        const end = start + (1 / words.length) * (range[1] - range[0]);
        return (
          <span key={i} className="inline-block mr-[0.2em] whitespace-nowrap">
            {word.split("").map((char, j) => {
               // Per-character stagger within the word
               const step = (end - start) / word.length;
               const charStart = start + step * j;
               const charEnd = charStart + step;
               
               return (
                   <Char
                        key={j}
                        progress={scrollYProgress}
                        range={[charStart, charEnd]}
                        variant={variant}
                   >
                        {char}
                   </Char>
               );
            })}
          </span>
        );
      })}
    </span>
  );
}

interface CharProps {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  variant: "blur" | "simple";
}

function Char({ children, progress, range, variant }: CharProps) {
  const opacity = useTransform(progress, range, [0, 1]);
  const blur = useTransform(progress, range, [10, 0]);
  const y = useTransform(progress, range, [10, 0]);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);

  // Variant Switch
  const style = variant === "blur" 
    ? { opacity, filter, y }
    : { opacity, y };

  return (
    <motion.span style={style} className="inline-block">
      {children}
    </motion.span>
  );
}

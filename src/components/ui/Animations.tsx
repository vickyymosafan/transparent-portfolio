"use client";

import { motion } from "framer-motion";

export function WordMask({
    text,
    className,
    delay = 0,
    stagger = 0.08,
}: {
    text: string;
    className?: string;
    delay?: number;
    stagger?: number;
}) {
    const words = text.split(" ");
    return (
        <motion.span className={className} initial="hidden" whileInView="visible" viewport={{ once: true }} aria-label={text}>
            {words.map((word, i) => (
                <span key={i} className="inline-block overflow-hidden align-bottom" aria-hidden>
                    <motion.span
                        className="inline-block"
                        initial={{ y: "112%", opacity: 0 }}
                        variants={{ visible: { y: "0%", opacity: 1 } }}
                        transition={{ duration: 0.82, ease: [0.16, 1, 0.3, 1], delay: delay + i * stagger }}
                    >
                        {word}
                        {i < words.length - 1 ? "\u00A0" : ""}
                    </motion.span>
                </span>
            ))}
        </motion.span>
    );
}

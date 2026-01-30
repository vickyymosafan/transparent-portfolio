"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";

export function Contact() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end end"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [-50, 0]);

    return (
        <section ref={containerRef} className="relative z-10 bg-primary text-black pt-32 pb-12 overflow-hidden selection:bg-black selection:text-primary">
            {/* Background Noise (Subtle) */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat mix-blend-multiply pointer-events-none" />

            {/* Scrolling Marquee */}
            <div className="absolute top-0 left-0 w-full overflow-hidden whitespace-nowrap border-b-2 border-black bg-black py-2">
                 <motion.div 
                    initial={{ x: "0%" }}
                    animate={{ x: "-100%" }}
                    transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
                    className="flex text-primary font-mono font-bold uppercase tracking-widest text-sm"
                >
                    {[...Array(10)].map((_, i) => (
                        <span key={i} className="mx-8">
                            Open to Work // Frontend Architecture // Backend Systems // Creative Dev //
                        </span>
                    ))}
                 </motion.div>
            </div>

            <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center mt-12">
                <motion.div style={{ y }} className="mb-8">
                    <p className="font-mono font-bold uppercase tracking-[0.3em] text-sm md:text-base border border-black/20 rounded-full px-4 py-1 inline-block">
                        What&apos;s Next?
                    </p>
                </motion.div>

                <h2 className="text-[14vw] leading-[0.85] font-black tracking-tighter uppercase mix-blend-multiply mb-12 flex flex-col">
                    <AnimatedWord text="Let's" delay={0} />
                    <AnimatedWord text="Work" delay={0.1} />
                    <AnimatedWord text="Together" delay={0.2} />
                </h2>

                <motion.a 
                    href="mailto:mvickymosafan@gmail.com"
                    whileHover={{ scale: 1.05, rotate: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group inline-flex items-center gap-4 bg-black text-white px-8 md:px-16 py-6 md:py-8 text-2xl md:text-5xl font-bold font-mono uppercase tracking-tight shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] transition-all"
                >
                    <span>mvickymosafan@gmail.com</span>
                    <ArrowUpRight className="w-8 h-8 md:w-12 md:h-12 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </motion.a>

                <div className="mt-24 w-full flex flex-col md:flex-row justify-between items-center gap-8 border-t-2 border-black/10 pt-8 font-mono font-bold uppercase tracking-widest text-sm">
                   <div className="flex gap-4">
                        <SocialLink href="https://github.com/vickyymosafan" label="Github" />
                        <SocialLink href="#" label="LinkedIn" />
                   </div>
                   <div className="opacity-50">
                        &copy; {new Date().getFullYear()} Transparent Portfolio.
                   </div>
                </div>
            </div>
        </section>
    );
}

function AnimatedWord({ text, delay }: { text: string, delay: number }) {
    return (
        <motion.span 
            initial={{ y: "100%", opacity: 0, rotate: 5 }}
            whileInView={{ y: 0, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="block origin-bottom-left"
        >
            {text}
        </motion.span>
    );
}

function SocialLink({ href, label }: { href: string, label: string }) {
    return (
        <a 
            href={href} 
            className="relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-black after:transition-[width] hover:after:w-full"
        >
            {label}
        </a>
    );
}

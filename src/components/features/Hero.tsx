"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { motion, Variants } from "framer-motion";

export function Hero() {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 50, opacity: 0, rotateX: -20 },
        visible: {
            y: 0,
            opacity: 1,
            rotateX: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10,
                mass: 0.5
            }
        }
    };

    const imageVariants: Variants = {
        hidden: { scale: 0.8, opacity: 0, rotate: -15 },
        visible: {
            scale: 1,
            opacity: 1,
            rotate: 0,
            transition: {
                type: "spring",
                stiffness: 120,
                damping: 15,
                delay: 0.4
            }
        }
    };

    return (
        <div className="relative w-full overflow-visible py-12 md:py-20 lg:py-0">
            {/* Background Elements */}
            <div 
                className="absolute -top-[50%] -right-[20%] w-[1000px] h-[1000px] rounded-full pointer-events-none -z-10 opacity-20 mix-blend-screen"
                style={{
                    background: 'radial-gradient(circle at center, var(--primary) 0%, transparent 70%)',
                    filter: 'blur(80px)'
                }}
            />
            <div 
                className="absolute -bottom-[50%] -left-[20%] w-[800px] h-[800px] rounded-full pointer-events-none -z-10 opacity-10 mix-blend-screen"
                style={{
                    background: 'radial-gradient(circle at center, var(--accent) 0%, transparent 70%)',
                    filter: 'blur(60px)'
                }}
            />

            <motion.div 
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Left Column: Text */}
                <div className="flex flex-col gap-6 relative z-10 text-center lg:text-left items-center lg:items-start">


                    {/* Giant Typography */}
                    <div className="relative">
                        <motion.h1 
                            className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] text-foreground mix-blend-difference"
                            variants={itemVariants}
                        >
                            FULLSTACK
                            <br />
                            <span className="text-transparent stroke-text">DEV</span>ELOPER
                        </motion.h1>
                        
                        {/* Floating decorative elements */}
                         <motion.div 
                            className="absolute -top-4 -right-4 w-12 h-12 border-2 border-primary rounded-full hidden md:block" 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, rotate: 360 }}
                            transition={{ delay: 1, type: "spring" }}
                         />
                    </div>

                    <div className="space-y-2">
                        <motion.h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-muted/50" variants={itemVariants}>
                            Data Driven.
                        </motion.h2>
                        <motion.h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-foreground" variants={itemVariants}>
                            Transparent.
                        </motion.h2>
                    </div>

                    <motion.p 
                        className="max-w-xl text-lg md:text-xl text-muted-foreground font-medium border-l-2 border-primary pl-4 my-6 text-left"
                        variants={itemVariants}
                    >
                        I build scalable applications. No fluff, just code that works in production. 
                        Backed by real data, not just promises.
                    </motion.p>

                    <motion.div className="flex flex-wrap gap-4 justify-center lg:justify-start" variants={itemVariants}>
                        <Button size="lg" withArrow className="neo-brutal-border bg-primary text-black hover:bg-primary/90 rounded-none font-bold uppercase tracking-wider">
                            View My Work
                        </Button>
                        <Button size="lg" variant="outline" className="rounded-none border-2 hover:border-primary font-bold uppercase tracking-wider">
                            Contact Me
                        </Button>
                    </motion.div>
                </div>

                {/* Right Column: Image */}
                <div className="relative w-full aspect-square md:aspect-4/5 lg:aspect-square flex items-center justify-center">
                    {/* Image Container with Neo-Brutal styling */}
                    <motion.div 
                        className="relative w-[300px] h-[400px] md:w-[400px] md:h-[500px]"
                        variants={imageVariants}
                    >
                        {/* Back Card (Decoration) */}
                        <div className="absolute inset-0 bg-primary/10 translate-x-4 translate-y-4 border-2 border-primary/30 backdrop-blur-sm" />
                        
                        {/* Image Frame */}
                        <div className="absolute inset-0 bg-surface border-2 border-white/10 overflow-hidden grayscale hover:grayscale-0 transition-all duration-500 ease-out hover:translate-x-1 hover:translate-y-1">
                             <Image 
                                src="/profile.png" 
                                alt="Profile" 
                                fill 
                                className="object-cover object-center"
                                priority
                             />
                             
                             {/* Overlay Texture */}
                             <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay" />
                        </div>
                        
                        {/* Floating Badge */}
                         <motion.div 
                            className="absolute -bottom-6 -left-6 bg-black border border-white/20 p-4 neo-brutal-border"
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.8, type: "spring" }}
                         >
                            <div className="text-xs font-mono text-muted mb-1">CURRENT STACK</div>
                            <div className="text-xl font-bold text-primary">NEXT.JS</div>
                         </motion.div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Marquee Scroller at Bottom */}
            <motion.div 
                className="absolute -bottom-24 lg:-bottom-32 left-1/2 -translate-x-1/2 w-screen overflow-hidden py-4 border-y border-white/5 bg-black/50 backdrop-blur-sm transform"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
            >
                 <div className="whitespace-nowrap animate-marquee flex gap-8 items-center">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center gap-8">
                            <span className="text-4xl font-bold text-transparent stroke-text uppercase opacity-30">Principal Engineer</span>
                            <span className="text-2xl text-primary">★</span>
                            <span className="text-4xl font-bold text-foreground uppercase">Frontend Architecture</span>
                            <span className="text-2xl text-primary">★</span>
                            <span className="text-4xl font-bold text-transparent stroke-text uppercase opacity-30">Backend Performance</span>
                            <span className="text-2xl text-primary">★</span>
                        </div>
                    ))}
                 </div>
            </motion.div>
            
            <style jsx>{`
                .stroke-text {
                    -webkit-text-stroke: 1px rgba(255, 255, 255, 0.5);
                }
            `}</style>
        </div>
    );
}

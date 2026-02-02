import Image from "next/image";
import { Button } from "@/components/ui/Button";

export function Hero() {
    return (
        <section className="relative w-full min-h-[90vh] flex flex-col justify-center pt-20 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/10 blur-[100px] rounded-full pointer-events-none -z-10" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Column: Text */}
                <div className="flex flex-col gap-6 relative z-10">
                    {/* Status Badge */}
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-none transform -skew-x-12 w-fit hover:bg-white/10 transition-colors cursor-crosshair">
                        <span className="w-3 h-3 bg-primary animate-pulse shadow-[0_0_10px_#CCFF00]" />
                        <span className="text-sm font-mono text-primary uppercase tracking-widest font-bold">
                            Available for Hire
                        </span>
                    </div>

                    {/* Giant Typography */}
                    <div className="relative">
                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] text-foreground mix-blend-difference">
                            FULLSTACK
                            <br />
                            <span className="text-transparent stroke-text">DEV</span>ELOPER
                        </h1>
                        
                        {/* Floating decorative elements */}
                         <div className="absolute -top-4 -right-4 w-12 h-12 border-2 border-primary rounded-full animate-float hidden md:block" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-muted/50">
                            Data Driven.
                        </h2>
                        <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-foreground">
                            Transparent.
                        </h2>
                    </div>

                    <p className="max-w-xl text-lg md:text-xl text-muted-foreground font-medium border-l-2 border-primary pl-4 my-6">
                        I build scalable applications. No fluff, just code that works in production. 
                        Backed by real data, not just promises.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <Button size="lg" withArrow className="neo-brutal-border bg-primary text-black hover:bg-primary/90 rounded-none font-bold uppercase tracking-wider">
                            View My Work
                        </Button>
                        <Button size="lg" variant="outline" className="rounded-none border-2 hover:border-primary font-bold uppercase tracking-wider">
                            Contact Me
                        </Button>
                    </div>
                </div>

                {/* Right Column: Image */}
                <div className="relative w-full aspect-square md:aspect-[4/5] lg:aspect-square flex items-center justify-center">
                    {/* Image Container with Neo-Brutal styling */}
                    <div className="relative w-[300px] h-[400px] md:w-[400px] md:h-[500px]">
                        {/* Back Card (Decoration) */}
                        <div className="absolute inset-0 bg-primary translate-x-4 translate-y-4 border-2 border-white/20" />
                        
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
                         <div className="absolute -bottom-6 -left-6 bg-black border border-white/20 p-4 neo-brutal-border animate-float" style={{ animationDelay: "1s" }}>
                            <div className="text-xs font-mono text-muted mb-1">CURRENT STACK</div>
                            <div className="text-xl font-bold text-primary">NEXT.JS 16</div>
                         </div>
                    </div>
                </div>
            </div>

            {/* Marquee Scroller at Bottom */}
            <div className="absolute bottom-0 left-0 w-screen overflow-hidden py-4 border-y border-white/5 bg-black/50 backdrop-blur-sm -mx-[50vw] left-[50%] relative">
                 <div className="whitespace-nowrap animate-marquee flex gap-8 items-center">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center gap-8">
                            <span className="text-4xl font-bold text-transparent stroke-text uppercase opacity-30">Open For Work</span>
                            <span className="text-2xl text-primary">★</span>
                            <span className="text-4xl font-bold text-foreground uppercase">Frontend Architecture</span>
                            <span className="text-2xl text-primary">★</span>
                            <span className="text-4xl font-bold text-transparent stroke-text uppercase opacity-30">Backend Performance</span>
                            <span className="text-2xl text-primary">★</span>
                        </div>
                    ))}
                 </div>
            </div>
            
            <style jsx>{`
                .stroke-text {
                    -webkit-text-stroke: 1px rgba(255, 255, 255, 0.5);
                }
            `}</style>
        </section>
    );
}

import { Button } from "@/components/ui/Button";
import { H1, P } from "@/components/ui/Typography";

export function Hero() {
    return (
        <div className="flex flex-col gap-8 max-w-4xl pt-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full w-fit">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-mono text-primary uppercase tracking-widest">
                    Available for Hire
                </span>
            </div>

            <H1>
                Fullstack Developer <br />
                <span className="text-muted opacity-50">Data Driven.</span> Transparent.
            </H1>

            <P className="max-w-xl text-lg md:text-xl">
                I build scalable applications with <strong>Next.js</strong> and <strong>NestJS</strong>.
                No fluff, just code that works in production.
                My work is backed by real data, not just promises.
            </P>

            <div className="flex flex-wrap gap-4">
                <Button size="lg" withArrow>View My Work</Button>
                <Button size="lg" variant="outline">Contact Me</Button>
            </div>
        </div>
    );
}

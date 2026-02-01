import { cn } from "@/lib/utils";
import React from "react";

export function Section({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
    return (
        <section className={cn("py-16 md:py-24", className)} {...props}>
            {children}
        </section>
    );
}

export function Container({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("mx-auto max-w-7xl px-6 md:px-8", className)} {...props}>
            {children}
        </div>
    );
}

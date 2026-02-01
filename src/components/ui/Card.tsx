import { cn } from "@/lib/utils";
import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    hoverEffect?: boolean;
}

export function Card({ className, hoverEffect = true, children, ...props }: CardProps) {
    return (
        <div
            className={cn(
                "bg-surface border border-white/5 p-6",
                hoverEffect && "transition-all duration-300 hover:border-primary/50 hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(204,255,0,0.1)]",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

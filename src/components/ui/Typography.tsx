import { cn } from "@/lib/utils";
import React from "react";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
    as?: React.ElementType;
}

export function H1({ children, className, as: Component = "h1", ...props }: TypographyProps) {
    return (
        <Component
            className={cn(
                "font-heading text-4xl font-bold uppercase tracking-tight sm:text-6xl lg:text-7xl",
                "text-foreground",
                className
            )}
            {...props}
        >
            {children}
        </Component>
    );
}

export function H2({ children, className, as: Component = "h2", ...props }: TypographyProps) {
    return (
        <Component
            className={cn(
                "font-heading text-3xl font-bold sm:text-4xl",
                "text-foreground",
                className
            )}
            {...props}
        >
            {children}
        </Component>
    );
}

export function H3({ children, className, as: Component = "h3", ...props }: TypographyProps) {
    return (
        <Component
            className={cn(
                "font-heading text-xl font-semibold sm:text-2xl",
                "text-foreground",
                className
            )}
            {...props}
        >
            {children}
        </Component>
    );
}

export function P({ children, className, as: Component = "p", ...props }: TypographyProps) {
    return (
        <Component
            className={cn("font-body text-base leading-relaxed text-muted sm:text-lg", className)}
            {...props}
        >
            {children}
        </Component>
    );
}

import { cn } from "@/lib/utils";
import React from "react";
import { MoveRight } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    withArrow?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", withArrow, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center gap-2 transition-all duration-300 font-medium",
                    "cursor-pointer active:scale-95 disabled:pointer-events-none disabled:opacity-50",
                    {
                        // Variants
                        "bg-primary text-primary-foreground hover:bg-white hover:text-black": variant === "primary",
                        "bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
                        "border border-white/20 hover:bg-white/10 text-foreground": variant === "outline",
                        "hover:bg-white/5 text-foreground": variant === "ghost",
                        // Sizes
                        "h-9 px-4 text-sm": size === "sm",
                        "h-11 px-6 text-base": size === "md",
                        "h-14 px-8 text-lg": size === "lg",
                    },
                    className
                )}
                {...props}
            >
                {children}
                {withArrow && <MoveRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />}
            </button>
        );
    }
);

Button.displayName = "Button";

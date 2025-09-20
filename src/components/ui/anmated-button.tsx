import React from "react";
import { cn } from "~/lib/utils";

interface AnimatedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "hero" | "outline-hero" | "primary";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    hero: "btn-hero",
    "outline-hero": "btn-outline-hero",
    primary:
      "bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-xl hover:scale-105 active:scale-95",
  };

  const sizes = {
    sm: "text-sm px-4 py-2",
    md: "text-base px-6 py-3",
    lg: "text-lg px-8 py-4",
  };

  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        variant !== "hero" && variant !== "outline-hero" && sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "font-semibold whitespace-nowrap",
    "border-[var(--border-w)] border-ink",
    "rounded-[var(--radius)]",
    "shadow-[var(--shadow)]",
    "transition-transform duration-100",
    "focus-visible:outline-[3px] focus-visible:outline-ink focus-visible:outline-offset-[3px]",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    "hover:-translate-x-0.5 hover:-translate-y-0.5",
    "hover:shadow-[6px_6px_0_0_var(--ink)]",
    "active:translate-x-1 active:translate-y-1 active:shadow-none",
  ],
  {
    variants: {
      variant: {
        default: "bg-yellow text-on-accent",
        pink: "bg-pink text-on-accent",
        blue: "bg-blue text-on-accent",
        green: "bg-green text-on-accent",
        orange: "bg-orange text-on-accent",
        lilac: "bg-lilac text-on-accent",
        outline: "bg-transparent text-ink",
        ghost: "border-transparent shadow-none hover:shadow-none active:shadow-none",
      },
      size: {
        sm: "h-9 px-3 text-sm min-w-11",
        default: "h-11 px-5 min-w-11",
        lg: "h-12 px-6 text-lg min-w-12",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

// `buttonVariants` sengaja diekspor bersama `Button` (pola standar shadcn).
// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants };
import React from "react";
import { cva } from "class-variance-authority";


// Variants & sizes using CVA
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-2xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-700",
        outline:
          "border border-gray-300 bg-transparent text-gray-900 hover:bg-gray-100",
        ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
        destructive: "bg-red-600 text-white hover:bg-red-700",
      },
      size: {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-5 py-3 text-lg",
        icon: "p-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? "span" : "button"; // support slotting
    return (
      <Comp
        ref={ref}
        className={(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

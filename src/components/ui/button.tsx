import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[#2A5C45] text-white hover:bg-[#214A37] shadow-sm active:translate-y-[0.5px]",
        secondary:
          "bg-stone-100 text-stone-800 hover:bg-stone-200 border border-stone-200/70",
        outline:
          "border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 hover:text-stone-900 shadow-sm",
        ghost:
          "text-stone-700 hover:bg-stone-100 hover:text-stone-900",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 shadow-sm",
        link:
          "text-[#2A5C45] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-6 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

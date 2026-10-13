import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-[#EAF2ED] text-[#204E38] border border-[#CDE1D4]",
        secondary:
          "bg-stone-100 text-stone-700 border border-stone-200",
        outline:
          "border border-stone-300 text-stone-700 bg-white",
        success:
          "bg-[#EAF2ED] text-[#204E38] border border-[#CDE1D4]",
        warning:
          "bg-amber-50 text-amber-800 border border-amber-200",
        destructive:
          "bg-rose-50 text-rose-700 border border-rose-200",
        info:
          "bg-sky-50 text-sky-800 border border-sky-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

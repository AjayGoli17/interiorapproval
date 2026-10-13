import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={cn(
            "flex h-9 w-full appearance-none rounded-md border border-stone-200 bg-white px-3 py-1 pr-8 text-sm shadow-none placeholder:text-stone-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2A5C45] focus-visible:border-[#2A5C45] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-4 w-4 text-stone-400" />
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };

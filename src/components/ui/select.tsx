import * as React from "react";
import { cn } from "@/lib/utils";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => (
    <select
      className={cn(
        "flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-base shadow-soft outline-none transition-colors hover:border-border-strong focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 sm:h-10 sm:text-sm",
        className,
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  ),
);
Select.displayName = "Select";

export { Select };

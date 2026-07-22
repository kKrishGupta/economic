import React, { forwardRef } from "react";
import { cn } from "../../utils/cn";

const Input = forwardRef(({ className, type, error, ...props }, ref) => {
  return (
    <div className="w-full">
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm shadow-sm transition-all placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-destructive focus-visible:ring-destructive/30 focus-visible:border-destructive",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && <span className="text-xs text-destructive mt-1 block">{error}</span>}
    </div>
  );
});

Input.displayName = "Input";

export { Input };

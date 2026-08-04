"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "./cn";

export interface SliderProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {}

// Controlled range input styled with the accent color. Follows the `ui/`
// primitive convention: a thin wrapper over the native element that forwards
// { value, min, max, step, onChange, ... }.
export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="range"
        className={cn(
          "h-2 w-full cursor-pointer appearance-none rounded-full bg-surface-subtle accent-accent",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    );
  },
);
Slider.displayName = "Slider";

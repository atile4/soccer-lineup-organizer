"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "./cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "danger-ghost"
  | "outline-accent";

export type ButtonSize = "sm" | "md" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-accent text-white hover:bg-accent-hover focus-visible:ring-offset-paper",
  secondary:
    "bg-surface text-ink-2 border border-border hover:bg-surface-subtle focus-visible:ring-offset-paper",
  ghost: "text-ink-2 hover:bg-surface-subtle focus-visible:ring-offset-paper",
  danger:
    "bg-danger text-white hover:bg-danger-hover focus-visible:ring-offset-paper",
  "danger-ghost":
    "text-danger hover:bg-danger-fill focus-visible:ring-offset-paper",
  // For buttons that sit on the solid accent header.
  "outline-accent":
    "border border-white/70 text-white hover:bg-white hover:text-accent focus-visible:ring-white focus-visible:ring-offset-accent",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-label",
  md: "h-9 px-4 text-body-sm",
  icon: "h-9 w-9",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-md font-semibold whitespace-nowrap select-none transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {loading && (
          <span
            aria-hidden="true"
            className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent opacity-40"
          />
        )}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

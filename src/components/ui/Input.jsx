// src/components/ui/Input.jsx

import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";

const inputVariants = cva(
  "w-full text-base text-primary placeholder:text-tertiary transition-all duration-200 focus:outline-none py-3 px-4",
  {
    variants: {
      variant: {
        default: "rounded-xl border border-border bg-white focus:ring-1 focus:ring-brand",
        ghost: "rounded-none border-0 bg-transparent p-0 focus:ring-0",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Input = forwardRef(
  (
    {
      value,
      defaultValue,
      onChange,
      label,
      id,
      name,
      placeholder,
      type = "text",
      variant = "default",
      className,
      containerClassName,
      prefix,
      suffix,
      error,
      disabled = false,
      ...props
    },
    ref,
  ) => {
    // Controlled vs uncontrolled compatibility
    const valueProp = value !== undefined ? { value } : defaultValue !== undefined ? { defaultValue } : {};

    return (
      <div className={cn("w-full", containerClassName)}>
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium mb-2 text-primary"
          >
            {label}
          </label>
        )}

        <div className="relative w-full flex items-center">
          {/* LEFT ICON / PREFIX */}
          {prefix && (
            <div className="absolute left-3 z-10 flex items-center justify-center pointer-events-none">
              {prefix}
            </div>
          )}

          <input
            ref={ref}
            id={id}
            name={name}
            type={type}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={!!error}
            suppressHydrationWarning={true}
            className={cn(
              inputVariants({ variant }),
              prefix ? "pl-11" : "",
              suffix ? "pr-14" : "",
              error && "border-red-500 focus:ring-red-500",
              disabled && "opacity-50 cursor-not-allowed",
              className,
            )}
            {...valueProp}
            {...props}
          />

          {/* RIGHT ACTION / SUFFIX */}
          {suffix && (
            <div className="absolute right-2 z-10 flex items-center justify-center">
              {suffix}
            </div>
          )}
        </div>

        {error && <p className="mt-1 text-sm text-error">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
export default Input;

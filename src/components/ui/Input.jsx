// src/components/ui/Input.jsx

import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";

const inputVariants = cva(
  "w-full transition-all duration-200 outline-none disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default:
          "rounded-xl border border-border bg-white text-gray-900 placeholder:text-gray-400 focus:border-brand focus:ring-1 focus:ring-brand/20",
        mono:
          "rounded-xl border border-border bg-white font-mono text-gray-700 placeholder:text-gray-400 focus:border-brand focus:ring-1 focus:ring-brand/20",
        ghost:
          "rounded-none border-0 bg-transparent p-0 focus:ring-0 text-gray-900",
      },
      inputSize: {
        sm: "h-9 px-3 text-xs",
        default: "h-11 px-4 text-xs sm:text-sm",
        lg: "h-12 px-4 text-sm sm:text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  }
);

const Input = forwardRef(
  (
    {
      value,
      defaultValue,
      onChange,
      label,
      sublabel,
      required = false,
      id,
      name,
      placeholder,
      type = "text",
      variant = "default",
      inputSize = "default",
      className,
      containerClassName,
      labelClassName,
      prefix,
      prefixClassName,
      prefixPadding,
      suffix,
      suffixClassName,
      error,
      helperText,
      disabled = false,
      ...props
    },
    ref
  ) => {
    // Controlled vs uncontrolled compatibility
    const valueProp =
      value !== undefined
        ? { value }
        : defaultValue !== undefined
        ? { defaultValue }
        : {};

    const computedLeftPadding = prefix
      ? prefixPadding || (typeof prefix === "string" && prefix.length > 3 ? "pl-24" : "pl-11")
      : "";

    return (
      <div className={cn("w-full space-y-1.5", containerClassName)}>
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "block text-xs font-semibold text-gray-700",
              labelClassName
            )}
          >
            {label}
            {required && <span className="text-rose-500 ml-1">*</span>}
            {sublabel && (
              <span className="text-gray-400 font-normal ml-1">
                ({sublabel})
              </span>
            )}
          </label>
        )}

        <div className="relative w-full flex items-center">
          {/* Prefix (Icon or Text Addon) */}
          {prefix && (
            <div
              className={cn(
                "absolute left-3.5 top-1/2 -translate-y-1/2 z-10 flex items-center pointer-events-none text-gray-400 text-xs",
                prefixClassName
              )}
            >
              {prefix}
            </div>
          )}

          <input
            ref={ref}
            id={id}
            name={name}
            type={type}
            required={required}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={!!error}
            suppressHydrationWarning={true}
            className={cn(
              inputVariants({ variant, inputSize }),
              computedLeftPadding,
              suffix ? "pr-11" : "",
              error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20",
              className
            )}
            {...valueProp}
            {...props}
          />

          {/* Suffix (Icon or Action) */}
          {suffix && (
            <div
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center text-gray-400",
                suffixClassName
              )}
            >
              {suffix}
            </div>
          )}
        </div>

        {error && <p className="text-xs text-rose-500">{error}</p>}
        {helperText && !error && (
          <p className="text-[11px] text-gray-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
export default Input;

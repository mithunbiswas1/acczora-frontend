// src/components/ui/Textarea.jsx

import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";

const textareaVariants = cva(
  "w-full rounded-xl border border-border bg-white text-gray-900 placeholder:text-gray-400 p-4 text-xs sm:text-sm focus:border-brand focus:ring-1 focus:ring-brand/20 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed resize-none",
  {
    variants: {
      variant: {
        default: "border-border bg-white focus:border-brand focus:ring-brand/20",
        filled: "border-transparent bg-gray-50 focus:bg-white focus:border-brand",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Textarea = forwardRef(
  (
    {
      className,
      containerClassName,
      label,
      sublabel,
      required = false,
      id,
      name,
      rows = 3,
      error,
      helperText,
      disabled,
      variant = "default",
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("w-full space-y-1.5", containerClassName)}>
        {label && (
          <label
            htmlFor={id}
            className="block text-xs font-semibold text-gray-700"
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
        <textarea
          ref={ref}
          id={id}
          name={name}
          rows={rows}
          required={required}
          disabled={disabled}
          aria-invalid={!!error}
          className={cn(
            textareaVariants({ variant }),
            error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-rose-500">{error}</p>}
        {helperText && !error && (
          <p className="text-[11px] text-gray-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
export default Textarea;

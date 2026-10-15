// src/components/ui/Select.jsx

import { forwardRef, useState } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";
import { ChevronDown } from "lucide-react";

const selectVariants = cva(
  "w-full appearance-none focus:outline-none focus:ring-1 cursor-pointer transition-colors",
  {
    variants: {
      variant: {
        default: "py-2 2xl:py-2.5 px-4 pr-10 rounded-md border border-border bg-gray-50 focus:ring-primary",
        outline: "py-2 2xl:py-2.5 px-4 pr-10 rounded-lg border border-border bg-white text-sm text-primary focus:ring-brand",
        filter: "py-2 px-3 pr-8 rounded-xl border border-border bg-white text-xs font-medium text-gray-700 hover:border-gray-300 focus:border-brand focus:ring-brand/20 shadow-xs",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Select = forwardRef(
  (
    {
      value,
      onChange = () => {},
      label,
      id,
      name,
      placeholder,
      options = [],
      suggested = [],
      variant = "default",
      className,
      containerClassName = "",
      suffix,
      error,
      disabled = false,
      children,
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className={containerClassName}>
        {(label || suggested.length > 0) && (
          <div className="flex items-center justify-between mb-2">
            {label && (
              <label
                className="block text-sm font-medium text-gray_deep"
                htmlFor={id}
              >
                {label}
              </label>
            )}

            {suggested.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray_light">
                  Suggested:
                </span>
                <div className="flex gap-2">
                  {suggested.map((item, index) => {
                    const l = typeof item === "string" ? item : item.label;
                    const val = typeof item === "string" ? item : item.value;
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => onChange({ target: { name, value: val } })}
                        className="text-xs font-semibold text-info hover:underline cursor-pointer"
                      >
                        {l}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="relative w-full">
          <select
            id={id}
            name={name}
            value={value ?? ""}
            onChange={onChange}
            ref={ref}
            disabled={disabled}
            aria-invalid={!!error}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setIsOpen(false)}
            className={cn(
              selectVariants({ variant }),
              error && "border-red-500 focus:ring-red-500",
              disabled && "opacity-50 cursor-not-allowed",
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}

            {children
              ? children
              : options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
          </select>

          <div
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 transition-transform duration-200 pointer-events-none",
              isOpen && "rotate-180",
            )}
          >
            {suffix || <ChevronDown size={14} className="text-gray-400 stroke-[2]" />}
          </div>
        </div>

        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
    );
  },
);

Select.displayName = "Select";
export default Select;

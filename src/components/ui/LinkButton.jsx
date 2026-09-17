// src/components/ui/LinkButton.jsx

import Link from "next/link";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";

const linkButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all duration-200 font-semibold cursor-pointer select-none",
  {
    variants: {
      variant: {
        solid:
          "text-white bg-brand border border-brand hover:bg-bran d-hover shadow-xs hover:shadow",
        outline:
          "text-brand border border-brand bg-transparent hover:text-white hover:bg-brand",
        "outline-group":
          "text-primary border border-border bg-white shadow-2xs group-hover:bg-brand group-hover:text-white group-hover:border-brand",
        "outline-secondary":
          "text-base-black border border-secondary bg-transparent hover:border-primary hover:bg-gray-50",
        secondary:
          "text-primary bg-gray-100 border border-transparent hover:bg-gray-200",
        pill:
          "text-secondary-500 border border-secondary-500 !rounded-full hover:text-white hover:bg-brand",
        "pill-solid":
          "text-white bg-brand border border-brand rounded-full hover:bg-brand-hover",
        ghost:
          "text-primary bg-transparent hover:bg-gray-100 hover:text-brand",
      },
      size: {
        sm: "px-3.5 py-1.5 text-xs",
        default: "px-4 py-2 text-sm",
        md: "px-5 py-2.5 text-sm",
        lg: "px-5 py-2.5 xl:px-6 xl:py-3 text-base",
        xl: "px-6 py-3.5 text-base",
      },
      rounded: {
        default: "rounded-lg",
        full: "rounded-full",
        md: "rounded-md",
        xl: "rounded-xl",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "default",
      rounded: "default",
    },
  },
);

function LinkButton({
  className,
  variant = "outline",
  size = "default",
  rounded = "default",
  href,
  children,
  ...props
}) {
  return (
    <Link
      href={href}
      className={cn(linkButtonVariants({ variant, size, rounded, className }))}
      {...props}
    >
      {children}
    </Link>
  );
}

export { LinkButton, linkButtonVariants };

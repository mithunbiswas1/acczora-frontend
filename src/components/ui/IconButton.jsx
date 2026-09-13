// src/components/ui/IconButton.jsx

import Link from "next/link";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";

const iconButtonVariants = cva(
  "inline-flex items-center justify-center transition-colors group",
  {
    variants: {
      variant: {
        default: "text-gray-400 hover:text-brand",
        primary: "text-brand hover:text-brand/80",
        danger: "text-red-500 hover:text-red-600",
      },
      size: {
        default: "h-6 w-6",
        sm: "h-5 w-5",
        lg: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function IconButton({
  className,
  variant = "default",
  size = "default",
  href,
  icon: Icon,
  label,
  ...props
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(iconButtonVariants({ variant, size, className }))}
      {...props}
    >
      <Icon className="h-full w-full transition-colors" strokeWidth={1.6} />
    </Link>
  );
}

export { IconButton, iconButtonVariants };

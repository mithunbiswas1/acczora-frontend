// src/components/ui/Typography.jsx

import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";

const typographyVariants = cva("transition-colors", {
  variants: {
    variant: {
      h1: "text-[36px] xl:text-[46px] font-bold tracking-tight text-primary leading-[120%]",
      h2: "text-[24px] lg:text-[32px] font-semibold tracking-tight text-primary leading-[120%]",
      h3: "text-[20px] sm:text-[24px] font-semibold text-primary leading-[120%]",
      h4: "text-[18px] sm:text-[20px] font-semibold text-primary leading-[120%]",
      h5: "text-base font-semibold text-primary leading-[120%]",
      h6: "text-xs font-semibold text-primary leading-[120%]",
      p: "text-base font-medium text-secondary leading-[160%]",
      caption: "text-xs font-medium text-tertiary leading-[160%]",
      default: "",
    },
    weight: {
      bold: "font-bold",
      semibold: "font-semibold",
      medium: "font-medium",
      regular: "font-normal",
      light: "font-light",
    },
    color: {
      primary: "text-primary",
      "primary-2": "text-primary-2",
      secondary: "text-secondary",
      tertiary: "text-tertiary",
      brand: "text-brand",
      "brand-hover": "text-brand-hover",
      muted: "text-tertiary",
      white: "text-white",
      danger: "text-error",
      error: "text-error",
      success: "text-success",
      warning: "text-warning",
      info: "text-info",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

function Typography({
  className,
  variant,
  weight,
  color,
  asChild = false,
  ...props
}) {
  const Comp = asChild
    ? Slot
    : variant === "caption"
      ? "p"
      : variant === "p"
        ? "p"
        : variant || "p";

  return (
    <Comp
      className={cn(typographyVariants({ variant, weight, color, className }))}
      {...props}
    />
  );
}

// Helper components for direct tag usage
const H1 = (props) => <Typography variant="h1" {...props} />;
const H2 = (props) => <Typography variant="h2" {...props} />;
const H3 = (props) => <Typography variant="h3" {...props} />;
const H4 = (props) => <Typography variant="h4" {...props} />;
const H5 = (props) => <Typography variant="h5" {...props} />;
const H6 = (props) => <Typography variant="h6" {...props} />;
const P = (props) => <Typography variant="p" {...props} />;
const Caption = (props) => <Typography variant="caption" {...props} />;

export { Typography, typographyVariants, H1, H2, H3, H4, H5, H6, P, Caption };

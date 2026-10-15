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
      title: "text-[14px] font-semibold text-primary leading-[150%] tracking-normal",
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
      muted: "text-muted",
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
  as,
  asChild = false,
  ...props
}) {
  const Comp = asChild
    ? Slot
    : as
      ? as
      : variant === "caption" || variant === "p"
        ? "p"
        : variant === "title"
          ? "h6"
          : variant || "p";

  return (
    <Comp
      className={cn(typographyVariants({ variant, weight, color, className }))}
      {...props}
    />
  );
}

// Helper components for direct tag usage
const H1 = ({ variant = "h1", ...props }) => (
  <Typography as="h1" variant={variant} {...props} />
);
const H2 = ({ variant = "h2", ...props }) => (
  <Typography as="h2" variant={variant} {...props} />
);
const H3 = ({ variant = "h3", ...props }) => (
  <Typography as="h3" variant={variant} {...props} />
);
const H4 = ({ variant = "h4", ...props }) => (
  <Typography as="h4" variant={variant} {...props} />
);
const H5 = ({ variant = "h5", ...props }) => (
  <Typography as="h5" variant={variant} {...props} />
);
const H6 = ({ variant = "h6", ...props }) => (
  <Typography as="h6" variant={variant} {...props} />
);
const Title = (props) => <Typography as="h6" variant="title" {...props} />;
const P = ({ variant = "p", ...props }) => (
  <Typography as="p" variant={variant} {...props} />
);
const Caption = ({ variant = "caption", ...props }) => (
  <Typography as="p" variant={variant} {...props} />
);

export { Typography, typographyVariants, H1, H2, H3, H4, H5, H6, Title, P, Caption };
export default Typography;

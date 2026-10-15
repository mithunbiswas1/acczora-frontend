// src/components/ui/Card.jsx

"use client";

import React from "react";
import { cn } from "@/lib/cn";

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "bg-white rounded-[10px] border border-border p-4 transition-colors",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 pb-3", className)}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }) {
  return (
    <h3
      className={cn(
        "text-xs sm:text-[13px] lg:text-[14px] font-semibold leading-[150%] tracking-normal text-primary",
        className
      )}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }) {
  return (
    <p
      className={cn("text-xs sm:text-sm text-secondary", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }) {
  return <div className={cn("pt-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }) {
  return (
    <div
      className={cn("flex items-center pt-3", className)}
      {...props}
    />
  );
}

export default Card;

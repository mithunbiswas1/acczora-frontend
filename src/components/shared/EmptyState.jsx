// src/components/shared/EmptyState.jsx

import { SearchX, MonitorX } from "lucide-react";
import { H3, P } from "@/components/ui/Typography";
import { linkButtonVariants } from "@/components/ui/LinkButton";
import { cn } from "@/lib/cn";

export default function EmptyState({ variant = "empty", title, description, actions = [] }) {
  const Icon = variant === "error" ? MonitorX : SearchX;

  return (
    <div className="flex flex-col items-center justify-center text-center py-16 md:py-20 px-4">
      <div className="flex items-center justify-center size-20 rounded-full border-2 border-border text-tertiary mb-6">
        <Icon className="size-9" strokeWidth={1.5} />
      </div>

      <H3>{title}</H3>
      <P className="mt-2 max-w-sm">{description}</P>

      {actions.length > 0 && (
        <div className="mt-6 flex items-center gap-3">
          {actions.map(({ label, onClick, variant: btnVariant = "outline-secondary" }) => (
            <button
              key={label}
              type="button"
              onClick={onClick}
              className={cn(linkButtonVariants({ variant: btnVariant }))}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

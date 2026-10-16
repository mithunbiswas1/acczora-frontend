// src/components/ui/PageHeader.jsx

import { cn } from "@/lib/cn";

/**
 * Shared PageHeader component for admin & dashboard pages.
 * Replaces hardcoded <h1> and <p> header blocks with a unified, clean layout.
 *
 * @param {React.ReactNode} title - Page title
 * @param {React.ReactNode} [description] - Subtitle / description
 * @param {React.ReactNode} [subtitle] - Alias for description
 * @param {React.ReactNode} [action] - Action buttons on the right side
 * @param {React.ReactNode} [children] - Additional action items
 * @param {React.ReactNode} [backLink] - Optional back link or breadcrumb
 * @param {string} [className] - Additional wrapper classes
 */
export default function PageHeader({
  title,
  description,
  subtitle,
  action,
  children,
  backLink,
  className,
  ...props
}) {
  const desc = description ?? subtitle;

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
        className
      )}
      {...props}
    >
      <div className="space-y-0.5">
        {backLink && <div className="mb-1">{backLink}</div>}
        {title && (
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            {title}
          </h1>
        )}
        {desc && (
          <div className="text-xs text-gray-500 font-normal leading-relaxed">
            {desc}
          </div>
        )}
      </div>

      {(action || children) && (
        <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-auto">
          {action}
          {children}
        </div>
      )}
    </div>
  );
}

export { PageHeader };

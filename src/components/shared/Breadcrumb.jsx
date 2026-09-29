// src/components/shared/Breadcrumb.jsx

import Link from "next/link";

export default function Breadcrumb({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex flex-wrap items-center gap-2 text-[13px] text-secondary">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-2">
              {item.href && !item.current && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={item.current || isLast ? "text-primary font-medium" : "text-secondary"}>
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span className="text-muted select-none">/</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

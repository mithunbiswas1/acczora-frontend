// src/app/(pages)/[slug]/_components/Breadcrumb.jsx

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Breadcrumb({ items = [] }) {
  const defaultItems = [
    { label: "Home", href: "/" },
    { label: "Market Place", href: "/marketplace" },
    { label: "Gaming", href: "/marketplace?category=Gaming" },
    { label: "Commercial & info", href: "#" },
    { label: "Steam", href: "#", current: true },
  ];

  const breadcrumbs = items.length > 0 ? items : defaultItems;

  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-tertiary">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5">
              {item.href && !item.current && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={
                    item.current || isLast
                      ? "text-primary font-medium"
                      : "text-tertiary"
                  }
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span className="text-gray-300 select-none">/</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

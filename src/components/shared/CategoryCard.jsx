// src/components/shared/CategoryCard.jsx

import Link from "next/link";
import { H5, Caption } from "@/components/ui/Typography";

export default function CategoryCard({ category, href }) {
  const { Icon, bg, color, name, count } = category;

  const cardContent = (
    <div
      className="group flex flex-col items-center justify-center py-8 rounded-2xl bg-card border border-border cursor-pointer transition-all duration-200 hover:border-brand"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-200"
        style={{ backgroundColor: bg }}
      >
        {Icon && <Icon size={24} color={color} />}
      </div>

      <H5 className="mt-3.5 text-center text-primary transition-colors duration-200 group-hover:text-brand">
        {name}
      </H5>

      <Caption className="mt-1 text-center">
        {count}
      </Caption>
    </div>
  );

  if (href) {
    return <Link href={href}>{cardContent}</Link>;
  }

  return cardContent;
}

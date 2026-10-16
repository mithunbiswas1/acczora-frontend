// src/components/shared/CategoryCard.jsx

import Link from "next/link";
import Image from "next/image";
import { H5, Caption } from "@/components/ui/Typography";
import { Folder } from "lucide-react";

export default function CategoryCard({ category = {}, href }) {
  const { Icon, bg, color, name, count, slug, image, icon } = category;

  const resolvedHref =
    href ||
    (slug ? `/marketplace?category=${encodeURIComponent(slug)}` : "/marketplace");

  const iconUrl =
    typeof icon === "string" && icon.startsWith("/")
      ? icon
      : typeof image === "string" && image.startsWith("/")
      ? image
      : null;

  const cardContent = (
    <div className="group flex flex-col items-center justify-center py-8 px-4 rounded-2xl bg-card border border-border cursor-pointer transition-all duration-200 hover:border-brand hover:shadow-xs">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105 overflow-hidden"
        style={{ backgroundColor: bg || "rgba(37, 99, 235, 0.08)" }}
      >
        {typeof Icon === "function" ? (
          <Icon size={24} color={color || "#2563EB"} />
        ) : iconUrl ? (
          <Image
            src={iconUrl}
            alt={name || "Category"}
            width={28}
            height={28}
            className="size-7 object-contain"
          />
        ) : (
          <Folder size={22} className="text-brand" />
        )}
      </div>

      <H5 className="mt-3.5 text-center text-primary transition-colors duration-200 group-hover:text-brand line-clamp-1">
        {name || "Category"}
      </H5>

      <Caption className="mt-1 text-center text-muted-foreground">
        {count || "Explore"}
      </Caption>
    </div>
  );

  return <Link href={resolvedHref}>{cardContent}</Link>;
}

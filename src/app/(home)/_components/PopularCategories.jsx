"use client";

import CategoryCard from "@/components/shared/CategoryCard";
import { H2, P } from "@/components/ui/Typography";
import { LinkButton } from "@/components/ui/LinkButton";
import {
  ButtonArrowIcon,
  SocialMediaCatIcon,
  GamingCatIcon,
  EmailCatIcon,
  SoftwareCatIcon,
  AIToolsCatIcon,
  BusinessCatIcon,
  DeveloperCatIcon,
  StreamingCatIcon,
  EducationCatIcon,
  ProductivityCatIcon,
} from "@/icons";

const categories = [
  {
    id: 1,
    name: "Social Media",
    count: "12.4K+ Products",
    Icon: SocialMediaCatIcon,
    bg: "#EDE9FF",
    color: "#6658FF",
  },
  {
    id: 2,
    name: "Gaming",
    count: "12.4K+ Products",
    Icon: GamingCatIcon,
    bg: "#FFF7ED",
    color: "#F59E0B",
  },
  {
    id: 3,
    name: "Email",
    count: "12.4K+ Products",
    Icon: EmailCatIcon,
    bg: "#ECFDF5",
    color: "#22C55E",
  },
  {
    id: 4,
    name: "Software & Apps",
    count: "12.4K+ Products",
    Icon: SoftwareCatIcon,
    bg: "#ECFEFF",
    color: "#06B6D4",
  },
  {
    id: 5,
    name: "AI Tools",
    count: "12.4K+ Products",
    Icon: AIToolsCatIcon,
    bg: "#EFF6FF",
    color: "#3B82F6",
  },
  {
    id: 6,
    name: "Business",
    count: "12.4K+ Products",
    Icon: BusinessCatIcon,
    bg: "#F5F3FF",
    color: "#8B5CF6",
  },
  {
    id: 7,
    name: "Developer",
    count: "12.4K+ Products",
    Icon: DeveloperCatIcon,
    bg: "#FFF1F2",
    color: "#F43F5E",
  },
  {
    id: 8,
    name: "Streaming",
    count: "12.4K+ Products",
    Icon: StreamingCatIcon,
    bg: "#FFF7ED",
    color: "#F97316",
  },
  {
    id: 9,
    name: "Education",
    count: "12.4K+ Products",
    Icon: EducationCatIcon,
    bg: "#ECFDF5",
    color: "#10B981",
  },
  {
    id: 10,
    name: "Productivity",
    count: "12.4K+ Products",
    Icon: ProductivityCatIcon,
    bg: "#FDF4FF",
    color: "#D946EF",
  },
];

export default function PopularCategories() {
  return (
    <section className="w-full py-12 lg:py-16">
      <div className="site-container">
        {/* Header */}
        <div className="text-center mb-10">
          <H2>Explore Popular Categories</H2>
          <P className="mt-3 max-w-xl mx-auto">
            Find what you need faster with our most popular digital categories.
          </P>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-5">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-10 flex justify-center">
          <LinkButton href="/categories" variant="solid" size="lg">
            <span>View All Categories</span>
            <ButtonArrowIcon size={18} />
          </LinkButton>
        </div>
      </div>
    </section>
  );
}

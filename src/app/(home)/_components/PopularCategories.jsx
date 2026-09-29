"use client";

import CategoryCard from "@/components/shared/CategoryCard";
import { H2, P } from "@/components/ui/Typography";
import { LinkButton } from "@/components/ui/LinkButton";
import { ButtonArrowIcon } from "@/icons";
import { popularCategories } from "@/data";

export default function PopularCategories() {
  return (
    <section className="w-full py-8 md:py-15 lg:py-20 xl:py-24">
      <div className="site-container">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10 lg:mb-15">
          <H2>Explore Popular Categories</H2>
          <P className="mt-2 md:mt-3 lg:mt-4 mx-auto">
            Find what you need faster with our most popular digital categories.
          </P>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 xl:gap-6">
          {popularCategories.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              href={`/marketplace?category=${encodeURIComponent(cat.name)}`}
            />
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-8 md:mt-10 xl:mt-15 flex justify-center">
          <LinkButton href="/marketplace" variant="solid" size="lg">
            <span>View All Categories</span>
            <ButtonArrowIcon size={18} />
          </LinkButton>
        </div>
      </div>
    </section>
  );
}


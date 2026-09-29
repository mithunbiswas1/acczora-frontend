// src/app/(pages)/marketplace/_components/MarketplaceBanner.jsx

import Link from "next/link";
import { H1, P } from "@/components/ui/Typography";

export default function MarketplaceBanner() {
  return (
    <section className="w-full">
      <div className="site-container pb-4 pt-6 md:pb-6 lg:pt-10 lg:pb-6 xl:pt-15 xl:pb-7.5 text-center">
        <Link
          href="/"
          className="inline-block px-3 py-1 rounded-full bg-gray-50 text-xs font-medium text-secondary hover:text-primary transition-colors"
        >
          Home / Marketplace
        </Link>

        <H1 className="mt-4">Marketplace</H1>

        <P className="mt-2 max-w-md mx-auto">
          Find the right digital product from trusted sellers.
        </P>
      </div>
    </section>
  );
}

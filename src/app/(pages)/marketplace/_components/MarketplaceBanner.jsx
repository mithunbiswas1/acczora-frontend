// src/app/(pages)/marketplace/_components/MarketplaceBanner.jsx

import Link from "next/link";
import { H1, P } from "@/components/ui/Typography";

export default function MarketplaceBanner() {
  return (
    <section className="w-full bg-white border-b border-border">
      <div className="site-container py-10 md:py-14 text-center">
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

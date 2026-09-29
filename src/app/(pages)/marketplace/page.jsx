// src/app/(pages)/marketplace/page.jsx

import { Suspense } from "react";
import MarketplaceBanner from "./_components/MarketplaceBanner";
import MarketplaceCatalog from "./_components/MarketplaceCatalog";

export const metadata = {
  title: "Marketplace",
  description: "Find the right digital product from trusted sellers.",
};

export default function MarketplacePage() {
  return (
    <main>
      <MarketplaceBanner />
      <Suspense fallback={<div className="site-container py-12 text-center text-gray-400">Loading marketplace...</div>}>
        <MarketplaceCatalog />
      </Suspense>
    </main>
  );
}


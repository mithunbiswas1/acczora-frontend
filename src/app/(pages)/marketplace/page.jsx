// src/app/(pages)/marketplace/page.jsx

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
      <MarketplaceCatalog />
    </main>
  );
}

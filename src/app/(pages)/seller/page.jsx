// src/app/(pages)/seller/page.jsx

import Breadcrumb from "@/components/shared/Breadcrumb";
import SellersListContainer from "./_components/SellersListContainer";
import { sellersData } from "@/data";

export const metadata = {
  title: "Sellers | ACCZORA",
  description:
    "Browse verified stores on ACCZORA. Every seller here is rated by buyers who actually received their product.",
};

export default function SellersPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Sellers", href: "/seller", current: true },
  ];

  return (
    <main className="min-h-screen bg-white pb-16 sm:pb-24 pt-4 sm:pt-6">
      <div className="site-container">
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Page Header Section */}
        <header className="mt-4 sm:mt-6">
          <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#0F172A] tracking-tight leading-tight">
            Sellers
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-2.5 sm:mt-3 max-w-2xl font-normal leading-relaxed">
            Browse verified stores on ACCZORA. Every seller here is rated by buyers who
            actually received their product.
          </p>
        </header>

        {/* Sellers Interactive Listing */}
        <SellersListContainer initialSellers={sellersData} />
      </div>
    </main>
  );
}

// src/app/(home)/page.jsx

import Banner from "./_components/Banner";
import PopularCategories from "./_components/PopularCategories";
import FeaturedProducts from "./_components/FeaturedProducts";
import WhyChooseAcczora from "./_components/WhyChooseAcczora";
import HowItWorks from "./_components/HowItWorks";
import TopSellers from "./_components/TopSellers";
import SellerCTA from "./_components/SellerCTA";

export async function generateMetadata() { }

export default async function Home() {
  return (
    <main className="">
      <Banner />
      <PopularCategories />
      <FeaturedProducts />
      <WhyChooseAcczora />
      <HowItWorks />
      <TopSellers />
      <SellerCTA />
    </main>
  );
}





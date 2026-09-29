// src/app/(home)/layout.jsx

import Navbar from "@/components/common/navbar/navbar.jsx";
import Footer from "@/components/common/footer/footer.jsx";
import FixedCartButton from "@/components/shared/FixedCartButton";

export default function HomeLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <FixedCartButton />
    </>
  );
}

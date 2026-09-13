// app/layout.jsx

import { Plus_Jakarta_Sans } from "next/font/google";

import "./globals.css";

import { Toaster } from "sonner";

import Footer from "@/components/common/footer/footer.jsx";
import ReduxProvider from "@/redux/redux-provider/ReduxProvider";
import Navbar from "@/components/common/navbar/navbar.jsx";
import CartDrawer from "@/components/shared/CartDrawer";
import FixedCartButton from "@/components/shared/FixedCartButton";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://acczora.com"),

  title: {
    default: "ACCZORA | Secure Digital Marketplace for Verified Accounts",
    template: "%s | ACCZORA",
  },

  description:
    "Buy verified digital accounts and digital products with instant delivery. ACCZORA is a trusted marketplace for gaming, social media, email, streaming, and software accounts with buyer protection and secure payments.",

  keywords: [
    "Digital Marketplace",
    "Buy Accounts",
    "Verified Accounts",
    "Gaming Accounts",
    "Social Media Accounts",
    "Email Accounts",
    "Streaming Accounts",
    "Software Licenses",
    "Digital Products",
    "Instant Delivery",
    "Buyer Protection",
    "Secure Payment",
    "ACCZORA",
  ],

  openGraph: {
    title: "ACCZORA — Secure Digital Marketplace",
    description:
      "Buy verified digital accounts and digital products with instant delivery. Trusted by thousands. Secure payments, buyer protection, and instant delivery.",
    url: "https://acczora.com",
    siteName: "ACCZORA",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ACCZORA — Secure Digital Marketplace",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "ACCZORA — Secure Digital Marketplace",
    description:
      "Buy verified digital accounts and digital products with instant delivery. Secure payments & buyer protection.",
    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: "https://acczora.com",
  },

  category: "Digital Marketplace",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        cz-shortcut-listen="true"
        className={`${plusJakartaSans.variable} bg-page-back`}
      >
        <ReduxProvider>
          <Navbar />
          {children}
          <Footer />
          <FixedCartButton />
          <CartDrawer />
          <Toaster />
        </ReduxProvider>
      </body>
    </html>
  );
}

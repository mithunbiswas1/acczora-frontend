// src/app/(pages)/marketplace/_components/marketplaceData.js

export const products = [
  {
    id: 1,
    category: "Social Media",
    subcategory: "Facebook",
    title: "Facebook Account",
    specs: ["USA", "10K+ Followers", "Aged"],
    inStock: true,
    instantDelivery: true,
    isBestSeller: true,
    price: 24.99,
    image: "/logo_image/facebook.png",
    gradient: "linear-gradient(to top right, #066BDA22 0%, #066BDA00 100%)",
    bg: "#066BDA0F",
    seller: {
      name: "NovaStore",
      verified: true,
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80",
      rating: "4.5",
      reviews: "350+ Reviews",
    },
  },
  {
    id: 2,
    category: "Email",
    subcategory: "Gmail",
    title: "Gmail Account",
    specs: ["Premium", "5 Years Old", "Verified"],
    inStock: true,
    instantDelivery: true,
    isBestSeller: true,
    price: 39.99,
    image: "/logo_image/google.png",
    gradient: "linear-gradient(to top right, #EA43351F 0%, #4285F400 100%)",
    bg: "#EA43350F",
    seller: {
      name: "DigitalHub",
      verified: true,
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80",
      rating: "4.5",
      reviews: "350+ Reviews",
    },
  },
  {
    id: 3,
    category: "Gaming",
    subcategory: "Steam",
    title: "Steam Gaming Account",
    specs: ["Level 80", "25+ Games"],
    inStock: true,
    instantDelivery: true,
    isBestSeller: true,
    price: 14.99,
    image: "/logo_image/steam.png",
    gradient: "linear-gradient(to top right, #00ADEE20 0%, #00ADEE00 100%)",
    bg: "#00ADEE0F",
    seller: {
      name: "GameVault",
      verified: true,
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80",
      rating: "4.5",
      reviews: "350+ Reviews",
    },
  },
  {
    id: 4,
    category: "AI Tools",
    subcategory: "Claude",
    title: "Claude Account",
    specs: ["Pro", "1 Month", "Full Access"],
    inStock: true,
    instantDelivery: true,
    isBestSeller: true,
    price: 19.99,
    image: "/logo_image/claude.png",
    gradient: "linear-gradient(to top right, #D9770620 0%, #D9770600 100%)",
    bg: "#D977060F",
    seller: {
      name: "TechMarket",
      verified: true,
      avatar:
        "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=80&auto=format&fit=crop&q=80",
      rating: "4.5",
      reviews: "350+ Reviews",
    },
  },
  {
    id: 5,
    category: "Business",
    subcategory: "Amazon",
    title: "Amazon Account",
    specs: ["USA", "Verified", "Aged"],
    inStock: true,
    instantDelivery: true,
    isBestSeller: true,
    price: 29.99,
    image: "/logo_image/amazon.png",
    gradient: "linear-gradient(to top right, #FF990022 0%, #FF990000 100%)",
    bg: "#FF99000F",
    seller: {
      name: "ProAccounts",
      verified: true,
      avatar:
        "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=80&auto=format&fit=crop&q=80",
      rating: "4.5",
      reviews: "350+ Reviews",
    },
  },
  {
    id: 6,
    category: "Developer",
    subcategory: "Visual Studio",
    title: "Visual Studio Account",
    specs: ["Verified", "Ready to Use"],
    inStock: true,
    instantDelivery: true,
    isBestSeller: true,
    price: 49.99,
    image: "/logo_image/visual-studio-code.png",
    gradient: "linear-gradient(to top right, #007ACC20 0%, #007ACC00 100%)",
    bg: "#007ACC0F",
    seller: {
      name: "DevStore",
      verified: true,
      avatar:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&auto=format&fit=crop&q=80",
      rating: "4.5",
      reviews: "350+ Reviews",
    },
  },
  {
    id: 7,
    category: "Streaming",
    subcategory: "Netflix",
    title: "Netflix Premium",
    specs: ["30 Days", "Premium"],
    inStock: true,
    instantDelivery: true,
    isBestSeller: true,
    price: 9.99,
    image: "/logo_image/netflix.png",
    gradient: "linear-gradient(to top right, #E5091420 0%, #E5091400 100%)",
    bg: "#E509140F",
    seller: {
      name: "StreamHub",
      verified: true,
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&auto=format&fit=crop&q=80",
      rating: "4.5",
      reviews: "350+ Reviews",
    },
  },
  {
    id: 8,
    category: "Software & Apps",
    subcategory: "Android",
    title: "Software License",
    specs: ["1 Year", "Full Access"],
    inStock: true,
    instantDelivery: true,
    isBestSeller: true,
    price: 34.99,
    image: "/logo_image/android.png",
    gradient: "linear-gradient(to top right, #3DDC8424 0%, #3DDC8400 100%)",
    bg: "#3DDC840F",
    seller: {
      name: "SoftZone",
      verified: true,
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80",
      rating: "4.5",
      reviews: "350+ Reviews",
    },
  },
];

const categoryNames = [
  "Social Media",
  "Email",
  "Gaming",
  "Streaming",
  "Software & Apps",
  "AI Tools",
  "Business",
  "Developer",
  "E-commerce",
  "Crypto & Web3",
  "Education",
  "Productivity",
];

const subcategoryNames = {
  "Social Media": ["Facebook", "Instagram", "Twitter / X", "TikTok", "LinkedIn", "Snapchat"],
  Email: ["Gmail", "Outlook", "Yahoo Mail", "ProtonMail"],
  Gaming: ["Steam", "PlayStation", "Xbox", "Epic Games", "Riot Games"],
  Streaming: ["Netflix", "Disney+", "Amazon Prime Video", "Spotify", "YouTube Premium"],
  "Software & Apps": ["Windows", "Android", "Adobe", "Microsoft Office", "Antivirus"],
  "AI Tools": ["ChatGPT", "Claude", "Midjourney", "GitHub Copilot"],
  Business: ["Amazon", "Shopify", "LinkedIn Business", "CRM Tools"],
  Developer: ["GitHub", "Visual Studio", "JetBrains", "Domain & Hosting"],
  "E-commerce": ["Shopify", "Amazon", "eBay", "Etsy"],
  "Crypto & Web3": ["Binance", "Coinbase", "MetaMask", "NFT Marketplaces"],
  Education: ["Coursera", "Udemy", "LinkedIn Learning", "Skillshare"],
  Productivity: ["Notion", "Slack", "Trello", "Google Workspace"],
};

export const categories = categoryNames.map((name, index) => ({
  id: index + 1,
  name,
  count: products.filter((product) => product.category === name).length,
  subcategories: subcategoryNames[name].map((subName, subIndex) => ({
    id: `${index + 1}-${subIndex + 1}`,
    name: subName,
    count: products.filter(
      (product) => product.category === name && product.subcategory === subName,
    ).length,
  })),
}));

export const sortOptions = [
  { value: "popular", label: "Popular..." },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

export const priceRanges = [
  { id: "under-10", label: "Under $10", min: 0, max: 9.99 },
  { id: "10-25", label: "$10 - $25", min: 10, max: 25 },
  { id: "25-50", label: "$25 - $50", min: 25, max: 50 },
  { id: "50-100", label: "$50 - $100", min: 50, max: 100 },
  { id: "100-plus", label: "$100+", min: 100, max: Infinity },
];

export const ratingOptions = [
  { id: "4.5", label: "4.5 & above", min: 4.5 },
  { id: "4.0", label: "4.0 & above", min: 4.0 },
  { id: "3.0", label: "3.0 & above", min: 3.0 },
];

export const sellerOptions = [
  { id: "verified", label: "Verified Sellers" },
  { id: "top", label: "Top Sellers" },
  { id: "new", label: "New Sellers" },
];

export const deliveryOptions = [
  { id: "instant", label: "Instant Delivery" },
  { id: "1-hour", label: "Within 1 Hour" },
  { id: "24-hour", label: "Within 24 Hours" },
];

export const availabilityOptions = [
  { id: "in-stock", label: "In Stock" },
  { id: "available-now", label: "Available Now" },
];

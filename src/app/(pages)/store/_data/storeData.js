// src/app/(pages)/store/_data/storeData.js

export const storeData = {
  seller: {
    name: "NovaStore",
    slug: "nova-store",
    avatar: "/seller_avater.jpg",
    verified: true,
    bio: "Streaming, AI tools and design licenses",
    rating: "4.9",
    ratingLabel: "Seller rating",
    sales: "1,284",
    salesLabel: "Sales",
    positiveReviews: "98%",
    positiveLabel: "Positive reviews",
    since: "Since 2025",
    sinceLabel: "Selling on ACCZORA",
  },
  categories: [
    { id: "all", name: "All Products", hasDropdown: false },
    { id: "social-media", name: "Social Media", hasDropdown: true },
    { id: "email", name: "Email", hasDropdown: true },
    { id: "gaming", name: "Gaming", hasDropdown: true },
    { id: "streaming", name: "Streaming", hasDropdown: true },
    { id: "software", name: "Software & Apps", hasDropdown: true },
    { id: "ai-tools", name: "AI Tools", hasDropdown: true },
    { id: "business", name: "Business", hasDropdown: true },
    { id: "developer", name: "Developer", hasDropdown: true },
    { id: "e-commerce", name: "E-commerce", hasDropdown: true },
    { id: "crypto", name: "Crypto", hasDropdown: true },
  ],
  reviewsSummary: {
    totalReviews: "10.0k",
    growth: "+21% ↑",
    growthSubtext: "Growth in reviews on this year",
    averageRating: "4.0",
    ratingSubtext: "Average Ratings on the year",
    distribution: [
      { stars: 5, count: "2.2k", percentage: 92 },
      { stars: 4, count: "1.0k", percentage: 55 },
      { stars: 3, count: "500", percentage: 25 },
      { stars: 2, count: "200", percentage: 10 },
      { stars: 1, count: "0", percentage: 2 },
    ],
  },
  reviews: [
    {
      id: 1,
      author: "Farzana A.",
      avatar: "/review_avater.jpg",
      verifiedPurchase: true,
      rating: 5,
      ratingFormatted: "5.0",
      comment:
        "Love this shampoo! My hair feels so fresh and smooth. Love this shampoo! My hair feels so fresh and smooth.Love this shampoo! My hair feels so fresh and smooth. Love this shampoo! My hair feels so fresh and smooth.",
    },
    {
      id: 2,
      author: "Farzana A.",
      avatar: "/review_avater.jpg",
      verifiedPurchase: true,
      rating: 5,
      ratingFormatted: "5.0",
      comment:
        "Love this shampoo! My hair feels so fresh and smooth. Love this shampoo! My hair feels so fresh and smooth.Love this shampoo! My hair feels so fresh and smooth. Love this shampoo! My hair feels so fresh and smooth.",
    },
    {
      id: 3,
      author: "Farzana A.",
      avatar: "/review_avater.jpg",
      verifiedPurchase: true,
      rating: 5,
      ratingFormatted: "5.0",
      comment:
        "Love this shampoo! My hair feels so fresh and smooth. Love this shampoo! My hair feels so fresh and smooth.Love this shampoo! My hair feels so fresh and smooth. Love this shampoo! My hair feels so fresh and smooth.",
    },
    {
      id: 4,
      author: "Farzana A.",
      avatar: "/review_avater.jpg",
      verifiedPurchase: true,
      rating: 5,
      ratingFormatted: "5.0",
      comment:
        "Love this shampoo! My hair feels so fresh and smooth. Love this shampoo! My hair feels so fresh and smooth.Love this shampoo! My hair feels so fresh and smooth. Love this shampoo! My hair feels so fresh and smooth.",
    },
  ],
};

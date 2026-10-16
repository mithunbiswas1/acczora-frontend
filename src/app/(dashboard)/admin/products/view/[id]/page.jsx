// src/app/(dashboard)/admin/products/view/[id]/page.jsx

"use client";

import { use } from "react";
import ProductViewDetails from "@/app/(dashboard)/_components/products/ProductViewDetails";

export default function AdminProductViewPage({ params }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams?.id;

  return <ProductViewDetails productId={id} basePath="/admin/products" />;
}

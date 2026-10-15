// src/app/(dashboard)/admin/products/edit/[id]/page.jsx

"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import ProductForm from "@/app/(dashboard)/_components/products/ProductForm";
import { useGetProductByIdQuery } from "@/redux/api/productApi";

export default function AdminEditProductPage() {
  const params = useParams();
  const id = params?.id;

  const { data: productData, isLoading } = useGetProductByIdQuery(id, {
    skip: !id,
  });

  if (isLoading) {
    return (
      <div className="py-24 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#5b52f9] animate-spin mx-auto" />
        <p className="text-xs text-gray-400">Loading product details...</p>
      </div>
    );
  }

  return (
    <ProductForm
      mode="edit"
      productId={id}
      initialData={productData?.data || {}}
      basePath="/admin/products"
    />
  );
}

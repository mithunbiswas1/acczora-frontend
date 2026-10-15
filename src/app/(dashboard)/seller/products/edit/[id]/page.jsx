// src/app/(dashboard)/seller/products/edit/[id]/page.jsx

"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useGetProductByIdQuery } from "@/redux/api/productApi";
import ProductForm from "@/app/(dashboard)/_components/products/ProductForm";

export default function EditProductPage() {
  const params = useParams();
  const id = params?.id;

  const { data: apiResponse, isLoading } = useGetProductByIdQuery(id, {
    skip: !id,
  });

  const product = apiResponse?.data || apiResponse?.data?.product || {};

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="w-8 h-8 border-3 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <ProductForm
      mode="edit"
      productId={id}
      initialData={product}
      basePath="/seller/products"
    />
  );
}

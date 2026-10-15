// src/app/(dashboard)/seller/products/add/page.jsx

"use client";

import React from "react";
import ProductForm from "@/app/(dashboard)/_components/products/ProductForm";

export default function AddProductPage() {
  return <ProductForm mode="add" basePath="/seller/products" />;
}

// src/app/(dashboard)/admin/products/add/page.jsx

"use client";

import React from "react";
import ProductForm from "@/app/(dashboard)/_components/products/ProductForm";

export default function AdminAddProductPage() {
  return <ProductForm mode="add" basePath="/admin/products" />;
}

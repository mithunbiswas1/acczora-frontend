// src/app/(dashboard)/_components/overview/TopProductsTable.jsx

import React from "react";
import Link from "next/link";
import BrandIcon from "./BrandIcon";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";

const DEFAULT_TOP_PRODUCTS = [
  {
    title: "Netflix Premium — 12 Month",
    category: "Category",
    sales: 84,
    revenue: "$1,512.00",
  },
  {
    title: "Canva Pro — Lifetime Seat",
    category: "Category",
    sales: 62,
    revenue: "$744.00",
  },
  {
    title: "Spotify Premium — 3 Month",
    category: "Category",
    sales: 48,
    revenue: "$384.00",
  },
];

export default function TopProductsTable({
  title = "Top products",
  viewAllHref = "/seller/products",
  products = DEFAULT_TOP_PRODUCTS,
}) {
  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <h3 className="text-base font-bold text-gray-900">{title}</h3>
        <Link
          href={viewAllHref}
          className="text-xs font-semibold text-brand hover:text-brand-hover flex items-center gap-1 transition-colors"
        >
          View All →
        </Link>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-100 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            <TableHead className="py-3 px-6">Product</TableHead>
            <TableHead className="py-3 px-6">Sales</TableHead>
            <TableHead className="py-3 px-6 text-right">Revenue</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-100 text-xs">
          {products.map((item, idx) => (
            <TableRow
              key={item.title || idx}
              className="hover:bg-gray-50/70 transition-colors"
            >
              {/* Product with Icon & Subtitle */}
              <TableCell className="py-3.5 px-6">
                <div className="flex items-center gap-3">
                  <BrandIcon name={item.title} size={32} />
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-xs truncate">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-gray-400 truncate">
                      {item.category || "Category"}
                    </p>
                  </div>
                </div>
              </TableCell>

              {/* Sales */}
              <TableCell className="py-3.5 px-6 font-medium text-gray-700">
                {item.sales}
              </TableCell>

              {/* Revenue */}
              <TableCell className="py-3.5 px-6 font-bold text-gray-900 text-right">
                {item.revenue}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

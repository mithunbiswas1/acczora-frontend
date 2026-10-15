// src/app/(dashboard)/_components/overview/RecentOrdersTable.jsx

import React from "react";
import Link from "next/link";
import Image from "next/image";
import BrandIcon from "./BrandIcon";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";

const DEFAULT_ORDERS = [
  {
    orderId: "#ACC10248",
    product: "Netflix Premium",
    category: "Category",
    buyer: "John D.",
    buyerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
    date: "Sep 24",
    amount: "$18",
    status: "Completed",
  },
  {
    orderId: "#ACC10247",
    product: "Canva Pro",
    category: "Category",
    buyer: "Alex M.",
    buyerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
    date: "Sep 24",
    amount: "$12",
    status: "Processing",
  },
  {
    orderId: "#ACC10246",
    product: "Spotify Premium",
    category: "Category",
    buyer: "Mark R.",
    buyerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
    date: "Sep 23",
    amount: "$8",
    status: "Completed",
  },
  {
    orderId: "#ACC10245",
    product: "ChatGPT Plus — 1 Month",
    category: "Category",
    buyer: "Priya S.",
    buyerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
    date: "Sep 22",
    amount: "$16.50",
    status: "Pending",
  },
  {
    orderId: "#ACC10244",
    product: "NordVPN — 2 Year",
    category: "Category",
    buyer: "Tanvir H.",
    buyerAvatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop&crop=faces",
    date: "Sep 22",
    amount: "$34.00",
    status: "Cancelled",
  },
];

export default function RecentOrdersTable({
  title = "Team Hiring Performance",
  viewAllHref = "/seller/orders",
  orders = DEFAULT_ORDERS,
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
            <TableHead className="py-3 px-6">Order</TableHead>
            <TableHead className="py-3 px-6">Product</TableHead>
            <TableHead className="py-3 px-6">Buyer</TableHead>
            <TableHead className="py-3 px-6">Date</TableHead>
            <TableHead className="py-3 px-6">Amount</TableHead>
            <TableHead className="py-3 px-6 text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-100 text-xs">
          {orders.map((item, idx) => (
            <TableRow
              key={item.orderId || idx}
              className="hover:bg-gray-50/70 transition-colors"
            >
              {/* Order ID */}
              <TableCell className="py-3.5 px-6 font-semibold text-gray-900">
                {item.orderId}
              </TableCell>

              {/* Product with Brand Icon & Subtitle */}
              <TableCell className="py-3.5 px-6">
                <div className="flex items-center gap-3">
                  <BrandIcon name={item.product} size={32} />
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-xs truncate">
                      {item.product}
                    </p>
                    <p className="text-[11px] text-gray-400 truncate">
                      {item.category || "Category"}
                    </p>
                  </div>
                </div>
              </TableCell>

              {/* Buyer with circular avatar */}
              <TableCell className="py-3.5 px-6">
                <div className="flex items-center gap-2">
                  <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 ring-1 ring-gray-200">
                    {item.buyerAvatar ? (
                      <Image
                        src={item.buyerAvatar}
                        alt={item.buyer}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-600">
                        {item.buyer?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <span className="font-medium text-gray-800">
                    {item.buyer}
                  </span>
                </div>
              </TableCell>

              {/* Date */}
              <TableCell className="py-3.5 px-6 text-gray-500 font-medium">
                {item.date}
              </TableCell>

              {/* Amount */}
              <TableCell className="py-3.5 px-6 font-bold text-gray-900">
                {item.amount}
              </TableCell>

              {/* Status Pill */}
              <TableCell className="py-3.5 px-6 text-right">
                <Badge variant={item.status} size="sm">
                  {item.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

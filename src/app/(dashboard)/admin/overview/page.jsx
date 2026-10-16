// src/app/(dashboard)/admin/overview/page.jsx

"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { Users, Store, ArrowRight, Loader2 } from "lucide-react";
import { CubesIcon, CartFlatbedBoxesIcon } from "@/icons";
import StatCard from "@/components/ui/StatCard";
import SalesOverviewChart from "@/app/(dashboard)/_components/overview/SalesOverviewChart";
import Badge from "@/components/ui/Badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { useGetAllOrdersQuery } from "@/redux/api/orderApi";
import { useGetAllProductsQuery } from "@/redux/api/productApi";
import { useGetAdminReviewsQuery } from "@/redux/api/reviewApi";

export default function AdminOverviewPage() {
  const { isLoggedIn } = useSelector((state) => state.auth || {});
  const { data: ordersData, isLoading: isLoadingOrders } = useGetAllOrdersQuery(
    undefined,
    { skip: !isLoggedIn }
  );
  const { data: productsData, isLoading: isLoadingProducts } =
    useGetAllProductsQuery(undefined, { skip: !isLoggedIn });
  const { data: reviewsData } = useGetAdminReviewsQuery(undefined, {
    skip: !isLoggedIn,
  });

  const orders = useMemo(() => {
    return Array.isArray(ordersData?.data?.orders)
      ? ordersData.data.orders
      : Array.isArray(ordersData?.data)
      ? ordersData.data
      : [];
  }, [ordersData]);

  const products = useMemo(() => {
    return Array.isArray(productsData?.data?.products)
      ? productsData.data.products
      : Array.isArray(productsData?.data)
      ? productsData.data
      : [];
  }, [productsData]);

  const reviews = useMemo(() => {
    return Array.isArray(reviewsData?.data?.reviews)
      ? reviewsData.data.reviews
      : Array.isArray(reviewsData?.data)
      ? reviewsData.data
      : [];
  }, [reviewsData]);

  const pendingReviewsCount = useMemo(() => {
    return reviews.filter((r) => r.status === "pending").length;
  }, [reviews]);

  const totalGrossRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  }, [orders]);

  const recentOrders = useMemo(() => {
    return orders.slice(0, 5).map((order) => {
      const orderIdStr = order.orderNumber || `#ACC${String(order._id || order.id).slice(-5)}`;
      const amountVal = `$${Number(order.totalAmount || 0).toFixed(2)}`;
      const statusLabel =
        order.status === "completed"
          ? "Completed"
          : order.status === "processing"
          ? "Processing"
          : "Completed";
      return {
        id: orderIdStr,
        amount: amountVal,
        status: order.status || "completed",
        statusLabel: statusLabel,
      };
    });
  }, [orders]);

  const pendingActions = [
    {
      label: "Pending Reviews Moderation",
      count: pendingReviewsCount,
      href: "/admin/reviews",
    },
    {
      label: "Live Active Products",
      count: products.filter((p) => p.status === "active").length,
      href: "/admin/products",
    },
    {
      label: "Total Platform Orders",
      count: orders.length,
      href: "/admin/orders",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Welcome back. Here&apos;s your live marketplace overview.
        </p>
      </div>

      {/* 2. Top Metric Cards (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Platform Revenue */}
        <StatCard
          title="Gross Sales"
          value={`$${totalGrossRevenue.toFixed(2)}`}
          change={`${orders.length} orders`}
          subtext="Lifetime marketplace volume"
          icon={Users}
          iconBg="bg-[#ede9fe] text-[#7c3aed]"
        />

        {/* Total Products */}
        <StatCard
          title="Catalog Products"
          value={String(products.length)}
          change={`${products.filter((p) => p.status === "active").length} active`}
          subtext="Total listings"
          icon={CubesIcon}
          iconBg="bg-[#dbeafe] text-[#2563eb]"
        />

        {/* Total Orders */}
        <StatCard
          title="Delivered Orders"
          value={String(orders.length)}
          subtext="All-time deliveries"
          icon={CartFlatbedBoxesIcon}
          iconBg="bg-[#dcfce7] text-[#16a34a]"
        />

        {/* Pending Reviews */}
        <StatCard
          title="Pending Reviews"
          value={String(pendingReviewsCount)}
          change="Requires moderation"
          subtext="Trust & Safety"
          icon={Store}
          iconBg="bg-[#fef3c7] text-[#d97706]"
        />
      </div>

      {/* 3. Middle Section: Platform Revenue & Pending Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Platform Revenue Chart (8 Columns) */}
        <div className="lg:col-span-8">
          <SalesOverviewChart
            title="Platform Revenue"
            initialRange="12 Months"
            peakAmount="$ 7,900"
            className="h-full"
          />
        </div>

        {/* Pending Actions (4 Columns) */}
        <Card className="lg:col-span-4 flex flex-col justify-between">
          <div>
            <CardHeader className="mb-6 p-0 pb-0">
              <CardTitle>Pending Actions</CardTitle>
            </CardHeader>

            <div className="">
              {pendingActions.map((action, idx) => (
                <Link
                  key={idx}
                  href={action.href}
                  className="flex items-center justify-between py-4 border-b border-border"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {action.label}
                  </span>
                  <Badge variant="purple_pill" size="xs" className="px-2.5 py-0.5">
                    {action.count}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* 4. Bottom Section: Recent Orders Table */}
      <Card className="space-y-4">
        {/* Table Header */}
        <CardHeader className="flex flex-row items-center justify-between p-0 pb-2">
          <CardTitle>Recent Orders</CardTitle>
          <Link
            href="/admin/orders"
            className="text-xs sm:text-sm font-semibold text-[#2563eb] hover:underline flex items-center gap-1.5 transition-colors"
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </Link>
        </CardHeader>

        {/* Table Content */}
        {recentOrders.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-400">
            No marketplace orders yet.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-100 hover:bg-transparent">
                <TableHead className="text-xs font-medium text-gray-400 py-3.5 px-4 w-1/3">
                  Order ID
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-400 py-3.5 px-4 text-left w-1/3">
                  Amount
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-400 py-3.5 px-4 text-right w-1/3">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow
                  key={order.id}
                  className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors"
                >
                  <TableCell className="py-4 px-4 text-sm font-semibold text-gray-900">
                    {order.id}
                  </TableCell>
                  <TableCell className="py-4 px-4 text-sm font-semibold text-gray-900 text-left">
                    {order.amount}
                  </TableCell>
                  <TableCell className="py-4 px-4 text-right">
                    <Badge variant={order.status}>
                      {order.statusLabel}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}

// src/app/(dashboard)/admin/overview/page.jsx

"use client";

import React from "react";
import Link from "next/link";
import { Users, Store, ArrowRight } from "lucide-react";
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

const RECENT_ORDERS = [
  {
    id: "#ACC10248",
    amount: "$18",
    status: "completed",
    statusLabel: "Completed",
  },
  {
    id: "#ACC10247",
    amount: "$12",
    status: "processing",
    statusLabel: "Processing",
  },
  {
    id: "#ACC10246",
    amount: "$8",
    status: "completed",
    statusLabel: "Completed",
  },
  {
    id: "#ACC10245",
    amount: "$16.50",
    status: "pending",
    statusLabel: "Pending",
  },
  {
    id: "#ACC10244",
    amount: "$34.00",
    status: "cancelled",
    statusLabel: "Cancelled",
  },
];

const PENDING_ACTIONS = [
  {
    label: "Seller applications",
    count: 12,
    href: "/admin/users",
  },
  {
    label: "Products awaiting approval",
    count: 28,
    href: "/admin/products",
  },
  {
    label: "Withdrawal requests",
    count: 28,
    href: "/admin/withdrawals",
  },
];

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Dashboard
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Welcome back. Here&apos;s your marketplace overview.
        </p>
      </div>

      {/* 2. Top Metric Cards (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <StatCard
          title="Total Users"
          value="12,840"
          change="12.5% ↑"
          subtext="All-time total"
          icon={Users}
          iconBg="bg-[#ede9fe] text-[#7c3aed]"
        />

        {/* Total Sellers */}
        <StatCard
          title="Total Sellers"
          value="486"
          change="8.2% ↑"
          subtext="All-time total"
          icon={Store}
          iconBg="bg-[#dcfce7] text-[#16a34a]"
        />

        {/* Total Products */}
        <StatCard
          title="Total Products"
          value="2,460"
          subtext="All-time total"
          icon={CubesIcon}
          iconBg="bg-[#dbeafe] text-[#2563eb]"
        />

        {/* Total Orders */}
        <StatCard
          title="Total Orders"
          value="8,192"
          subtext="All-time total"
          icon={CartFlatbedBoxesIcon}
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
              {PENDING_ACTIONS.map((action, idx) => (
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
            {RECENT_ORDERS.map((order) => (
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
      </Card>
    </div>
  );
}

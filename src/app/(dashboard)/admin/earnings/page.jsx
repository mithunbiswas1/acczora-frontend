// src/app/(dashboard)/admin/earnings/page.jsx

"use client";

import { useState } from "react";
import {
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle,
  Calendar,
} from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import Badge from "@/components/ui/Badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import Pagination from "@/components/ui/Pagination";
import { MoneyBillCardIcon, MoneyWithdrawalIcon, TotalSalesIcon } from "@/icons";
import { Typography, H3, P, Caption } from "@/components/ui/Typography";

const PLATFORM_MONTHLY_EARNINGS = [
  {
    month: "October 2026 (MTD)",
    grossVolume: "$38,420.00",
    platformCut: "$3,842.00",
    sellerPayouts: "$31,200.00",
    escrowHolding: "$3,378.00",
    activeSellers: 48,
    status: "active",
  },
  {
    month: "September 2026",
    grossVolume: "$44,180.00",
    platformCut: "$4,418.00",
    sellerPayouts: "$39,762.00",
    escrowHolding: "$0.00",
    activeSellers: 52,
    status: "completed",
  },
  {
    month: "August 2026",
    grossVolume: "$41,890.00",
    platformCut: "$4,189.00",
    sellerPayouts: "$37,701.00",
    escrowHolding: "$0.00",
    activeSellers: 45,
    status: "completed",
  },
  {
    month: "July 2026",
    grossVolume: "$32,950.00",
    platformCut: "$3,295.00",
    sellerPayouts: "$29,655.00",
    escrowHolding: "$0.00",
    activeSellers: 39,
    status: "completed",
  },
  {
    month: "June 2026",
    grossVolume: "$26,200.00",
    platformCut: "$2,620.00",
    sellerPayouts: "$23,580.00",
    escrowHolding: "$0.00",
    activeSellers: 31,
    status: "completed",
  },
];

export default function AdminEarningsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const stats = [
    {
      title: "Lifetime Platform GMV",
      value: "$183,640",
      change: "19.5% ↑",
      subtext: "Gross accounts transaction volume",
      iconBg: "bg-purple-50 text-purple-600",
      icon: TotalSalesIcon,
    },
    {
      title: "Net Platform Revenue",
      value: "$18,364",
      change: "19.5% ↑",
      subtext: "Retained 10% platform commission",
      iconBg: "bg-emerald-50 text-emerald-600",
      icon: MoneyBillCardIcon,
    },
    {
      title: "Current Seller Escrow",
      value: "$3,378",
      subtext: "Pending 24h warranty release",
      iconBg: "bg-amber-50 text-amber-600",
      icon: MoneyWithdrawalIcon,
    },
    {
      title: "Total Paid Out to Sellers",
      value: "$161,898",
      subtext: "Zero unresolved payouts",
      iconBg: "bg-blue-50 text-blue-600",
      icon: Wallet,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-border">
        <div>
          <H3 className="text-xl font-bold text-gray-900">Platform Treasury & Revenue</H3>
          <P className="text-xs text-gray-500 mt-1">
            Global marketplace commission collections, seller liabilities, and escrow reserves.
          </P>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
          <ShieldCheck size={16} /> 100% Reserve Backed
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            subtext={stat.subtext}
            iconBg={stat.iconBg}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <Typography variant="h5" className="font-bold text-gray-900">Platform Monthly Financial Breakdown</Typography>
          <Caption className="text-gray-500">Gross accounts trade, 10% fee retained, and seller disbursements</Caption>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Accounting Period</TableHead>
              <TableHead>Gross Marketplace GMV</TableHead>
              <TableHead>Acczora Fee Revenue</TableHead>
              <TableHead>Seller Payouts Cleared</TableHead>
              <TableHead>Escrow Held</TableHead>
              <TableHead>Active Sellers</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PLATFORM_MONTHLY_EARNINGS.map((row) => (
              <TableRow key={row.month}>
                <TableCell className="font-semibold text-gray-900 text-xs flex items-center gap-2">
                  <Calendar size={14} className="text-gray-400" />
                  {row.month}
                </TableCell>
                <TableCell className="text-xs font-bold text-gray-900">{row.grossVolume}</TableCell>
                <TableCell className="text-xs font-bold text-brand">+{row.platformCut}</TableCell>
                <TableCell className="text-xs font-semibold text-gray-700">{row.sellerPayouts}</TableCell>
                <TableCell className="text-xs font-semibold text-amber-600">{row.escrowHolding}</TableCell>
                <TableCell className="text-xs text-gray-500">{row.activeSellers} stores</TableCell>
                <TableCell>
                  <Badge variant={row.status === "active" ? "pending" : "completed"} dot>
                    {row.status === "active" ? "In Progress" : "Audited"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="p-4 border-t border-border">
          <Pagination
            currentPage={currentPage}
            totalPages={1}
            totalItems={PLATFORM_MONTHLY_EARNINGS.length}
            pageSize={pageSize}
            onPageChange={(p) => setCurrentPage(p)}
          />
        </div>
      </div>
    </div>
  );
}

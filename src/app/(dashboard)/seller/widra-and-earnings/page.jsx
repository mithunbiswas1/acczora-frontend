// src/app/(dashboard)/seller/widra-and-earnings/page.jsx

"use client";

import { useState } from "react";
import {
  Wallet,
  ArrowDownToLine,
  ArrowUpRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Plus,
  Download,
  Calendar,
  Layers,
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
import Modal from "@/components/ui/Modal";
import SearchInput from "@/components/ui/SearchInput";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Typography, H2, H3, P, Caption } from "@/components/ui/Typography";
import { toast } from "sonner";

const DEMO_WITHDRAWALS = [
  {
    id: "#WD-1082",
    method: "USDT (TRC-20)",
    destination: "TYz84kLmnPq92Vx45ZaBcv1098Xy",
    amount: "$450.00",
    fee: "$1.00",
    net: "$449.00",
    status: "completed",
    txRef: "a8f9c1b72e0d3f4a...",
    date: "Oct 10, 2026",
  },
  {
    id: "#WD-1081",
    method: "Binance Pay ID",
    destination: "binance_id_88294103",
    amount: "$300.00",
    fee: "$0.00",
    net: "$300.00",
    status: "completed",
    txRef: "BP-9982410294",
    date: "Oct 05, 2026",
  },
  {
    id: "#WD-1080",
    method: "bKash (Personal)",
    destination: "+8801700000003",
    amount: "$150.00",
    fee: "$2.25",
    net: "$147.75",
    status: "completed",
    txRef: "BKH-9821048",
    date: "Sep 28, 2026",
  },
  {
    id: "#WD-1079",
    method: "USDT (TRC-20)",
    destination: "TYz84kLmnPq92Vx45ZaBcv1098Xy",
    amount: "$600.00",
    fee: "$1.00",
    net: "$599.00",
    status: "pending",
    txRef: "Processing...",
    date: "Oct 14, 2026",
  },
];

const MONTHLY_STATEMENTS = [
  {
    period: "October 2026",
    grossSales: "$3,420.00",
    fee: "$342.00",
    netEarnings: "$3,078.00",
    ordersCount: 78,
    status: "completed",
  },
  {
    period: "September 2026",
    grossSales: "$4,180.00",
    fee: "$418.00",
    netEarnings: "$3,762.00",
    ordersCount: 94,
    status: "completed",
  },
  {
    period: "August 2026",
    grossSales: "$3,890.00",
    fee: "$389.00",
    netEarnings: "$3,501.00",
    ordersCount: 86,
    status: "completed",
  },
  {
    period: "July 2026",
    grossSales: "$2,950.00",
    fee: "$295.00",
    netEarnings: "$2,655.00",
    ordersCount: 65,
    status: "completed",
  },
];

export default function SellerWithdrawalsAndEarningsPage() {
  const [activeTab, setActiveTab] = useState("withdrawals"); // 'withdrawals' | 'earnings'
  const [withdrawals, setWithdrawals] = useState(DEMO_WITHDRAWALS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter state for withdrawals
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // New Withdrawal Form
  const [withdrawForm, setWithdrawForm] = useState({
    method: "USDT (TRC-20)",
    amount: "",
    destination: "",
  });

  const availableBalance = 2480.0;

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    const amountNum = parseFloat(withdrawForm.amount);
    if (!amountNum || amountNum < 20) {
      toast.error("Minimum withdrawal amount is $20.00");
      return;
    }
    if (amountNum > availableBalance) {
      toast.error("Withdrawal amount exceeds your available balance");
      return;
    }
    if (!withdrawForm.destination.trim()) {
      toast.error("Please enter your payout destination (wallet/account/phone)");
      return;
    }

    const fee = withdrawForm.method.includes("bKash") ? (amountNum * 0.015).toFixed(2) : "1.00";
    const net = (amountNum - parseFloat(fee)).toFixed(2);

    const newWd = {
      id: `#WD-${Math.floor(1085 + Math.random() * 50)}`,
      method: withdrawForm.method,
      destination: withdrawForm.destination,
      amount: `$${amountNum.toFixed(2)}`,
      fee: `$${fee}`,
      net: `$${net}`,
      status: "pending",
      txRef: "Under Review",
      date: "Just now",
    };

    setWithdrawals([newWd, ...withdrawals]);
    setIsModalOpen(false);
    setWithdrawForm({ method: "USDT (TRC-20)", amount: "", destination: "" });
    toast.success("Payout request submitted! Processing takes 15–30 minutes.");
  };

  const filteredWithdrawals = withdrawals.filter((w) => {
    const matchSearch =
      w.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.method.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "all" || w.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredWithdrawals.length / itemsPerPage) || 1;
  const paginatedWithdrawals = filteredWithdrawals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <H2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
            Withdrawals & Earnings Hub
          </H2>
          <P className="text-xs text-gray-500 mt-1">
            Manage your store balances, payout requests, and download monthly statements.
          </P>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="solid"
            size="default"
            onClick={() => setIsModalOpen(true)}
            icon={<ArrowDownToLine size={16} />}
          >
            Request Payout
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Available to Withdraw"
          value={`$${availableBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          icon={Wallet}
          trend="Instant payout available"
          trendDirection="up"
        />
        <StatCard
          title="Total Lifetime Earnings"
          value="$14,440.00"
          icon={ArrowUpRight}
          trend="+18.4% from last month"
          trendDirection="up"
        />
        <StatCard
          title="Pending in Escrow"
          value="$600.00"
          icon={Clock}
          trend="Releasing after buyer warranty"
          trendDirection="neutral"
        />
        <StatCard
          title="Total Withdrawn"
          value="$11,360.00"
          icon={CheckCircle}
          trend="Processed to your wallets"
          trendDirection="up"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border">
        <button
          type="button"
          onClick={() => setActiveTab("withdrawals")}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === "withdrawals"
              ? "border-brand text-brand"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          Withdrawal Requests ({withdrawals.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("earnings")}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === "earnings"
              ? "border-brand text-brand"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          Earnings & Monthly Statements ({MONTHLY_STATEMENTS.length})
        </button>
      </div>

      {/* TAB 1: WITHDRAWALS */}
      {activeTab === "withdrawals" && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-border shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex-1 max-w-md">
              <SearchInput
                placeholder="Search by ID, wallet or method..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <Select
              variant="filter"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 text-xs min-w-[130px]"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </Select>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-border shadow-xs overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payout ID</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Gross Amount</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Net Payout</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedWithdrawals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-gray-400 text-xs">
                      No withdrawal records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedWithdrawals.map((w) => (
                    <TableRow key={w.id} className="hover:bg-gray-50/60">
                      <TableCell className="font-semibold text-xs text-gray-900">{w.id}</TableCell>
                      <TableCell className="text-xs font-medium text-gray-700">{w.method}</TableCell>
                      <TableCell className="text-xs font-mono text-gray-500 truncate max-w-[180px]">
                        {w.destination}
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-gray-900">{w.amount}</TableCell>
                      <TableCell className="text-xs text-gray-400">{w.fee}</TableCell>
                      <TableCell className="text-xs font-bold text-emerald-600">{w.net}</TableCell>
                      <TableCell>
                        <Badge
                          variant={w.status === "completed" ? "success" : "warning"}
                          size="sm"
                        >
                          {w.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-gray-500 whitespace-nowrap">{w.date}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            <div className="p-4 border-t border-border flex items-center justify-between">
              <p className="text-xs text-gray-500">
                Showing {paginatedWithdrawals.length} of {filteredWithdrawals.length} payouts
              </p>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EARNINGS & MONTHLY STATEMENTS */}
      {activeTab === "earnings" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-border shadow-xs overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <H3 className="text-sm font-bold text-gray-900">Monthly Payout Statements</H3>
              <span className="text-xs text-gray-500">Platform commission: 10%</span>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Billing Period</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Gross Sales</TableHead>
                  <TableHead>Platform Fee (10%)</TableHead>
                  <TableHead>Net Earnings</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MONTHLY_STATEMENTS.map((item, index) => (
                  <TableRow key={index} className="hover:bg-gray-50/60">
                    <TableCell className="font-semibold text-xs text-gray-900">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        <span>{item.period}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-gray-600">{item.ordersCount} sales</TableCell>
                    <TableCell className="text-xs font-semibold text-gray-900">{item.grossSales}</TableCell>
                    <TableCell className="text-xs text-rose-500">-{item.fee}</TableCell>
                    <TableCell className="text-xs font-bold text-emerald-600">{item.netEarnings}</TableCell>
                    <TableCell>
                      <Badge variant="success" size="sm">
                        CLEARED
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast.success(`Statement for ${item.period} exported to PDF`)}
                        icon={<Download size={13} />}
                        className="text-xs"
                      >
                        Download PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Request Payout Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Request Balance Withdrawal"
        >
          <form onSubmit={handleWithdrawSubmit} className="space-y-4">
            <div className="p-3 bg-brand/5 border border-brand/20 rounded-xl flex items-center justify-between">
              <span className="text-xs text-gray-600">Available Balance:</span>
              <span className="text-sm font-bold text-brand">${availableBalance.toFixed(2)}</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Payout Method</label>
              <Select
                value={withdrawForm.method}
                onChange={(e) => setWithdrawForm({ ...withdrawForm, method: e.target.value })}
                className="w-full text-xs"
              >
                <option value="USDT (TRC-20)">USDT (TRC-20) - $1.00 Network Fee</option>
                <option value="Binance Pay ID">Binance Pay (ID) - Instant & 0% Fee</option>
                <option value="bKash (Personal)">bKash (Personal) - 1.5% Fee</option>
                <option value="Bank Transfer">Bank Wire Transfer - $10.00 Fee</option>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Withdraw Amount ($ USD)</label>
              <Input
                type="number"
                step="0.01"
                placeholder="Min $20.00"
                value={withdrawForm.amount}
                onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                className="w-full text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">
                Payout Address / Account Number
              </label>
              <Input
                placeholder="Wallet address, Binance ID, or bKash phone..."
                value={withdrawForm.destination}
                onChange={(e) => setWithdrawForm({ ...withdrawForm, destination: e.target.value })}
                className="w-full text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="solid"
                size="sm"
                type="submit"
                icon={<ArrowDownToLine size={13} />}
              >
                Confirm Payout
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

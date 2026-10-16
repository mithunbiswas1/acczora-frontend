// src/app/(dashboard)/buyer/overview/page.jsx

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import {
  Wallet,
  ShieldCheck,
  ArrowRight,
  Copy,
  Check,
  Eye,
  Plus,
  Loader2,
} from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import LinkButton from "@/components/ui/LinkButton";
import EmptyState from "@/components/ui/EmptyState";
import { Typography, H3, P, Caption } from "@/components/ui/Typography";
import { toast } from "sonner";
import { CartFlatbedBoxesIcon, TotalSalesIcon } from "@/icons";
import { useGetMyPointsQuery, useGetBuyerOrdersQuery } from "@/redux/api/orderApi";

export default function BuyerOverviewPage() {
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const [copiedId, setCopiedId] = useState(null);

  const { data: myPointsRes, isLoading: isLoadingPoints } = useGetMyPointsQuery(
    undefined,
    { skip: !isLoggedIn }
  );

  const { data: ordersData, isLoading: isLoadingOrders } = useGetBuyerOrdersQuery(
    undefined,
    { skip: !isLoggedIn }
  );

  const buyerName = user?.fullName || "Valued Buyer";
  const pointsBalance = Number(myPointsRes?.data?.points ?? user?.points ?? 0);

  const orders = useMemo(() => {
    return Array.isArray(ordersData?.data?.orders)
      ? ordersData.data.orders
      : Array.isArray(ordersData?.data)
      ? ordersData.data
      : [];
  }, [ordersData]);

  const totalAccounts = useMemo(() => {
    return orders.reduce((acc, o) => acc + (Number(o.quantity) || 1), 0);
  }, [orders]);

  const activeWarranties = useMemo(() => {
    return orders.filter((o) => o.status === "completed").length;
  }, [orders]);

  const totalSpent = useMemo(() => {
    return orders.reduce((acc, o) => acc + (Number(o.totalAmount) || 0), 0);
  }, [orders]);

  const recentPurchases = useMemo(() => {
    return orders.slice(0, 5);
  }, [orders]);

  const stats = [
    {
      title: "Wallet Balance",
      value: `$${pointsBalance.toFixed(2)}`,
      change: "Available for checkout",
      subtext: "Instant digital purchase ready",
      iconBg: "bg-brand/10 text-brand",
      icon: Wallet,
    },
    {
      title: "Accounts Purchased",
      value: `${totalAccounts} Account${totalAccounts === 1 ? "" : "s"}`,
      change: orders.length > 0 ? `${orders.length} orders` : "None yet",
      subtext: "Instant digital delivery",
      iconBg: "bg-blue-50 text-blue-600",
      icon: CartFlatbedBoxesIcon,
    },
    {
      title: "Active Warranties",
      value: `${activeWarranties} Active`,
      subtext: "Replacement guarantee active",
      iconBg: "bg-emerald-50 text-emerald-600",
      icon: ShieldCheck,
    },
    {
      title: "Total Spent",
      value: `$${totalSpent.toFixed(2)}`,
      subtext: "Lifetime marketplace purchases",
      iconBg: "bg-purple-50 text-purple-600",
      icon: TotalSalesIcon,
    },
  ];

  const handleCopy = (text, id) => {
    if (!text) {
      toast.error("No credential text available to copy");
      return;
    }
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Account credential copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-border">
        <div>
          <H3 className="text-xl font-bold text-gray-900">
            Welcome, {buyerName} 👋
          </H3>
          <P className="text-xs text-gray-500 mt-1">
            Access your purchased digital accounts, wallet balance, and replacement guarantees.
          </P>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {user?.role !== "seller" && (
            <LinkButton
              href="/become-a-seller"
              variant="outline"
              size="sm"
              rounded="xl"
              className="border-[#6558ff]/30 text-[#6558ff] hover:bg-indigo-50 font-semibold"
            >
              Become a Seller <ArrowRight size={14} className="ml-1" />
            </LinkButton>
          )}
          <LinkButton
            href="/buyer/wallet"
            variant="brand"
            size="sm"
            rounded="xl"
          >
            <Plus size={16} /> Add Funds
          </LinkButton>
          <LinkButton
            href="/marketplace"
            variant="outline"
            size="sm"
            rounded="xl"
          >
            Explore Catalog
          </LinkButton>
        </div>
      </div>

      {/* Stat Cards Grid */}
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

      {/* Recent Purchases & Digital Credentials */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <Typography variant="h5" className="font-bold text-gray-900">Recent Purchased Accounts</Typography>
            <Caption className="text-gray-500">Your unlocked accounts with instant copy & warranty details</Caption>
          </div>
          <Link
            href="/buyer/purchases"
            className="text-xs font-semibold text-brand hover:underline flex items-center gap-1"
          >
            All Purchased Accounts <ArrowRight size={14} />
          </Link>
        </div>

        {isLoadingOrders ? (
          <div className="py-16 text-center space-y-2">
            <Loader2 className="w-8 h-8 text-brand animate-spin mx-auto" />
            <p className="text-xs text-gray-400">Loading your purchases...</p>
          </div>
        ) : recentPurchases.length === 0 ? (
          <EmptyState
            variant="empty"
            title="No purchases yet"
            description="Start exploring our digital marketplace to buy verified digital accounts."
            actionHref="/marketplace"
            actionLabel="Explore Marketplace"
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Delivery Date</TableHead>
                <TableHead>Warranty Active</TableHead>
                <TableHead>Quick Credentials</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentPurchases.map((item) => {
                const credString = Array.isArray(item.deliveredCredentials)
                  ? item.deliveredCredentials.map((c) => c.credential || c).join("\n")
                  : item.deliveredCredentials || "";
                const itemId = item._id || item.id;
                const formattedDate = item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Recent";

                return (
                  <TableRow key={itemId}>
                    <TableCell>
                      <div className="max-w-xs">
                        <Typography variant="p" className="font-semibold text-gray-900 text-xs truncate">
                          {item.productTitle || item.product?.title || "Digital Product"}
                        </Typography>
                        <Caption className="text-[11px] text-gray-400 font-mono">
                          {item.orderNumber || `#ORD-${String(itemId).slice(-6)}`}
                        </Caption>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-gray-700 font-medium">
                      {item.seller?.shopName || item.seller?.fullName || "Verified Seller"}
                    </TableCell>
                    <TableCell className="text-xs text-gray-500">{formattedDate}</TableCell>
                    <TableCell>
                      <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold inline-flex items-center gap-1">
                        <ShieldCheck size={12} /> Instant Delivery
                      </span>
                    </TableCell>
                    <TableCell>
                      {credString ? (
                        <Button
                          variant="outline"
                          size="xs"
                          rounded="lg"
                          onClick={() => handleCopy(credString, itemId)}
                          className="font-mono"
                        >
                          {copiedId === itemId ? (
                            <>
                              <Check size={12} className="text-emerald-600" />
                              <span className="text-emerald-600 font-semibold">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} className="text-gray-400" />
                              <span>Copy Credentials</span>
                            </>
                          )}
                        </Button>
                      ) : (
                        <span className="text-[11px] text-gray-400 italic">No credentials</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/buyer/purchases/${itemId}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
                      >
                        <Eye size={13} /> View
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

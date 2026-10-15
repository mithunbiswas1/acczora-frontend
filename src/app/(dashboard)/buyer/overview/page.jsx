// src/app/(dashboard)/buyer/overview/page.jsx

"use client";

import { useState } from "react";
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
import { Typography, H3, P, Caption } from "@/components/ui/Typography";
import { toast } from "sonner";
import { CartFlatbedBoxesIcon, TotalSalesIcon } from "@/icons";

export default function BuyerOverviewPage() {
  const { user } = useSelector((state) => state.auth);
  const [copiedId, setCopiedId] = useState(null);

  const buyerName = user?.fullName || "Valued Buyer";
  const pointsBalance = 42.5; // 1 USD = 1 Point

  const stats = [
    {
      title: "Wallet Points Balance",
      value: `${pointsBalance.toFixed(2)} pts`,
      change: "1 Point = $1.00 USD",
      subtext: "Instant checkout ready",
      iconBg: "bg-brand/10 text-brand",
      icon: Wallet,
    },
    {
      title: "Accounts Purchased",
      value: "8 Accounts",
      change: "All active",
      subtext: "Instant digital delivery",
      iconBg: "bg-blue-50 text-blue-600",
      icon: CartFlatbedBoxesIcon,
    },
    {
      title: "Active Warranties",
      value: "3 Active",
      subtext: "Replacement guarantee active",
      iconBg: "bg-emerald-50 text-emerald-600",
      icon: ShieldCheck,
    },
    {
      title: "Total Spent",
      value: "$108.50",
      subtext: "Lifetime marketplace purchases",
      iconBg: "bg-purple-50 text-purple-600",
      icon: TotalSalesIcon,
    },
  ];

  const recentPurchases = [
    {
      id: "#ORD-9821",
      product: "Netflix Premium UHD 4K (1 Month)",
      category: "Streaming",
      seller: "NovaStore",
      date: "Oct 12, 2026",
      warrantyUntil: "Nov 12, 2026",
      credentials: "alex_netf_user@netflix.com:SecretStream992",
      amount: "$14.50",
      status: "completed",
    },
    {
      id: "#ORD-9820",
      product: "Canva Pro Educational (1 Year)",
      category: "Design",
      seller: "NovaStore",
      date: "Oct 11, 2026",
      warrantyUntil: "Oct 11, 2027",
      credentials: "https://www.canva.com/brand/join?token=xYz789_edu_invitation",
      amount: "$9.00",
      status: "completed",
    },
    {
      id: "#ORD-9818",
      product: "Spotify Family Slot (6 Months)",
      category: "Music",
      seller: "DigitalVault BD",
      date: "Oct 10, 2026",
      warrantyUntil: "Apr 10, 2027",
      credentials: "spotify_family_invite@music.org:Sp0t1fyFam99",
      amount: "$7.50",
      status: "completed",
    },
  ];

  const handleCopy = (text, id) => {
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
            Access your purchased digital accounts, wallet points, and replacement guarantees.
          </P>
        </div>
        <div className="flex items-center gap-3">
          <LinkButton
            href="/buyer/wallet"
            variant="brand"
            size="sm"
            rounded="xl"
          >
            <Plus size={16} /> Add Funds / Points
          </LinkButton>
          <LinkButton
            href="/"
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
            {recentPurchases.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="max-w-xs">
                    <Typography variant="p" className="font-semibold text-gray-900 text-xs truncate">
                      {item.product}
                    </Typography>
                    <Caption className="text-[11px] text-gray-400 font-mono">{item.id}</Caption>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-gray-700 font-medium">
                  {item.seller}
                </TableCell>
                <TableCell className="text-xs text-gray-500">{item.date}</TableCell>
                <TableCell>
                  <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold inline-flex items-center gap-1">
                    <ShieldCheck size={12} /> {item.warrantyUntil}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="xs"
                    rounded="lg"
                    onClick={() => handleCopy(item.credentials, item.id)}
                    className="font-mono"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check size={12} className="text-emerald-600" />
                        <span className="text-emerald-600 font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} className="text-gray-400" />
                        <span>Copy Login Info</span>
                      </>
                    )}
                  </Button>
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/buyer/purchases?orderId=${item.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
                  >
                    <Eye size={13} /> View
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

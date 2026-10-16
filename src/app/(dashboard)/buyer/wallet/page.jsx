// src/app/(dashboard)/buyer/wallet/page.jsx

"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Wallet,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle,
  CreditCard,
  QrCode,
  Sparkles,
  Loader2,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import Pagination from "@/components/ui/Pagination";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import LinkButton from "@/components/ui/LinkButton";
import Input from "@/components/ui/Input";
import SearchableSelect from "@/components/ui/SearchableSelect";
import { Typography, H3, P, Caption } from "@/components/ui/Typography";
import { toast } from "sonner";
import { useGetMyPointsQuery, useBuyPointsMutation } from "@/redux/api/orderApi";

const PAYMENT_GATEWAY_OPTIONS = [
  { label: "Crypto - USDT (TRC-20)", value: "USDT (TRC-20)" },
  { label: "Binance Pay (Instant 0% Fee)", value: "Binance Pay" },
  { label: "bKash (Instant Checkout)", value: "bKash" },
  { label: "Nagad (Instant Checkout)", value: "Nagad" },
  { label: "Credit / Debit Card (Stripe)", value: "Credit / Debit Card" },
];

const PACKAGES = [
  { amount: 10, points: 10, bonus: 0 },
  { amount: 25, points: 25, bonus: 1, popular: true },
  { amount: 50, points: 50, bonus: 3 },
  { amount: 100, points: 100, bonus: 8, bestValue: true },
];

export default function BuyerWalletPage() {
  const { user, isLoggedIn } = useSelector((state) => state.auth);

  const { data: myPointsRes, isLoading: isLoadingPoints, refetch: refetchPoints } =
    useGetMyPointsQuery(undefined, { skip: !isLoggedIn });
  const [buyPoints, { isLoading: isDepositing }] = useBuyPointsMutation();

  const currentPoints = Number(myPointsRes?.data?.points ?? user?.points ?? 0);

  const [deposits, setDeposits] = useState([]);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

  const [selectedMethod, setSelectedMethod] = useState("USDT (TRC-20)");
  const [depositAmount, setDepositAmount] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Load past deposits from localStorage for persistence
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storageKey = `acczora_deposits_${user?._id || user?.id || "guest"}`;
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          setDeposits(JSON.parse(stored));
        } else {
          setDeposits([
            {
              id: "#DEP-3091",
              method: "Binance Pay",
              amountUsd: "$50.00",
              pointsReceived: "$53.00",
              bonus: "+$3.00 bonus",
              date: "Oct 10, 2026",
              status: "completed",
              txRef: "BP-9982410294",
            },
          ]);
        }
      } catch (e) {
        // Fallback
      }
    }
  }, [user]);

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    const amount = Number(depositAmount);
    if (!amount || amount < 1) {
      toast.error("Please enter a valid amount (minimum 1)");
      return;
    }

    const pkg = PACKAGES.find((p) => p.amount === amount);
    const bonus = pkg ? pkg.bonus : 0;
    const totalPoints = amount + bonus;

    try {
      // Backend buy points mutation
      const res = await buyPoints({ points: totalPoints }).unwrap();

      const newDep = {
        id: `#DEP-${Math.floor(3000 + Math.random() * 2000)}`,
        method: selectedMethod,
        amountUsd: `$${amount.toFixed(2)}`,
        pointsReceived: `$${totalPoints.toFixed(2)}`,
        bonus: bonus > 0 ? `+$${bonus.toFixed(2)} bonus` : "Standard",
        date: "Just now",
        status: "completed",
        txRef: `AUTOPAY-${Math.floor(100000 + Math.random() * 900000)}`,
      };

      const updated = [newDep, ...deposits];
      setDeposits(updated);

      if (typeof window !== "undefined") {
        const storageKey = `acczora_deposits_${user?._id || user?.id || "guest"}`;
        localStorage.setItem(storageKey, JSON.stringify(updated));
      }

      toast.success(
        res?.message ||
          `Successfully deposited $${amount}! Credited $${totalPoints.toFixed(2)} to your wallet.`
      );
      if (refetchPoints) refetchPoints();
      setIsDepositModalOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || err?.message || "Failed to add funds");
    }
  };

  return (
    <div className="space-y-6">
      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-r from-white via-white to-brand/5 p-6 sm:p-8 rounded-3xl border border-border flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-2">
          <span className="text-xs font-bold text-brand uppercase tracking-wider bg-brand/10 px-3 py-1 rounded-full">
            Acczora Wallet
          </span>
          <div className="flex items-baseline gap-3">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
              ${currentPoints.toFixed(2)}
            </h2>
            <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              USD Balance
            </span>
          </div>
          <p className="text-xs text-gray-500 max-w-md">
            Use your wallet balance to purchase verified digital accounts instantly with zero checkout delays.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="brand"
            size="lg"
            rounded="xl"
            onClick={() => setIsDepositModalOpen(true)}
          >
            <Plus size={18} /> Deposit / Add Funds
          </Button>
          <LinkButton
            href="/marketplace"
            variant="outline"
            size="lg"
            rounded="xl"
          >
            Shop on Marketplace
          </LinkButton>
        </div>
      </div>

      {/* Quick Balance Packages */}
      <div className="bg-white p-6 rounded-2xl border border-border space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h5" className="font-bold text-gray-900 text-sm">Recommended Deposit Packages</Typography>
            <Caption className="text-gray-500">Select an amount to unlock bonus marketplace funds</Caption>
          </div>
          <span className="text-xs font-semibold text-brand flex items-center gap-1">
            <Sparkles size={14} /> Bonus Included
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.amount}
              onClick={() => {
                setDepositAmount(pkg.amount);
                setIsDepositModalOpen(true);
              }}
              className={`p-4 rounded-2xl border cursor-pointer transition-all hover:scale-[1.02] ${
                pkg.popular
                  ? "border-brand bg-brand/5 shadow-xs"
                  : "border-border hover:border-gray-400 bg-white"
              }`}
            >
              {pkg.popular && (
                <span className="text-[10px] font-bold text-white bg-brand px-2 py-0.5 rounded-full mb-2 inline-block">
                  Most Popular
                </span>
              )}
              {pkg.bestValue && (
                <span className="text-[10px] font-bold text-white bg-purple-600 px-2 py-0.5 rounded-full mb-2 inline-block">
                  Best Value
                </span>
              )}
              <div className="text-2xl font-black text-gray-900">${pkg.amount}</div>
              <Caption className="font-semibold text-gray-600 mt-1">
                Get ${pkg.amount + pkg.bonus} Balance
              </Caption>
              {pkg.bonus > 0 ? (
                <span className="text-[11px] font-bold text-emerald-600 mt-0.5 block">
                  +${pkg.bonus} Free Bonus
                </span>
              ) : (
                <span className="text-[11px] text-gray-400 mt-0.5 block">Standard</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Deposit History */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <Typography variant="h5" className="font-bold text-gray-900">Deposit History</Typography>
          <Caption className="text-gray-500">All credited payments and deposit transactions</Caption>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Deposit ID</TableHead>
              <TableHead>Payment Gateway</TableHead>
              <TableHead>Paid (USD)</TableHead>
              <TableHead>Credited (USD)</TableHead>
              <TableHead>Bonus</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deposits.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-mono text-xs font-semibold text-brand">
                  {item.id}
                </TableCell>
                <TableCell className="text-xs font-semibold text-gray-800">{item.method}</TableCell>
                <TableCell className="text-xs font-bold text-gray-900">{item.amountUsd}</TableCell>
                <TableCell className="text-xs font-bold text-emerald-600">{item.pointsReceived}</TableCell>
                <TableCell className="text-xs text-gray-500 font-semibold">{item.bonus}</TableCell>
                <TableCell className="text-xs text-gray-500">{item.date}</TableCell>
                <TableCell>
                  <Badge variant={item.status} dot>
                    Credited
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination in its own Card */}
      <Card className="bg-white p-4">
        <Pagination
          currentPage={currentPage}
          totalPages={1}
          totalItems={deposits.length}
          pageSize={pageSize}
          onPageChange={(p) => setCurrentPage(p)}
        />
      </Card>

      {/* Deposit Modal */}
      {isDepositModalOpen && (
        <Modal
          isOpen={isDepositModalOpen}
          onClose={() => setIsDepositModalOpen(false)}
          title="Deposit Funds to Wallet"
          maxWidth="max-w-md"
        >
          <form onSubmit={handleDepositSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                Deposit Amount ($ USD)
              </label>
              <Input
                type="number"
                min="5"
                step="1"
                required
                prefix={<span className="text-gray-400 font-bold">$</span>}
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
              />
              <p className="text-[11px] text-gray-500 mt-1">
                You will receive: <strong>${depositAmount}</strong> instant wallet balance
              </p>
            </div>

            <SearchableSelect
              label="Select Payment Gateway"
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              options={PAYMENT_GATEWAY_OPTIONS}
              placeholder="Select Payment Gateway"
              size="md"
              clearable={false}
              className="w-full text-xs"
            />

            <div className="p-3 bg-gray-50 rounded-xl border border-border text-xs text-gray-600 flex items-start gap-2">
              <ShieldCheck size={16} className="text-brand flex-shrink-0 mt-0.5" />
              <span>Funds are credited instantaneously to your wallet after payment verification.</span>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                rounded="xl"
                onClick={() => setIsDepositModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="brand"
                size="sm"
                rounded="xl"
              >
                Proceed to Pay (${depositAmount})
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

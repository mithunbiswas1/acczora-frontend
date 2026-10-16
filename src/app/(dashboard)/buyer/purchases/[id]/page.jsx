// src/app/(dashboard)/buyer/purchases/[id]/page.jsx

"use client";

import { use, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  ArrowLeft,
  ShieldCheck,
  Store,
  Calendar,
  CreditCard,
  Download,
  Copy,
  Check,
  Eye,
  EyeOff,
  Star,
  MessageSquare,
  AlertCircle,
  ExternalLink,
  Loader2,
  CheckCircle2,
  KeyRound,
  User,
  Lock,
  FileSpreadsheet,
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import LinkButton from "@/components/ui/LinkButton";
import Textarea from "@/components/ui/Textarea";
import EmptyState from "@/components/ui/EmptyState";
import { useGetOrderByIdQuery } from "@/redux/api/orderApi";
import {
  useGetBuyerReviewsQuery,
  useCreateReviewMutation,
} from "@/redux/api/reviewApi";
import { getSafeImageSrc } from "@/utils/imageUtils";
import { toast } from "sonner";

export default function BuyerOrderDetailsPage({ params }) {
  const unwrappedParams = use(params);
  const orderId = unwrappedParams.id;
  const router = useRouter();

  const { user, isLoggedIn } = useSelector((state) => state.auth);

  // Queries
  const { data: orderData, isLoading: isLoadingOrder, error } =
    useGetOrderByIdQuery(orderId, { skip: !orderId || !isLoggedIn });

  const { data: reviewsData, refetch: refetchReviews } =
    useGetBuyerReviewsQuery(undefined, { skip: !isLoggedIn });

  const [createReview, { isLoading: isSubmittingReview }] =
    useCreateReviewMutation();

  // Local state
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [revealedPasswords, setRevealedPasswords] = useState({});

  // Review Form State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const order = orderData?.data;

  // Find existing review for this order
  const existingReview = useMemo(() => {
    const list = Array.isArray(reviewsData?.data?.reviews)
      ? reviewsData.data.reviews
      : Array.isArray(reviewsData?.data)
      ? reviewsData.data
      : [];

    return list.find((r) => {
      const rOrderId = r.order?._id || r.order;
      return rOrderId?.toString() === orderId?.toString();
    });
  }, [reviewsData, orderId]);

  // Delivered credentials normalization (clean tabular structure, zero database IDs)
  const credentialsList = useMemo(() => {
    if (!order?.deliveredCredentials) return [];
    const list = Array.isArray(order.deliveredCredentials)
      ? order.deliveredCredentials
      : [order.deliveredCredentials];

    return list.map((item, idx) => {
      if (typeof item === "object" && item !== null) {
        const emailOrUser =
          item.email || item.username || item.user || item.login || "";
        const password = item.password || item.pass || "";
        const recoveryEmail =
          item.recoveryEmail || item.recovery || item.recovery_email || "";
        const twoFactor =
          item.twoFactor || item.twoFA || item["2fa"] || item.totp || "";

        // Strictly ignore all database/internal ID fields and known keys
        const ignoredKeys = new Set([
          "_id",
          "id",
          "credentialId",
          "credential_id",
          "deliveredAt",
          "createdAt",
          "updatedAt",
          "status",
          "__v",
          "email",
          "username",
          "user",
          "login",
          "password",
          "pass",
          "recoveryEmail",
          "recovery",
          "recovery_email",
          "twoFactor",
          "twoFA",
          "2fa",
          "totp",
        ]);

        const extraPairs = Object.entries(item)
          .filter(
            ([k, v]) =>
              !ignoredKeys.has(k) &&
              v !== undefined &&
              v !== null &&
              v !== ""
          )
          .map(([k, v]) => `${k}: ${v}`);

        const extra = extraPairs.join(" | ");

        // Build clean formatted line (email:password:recovery:2fa) WITHOUT any ID
        const parts = [];
        if (emailOrUser) parts.push(emailOrUser);
        if (password) parts.push(password);
        if (recoveryEmail) parts.push(recoveryEmail);
        if (twoFactor) parts.push(twoFactor);
        if (extra) parts.push(extra);
        const rawLine = parts.join(":");

        return {
          email: emailOrUser,
          password: password,
          recoveryEmail: recoveryEmail,
          twoFactor: twoFactor,
          extra: extra,
          raw: rawLine,
        };
      }

      // If plain text string (e.g. email:pass:recovery:2fa)
      const rawText = String(item || "").trim();
      const parts = rawText.split(/[:|\t]/);
      const email = parts[0]?.trim() || "";
      const password = parts[1]?.trim() || "";
      const recoveryEmail = parts[2]?.trim() || "";
      const twoFactor = parts[3]?.trim() || "";
      const extra = parts.slice(4).join(":").trim();

      return {
        email,
        password,
        recoveryEmail,
        twoFactor,
        extra,
        raw: rawText,
      };
    });
  }, [order]);

  const hasRecovery = useMemo(() => {
    return credentialsList.some((c) => Boolean(c.recoveryEmail));
  }, [credentialsList]);

  const hasTwoFactor = useMemo(() => {
    return credentialsList.some((c) => Boolean(c.twoFactor));
  }, [credentialsList]);

  const hasExtra = useMemo(() => {
    return credentialsList.some((c) => Boolean(c.extra));
  }, [credentialsList]);

  const [showAllPasswords, setShowAllPasswords] = useState(false);
  const handleToggleAllPasswords = () => {
    const nextState = !showAllPasswords;
    setShowAllPasswords(nextState);
    const updated = {};
    credentialsList.forEach((_, idx) => {
      updated[idx] = nextState;
    });
    setRevealedPasswords(updated);
  };

  // Actions
  const handleCopySingle = (text, idx) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = () => {
    if (!credentialsList.length) return;
    // Format as clean Tab-Separated Values (TSV) which pastes directly as columns into Excel
    const headers = ["#", "Email / Username", "Password"];
    if (hasRecovery) headers.push("Recovery Email");
    if (hasTwoFactor) headers.push("2FA / Secret");
    if (hasExtra) headers.push("Additional Info");

    const rows = credentialsList.map((item, idx) => {
      const row = [idx + 1, item.email, item.password];
      if (hasRecovery) row.push(item.recoveryEmail || "");
      if (hasTwoFactor) row.push(item.twoFactor || "");
      if (hasExtra) row.push(item.extra || "");
      return row.join("\t");
    });

    const tsvContent = [headers.join("\t"), ...rows].join("\n");
    navigator.clipboard.writeText(tsvContent);
    setCopiedAll(true);
    toast.success("All accounts copied! You can paste directly into Excel.");
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleDownloadCsv = () => {
    if (!credentialsList.length) return;
    const headers = ["#", "Email / Username", "Password"];
    if (hasRecovery) headers.push("Recovery Email");
    if (hasTwoFactor) headers.push("2FA / Secret");
    if (hasExtra) headers.push("Additional Info");

    const rows = credentialsList.map((item, idx) => {
      const row = [
        idx + 1,
        `"${(item.email || "").replace(/"/g, '""')}"`,
        `"${(item.password || "").replace(/"/g, '""')}"`,
      ];
      if (hasRecovery) {
        row.push(`"${(item.recoveryEmail || "").replace(/"/g, '""')}"`);
      }
      if (hasTwoFactor) {
        row.push(`"${(item.twoFactor || "").replace(/"/g, '""')}"`);
      }
      if (hasExtra) {
        row.push(`"${(item.extra || "").replace(/"/g, '""')}"`);
      }
      return row.join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `acczora-${order?.orderNumber || "order"}-accounts.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded Excel/CSV spreadsheet file!");
  };

  const handleDownloadTxt = () => {
    if (!credentialsList.length) return;
    const txtContent = credentialsList.map((c) => c.raw).join("\n");
    const blob = new Blob([txtContent], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `acczora-${order?.orderNumber || "order"}-credentials.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded credentials (.txt) file!");
  };

  const togglePasswordReveal = (idx) => {
    setRevealedPasswords((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please write a short review comment");
      return;
    }

    try {
      const productId = order?.product?._id || order?.product;
      await createReview({
        productId,
        orderId: order?._id || order?.id || orderId,
        rating,
        comment: comment.trim(),
      }).unwrap();

      toast.success(
        "Review submitted! It will appear publicly upon admin moderation."
      );
      if (refetchReviews) refetchReviews();
      setComment("");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to submit review");
    }
  };

  if (isLoadingOrder) {
    return (
      <div className="py-24 text-center space-y-3">
        <Loader2 className="w-9 h-9 text-brand animate-spin mx-auto" />
        <p className="text-xs text-gray-400">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-6">
        <Link
          href="/buyer/purchases"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={14} /> Back to My Purchases
        </Link>
        <EmptyState
          variant="error"
          title="Order not found"
          description="Could not locate this order or you do not have permission to view it."
          actionHref="/buyer/purchases"
          actionLabel="Back to Purchases"
        />
      </div>
    );
  }

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Recent";

  return (
    <div className="space-y-6 pb-20">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          href="/buyer/purchases"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={14} /> Back to My Purchases
        </Link>

        <div className="flex items-center gap-2">
          <Badge
            variant={order.status === "completed" ? "success" : "neutral"}
            className="text-xs px-2.5 py-1 capitalize font-semibold"
          >
            {order.status || "Completed"}
          </Badge>
          <span className="text-xs text-gray-400 font-mono font-medium">
            {order.orderNumber}
          </span>
        </div>
      </div>

      {/* Main Order Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-border flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-start sm:items-center gap-4">
          <div className="relative size-16 sm:size-18 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
            <img
              src={getSafeImageSrc(
                order.productThumbnail ||
                  order.product?.thumbnail ||
                  "/review_avater.jpg"
              )}
              alt={order.productTitle}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-1">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
              {order.productTitle || "Digital Product"}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
              <span className="flex items-center gap-1.5 font-medium text-gray-700">
                <Store size={13} className="text-gray-400" />
                {order.seller?.shopName ||
                  order.seller?.fullName ||
                  "Verified Merchant"}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar size={13} className="text-gray-400" />
                {formattedDate}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-row md:flex-col md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-gray-100 gap-1">
          <span className="text-xs text-gray-400">Total Paid</span>
          <div className="text-xl sm:text-2xl font-black text-gray-900">
            ${Number(order.totalAmount || 0).toFixed(2)}
          </div>
        </div>
      </div>

      {/* 2-Column Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Unlocked Account Credentials */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="p-6 bg-white border border-border shadow-xs rounded-2xl space-y-5">
            {/* Section Header with Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-gray-900">
                    Delivered Digital Accounts
                  </h2>
                  <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {credentialsList.length} Account{credentialsList.length === 1 ? "" : "s"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Your credentials have been auto-delivered in spreadsheet format. You can copy, reveal, or export directly to Excel.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  rounded="xl"
                  onClick={handleCopyAll}
                  disabled={credentialsList.length === 0}
                  className="text-xs"
                >
                  {copiedAll ? (
                    <>
                      <Check size={13} className="text-emerald-600" />
                      <span className="text-emerald-600 font-semibold">
                        Copied All
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>Copy All</span>
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  rounded="xl"
                  onClick={handleDownloadCsv}
                  disabled={credentialsList.length === 0}
                  className="text-xs text-emerald-700 hover:text-emerald-800 border-emerald-200 hover:bg-emerald-50"
                >
                  <FileSpreadsheet size={13} />
                  <span>Export Excel (.csv)</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  rounded="xl"
                  onClick={handleDownloadTxt}
                  disabled={credentialsList.length === 0}
                  className="text-xs"
                >
                  <Download size={13} />
                  <span>Download .txt</span>
                </Button>
              </div>
            </div>

            {/* Excel Table Representation */}
            {credentialsList.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                No credentials found for this order.
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-gray-300 bg-white shadow-2xs">
                {/* Excel Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-gray-50 border-b border-gray-300 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-[11px] tracking-wide">
                      <FileSpreadsheet size={13} className="text-emerald-600" />
                      Excel Spreadsheet Table
                    </span>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-500 font-medium text-[11px]">
                      {credentialsList.length} item(s) loaded
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleToggleAllPasswords}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-gray-200 hover:border-gray-300 text-gray-700 text-[11px] font-semibold transition-colors cursor-pointer shadow-2xs"
                  >
                    {showAllPasswords ? (
                      <>
                        <EyeOff size={12} className="text-gray-500" />
                        <span>Hide All Passwords</span>
                      </>
                    ) : (
                      <>
                        <Eye size={12} className="text-gray-500" />
                        <span>Show All Passwords</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Table Sheet */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#F8FAFC] text-gray-700 font-bold border-b border-gray-300 select-none">
                        <th className="w-12 px-3 py-2.5 text-center border-r border-gray-300 text-[11px] text-gray-500 font-mono bg-gray-100">
                          #
                        </th>
                        <th className="px-4 py-2.5 border-r border-gray-300 text-[11px] uppercase tracking-wider font-bold">
                          Email / Username
                        </th>
                        <th className="px-4 py-2.5 border-r border-gray-300 text-[11px] uppercase tracking-wider font-bold">
                          Password
                        </th>
                        {hasRecovery && (
                          <th className="px-4 py-2.5 border-r border-gray-300 text-[11px] uppercase tracking-wider font-bold">
                            Recovery Email
                          </th>
                        )}
                        {hasTwoFactor && (
                          <th className="px-4 py-2.5 border-r border-gray-300 text-[11px] uppercase tracking-wider font-bold">
                            2FA / Secret Code
                          </th>
                        )}
                        {hasExtra && (
                          <th className="px-4 py-2.5 border-r border-gray-300 text-[11px] uppercase tracking-wider font-bold">
                            Additional Info
                          </th>
                        )}
                        <th className="w-24 px-4 py-2.5 text-center text-[11px] uppercase tracking-wider font-bold">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white font-mono">
                      {credentialsList.map((item, idx) => {
                        const isRevealed = revealedPasswords[idx];

                        return (
                          <tr
                            key={idx}
                            className="hover:bg-blue-50/40 transition-colors group"
                          >
                            {/* Row Index */}
                            <td className="px-3 py-2.5 text-center text-gray-500 font-semibold border-r border-gray-200 bg-gray-50/70 select-none text-[11px]">
                              {idx + 1}
                            </td>

                            {/* Email / Username */}
                            <td className="px-4 py-2.5 text-gray-900 font-semibold border-r border-gray-200">
                              <div className="flex items-center justify-between gap-2">
                                <span className="truncate select-all">
                                  {item.email || "—"}
                                </span>
                                {item.email && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleCopySingle(item.email, `email-${idx}`)
                                    }
                                    className="text-gray-400 hover:text-brand transition-colors p-1 rounded hover:bg-gray-100 cursor-pointer flex-shrink-0"
                                    title="Copy Email / Username"
                                  >
                                    {copiedIndex === `email-${idx}` ? (
                                      <Check size={12} className="text-emerald-600" />
                                    ) : (
                                      <Copy size={12} />
                                    )}
                                  </button>
                                )}
                              </div>
                            </td>

                            {/* Password */}
                            <td className="px-4 py-2.5 text-gray-900 border-r border-gray-200">
                              <div className="flex items-center justify-between gap-2">
                                <span className="truncate select-all">
                                  {isRevealed
                                    ? item.password
                                    : "••••••••••••"}
                                </span>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => togglePasswordReveal(idx)}
                                    className="text-gray-400 hover:text-gray-700 transition-colors p-1 rounded hover:bg-gray-100 cursor-pointer"
                                    title={
                                      isRevealed
                                        ? "Hide Password"
                                        : "Show Password"
                                    }
                                  >
                                    {isRevealed ? (
                                      <EyeOff size={12} />
                                    ) : (
                                      <Eye size={12} />
                                    )}
                                  </button>
                                  {item.password && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleCopySingle(
                                          item.password,
                                          `pass-${idx}`
                                        )
                                      }
                                      className="text-gray-400 hover:text-brand transition-colors p-1 rounded hover:bg-gray-100 cursor-pointer"
                                      title="Copy Password"
                                    >
                                      {copiedIndex === `pass-${idx}` ? (
                                        <Check
                                          size={12}
                                          className="text-emerald-600"
                                        />
                                      ) : (
                                        <Copy size={12} />
                                      )}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Recovery Email */}
                            {hasRecovery && (
                              <td className="px-4 py-2.5 text-gray-700 border-r border-gray-200">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="truncate select-all">
                                    {item.recoveryEmail || (
                                      <span className="text-gray-300 font-sans">
                                        —
                                      </span>
                                    )}
                                  </span>
                                  {item.recoveryEmail && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleCopySingle(
                                          item.recoveryEmail,
                                          `rec-${idx}`
                                        )
                                      }
                                      className="text-gray-400 hover:text-brand transition-colors p-1 rounded hover:bg-gray-100 cursor-pointer flex-shrink-0"
                                      title="Copy Recovery Email"
                                    >
                                      {copiedIndex === `rec-${idx}` ? (
                                        <Check
                                          size={12}
                                          className="text-emerald-600"
                                        />
                                      ) : (
                                        <Copy size={12} />
                                      )}
                                    </button>
                                  )}
                                </div>
                              </td>
                            )}

                            {/* 2FA / Code */}
                            {hasTwoFactor && (
                              <td className="px-4 py-2.5 text-gray-700 border-r border-gray-200">
                                <div className="flex items-center justify-between gap-2">
                                  {item.twoFactor ? (
                                    <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold select-all">
                                      {item.twoFactor}
                                    </span>
                                  ) : (
                                    <span className="text-gray-300 font-sans">
                                      —
                                    </span>
                                  )}
                                  {item.twoFactor && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleCopySingle(
                                          item.twoFactor,
                                          `2fa-${idx}`
                                        )
                                      }
                                      className="text-gray-400 hover:text-brand transition-colors p-1 rounded hover:bg-gray-100 cursor-pointer flex-shrink-0"
                                      title="Copy 2FA Code"
                                    >
                                      {copiedIndex === `2fa-${idx}` ? (
                                        <Check
                                          size={12}
                                          className="text-emerald-600"
                                        />
                                      ) : (
                                        <Copy size={12} />
                                      )}
                                    </button>
                                  )}
                                </div>
                              </td>
                            )}

                            {/* Extra Details */}
                            {hasExtra && (
                              <td className="px-4 py-2.5 text-gray-600 border-r border-gray-200 text-[11px]">
                                {item.extra || (
                                  <span className="text-gray-300 font-sans">
                                    —
                                  </span>
                                )}
                              </td>
                            )}

                            {/* Copy Row Action */}
                            <td className="px-3 py-2.5 text-center">
                              <button
                                type="button"
                                onClick={() =>
                                  handleCopySingle(item.raw, `row-${idx}`)
                                }
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold text-brand hover:bg-brand/10 transition-colors cursor-pointer border border-brand/20 bg-white"
                                title="Copy complete account credentials"
                              >
                                {copiedIndex === `row-${idx}` ? (
                                  <>
                                    <Check
                                      size={11}
                                      className="text-emerald-600"
                                    />
                                    <span className="text-emerald-600">
                                      Copied
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <Copy size={11} />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </Card>

          {/* Product Review Section */}
          <Card className="p-6 bg-white border border-border shadow-xs rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Buyer Review & Feedback
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Share your experience with this seller to help other buyers.
                </p>
              </div>
              <MessageSquare size={18} className="text-gray-400" />
            </div>

            {existingReview ? (
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={14}
                        className={
                          s <= existingReview.rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                    <span className="font-bold text-gray-800 ml-1.5">
                      {existingReview.rating} / 5
                    </span>
                  </div>
                  <Badge
                    variant={
                      existingReview.status === "approved"
                        ? "success"
                        : "warning"
                    }
                    className="text-[10px] capitalize"
                  >
                    {existingReview.status === "approved"
                      ? "Approved & Public"
                      : "Pending Moderation"}
                  </Badge>
                </div>
                <p className="text-gray-700 font-medium pt-1 italic">
                  &ldquo;{existingReview.comment}&rdquo;
                </p>
                {existingReview.sellerReply && (
                  <div className="p-2.5 rounded-lg bg-white border border-gray-200 mt-2 text-[11px] text-gray-600">
                    <span className="font-bold text-brand">Seller Reply:</span>{" "}
                    {existingReview.sellerReply}
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 text-gray-300 hover:text-amber-400 transition-colors cursor-pointer"
                      >
                        <Star
                          size={22}
                          className={
                            star <= (hoverRating || rating)
                              ? "text-amber-400 fill-amber-400"
                              : "text-gray-300"
                          }
                        />
                      </button>
                    ))}
                    <span className="text-xs font-semibold text-gray-500 ml-2">
                      {rating} Star{rating > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Your Feedback
                  </label>
                  <Textarea
                    placeholder="Describe account functionality, delivery speed, and overall satisfaction..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    className="text-xs"
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="brand"
                    size="sm"
                    rounded="xl"
                    disabled={isSubmittingReview || !comment.trim()}
                  >
                    {isSubmittingReview ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin mr-1.5" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <span>Submit Review</span>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>

        {/* Right Column (4 cols): Order Info & Security Advice */}
        <div className="lg:col-span-4 space-y-6">
          {/* Order Summary Card */}
          <Card className="p-6 bg-white border border-border shadow-xs rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
              Order Receipt Summary
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-gray-600">
                <span>Order Number:</span>
                <span className="font-mono font-semibold text-gray-900">
                  {order.orderNumber}
                </span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>Quantity:</span>
                <span className="font-semibold text-gray-900">
                  {order.quantity} account(s)
                </span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>Unit Price:</span>
                <span className="font-semibold text-gray-900">
                  ${Number(order.unitPrice || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>Payment Method:</span>
                <span className="font-semibold text-brand">
                  Acczora Wallet (Instant)
                </span>
              </div>
              <div className="flex items-center justify-between text-gray-600 pt-2 border-t border-gray-100 font-bold">
                <span className="text-gray-900">Total Deducted:</span>
                <span className="text-emerald-600">
                  ${Number(order.totalAmount || 0).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <LinkButton
                href={`/product/${order.product?.slug || order.product?._id || order.product || ""}`}
                variant="outline"
                size="sm"
                rounded="xl"
                className="w-full text-xs"
              >
                <span>View Product Page</span>
                <ExternalLink size={12} />
              </LinkButton>
            </div>
          </Card>

          {/* Security & Warranty Notice Card */}
          <Card className="p-6 bg-emerald-50/50 border border-emerald-200/80 shadow-xs rounded-2xl space-y-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-800 font-bold">
              <ShieldCheck size={18} className="text-emerald-600 flex-shrink-0" />
              <span>Buyer Warranty Active</span>
            </div>
            <p className="text-emerald-900/80 leading-relaxed text-[11px]">
              This digital product was auto-delivered directly from verified inventory.
              Please change the account credentials immediately to secure ownership.
            </p>
            <div className="space-y-1.5 pt-1 text-[11px] text-gray-600">
              <div className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Test your login credentials within 24 hours.</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Update recovery email and password right away.</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                <span>If invalid, contact support or file a dispute.</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

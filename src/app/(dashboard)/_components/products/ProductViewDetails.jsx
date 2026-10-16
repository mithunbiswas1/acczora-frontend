// src/app/(dashboard)/_components/products/ProductViewDetails.jsx

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Copy,
  Check,
  Edit,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Loader2,
  Package,
  Layers,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import LinkButton from "@/components/ui/LinkButton";
import Badge from "@/components/ui/Badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import SearchInput from "@/components/ui/SearchInput";
import Pagination from "@/components/ui/Pagination";
import EmptyState from "@/components/ui/EmptyState";
import { useGetProductByIdQuery } from "@/redux/api/productApi";
import { toast } from "sonner";

export default function ProductViewDetails({
  productId,
  basePath = "/seller/products",
}) {
  const { data: productData, isLoading } = useGetProductByIdQuery(productId, {
    skip: !productId,
  });

  const product = productData?.data || {};

  const [activeTab, setActiveTab] = useState("all"); // "all" | "available" | "sold"
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [revealedPasswords, setRevealedPasswords] = useState({});
  const [copiedIndex, setCopiedIndex] = useState(null);

  const rawCredentials = useMemo(() => {
    return Array.isArray(product.uploadedInfo) ? product.uploadedInfo : [];
  }, [product.uploadedInfo]);

  // Statistics
  const totalCount = rawCredentials.length;
  const availableCount = rawCredentials.filter((c) => c.isSold !== true).length;
  const soldCount = rawCredentials.filter((c) => c.isSold === true).length;

  // Filtered credentials based on Tab and Search
  const filteredCredentials = useMemo(() => {
    return rawCredentials.filter((item) => {
      // Tab filter
      if (activeTab === "available" && item.isSold === true) return false;
      if (activeTab === "sold" && item.isSold !== true) return false;

      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesEmail = item.email?.toLowerCase().includes(q);
        const matchesRecovery = item.recoveryEmail?.toLowerCase().includes(q);
        if (!matchesEmail && !matchesRecovery) return false;
      }

      return true;
    });
  }, [rawCredentials, activeTab, search]);

  // Pagination
  const totalItems = filteredCredentials.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCredentials.slice(start, start + pageSize);
  }, [filteredCredentials, currentPage, pageSize]);

  const togglePasswordReveal = (idx) => {
    setRevealedPasswords((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const copyToClipboard = (text, idx) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (isLoading) {
    return (
      <Card className="p-16 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#5b52f9] animate-spin mx-auto" />
        <p className="text-xs text-gray-400">Loading product inventory...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <PageHeader
        title={product.title || "Product Details"}
        description={`Category: ${
          product.categoryName || product.category?.name || "Digital Account"
        } • Price: $${product.salePrice || product.price || 0}`}
        action={
          <div className="flex items-center gap-2.5">
            <LinkButton
              href={basePath}
              variant="outline-border"
              size="default"
              rounded="xl"
            >
              Back to List
            </LinkButton>
            <LinkButton
              href={`${basePath}/edit/${productId}`}
              variant="brand"
              size="default"
              rounded="xl"
            >
              <Edit size={14} />
              <span>Edit Product</span>
            </LinkButton>
          </div>
        }
      />

      {/* Top Inventory Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 sm:p-5 flex items-center gap-3.5 bg-white">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-[#5b52f9] flex items-center justify-center flex-shrink-0">
            <Package size={20} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Total Uploaded
            </p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-0.5">
              {totalCount}
            </p>
          </div>
        </Card>

        <Card className="p-4 sm:p-5 flex items-center gap-3.5 bg-white">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">
              Available Stock
            </p>
            <p className="text-xl sm:text-2xl font-bold text-emerald-700 mt-0.5">
              {availableCount}
            </p>
          </div>
        </Card>

        <Card className="p-4 sm:p-5 flex items-center gap-3.5 bg-white">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
              Sold Accounts
            </p>
            <p className="text-xl sm:text-2xl font-bold text-blue-700 mt-0.5">
              {soldCount}
            </p>
          </div>
        </Card>

        <Card className="p-4 sm:p-5 flex items-center gap-3.5 bg-white">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <DollarSign size={20} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider">
              Price per Unit
            </p>
            {(() => {
              const regularPrice = Number(product.price || 0);
              const salePrice = Number(product.salePrice || product.discountPrice || 0);
              const hasDiscount = salePrice > 0 && salePrice < regularPrice;
              const activePrice = hasDiscount ? salePrice : regularPrice;

              return (
                <div className="flex items-baseline gap-2 mt-0.5">
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    ${activePrice.toFixed(2)}
                  </p>
                  {hasDiscount && (
                    <span className="text-sm font-medium text-gray-400 line-through">
                      ${regularPrice.toFixed(2)}
                    </span>
                  )}
                  {hasDiscount && (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded-full">
                      {Math.round(((regularPrice - activePrice) / regularPrice) * 100)}% OFF
                    </span>
                  )}
                </div>
              );
            })()}
          </div>
        </Card>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-2 bg-gray-100/80 p-1 rounded-xl w-fit">
          <button
            type="button"
            onClick={() => {
              setActiveTab("all");
              setCurrentPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-white text-gray-900 shadow-xs"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            All Accounts ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("available");
              setCurrentPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "available"
                ? "bg-white text-emerald-700 shadow-xs"
                : "text-gray-500 hover:text-emerald-700"
            }`}
          >
            Available ({availableCount})
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("sold");
              setCurrentPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "sold"
                ? "bg-white text-blue-700 shadow-xs"
                : "text-gray-500 hover:text-blue-700"
            }`}
          >
            Sold ({soldCount})
          </button>
        </div>

        {/* Search */}
        <div className="w-full sm:w-72">
          <SearchInput
            placeholder="Search email or username..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Credentials Table Card */}
      <Card className="overflow-hidden bg-white border border-border shadow-xs">
        {totalItems === 0 ? (
          <EmptyState
            variant="search"
            title="No credentials found"
            description="No accounts match your current filter or search criteria."
            onClear={() => {
              setSearch("");
              setActiveTab("all");
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/60 border-b border-gray-100">
                  <TableHead className="py-3 px-4 text-xs font-bold text-gray-700">
                    #
                  </TableHead>
                  <TableHead className="py-3 px-4 text-xs font-bold text-gray-700">
                    Email / Account
                  </TableHead>
                  <TableHead className="py-3 px-4 text-xs font-bold text-gray-700">
                    Password
                  </TableHead>
                  <TableHead className="py-3 px-4 text-xs font-bold text-gray-700">
                    Recovery Email
                  </TableHead>
                  <TableHead className="py-3 px-4 text-xs font-bold text-gray-700">
                    2FA / Pin
                  </TableHead>
                  <TableHead className="py-3 px-4 text-xs font-bold text-gray-700">
                    Status
                  </TableHead>
                  <TableHead className="py-3 px-4 text-xs font-bold text-gray-700">
                    Sold At
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedList.map((item, idx) => {
                  const globalIdx = (currentPage - 1) * pageSize + idx;
                  const isPasswordRevealed = !!revealedPasswords[globalIdx];

                  return (
                    <TableRow
                      key={item._id || idx}
                      className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/40 transition-colors text-xs"
                    >
                      <TableCell className="py-3.5 px-4 text-gray-400 font-mono">
                        {globalIdx + 1}
                      </TableCell>

                      {/* Email */}
                      <TableCell className="py-3.5 px-4 font-medium text-gray-900">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono">{item.email}</span>
                          <button
                            type="button"
                            onClick={() =>
                              copyToClipboard(item.email, `e-${globalIdx}`)
                            }
                            className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                            title="Copy email"
                          >
                            {copiedIndex === `e-${globalIdx}` ? (
                              <Check size={12} className="text-emerald-500" />
                            ) : (
                              <Copy size={12} />
                            )}
                          </button>
                        </div>
                      </TableCell>

                      {/* Password */}
                      <TableCell className="py-3.5 px-4 font-mono">
                        <div className="flex items-center gap-2">
                          <span>
                            {isPasswordRevealed
                              ? item.password
                              : "••••••••••••"}
                          </span>
                          <button
                            type="button"
                            onClick={() => togglePasswordReveal(globalIdx)}
                            className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                            title={
                              isPasswordRevealed
                                ? "Hide password"
                                : "Reveal password"
                            }
                          >
                            {isPasswordRevealed ? (
                              <EyeOff size={13} />
                            ) : (
                              <Eye size={13} />
                            )}
                          </button>
                        </div>
                      </TableCell>

                      {/* Recovery */}
                      <TableCell className="py-3.5 px-4 text-gray-500 font-mono">
                        {item.recoveryEmail || "—"}
                      </TableCell>

                      {/* 2FA */}
                      <TableCell className="py-3.5 px-4 text-gray-500 font-mono">
                        {item.twoFactor || "—"}
                      </TableCell>

                      {/* Status Badge */}
                      <TableCell className="py-3.5 px-4">
                        {item.isSold ? (
                          <Badge variant="neutral" className="text-[10px]">
                            Sold
                          </Badge>
                        ) : (
                          <Badge variant="success" className="text-[10px]">
                            Available
                          </Badge>
                        )}
                      </TableCell>

                      {/* Sold At */}
                      <TableCell className="py-3.5 px-4 text-gray-400 text-[11px]">
                        {item.soldAt
                          ? new Date(item.soldAt).toLocaleDateString()
                          : "—"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Pagination in separate Card */}
      {totalItems > 0 && (
        <Card className="bg-white p-4 border border-border shadow-xs">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={(p) => setCurrentPage(p)}
            showAlways={totalItems > 0}
          />
        </Card>
      )}
    </div>
  );
}

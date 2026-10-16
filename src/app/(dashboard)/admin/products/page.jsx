// src/app/(dashboard)/admin/products/page.jsx

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  SquarePen,
  Eye,
  Trash2,
  Copy,
  Check,
  KeyRound,
  ShieldCheck,
  Mail,
  Lock,
  Loader2,
  Store,
} from "lucide-react";
import { toast } from "sonner";
import BrandIcon from "../../_components/BrandIcon";
import Modal from "@/components/ui/Modal";
import DeleteModal from "@/components/ui/DeleteModal";
import Pagination from "@/components/ui/Pagination";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import LinkButton from "@/components/ui/LinkButton";
import PageHeader from "@/components/ui/PageHeader";
import SearchInput from "@/components/ui/SearchInput";
import SearchableSelect from "@/components/ui/SearchableSelect";
import Textarea from "@/components/ui/Textarea";
import EmptyState from "@/components/ui/EmptyState";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import {
  useGetAllProductsQuery,
  useToggleProductStatusMutation,
  useDeleteProductMutation,
} from "@/redux/api/productApi";
import { useGetAllCategoriesQuery } from "@/redux/api/categoryApi";

const PRODUCT_STATUS_OPTIONS = [
  { label: "All Status", value: "all" },
  { label: "Active", value: "active" },
  { label: "Suspend", value: "suspend" },
  { label: "Draft", value: "draft" },
  { label: "Deactivate", value: "deactivate" },
];

const PRODUCT_SORT_OPTIONS = [
  { label: "Sort by", value: "default" },
  { label: "Sales", value: "sales" },
  { label: "Price: Low to High", value: "price_low" },
  { label: "Price: High to Low", value: "price_high" },
];

export default function AdminProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Selected state for Modals
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  // RTK Query API - Admin gets ALL products from all sellers
  const { data: apiResponse, isLoading: isLoadingProducts, isFetching } = useGetAllProductsQuery();
  const { data: categoriesResponse } = useGetAllCategoriesQuery();
  const [toggleStatus] = useToggleProductStatusMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const realCategories = useMemo(() => {
    const list = categoriesResponse?.data?.categories || categoriesResponse?.data || [];
    return Array.isArray(list) ? list : [];
  }, [categoriesResponse]);

  const categoryOptions = useMemo(() => {
    return [
      { label: "All Categories", value: "all" },
      ...realCategories.map((c) => ({ label: c.name, value: c.name })),
    ];
  }, [realCategories]);

  const apiProducts = apiResponse?.data?.products || apiResponse?.data || [];
  const rawProducts = useMemo(() => {
    return Array.isArray(apiProducts) ? apiProducts : [];
  }, [apiProducts]);

  // Filter & Search
  const filteredProducts = useMemo(() => {
    let list = rawProducts.map((p) => ({
      ...p,
      date: p.createdAt
        ? new Date(p.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })
        : "Recent",
      salesCount: p.sales ?? p.salesCount ?? 0,
      categoryName: p.category?.name || p.categoryName || p.category || "Uncategorized",
      sellerName: p.seller?.shopName || p.seller?.fullName || p.seller?.userName || "Admin Store",
      displayPrice: p.price ?? 0,
      originalPrice: p.salePrice ? `$${p.price}` : null,
      effectivePrice: p.salePrice ? p.salePrice : p.price ?? 0,
    }));

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (p) =>
          (p.title || "").toLowerCase().includes(q) ||
          (p.slug || "").toLowerCase().includes(q) ||
          (p.categoryName || "").toLowerCase().includes(q) ||
          (p.sellerName || "").toLowerCase().includes(q)
      );
    }

    if (categoryFilter !== "all") {
      list = list.filter(
        (p) =>
          (p.categoryName || "").toLowerCase() === categoryFilter.toLowerCase() ||
          p.category?._id === categoryFilter ||
          p.category === categoryFilter
      );
    }

    if (statusFilter !== "all") {
      list = list.filter(
        (p) => (p.status || "active").toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (sortBy === "sales") {
      list = [...list].sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
    } else if (sortBy === "price_low") {
      list = [...list].sort((a, b) => (Number(a.effectivePrice) || 0) - (Number(b.effectivePrice) || 0));
    } else if (sortBy === "price_high") {
      list = [...list].sort((a, b) => (Number(b.effectivePrice) || 0) - (Number(a.effectivePrice) || 0));
    } else {
      list = [...list].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    return list;
  }, [rawProducts, searchTerm, categoryFilter, statusFilter, sortBy]);

  const isFiltering = Boolean(
    searchTerm.trim() || categoryFilter !== "all" || statusFilter !== "all" || sortBy !== "default"
  );

  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleToggle = async (product) => {
    try {
      await toggleStatus(product._id).unwrap();
      toast.success(`Updated status for ${product.title}`);
    } catch {
      toast.error(`Failed to update status for ${product.title}`);
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    setIsDeleting(true);
    try {
      await deleteProduct(selectedProduct._id).unwrap();
      toast.success("Product deleted successfully");
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleCopyCredentials = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Credentials copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* 1. Header: Page Title + Add Product Action */}
      <PageHeader
        title="All Marketplace Products"
        description="Global catalog of digital assets, accounts, and inventory across all marketplace sellers."
        action={
          <LinkButton
            href="/admin/products/add"
            variant="brand"
            size="default"
            rounded="xl"
            className="gap-1.5 shadow-xs"
          >
            <Plus size={15} className="stroke-[2.5]" />
            <span>Add Product</span>
          </LinkButton>
        }
      />

      {/* 2. Filter Bar: Search Input + Status + Category + Sort by (Outside Table Card) */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input Box */}
        <SearchInput
          placeholder="Search product, seller, or category..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          size="sm"
          className="flex-1"
        />

        {/* 3 Dropdown Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Dropdown */}
          <SearchableSelect
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            options={PRODUCT_STATUS_OPTIONS}
            placeholder="Status"
            size="sm"
            clearable={false}
            className="w-32"
          />

          {/* Category Dropdown */}
          <SearchableSelect
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            options={categoryOptions}
            placeholder="Category"
            size="sm"
            clearable={false}
            className="w-36"
          />

          {/* Sort by Dropdown */}
          <SearchableSelect
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={PRODUCT_SORT_OPTIONS}
            placeholder="Sort by"
            size="sm"
            clearable={false}
            className="w-36"
          />
        </div>
      </div>

      {/* 3. Products Table in Reusable Card */}
      <Card className="p-0 overflow-hidden border border-border bg-white shadow-xs">
        {isLoadingProducts ? (
          <div className="py-24 flex flex-col items-center justify-center gap-2 text-gray-400">
            <Loader2 size={26} className="animate-spin text-[#5b52f9]" />
            <span className="text-xs">Loading marketplace products...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          isFiltering ? (
            <EmptyState
              variant="search"
              itemType="products"
              title="No products found"
              description="We couldn't find any products matching your search or filters."
              onClear={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setCategoryFilter("all");
                setSortBy("default");
                setCurrentPage(1);
              }}
            />
          ) : (
            <EmptyState
              variant="empty"
              itemType="products"
              title="No products yet"
              description="Start selling by adding your first product."
              actionHref="/admin/products/add"
              actionLabel="Add Product"
            />
          )
        ) : (
          <>
            {/* Card Header Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-900">
                Products ({totalItems})
              </h2>
              <span className="text-xs text-gray-400">
                Showing all marketplace sellers
              </span>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-100 text-xs font-normal text-gray-400">
                    <TableHead className="py-3 px-6 font-normal text-left text-gray-400">
                      Product
                    </TableHead>
                    <TableHead className="py-3 px-6 font-normal text-left text-gray-400">
                      Seller
                    </TableHead>
                    <TableHead className="py-3 px-6 font-normal text-left text-gray-400">
                      Amount
                    </TableHead>
                    <TableHead className="py-3 px-6 font-normal text-left text-gray-400">
                      Sales
                    </TableHead>
                    <TableHead className="py-3 px-6 font-normal text-left text-gray-400">
                      Status
                    </TableHead>
                    <TableHead className="py-3 px-6 font-normal text-left text-gray-400">
                      Date
                    </TableHead>
                    <TableHead className="py-3 px-6 text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-100/80 text-xs">
                  {paginatedProducts.map((product) => {
                    const s = (product.status || "active").toLowerCase();
                    const isDeactivated = s === "deactivate" || s === "inactive";
                    const isSuspend = s === "suspend";

                    const displayImage =
                      product.thumbnail ||
                      product.media?.[0]?.url ||
                      product.images?.[0] ||
                      (typeof product.media?.[0] === "string" ? product.media[0] : null);

                    return (
                      <TableRow
                        key={product._id}
                        className="hover:bg-gray-50/60 transition-colors"
                      >
                        {/* Product Name + Icon + Category Subtitle */}
                        <TableCell className="py-3.5 px-6">
                          <div className="flex items-center gap-3">
                            <BrandIcon
                              name={product.platform || product.title}
                              image={displayImage}
                              size={32}
                            />
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 text-xs truncate">
                                {product.title}
                              </p>
                              <p className="text-[11px] text-gray-400 truncate">
                                {product.categoryName}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Seller Name */}
                        <TableCell className="py-3.5 px-6">
                          <div className="flex items-center gap-1.5 text-xs text-gray-700">
                            <Store size={12} className="text-[#5b52f9] flex-shrink-0" />
                            <span className="font-medium truncate max-w-[120px]">
                              {product.sellerName}
                            </span>
                          </div>
                        </TableCell>

                        {/* Amount */}
                        <TableCell className="py-3.5 px-6">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-gray-900 text-xs">
                              ${Number(product.effectivePrice).toFixed(2).replace(/\.00$/, "")}
                            </span>
                            {product.originalPrice && (
                              <span className="text-[11px] text-gray-400 font-normal line-through">
                                {product.originalPrice}
                              </span>
                            )}
                          </div>
                        </TableCell>

                        {/* Sales count */}
                        <TableCell className="py-3.5 px-6 font-normal text-gray-600">
                          {product.salesCount}
                        </TableCell>

                        {/* Status Pill */}
                        <TableCell className="py-3.5 px-6">
                          <Badge variant={s} size="sm">
                            {s === "active"
                              ? "Active"
                              : s === "draft"
                              ? "Draft"
                              : s === "suspend"
                              ? "Suspend"
                              : s === "deactivate"
                              ? "Deactivate"
                              : product.status || "Active"}
                          </Badge>
                        </TableCell>

                        {/* Date */}
                        <TableCell className="py-3.5 px-6 text-gray-500 font-normal whitespace-nowrap">
                          {product.date}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="py-3.5 px-6 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-2">
                            {/* 1. Edit */}
                            <Link
                              href={`/admin/products/edit/${product._id}`}
                              className="p-1 text-gray-400 hover:text-gray-700 transition-colors"
                              title="Edit Product"
                            >
                              <SquarePen size={14} className="stroke-[1.8]" />
                            </Link>

                            {/* 2. View Credentials */}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedProduct(product);
                                setIsCredentialsModalOpen(true);
                              }}
                              className="p-1 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                              title="View Credentials"
                            >
                              <Eye size={14} className="stroke-[1.8]" />
                            </button>

                            {/* 3. Status Circle Button */}
                            <button
                              type="button"
                              onClick={() => handleToggle(product)}
                              className="p-0.5 cursor-pointer hover:scale-110 transition-transform"
                              title={isDeactivated ? "Activate Product" : "Deactivate / Suspend Product"}
                            >
                              {isDeactivated ? (
                                <div className="w-[18px] h-[18px] rounded-full bg-[#34d399] text-white flex items-center justify-center shadow-xs">
                                  <span className="text-[10px] font-bold leading-none select-none">✓</span>
                                </div>
                              ) : isSuspend ? (
                                <div className="w-[18px] h-[18px] rounded-full bg-[#d1d5db] text-white flex items-center justify-center shadow-xs">
                                  <span className="text-[9px] font-bold leading-none select-none">✕</span>
                                </div>
                              ) : (
                                <div className="w-[18px] h-[18px] rounded-full bg-[#f87171] text-white flex items-center justify-center shadow-xs">
                                  <span className="text-[9px] font-bold leading-none select-none">✕</span>
                                </div>
                              )}
                            </button>

                            {/* 4. Delete */}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedProduct(product);
                                setIsDeleteModalOpen(true);
                              }}
                              className="p-1 text-[#f87171] hover:text-[#ef4444] transition-colors cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 size={14} className="stroke-[1.8]" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </Card>

      {/* 4. Pagination in its own Card */}
      {totalItems > 0 && (
        <Card className="bg-white p-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={(page) => setCurrentPage(page)}
            showAlways={totalItems > 0}
          />
        </Card>
      )}

      {/* Reusable Delete Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedProduct(null);
        }}
        onConfirm={handleDelete}
        title="Delete Product?"
        itemName={selectedProduct?.title}
        itemType="product"
        isLoading={isDeleting}
      />

      {/* Credentials Modal */}
      {isCredentialsModalOpen && selectedProduct && (
        <Modal
          isOpen={isCredentialsModalOpen}
          onClose={() => {
            setIsCredentialsModalOpen(false);
            setSelectedProduct(null);
          }}
          title={selectedProduct.title}
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Digital Delivery Format
              </span>
              <span className="text-xs text-brand font-semibold">
                {selectedProduct.uploadedInfo?.length || 1} Account(s) in Stock
              </span>
            </div>

            {selectedProduct.uploadedInfo && selectedProduct.uploadedInfo.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {selectedProduct.uploadedInfo.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-700">Account #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyCredentials(
                            `Email: ${item.email}\nPassword: ${item.password}${
                              item.recoveryEmail ? `\nRecovery: ${item.recoveryEmail}` : ""
                            }${item.twoFactor ? `\n2FA: ${item.twoFactor}` : ""}`
                          )
                        }
                        className="text-brand hover:underline font-medium text-[11px] flex items-center gap-1 cursor-pointer"
                      >
                        <Copy size={11} /> Copy All
                      </button>
                    </div>

                    <div className="font-mono text-gray-600 space-y-0.5">
                      <div>
                        <span className="text-gray-400">Email: </span>
                        {item.email}
                      </div>
                      <div>
                        <span className="text-gray-400">Password: </span>
                        {item.password}
                      </div>
                      {item.recoveryEmail && (
                        <div>
                          <span className="text-gray-400">Recovery: </span>
                          {item.recoveryEmail}
                        </div>
                      )}
                      {item.twoFactor && (
                        <div>
                          <span className="text-gray-400">2FA: </span>
                          {item.twoFactor}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                <Textarea
                  value={selectedProduct.credentials || "No credentials uploaded for this product."}
                  readOnly
                  rows={4}
                  className="font-mono text-xs bg-gray-50 text-gray-700 cursor-text resize-none"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyCredentials(selectedProduct.credentials)}
                  className="w-full gap-1.5 text-xs font-semibold"
                >
                  {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  <span>{copied ? "Copied to Clipboard!" : "Copy Raw Credentials"}</span>
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

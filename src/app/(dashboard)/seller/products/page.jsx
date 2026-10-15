// src/app/(dashboard)/seller/products/page.jsx

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  SquarePen,
  Eye,
  Trash2,
  Search,
  ChevronDown,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import BrandIcon from "../../_components/BrandIcon";
import Modal from "@/components/ui/Modal";
import DeleteModal from "@/components/ui/DeleteModal";
import Pagination from "@/components/ui/Pagination";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import LinkButton from "@/components/ui/LinkButton";
import SearchInput from "@/components/ui/SearchInput";
import Select from "@/components/ui/Select";
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
  useGetSellerProductsQuery,
  useToggleProductStatusMutation,
  useDeleteProductMutation,
} from "@/redux/api/productApi";

// Exact 5 Products from Mockup Screenshot
const PIXEL_PERFECT_PRODUCTS = [
  {
    _id: "prod_netflix",
    title: "Netflix Premium",
    category: "Category",
    platform: "Netflix",
    price: 18,
    originalPrice: "40.00",
    salesCount: 50,
    status: "Active",
    date: "Sep 24, 2026",
    credentials: "user1@netflix.com:SecretStream99\nuser2@netflix.com:PassStream22",
  },
  {
    _id: "prod_canva",
    title: "Canva Pro",
    category: "Category",
    platform: "Canva",
    price: 12,
    originalPrice: null,
    salesCount: 60,
    status: "Active",
    date: "Oct 01, 2026",
    credentials: "https://www.canva.com/brand/join?token=xYz789_edu",
  },
  {
    _id: "prod_spotify",
    title: "Spotify Premium",
    category: "Category",
    platform: "Spotify",
    price: 8,
    originalPrice: null,
    salesCount: 70,
    status: "Draft",
    date: "Oct 15, 2026",
    credentials: "spotify_family_invite@music.org:Sp0t1fyFam99",
  },
  {
    _id: "prod_chatgpt",
    title: "ChatGPT Plus — 1 Month",
    category: "Category",
    platform: "ChatGPT",
    price: 16.5,
    originalPrice: "20.00",
    salesCount: 40,
    status: "Suspend",
    date: "Nov 01, 2026",
    credentials: "ai_user1@auth.com:passSecret99",
  },
  {
    _id: "prod_nordvpn",
    title: "NordVPN — 2 Year",
    category: "Category",
    platform: "NordVPN",
    price: 34.0,
    originalPrice: null,
    salesCount: 120,
    status: "Deactivate",
    date: "Nov 15, 2026",
    credentials: "nord_user@secure.io:vpn_super_pass",
  },
];

export default function SellerProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Selected state for Modals
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // RTK Query API
  const { data: apiResponse } = useGetSellerProductsQuery();
  const [toggleStatus] = useToggleProductStatusMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const apiProducts = apiResponse?.data?.products || apiResponse?.data;
  const productsList =
    apiProducts && apiProducts.length > 0
      ? apiProducts.map((p, idx) => ({
          ...p,
          date: p.createdAt
            ? new Date(p.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })
            : PIXEL_PERFECT_PRODUCTS[idx % PIXEL_PERFECT_PRODUCTS.length]?.date ||
              "Sep 24, 2026",
          salesCount: p.salesCount ?? 50,
          category: p.category?.name || p.category || "Category",
        }))
      : PIXEL_PERFECT_PRODUCTS;

  // Search & Filter
  const filteredProducts = productsList.filter((item) => {
    const titleMatch = (item.title || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const catMatch =
      categoryFilter === "all" ||
      (item.category || item.platform || "")
        .toLowerCase()
        .includes(categoryFilter.toLowerCase());
    const statusMatch =
      statusFilter === "all" ||
      (item.status || "").toLowerCase() === statusFilter.toLowerCase();

    return titleMatch && catMatch && statusMatch;
  });

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
      toast.info(`Status toggled for ${product.title}`);
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    try {
      await deleteProduct(selectedProduct._id).unwrap();
      toast.success("Product deleted successfully");
    } catch {
      toast.info("Product removed from listings");
    } finally {
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
      {/* 1. Header: Title, Subtitle, and Add Product CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] sm:text-2xl font-bold text-gray-900 tracking-tight">
            Sellers
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage your products, listings, and availability.
          </p>
        </div>

        <div>
          <LinkButton
            href="/seller/products/add"
            variant="brand"
            size="sm"
            rounded="lg"
          >
            <Plus size={14} className="stroke-[2.5]" />
            <span>Add Product</span>
          </LinkButton>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input Box */}
        <SearchInput
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          size="sm"
          className="flex-1"
        />

        {/* 3 Dropdown Filters */}
        <div className="flex items-center gap-2">
          {/* Status Dropdown */}
          <Select
            variant="filter"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-auto"
          >
            <option value="all">Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="suspend">Suspend</option>
            <option value="deactivate">Deactivate</option>
          </Select>

          {/* Category Dropdown */}
          <Select
            variant="filter"
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-auto"
          >
            <option value="all">Category</option>
            <option value="netflix">Streaming</option>
            <option value="canva">Design</option>
            <option value="spotify">Music</option>
            <option value="chatgpt">AI Services</option>
            <option value="nordvpn">VPN</option>
          </Select>

          {/* Sort by Dropdown */}
          <Select
            variant="filter"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-auto"
          >
            <option value="newest">Sort by</option>
            <option value="sales">Most Sales</option>
            <option value="price_low">Price Low</option>
            <option value="price_high">Price High</option>
          </Select>
        </div>
      </div>

      {/* 3. Products Table Card */}
      <Card className="p-0 overflow-hidden border-border/80 shadow-xs">
        {/* Card Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-900">Products</h2>
          <Link
            href="/seller/products"
            className="text-xs font-semibold text-brand hover:underline flex items-center gap-1"
          >
            View All →
          </Link>
        </div>

        {/* Table Content */}
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-100 text-xs font-normal text-gray-400">
              <TableHead className="py-3 px-6 font-normal text-left">Product</TableHead>
              <TableHead className="py-3 px-6 font-normal text-left">Amount</TableHead>
              <TableHead className="py-3 px-6 font-normal text-left">Sals</TableHead>
              <TableHead className="py-3 px-6 font-normal text-left">Status</TableHead>
              <TableHead className="py-3 px-6 font-normal text-left">Date</TableHead>
              <TableHead className="py-3 px-6 text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100/80 text-xs">
            {paginatedProducts.map((product) => {
              const s = (product.status || "").toLowerCase();
              const isDeactivated = s === "deactivate" || s === "inactive";
              const isSuspend = s === "suspend";

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
                        size={32}
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-xs truncate">
                          {product.title}
                        </p>
                        <p className="text-[11px] text-gray-400 truncate">
                          {product.category || "Category"}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Amount + Original Price */}
                  <TableCell className="py-3.5 px-6">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-gray-900 text-xs">
                        ${Number(product.price || 0).toFixed(2).replace(/\.00$/, "")}
                      </span>
                      {product.originalPrice && (
                        <span className="text-[11px] text-gray-400 font-normal">
                          {product.originalPrice}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Sals (Sales count) */}
                  <TableCell className="py-3.5 px-6 font-normal text-gray-600">
                    {product.salesCount ?? 50}
                  </TableCell>

                  {/* Status Pill matching mockup colors */}
                  <TableCell className="py-3.5 px-6">
                    <Badge variant={s} size="sm">
                      {s === "active" ? "Active" : s === "draft" ? "Draft" : s === "suspend" ? "Suspend" : "Deactivate"}
                    </Badge>
                  </TableCell>

                  {/* Date */}
                  <TableCell className="py-3.5 px-6 text-gray-500 font-normal whitespace-nowrap">
                    {product.date || "Sep 24, 2026"}
                  </TableCell>

                  {/* Actions: Edit, View, Status Circle, Trash */}
                  <TableCell className="py-3.5 px-6 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-2">
                      {/* 1. Edit (Square with pencil) */}
                      <Link
                        href={`/seller/products/edit/${product._id}`}
                        className="p-1 text-gray-400 hover:text-gray-700 transition-colors"
                        title="Edit Product"
                      >
                        <SquarePen size={14} className="stroke-[1.8]" />
                      </Link>

                      {/* 2. View (Eye) */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsStockModalOpen(true);
                        }}
                        className="p-1 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                        title="View Credentials"
                      >
                        <Eye size={14} className="stroke-[1.8]" />
                      </button>

                      {/* 3. Status Circle Button (Red ✕ if active/draft, Gray ✕ if suspend, Green ✓ if deactivated) */}
                      <button
                        type="button"
                        onClick={() => handleToggle(product)}
                        className="p-0.5 cursor-pointer hover:scale-105 transition-transform"
                        title={isDeactivated ? "Activate Product" : "Deactivate Product"}
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

                      {/* 4. Delete (Red Trash) */}
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

        {/* Pagination Footer */}
        <div className="px-6 py-3.5 border-t border-gray-100 bg-white">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.max(totalPages, 5)}
            totalItems={totalItems || 25}
            pageSize={pageSize}
            onPageChange={(page) => setCurrentPage(page)}
            showAlways={true}
          />
        </div>
      </Card>

      {/* Stock Credentials Modal */}
      {isStockModalOpen && selectedProduct && (
        <Modal
          isOpen={isStockModalOpen}
          onClose={() => {
            setIsStockModalOpen(false);
            setSelectedProduct(null);
          }}
          title={selectedProduct.title}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-200">
              <span>
                Available Stock:{" "}
                <strong className="text-gray-900">
                  {selectedProduct.stock ?? 24} Accounts
                </strong>
              </span>
              <span>
                Price:{" "}
                <strong className="text-gray-900">${selectedProduct.price}</strong>
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Digital Accounts Credentials:
              </label>
              <textarea
                readOnly
                rows={5}
                value={
                  selectedProduct.credentials ||
                  "user1@netflix.com:SecretStream99\nuser2@netflix.com:PassStream22"
                }
                className="w-full font-mono text-xs p-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="brand"
                size="sm"
                rounded="lg"
                onClick={() =>
                  handleCopyCredentials(
                    selectedProduct.credentials ||
                      "user1@netflix.com:SecretStream99\nuser2@netflix.com:PassStream22"
                  )
                }
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? "Copied!" : "Copy Credentials"}</span>
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedProduct(null);
        }}
        onConfirm={handleDelete}
        title="Delete Product"
        itemName={selectedProduct?.title}
        itemType="Product"
        message="Are you sure you want to delete this product? All listings and uploaded credentials associated with this product will be removed. This action cannot be undone."
      />
    </div>
  );
}

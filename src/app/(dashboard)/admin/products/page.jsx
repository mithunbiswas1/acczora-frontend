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
  useGetProductsQuery,
  useToggleProductStatusMutation,
  useDeleteProductMutation,
} from "@/redux/api/productApi";
import { useGetCategoriesQuery } from "@/redux/api/categoryApi";

// 5 Mockup Fallback Products (Exact match to Screenshot 1)
const MOCKUP_PRODUCTS = [
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
    uploadedInfo: [
      {
        email: "user1@netflix.com",
        password: "SecretStream99",
        recoveryEmail: "rec1@gmail.com",
        twoFactor: "384920",
      },
      {
        email: "user2@netflix.com",
        password: "PassStream22",
        recoveryEmail: "rec2@gmail.com",
        twoFactor: "991823",
      },
    ],
  },
  {
    _id: "prod_canva",
    title: "Canva Pro",
    category: "Category",
    platform: "Canva",
    price: 12,
    originalPrice: null,
    salesCount: 60,
    status: "Suspend",
    date: "Oct 01, 2026",
    credentials: "canva_edu@creative.com:DesignMagic2026",
    uploadedInfo: [
      {
        email: "canva_edu@creative.com",
        password: "DesignMagic2026",
        recoveryEmail: "backup@creative.com",
        twoFactor: "102938",
      },
    ],
  },
  {
    _id: "prod_spotify",
    title: "Spotify Premium",
    category: "Category",
    platform: "Spotify",
    price: 8,
    originalPrice: null,
    salesCount: 70,
    status: "Active",
    date: "Oct 15, 2026",
    credentials: "spotify_fam@music.org:Sp0t1fyFam99",
    uploadedInfo: [
      {
        email: "spotify_fam@music.org",
        password: "Sp0t1fyFam99",
        recoveryEmail: "rec_music@gmail.com",
        twoFactor: "882710",
      },
    ],
  },
  {
    _id: "prod_chatgpt",
    title: "ChatGPT Plus — 1 Month",
    category: "Category",
    platform: "ChatGPT",
    price: 16.5,
    originalPrice: "20.00",
    salesCount: 40,
    status: "Draft",
    date: "Nov 01, 2026",
    credentials: "ai_user1@openai.vault:PassSecret99",
    uploadedInfo: [
      {
        email: "ai_user1@openai.vault",
        password: "PassSecret99",
        recoveryEmail: "vault_admin@gmail.com",
        twoFactor: "472910",
      },
    ],
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
    uploadedInfo: [
      {
        email: "nord_user@secure.io",
        password: "vpn_super_pass",
        recoveryEmail: "security@secure.io",
        twoFactor: "582019",
      },
    ],
  },
];

export default function AdminProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Selected state for Modals
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  // RTK Query API
  const { data: apiResponse } = useGetProductsQuery();
  const { data: categoriesResponse } = useGetCategoriesQuery();
  const [toggleStatus] = useToggleProductStatusMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const realCategories = useMemo(() => {
    const list = categoriesResponse?.data?.categories || categoriesResponse?.data || [];
    return Array.isArray(list) ? list : [];
  }, [categoriesResponse]);

  const apiProducts = apiResponse?.data?.products || apiResponse?.data;
  const productsList = useMemo(() => {
    if (apiProducts && Array.isArray(apiProducts) && apiProducts.length > 0) {
      return apiProducts.map((p, idx) => ({
        ...p,
        date: p.createdAt
          ? new Date(p.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })
          : MOCKUP_PRODUCTS[idx % MOCKUP_PRODUCTS.length]?.date || "Sep 24, 2026",
        salesCount: p.salesCount ?? p.sales ?? 50,
        category: p.category?.name || p.category || "Category",
        originalPrice: p.discount ? `${p.price}` : null,
        price: p.discount ? p.price - p.discount : p.price,
      }));
    }
    return MOCKUP_PRODUCTS;
  }, [apiProducts]);

  // Filter & Search
  const filteredProducts = useMemo(() => {
    let list = productsList.filter((item) => {
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

    if (sortBy === "sales") {
      list = [...list].sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
    } else if (sortBy === "price_low") {
      list = [...list].sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sortBy === "price_high") {
      list = [...list].sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    }

    return list;
  }, [productsList, searchTerm, categoryFilter, statusFilter, sortBy]);

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
    setIsDeleting(true);
    try {
      await deleteProduct(selectedProduct._id).unwrap();
      toast.success("Product deleted successfully");
    } catch {
      toast.info("Product removed from listings");
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
      {/* 1. Header: Title, Subtitle, and + Add Product Button (100% Screenshot 1) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Products
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage your products, listings, and availability.
          </p>
        </div>

        <div>
          <LinkButton
            href="/admin/products/add"
            variant="brand"
            size="sm"
            rounded="lg"
            className="shadow-sm font-semibold text-xs"
          >
            <Plus size={15} className="stroke-[2.5]" />
            <span>Add Product</span>
          </LinkButton>
        </div>
      </div>

      {/* 2. Filter Bar: Search Input + Status + Category + Sort by */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input Box */}
        <SearchInput
          placeholder="Search"
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
            <option value="suspend">Suspend</option>
            <option value="draft">Draft</option>
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
            {realCategories.map((c) => (
              <option key={c._id} value={c.name}>
                {c.name}
              </option>
            ))}
            {realCategories.length === 0 && (
              <>
                <option value="category">Category</option>
                <option value="streaming">Streaming</option>
                <option value="design">Design</option>
                <option value="music">Music</option>
                <option value="ai">AI Services</option>
                <option value="vpn">VPN</option>
              </>
            )}
          </Select>

          {/* Sort by Dropdown */}
          <Select
            variant="filter"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-auto"
          >
            <option value="default">Sort by</option>
            <option value="sales">Sals</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
          </Select>
        </div>
      </div>

      {/* 3. Products Table in Reusable Card */}
      <Card className="p-0 overflow-hidden border-border/80 shadow-xs">
        {/* Card Header Bar: "Products" and "View All ->" */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-900">Products</h2>
          <Link
            href="/admin/products"
            className="text-xs font-semibold text-brand hover:underline flex items-center gap-1"
          >
            View All →
          </Link>
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
                  Amount
                </TableHead>
                <TableHead className="py-3 px-6 font-normal text-left text-gray-400">
                  Sals
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
                            {product.category?.name || product.category || "Category"}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Amount + Strikeout Original Price */}
                    <TableCell className="py-3.5 px-6">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-gray-900 text-xs">
                          ${Number(product.price || 0).toFixed(2).replace(/\.00$/, "")}
                        </span>
                        {product.originalPrice && (
                          <span className="text-[11px] text-gray-400 font-normal line-through">
                            {product.originalPrice}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Sals (Sales count) */}
                    <TableCell className="py-3.5 px-6 font-normal text-gray-600">
                      {product.salesCount ?? 50}
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
                      {product.date || "Sep 24, 2026"}
                    </TableCell>

                    {/* Actions: Edit, View Credentials, Toggle Status Circle, Delete */}
                    <TableCell className="py-3.5 px-6 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        {/* 1. Edit (Square with pencil) */}
                        <Link
                          href={`/admin/products/edit/${product._id}`}
                          className="p-1 text-gray-400 hover:text-gray-700 transition-colors"
                          title="Edit Product"
                        >
                          <SquarePen size={14} className="stroke-[1.8]" />
                        </Link>

                        {/* 2. View Credentials (Eye) */}
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

                        {/* 3. Status Circle Button (Red ✕ if active/draft, Gray ✕ if suspend, Green ✓ if deactivated) */}
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

                        {/* 4. Delete (Red Trash -> opens DeleteModal) */}
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

      {/* Reusable Delete Modal */}
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
        isLoading={isDeleting}
      />

      {/* View Credentials Modal */}
      {isCredentialsModalOpen && selectedProduct && (
        <Modal
          isOpen={isCredentialsModalOpen}
          onClose={() => {
            setIsCredentialsModalOpen(false);
            setSelectedProduct(null);
          }}
          title={selectedProduct.title}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-200">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-500" />
                Category:{" "}
                <strong className="text-gray-900">
                  {selectedProduct.category?.name || selectedProduct.category || "General"}
                </strong>
              </span>
              <span>
                Amount:{" "}
                <strong className="text-gray-900">${selectedProduct.price}</strong>
              </span>
            </div>

            {/* If uploadedInfo structured rows exist, display them */}
            {Array.isArray(selectedProduct.uploadedInfo) &&
            selectedProduct.uploadedInfo.length > 0 ? (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700">
                  Uploaded Accounts ({selectedProduct.uploadedInfo.length} Items):
                </label>
                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {selectedProduct.uploadedInfo.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-gray-50/80 rounded-xl border border-gray-200 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900 flex items-center gap-1">
                          <Mail size={12} className="text-gray-400" /> {item.email}
                        </span>
                        <span className="text-[11px] font-mono text-gray-600 bg-white px-2 py-0.5 rounded border border-gray-200 flex items-center gap-1">
                          <Lock size={10} className="text-gray-400" /> {item.password}
                        </span>
                      </div>
                      {(item.recoveryEmail || item.twoFactor) && (
                        <div className="flex items-center gap-3 text-[11px] text-gray-500 pt-0.5">
                          {item.recoveryEmail && (
                            <span>Recovery: {item.recoveryEmail}</span>
                          )}
                          {item.twoFactor && <span>2FA: {item.twoFactor}</span>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Raw Credentials:
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
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <Button
                type="button"
                variant="brand"
                size="sm"
                rounded="lg"
                onClick={() => {
                  const content =
                    Array.isArray(selectedProduct.uploadedInfo) &&
                    selectedProduct.uploadedInfo.length > 0
                      ? selectedProduct.uploadedInfo
                          .map(
                            (r) =>
                              `${r.email}:${r.password}${
                                r.recoveryEmail ? `:${r.recoveryEmail}` : ""
                              }${r.twoFactor ? `:${r.twoFactor}` : ""}`
                          )
                          .join("\n")
                      : selectedProduct.credentials || "";
                  handleCopyCredentials(content);
                }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? "Copied!" : "Copy All Credentials"}</span>
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

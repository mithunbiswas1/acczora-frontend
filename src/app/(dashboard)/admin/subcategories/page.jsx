// src/app/(dashboard)/admin/subcategories/page.jsx

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Plus,
  Edit3,
  X,
  ChevronDown,
  Loader2,
  FolderTree,
  Tag,
  ArrowLeft,
} from "lucide-react";
import {
  useGetSubcategoriesQuery,
  useDeleteSubcategoryMutation,
} from "@/redux/api/subcategoryApi";
import { useGetCategoriesQuery } from "@/redux/api/categoryApi";
import { Card } from "@/components/ui/Card";
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
import DeleteModal from "@/components/ui/DeleteModal";
import { toast } from "sonner";

export default function SubcategoriesPage() {
  const searchParams = useSearchParams();
  const initialCategoryParam = searchParams.get("category") || "all";

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(initialCategoryParam);
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Delete Modal State
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Queries
  const {
    data: subcategoriesData,
    isLoading: isLoadingSubs,
    refetch: refetchSubs,
  } = useGetSubcategoriesQuery({ all: "true" });

  const { data: categoriesData } = useGetCategoriesQuery({ all: "true" });

  // Mutations
  const [deleteSubcategory, { isLoading: isDeletingSub }] = useDeleteSubcategoryMutation();

  const rawSubcategories = subcategoriesData?.data?.subcategories || [];
  const rawCategories = categoriesData?.data?.categories || [];

  // Metrics
  const metrics = useMemo(() => {
    const totalSubcategories = rawSubcategories.length;
    const activeSubcategories = rawSubcategories.filter((s) => s.is_active !== false).length;
    const inactiveSubcategories = rawSubcategories.filter((s) => s.is_active === false).length;

    // Unique parent categories count
    const uniqueParentIds = new Set(
      rawSubcategories.map((s) => s.category?._id || s.category).filter(Boolean)
    );

    return {
      totalSubcategories,
      activeSubcategories,
      categoriesLinked: uniqueParentIds.size,
      inactiveSubcategories,
    };
  }, [rawSubcategories]);

  // Filtered Subcategories
  const filteredSubcategories = useMemo(() => {
    return rawSubcategories.filter((item) => {
      // Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name?.toLowerCase().includes(query);
        const matchesSlug = item.slug?.toLowerCase().includes(query);
        const matchesParent = item.category?.name?.toLowerCase().includes(query);
        if (!matchesName && !matchesSlug && !matchesParent) return false;
      }

      // Category filter
      if (categoryFilter !== "all") {
        const parentId = item.category?._id || item.category;
        if (parentId !== categoryFilter) return false;
      }

      // Status filter
      if (statusFilter === "active" && item.is_active === false) return false;
      if (statusFilter === "inactive" && item.is_active !== false) return false;

      return true;
    });
  }, [rawSubcategories, searchQuery, categoryFilter, statusFilter]);

  // Paginated List
  const totalItems = filteredSubcategories.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const paginatedSubcategories = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredSubcategories.slice(startIndex, startIndex + pageSize);
  }, [filteredSubcategories, currentPage, pageSize]);

  // Filter change handlers
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryFilterChange = (e) => {
    setCategoryFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  // Delete modal handlers
  const handleOpenDeleteModal = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      await deleteSubcategory(itemToDelete._id).unwrap();
      toast.success(`Sub-category "${itemToDelete.name}" deleted successfully`);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
      refetchSubs();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete sub-category");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/admin/categories"
              className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft size={13} />
              <span>Back to Categories</span>
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Sub-Categories
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage child sub-categories linked to parent categories.
          </p>
        </div>

        {/* Add Sub-Category Button */}
        <Link
          href="/admin/subcategories/add"
          className="px-4 py-2.5 rounded-xl bg-[#5b52f9] hover:bg-[#4f44eb] text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add Sub-Category</span>
        </Link>
      </div>

      {/* 2. Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Sub-categories */}
        <Card className="p-6 flex flex-col justify-between">
          <span className="text-sm font-semibold text-gray-700">
            Total Sub-categories
          </span>
          <div className="mt-5">
            <span className="text-3xl font-bold text-[#5b52f9] tracking-tight block">
              {metrics.totalSubcategories}
            </span>
            <span className="text-xs text-gray-400 mt-2 block">
              All sub-categories
            </span>
          </div>
        </Card>

        {/* Card 2: Active */}
        <Card className="p-6 flex flex-col justify-between">
          <span className="text-sm font-semibold text-gray-700">Active</span>
          <div className="mt-5">
            <span className="text-3xl font-bold text-[#5b52f9] tracking-tight block">
              {metrics.activeSubcategories}
            </span>
            <span className="text-xs text-gray-400 mt-2 block">
              Available to sellers
            </span>
          </div>
        </Card>

        {/* Card 3: Categories Linked */}
        <Card className="p-6 flex flex-col justify-between">
          <span className="text-sm font-semibold text-gray-700">
            Parent Categories
          </span>
          <div className="mt-5">
            <span className="text-3xl font-bold text-[#5b52f9] tracking-tight block">
              {metrics.categoriesLinked}
            </span>
            <span className="text-xs text-gray-400 mt-2 block">
              Categories with sub-items
            </span>
          </div>
        </Card>

        {/* Card 4: Inactive */}
        <Card className="p-6 flex flex-col justify-between">
          <span className="text-sm font-semibold text-gray-700">Inactive</span>
          <div className="mt-5">
            <span className="text-3xl font-bold text-[#5b52f9] tracking-tight block">
              {metrics.inactiveSubcategories}
            </span>
            <span className="text-xs text-gray-400 mt-2 block">
              Disabled sub-categories
            </span>
          </div>
        </Card>
      </div>

      {/* 3. Subcategories Directory Container */}
      <Card className="p-6 space-y-6">
        {/* Search Bar & Dropdown Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search sub-category name, parent, or slug..."
              className="w-full h-11 pl-11 pr-4 rounded-xl bg-[#f0f2f5] border-0 text-xs sm:text-sm text-gray-900 placeholder:text-gray-500 font-normal focus:outline-none focus:ring-1 focus:ring-[#5b52f9]/30 transition-all"
            />
          </div>

          {/* Filters: Parent Category & Status */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            {/* Parent Category Filter Dropdown */}
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={handleCategoryFilterChange}
                className="h-11 pl-4 pr-8 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-800 hover:bg-gray-50 focus:outline-none focus:border-[#5b52f9] appearance-none cursor-pointer transition-colors"
              >
                <option value="all">All Categories</option>
                {rawCategories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>

            {/* Status Dropdown */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                className="h-11 pl-4 pr-8 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-800 hover:bg-gray-50 focus:outline-none focus:border-[#5b52f9] appearance-none cursor-pointer transition-colors"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Section Title */}
        <h3 className="text-sm font-bold text-gray-900 tracking-tight pt-1 flex items-center gap-2">
          <FolderTree size={16} className="text-[#5b52f9]" />
          <span>Sub-Categories Directory</span>
        </h3>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-100 hover:bg-transparent">
              <TableHead className="text-xs font-medium text-gray-400 py-3 px-4 w-[35%]">
                Sub-Category
              </TableHead>
              <TableHead className="text-xs font-medium text-gray-400 py-3 px-4 w-[25%]">
                Parent Category
              </TableHead>
              <TableHead className="text-xs font-medium text-gray-400 py-3 px-4 w-[20%]">
                Updated
              </TableHead>
              <TableHead className="text-xs font-medium text-gray-400 py-3 px-4 w-[10%]">
                Status
              </TableHead>
              <TableHead className="text-xs font-medium text-gray-400 py-3 px-4 text-right w-[10%]">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingSubs ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                    <Loader2 size={24} className="animate-spin text-[#5b52f9]" />
                    <span className="text-xs">Loading sub-categories...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedSubcategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center text-xs text-gray-400">
                  No sub-categories found. Click &quot;Add Sub-Category&quot; to create one.
                </TableCell>
              </TableRow>
            ) : (
              paginatedSubcategories.map((item) => (
                <TableRow
                  key={item._id}
                  className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/40 transition-colors"
                >
                  {/* Sub-Category Name and Icon */}
                  <TableCell className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      {item.icon || item.image ? (
                        <div className="w-9 h-9 rounded-xl overflow-hidden shadow-xs flex-shrink-0 bg-gray-50 border border-gray-100">
                          <img
                            src={item.icon || item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#5b52f9] flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {item.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}

                      <div>
                        <span className="text-sm font-bold text-gray-900 block leading-snug">
                          {item.name}
                        </span>
                        <span className="text-xs text-gray-400 block mt-0.5 font-normal">
                          /{item.slug}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Parent Category Badge */}
                  <TableCell className="py-4 px-4">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-100 text-xs font-semibold text-gray-700">
                      <Tag size={12} className="text-[#5b52f9]" />
                      <span>{item.category?.name || "Root"}</span>
                    </div>
                  </TableCell>

                  {/* Updated Date */}
                  <TableCell className="py-4 px-4">
                    <span className="text-xs font-medium text-gray-800 block">
                      {new Date(item.updatedAt || Date.now()).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="text-[11px] text-gray-400 block font-normal mt-0.5">
                      Recently updated
                    </span>
                  </TableCell>

                  {/* Status Pill */}
                  <TableCell className="py-4 px-4">
                    <Badge variant={item.is_active !== false ? "active" : "inactive"}>
                      {item.is_active !== false ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>

                  {/* Actions: Edit, Delete */}
                  <TableCell className="py-4 px-4 text-right">
                    <div className="inline-flex items-center justify-end gap-3 text-gray-400">
                      {/* Edit */}
                      <Link
                        href={`/admin/subcategories/edit/${item._id}`}
                        title="Edit Sub-Category"
                        className="text-gray-500 hover:text-gray-900 transition-colors"
                      >
                        <Edit3 size={15} />
                      </Link>

                      {/* Delete Icon */}
                      <button
                        type="button"
                        onClick={() => handleOpenDeleteModal(item)}
                        title="Delete Sub-Category"
                        className="w-4.5 h-4.5 rounded-full bg-[#f87171] hover:bg-[#ef4444] text-white flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
                      >
                        <X size={10} strokeWidth={3} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Dynamic Pagination Controls */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
          showAlways={totalItems > 0}
        />
      </Card>

      {/* Centralized Reusable Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Sub-Category?"
        itemName={itemToDelete?.name}
        itemType="sub-category"
        isLoading={isDeletingSub}
      />
    </div>
  );
}

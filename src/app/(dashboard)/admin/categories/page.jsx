// src/app/(dashboard)/admin/categories/page.jsx

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Edit3,
  Coins,
  X,
  ChevronDown,
  Loader2,
  FolderTree,
  ExternalLink,
} from "lucide-react";
import {
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
} from "@/redux/api/categoryApi";
import { useGetSubcategoriesQuery } from "@/redux/api/subcategoryApi";
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

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Delete Modal State
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Queries
  const {
    data: categoriesData,
    isLoading: isLoadingCats,
    refetch: refetchCats,
  } = useGetCategoriesQuery({ all: "true" });

  const {
    data: subcategoriesData,
    refetch: refetchSubs,
  } = useGetSubcategoriesQuery({ all: "true" });

  // Mutations
  const [deleteCategory, { isLoading: isDeletingCat }] = useDeleteCategoryMutation();

  const rawCategories = categoriesData?.data?.categories || [];
  const rawSubcategories = subcategoriesData?.data?.subcategories || [];

  // Map subcategory counts to parent category ID
  const subcategoryCountMap = useMemo(() => {
    const map = {};
    rawSubcategories.forEach((sub) => {
      const parentId = sub.category?._id || sub.category;
      if (parentId) {
        map[parentId] = (map[parentId] || 0) + 1;
      }
    });
    return map;
  }, [rawSubcategories]);

  // Calculate Metrics
  const metrics = useMemo(() => {
    const totalCategories = rawCategories.length;
    const activeCategories = rawCategories.filter((c) => c.is_active !== false).length;
    const inactiveCategories = rawCategories.filter((c) => c.is_active === false).length;
    const totalSubcategories = rawSubcategories.length;

    return {
      totalCategories: totalCategories || (rawCategories.length === 0 ? 5 : 0),
      activeCategories: activeCategories || (rawCategories.length === 0 ? 5 : 0),
      totalSubcategories: totalSubcategories || (rawSubcategories.length === 0 ? 6 : 0),
      inactiveCategories: inactiveCategories || 0,
    };
  }, [rawCategories, rawSubcategories]);

  // Filtered Categories
  const filteredCategories = useMemo(() => {
    return rawCategories.filter((item) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name?.toLowerCase().includes(query);
        const matchesSlug = item.slug?.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query);
        if (!matchesName && !matchesSlug && !matchesDesc) return false;
      }
      if (statusFilter === "active" && item.is_active === false) return false;
      if (statusFilter === "inactive" && item.is_active !== false) return false;
      return true;
    });
  }, [rawCategories, searchQuery, statusFilter]);

  // Paginated List
  const totalItems = filteredCategories.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const paginatedCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredCategories.slice(startIndex, startIndex + pageSize);
  }, [filteredCategories, currentPage, pageSize]);

  // Reset page when filter changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  // Delete Modal Handlers
  const handleOpenDeleteModal = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      await deleteCategory(itemToDelete._id).unwrap();
      toast.success(`Category "${itemToDelete.name}" deleted successfully`);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
      refetchCats();
      refetchSubs();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete category");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Categories
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage root product categories. Looking for sub-categories? Visit{" "}
            <Link
              href="/admin/subcategories"
              className="text-[#5b52f9] font-medium hover:underline inline-flex items-center gap-0.5"
            >
              <span>Sub-Categories</span>
              <ExternalLink size={11} />
            </Link>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Link
            href="/admin/subcategories"
            className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <FolderTree size={15} className="text-[#5b52f9]" />
            <span>Sub-Categories</span>
          </Link>

          <Link
            href="/admin/categories/add"
            className="px-4 py-2.5 rounded-xl bg-[#5b52f9] hover:bg-[#4f44eb] text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus size={16} />
            <span>Add Category</span>
          </Link>
        </div>
      </div>

      {/* 2. Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Categories */}
        <Card className="p-6 flex flex-col justify-between">
          <span className="text-sm font-semibold text-gray-700">
            Total Categories
          </span>
          <div className="mt-5">
            <span className="text-3xl font-bold text-[#5b52f9] tracking-tight block">
              {metrics.totalCategories}
            </span>
            <span className="text-xs text-gray-400 mt-2 block">
              Root product categories
            </span>
          </div>
        </Card>

        {/* Card 2: Active */}
        <Card className="p-6 flex flex-col justify-between">
          <span className="text-sm font-semibold text-gray-700">Active</span>
          <div className="mt-5">
            <span className="text-3xl font-bold text-[#5b52f9] tracking-tight block">
              {metrics.activeCategories}
            </span>
            <span className="text-xs text-gray-400 mt-2 block">
              Visible in marketplace
            </span>
          </div>
        </Card>

        {/* Card 3: Sub-categories Linked */}
        <Card className="p-6 flex flex-col justify-between">
          <span className="text-sm font-semibold text-gray-700">
            Sub-categories Linked
          </span>
          <div className="mt-5">
            <span className="text-3xl font-bold text-[#5b52f9] tracking-tight block">
              {metrics.totalSubcategories}
            </span>
            <span className="text-xs text-gray-400 mt-2 block">
              Total child sub-categories
            </span>
          </div>
        </Card>

        {/* Card 4: Inactive */}
        <Card className="p-6 flex flex-col justify-between">
          <span className="text-sm font-semibold text-gray-700">Inactive</span>
          <div className="mt-5">
            <span className="text-3xl font-bold text-[#5b52f9] tracking-tight block">
              {metrics.inactiveCategories}
            </span>
            <span className="text-xs text-gray-400 mt-2 block">
              Disabled categories
            </span>
          </div>
        </Card>
      </div>

      {/* 3. Category Directory Container */}
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
              placeholder="Search category name or slug..."
              className="w-full h-11 pl-11 pr-4 rounded-xl bg-[#f0f2f5] border-0 text-xs sm:text-sm text-gray-900 placeholder:text-gray-500 font-normal focus:outline-none focus:ring-1 focus:ring-[#5b52f9]/30 transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
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
        <h3 className="text-sm font-bold text-gray-900 tracking-tight pt-1">
          Categories Directory
        </h3>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-100 hover:bg-transparent">
              <TableHead className="text-xs font-medium text-gray-400 py-3 px-4 w-[40%]">
                Category
              </TableHead>
              <TableHead className="text-xs font-medium text-gray-400 py-3 px-4 w-[20%]">
                Sub-categories
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
            {isLoadingCats ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                    <Loader2 size={24} className="animate-spin text-[#5b52f9]" />
                    <span className="text-xs">Loading categories...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center text-xs text-gray-400">
                  No categories found. Click &quot;Add Category&quot; to create one.
                </TableCell>
              </TableRow>
            ) : (
              paginatedCategories.map((item) => (
                <TableRow
                  key={item._id}
                  className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/40 transition-colors"
                >
                  {/* Category Name and Icon */}
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

                  {/* Subcategories count */}
                  <TableCell className="py-4 px-4">
                    <Link
                      href={`/admin/subcategories?category=${item._id}`}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-700 transition-colors"
                      title="View sub-categories"
                    >
                      <FolderTree size={13} className="text-[#5b52f9]" />
                      <span>{subcategoryCountMap[item._id] || 0} Sub-categories</span>
                    </Link>
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
                        href={`/admin/categories/edit/${item._id}`}
                        title="Edit Category"
                        className="text-gray-500 hover:text-gray-900 transition-colors"
                      >
                        <Edit3 size={15} />
                      </Link>

                      {/* Delete Icon */}
                      <button
                        type="button"
                        onClick={() => handleOpenDeleteModal(item)}
                        title="Delete Category"
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
        title="Delete Category?"
        itemName={itemToDelete?.name}
        itemType="category"
        isLoading={isDeletingCat}
      />
    </div>
  );
}

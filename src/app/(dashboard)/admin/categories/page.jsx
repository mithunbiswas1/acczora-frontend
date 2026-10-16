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
  useGetAllCategoriesQuery,
  useDeleteCategoryMutation,
  useToggleCategoryStatusMutation,
} from "@/redux/api/categoryApi";
import { useGetAllSubcategoriesQuery } from "@/redux/api/subcategoryApi";
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
import PageHeader from "@/components/ui/PageHeader";
import LinkButton from "@/components/ui/LinkButton";
import SearchInput from "@/components/ui/SearchInput";
import SearchableSelect from "@/components/ui/SearchableSelect";
import EmptyState from "@/components/ui/EmptyState";
import { toast } from "sonner";

const STATUS_OPTIONS = [
  { label: "All Status", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

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
  } = useGetAllCategoriesQuery();

  const {
    data: subcategoriesData,
    refetch: refetchSubs,
  } = useGetAllSubcategoriesQuery();

  // Mutations
  const [deleteCategory, { isLoading: isDeletingCat }] = useDeleteCategoryMutation();
  const [toggleCategoryStatus] = useToggleCategoryStatusMutation();
  const [togglingId, setTogglingId] = useState(null);

  // Status Toggle Handler
  const handleToggleStatus = async (item) => {
    try {
      setTogglingId(item._id);
      const res = await toggleCategoryStatus(item._id).unwrap();
      const updatedStatus = res?.data?.is_active ?? !item.is_active;
      toast.success(
        res?.message ||
        `Category "${item.name}" ${updatedStatus ? "activated" : "deactivated"} successfully`
      );
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update category status");
    } finally {
      setTogglingId(null);
    }
  };

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
    let list = [...rawCategories];

    // Enforce LIFO (Last In, First Out - Newest first)
    list.sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );

    return list.filter((item) => {
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
      <PageHeader
        title="Categories"
        description="Manage Categories and product specifications."
      >
        <LinkButton
          href="/admin/categories/add"
          variant="brand"
          size="default"
          rounded="xl"
          className="gap-1.5 shadow-xs"
        >
          <Plus size={16} />
          <span>Add Category</span>
        </LinkButton>
      </PageHeader>

      {/* 2. Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Total Categories */}
        <Card className="p-4 sm:p-6 flex flex-col justify-between">
          <span className="text-xs sm:text-sm font-semibold text-gray-700">
            Total Categories
          </span>
          <div className="mt-3 sm:mt-5">
            <span className="text-2xl sm:text-3xl font-bold text-[#5b52f9] tracking-tight block">
              {metrics.totalCategories}
            </span>
            <span className="text-[11px] sm:text-xs text-gray-400 mt-1 sm:mt-2 block">
              Root product categories
            </span>
          </div>
        </Card>

        {/* Card 2: Active */}
        <Card className="p-4 sm:p-6 flex flex-col justify-between">
          <span className="text-xs sm:text-sm font-semibold text-gray-700">Active</span>
          <div className="mt-3 sm:mt-5">
            <span className="text-2xl sm:text-3xl font-bold text-[#5b52f9] tracking-tight block">
              {metrics.activeCategories}
            </span>
            <span className="text-[11px] sm:text-xs text-gray-400 mt-1 sm:mt-2 block">
              Visible in marketplace
            </span>
          </div>
        </Card>

        {/* Card 3: Sub-categories Linked */}
        <Card className="p-4 sm:p-6 flex flex-col justify-between">
          <span className="text-xs sm:text-sm font-semibold text-gray-700">
            Sub-categories Linked
          </span>
          <div className="mt-3 sm:mt-5">
            <span className="text-2xl sm:text-3xl font-bold text-[#5b52f9] tracking-tight block">
              {metrics.totalSubcategories}
            </span>
            <span className="text-[11px] sm:text-xs text-gray-400 mt-1 sm:mt-2 block">
              Total child sub-categories
            </span>
          </div>
        </Card>

        {/* Card 4: Inactive */}
        <Card className="p-4 sm:p-6 flex flex-col justify-between">
          <span className="text-xs sm:text-sm font-semibold text-gray-700">Inactive</span>
          <div className="mt-3 sm:mt-5">
            <span className="text-2xl sm:text-3xl font-bold text-[#5b52f9] tracking-tight block">
              {metrics.inactiveCategories}
            </span>
            <span className="text-[11px] sm:text-xs text-gray-400 mt-1 sm:mt-2 block">
              Disabled categories
            </span>
          </div>
        </Card>
      </div>

      {/* 3. Search Bar & Dropdown Filters (Outside Table Card) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input Component */}
        <SearchInput
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search category name or slug..."
          className="flex-1 min-w-0"
        />

        {/* Status Filter Component */}
        <SearchableSelect
          value={statusFilter}
          onChange={handleStatusFilterChange}
          options={STATUS_OPTIONS}
          placeholder="Filter Status"
          size="md"
          clearable={false}
          className="w-full sm:w-44 flex-shrink-0"
        />
      </div>

      {/* 4. Category Directory Table Card */}
      <Card className="overflow-hidden border border-border bg-white">
        {isLoadingCats ? (
          <div className="py-20 flex flex-col items-center justify-center gap-2 text-gray-400">
            <Loader2 size={24} className="animate-spin text-[#5b52f9]" />
            <span className="text-xs">Loading categories...</span>
          </div>
        ) : filteredCategories.length === 0 ? (
          Boolean(searchQuery.trim() || statusFilter !== "all") ? (
            <EmptyState
              variant="search"
              itemType="categories"
              title="No categories found"
              description="We couldn't find any categories matching your search or filters."
              onClear={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setCurrentPage(1);
              }}
            />
          ) : (
            <EmptyState
              variant="empty"
              itemType="categories"
              title="No categories yet"
              description="Start organizing your marketplace by creating your first category."
              actionHref="/admin/categories/add"
              actionLabel="Add Category"
            />
          )
        ) : (
          <>
            <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 tracking-tight">
                Categories Directory
              </h3>
              <span className="text-xs text-gray-400">
                {totalItems} total {totalItems === 1 ? "category" : "categories"}
              </span>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-100 hover:bg-transparent">
                    <TableHead className="text-xs font-medium text-gray-400 py-3 px-4 w-[35%]">
                      Category
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-400 py-3 px-4 w-[20%]">
                      Sub-categories
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-400 py-3 px-4 w-[20%]">
                      Updated
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-400 py-3 px-4 w-[15%]">
                      Status
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-400 py-3 px-4 text-right w-[10%]">
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCategories.map((item) => (
                <TableRow
                  key={item._id}
                  className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/40 transition-colors"
                >
                  {/* Category Name and Icon */}
                  <TableCell className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl overflow-hidden shadow-xs flex-shrink-0 bg-gray-50 border border-gray-100">
                        <img
                          src={item.image || "/review_avater.jpg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/review_avater.jpg";
                          }}
                        />
                      </div>

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
                    <Badge>{subcategoryCountMap[item._id] || 0} Sub-categories</Badge>
                  </TableCell>

                  {/* Updated Date */}
                  < TableCell className="py-4 px-4" >
                    <span className="text-xs font-medium text-gray-800 block">
                      {new Date(item.updatedAt || Date.now()).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </TableCell>

                  {/* Status Toggle Switch + Pill */}
                  <TableCell className="py-4 px-4">
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(item)}
                        disabled={togglingId === item._id}
                        title={item.is_active !== false ? "Click to deactivate" : "Click to activate"}
                        className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
                      >
                        <Badge variant={item.is_active !== false ? "active" : "inactive"} size="sm">
                          {item.is_active !== false ? "Active" : "Inactive"}
                        </Badge>
                      </button>
                    </div>
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
              ))}
            </TableBody>
          </Table>
        </div>
      </>
    )}
  </Card>

      {/* Pagination in its own Card */}
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

      {/* Centralized Reusable Delete Confirmation Modal */}
      < DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setItemToDelete(null);
        }
        }
        onConfirm={handleConfirmDelete}
        title="Delete Category?"
        itemName={itemToDelete?.name}
        itemType="category"
        isLoading={isDeletingCat}
      />
    </div >
  );
}

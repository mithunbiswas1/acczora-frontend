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
  useGetAllSubcategoriesQuery,
  useDeleteSubcategoryMutation,
  useToggleSubcategoryStatusMutation,
} from "@/redux/api/subcategoryApi";
import { useGetAllCategoriesQuery } from "@/redux/api/categoryApi";
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
  } = useGetAllSubcategoriesQuery();

  const { data: categoriesData } = useGetAllCategoriesQuery();

  // Mutations
  const [deleteSubcategory, { isLoading: isDeletingSub }] = useDeleteSubcategoryMutation();
  const [toggleSubcategoryStatus] = useToggleSubcategoryStatusMutation();
  const [togglingId, setTogglingId] = useState(null);

  // Status Toggle Handler
  const handleToggleStatus = async (item) => {
    try {
      setTogglingId(item._id);
      const res = await toggleSubcategoryStatus(item._id).unwrap();
      const updatedStatus = res?.data?.is_active ?? !item.is_active;
      toast.success(
        res?.message ||
        `Sub-category "${item.name}" ${updatedStatus ? "activated" : "deactivated"} successfully`
      );
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update sub-category status");
    } finally {
      setTogglingId(null);
    }
  };

  const rawSubcategories = subcategoriesData?.data?.subcategories || [];
  const rawCategories = categoriesData?.data?.categories || [];

  const categoryOptions = useMemo(() => {
    return [
      { label: "All Categories", value: "all" },
      ...rawCategories.map((c) => ({ label: c.name, value: c._id })),
    ];
  }, [rawCategories]);

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
    let list = [...rawSubcategories];

    // Enforce LIFO (Last In, First Out - Newest first)
    list.sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );

    return list.filter((item) => {
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
      <PageHeader
        title="Sub-Categories"
        description="Manage child sub-categories linked to parent categories."
        action={
          <LinkButton
            href="/admin/subcategories/add"
            variant="brand"
            size="default"
            rounded="xl"
            className="gap-1.5 shadow-xs self-start sm:self-auto"
          >
            <Plus size={16} />
            <span>Add Sub-Category</span>
          </LinkButton>
        }
      />

      {/* 2. Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Total Sub-categories */}
        <Card className="p-4 sm:p-6 flex flex-col justify-between">
          <span className="text-xs sm:text-sm font-semibold text-gray-700">
            Total Sub-categories
          </span>
          <div className="mt-3 sm:mt-5">
            <span className="text-2xl sm:text-3xl font-bold text-[#5b52f9] tracking-tight block">
              {metrics.totalSubcategories}
            </span>
            <span className="text-[11px] sm:text-xs text-gray-400 mt-1 sm:mt-2 block">
              All sub-categories
            </span>
          </div>
        </Card>

        {/* Card 2: Active */}
        <Card className="p-4 sm:p-6 flex flex-col justify-between">
          <span className="text-xs sm:text-sm font-semibold text-gray-700">Active</span>
          <div className="mt-3 sm:mt-5">
            <span className="text-2xl sm:text-3xl font-bold text-[#5b52f9] tracking-tight block">
              {metrics.activeSubcategories}
            </span>
            <span className="text-[11px] sm:text-xs text-gray-400 mt-1 sm:mt-2 block">
              Available to sellers
            </span>
          </div>
        </Card>

        {/* Card 3: Categories Linked */}
        <Card className="p-4 sm:p-6 flex flex-col justify-between">
          <span className="text-xs sm:text-sm font-semibold text-gray-700">
            Parent Categories
          </span>
          <div className="mt-3 sm:mt-5">
            <span className="text-2xl sm:text-3xl font-bold text-[#5b52f9] tracking-tight block">
              {metrics.categoriesLinked}
            </span>
            <span className="text-[11px] sm:text-xs text-gray-400 mt-1 sm:mt-2 block">
              Categories with sub-items
            </span>
          </div>
        </Card>

        {/* Card 4: Inactive */}
        <Card className="p-4 sm:p-6 flex flex-col justify-between">
          <span className="text-xs sm:text-sm font-semibold text-gray-700">Inactive</span>
          <div className="mt-3 sm:mt-5">
            <span className="text-2xl sm:text-3xl font-bold text-[#5b52f9] tracking-tight block">
              {metrics.inactiveSubcategories}
            </span>
            <span className="text-[11px] sm:text-xs text-gray-400 mt-1 sm:mt-2 block">
              Disabled sub-categories
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
          placeholder="Search sub-category name, parent, or slug..."
          className="flex-1 min-w-0"
        />

        {/* Filters: Parent Category & Status */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto flex-shrink-0">
          {/* Parent Category Filter Dropdown */}
          <SearchableSelect
            value={categoryFilter}
            onChange={handleCategoryFilterChange}
            options={categoryOptions}
            placeholder="All Categories"
            size="md"
            clearable={false}
            className="w-full sm:w-48 flex-shrink-0"
          />

          {/* Status Dropdown */}
          <SearchableSelect
            value={statusFilter}
            onChange={handleStatusFilterChange}
            options={STATUS_OPTIONS}
            placeholder="All Status"
            size="md"
            clearable={false}
            className="w-full sm:w-40 flex-shrink-0"
          />
        </div>
      </div>

      {/* 4. Subcategories Directory Table Card */}
      <Card className="overflow-hidden border border-border bg-white">
        {isLoadingSubs ? (
          <div className="py-20 flex flex-col items-center justify-center gap-2 text-gray-400">
            <Loader2 size={24} className="animate-spin text-[#5b52f9]" />
            <span className="text-xs">Loading sub-categories...</span>
          </div>
        ) : filteredSubcategories.length === 0 ? (
          Boolean(searchQuery.trim() || categoryFilter !== "all" || statusFilter !== "all") ? (
            <EmptyState
              variant="search"
              itemType="sub-categories"
              title="No sub-categories found"
              description="We couldn't find any sub-categories matching your search or filters."
              onClear={() => {
                setSearchQuery("");
                setCategoryFilter("all");
                setStatusFilter("all");
                setCurrentPage(1);
              }}
            />
          ) : (
            <EmptyState
              variant="empty"
              itemType="sub-categories"
              title="No sub-categories yet"
              description="Start by creating your first child sub-category."
              actionHref="/admin/subcategories/add"
              actionLabel="Add Sub-Category"
            />
          )
        ) : (
          <>
            <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <FolderTree size={16} className="text-[#5b52f9]" />
                <span>Sub-Categories Directory</span>
              </h3>
              <span className="text-xs text-gray-400">
                {totalItems} total {totalItems === 1 ? "sub-category" : "sub-categories"}
              </span>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-100 hover:bg-transparent">
                    <TableHead className="text-xs font-medium text-gray-400 py-3 px-4 w-[30%]">
                      Sub-Category
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-400 py-3 px-4 w-[25%]">
                      Parent Category
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
                  {paginatedSubcategories.map((item) => (
                  <TableRow
                    key={item._id}
                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/40 transition-colors"
                  >
                    {/* Sub-Category Name and Icon */}
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

                    {/* Parent Category Badge */}
                    <TableCell className="py-4 px-4">
                      <Badge variant="neutral" size="sm" className="inline-flex items-center gap-1.5 font-semibold text-gray-700">
                        <Tag size={12} className="text-[#5b52f9]" />
                        <span>{item.category?.name || "Root"}</span>
                      </Badge>
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
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </Card>

    {/* Pagination in its own Card */}
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

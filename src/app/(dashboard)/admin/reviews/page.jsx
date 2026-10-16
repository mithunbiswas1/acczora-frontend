// src/app/(dashboard)/admin/reviews/page.jsx

"use client";

import { useState } from "react";
import {
  Star,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Store,
  User,
  ShieldCheck,
  Search,
  Loader2,
  Trash2,
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
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
import { Button } from "@/components/ui/Button";
import Pagination from "@/components/ui/Pagination";
import SearchInput from "@/components/ui/SearchInput";
import SearchableSelect from "@/components/ui/SearchableSelect";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import {
  useGetAdminReviewsQuery,
  useApproveReviewMutation,
  useRejectReviewMutation,
  useDeleteReviewMutation,
} from "@/redux/api/reviewApi";
import { toast } from "sonner";

const REVIEW_STATUS_OPTIONS = [
  { label: "All Statuses", value: "all" },
  { label: "Pending Moderation", value: "pending" },
  { label: "Approved & Live", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const REVIEW_STAR_OPTIONS = [
  { label: "All Stars", value: "all" },
  { label: "5 Stars", value: "5" },
  { label: "4 Stars", value: "4" },
  { label: "3 Stars", value: "3" },
  { label: "2 Stars", value: "2" },
  { label: "1 Star", value: "1" },
];

export default function AdminReviewsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [search, setSearch] = useState("");
  const [inspectReview, setInspectReview] = useState(null);

  // APIs
  const { data: reviewsData, isLoading } = useGetAdminReviewsQuery({
    page: currentPage,
    limit: pageSize,
    status: selectedStatus,
    rating: selectedRating,
    search: search.trim() || undefined,
  });

  const [approveReview, { isLoading: isApproving }] =
    useApproveReviewMutation();
  const [rejectReview, { isLoading: isRejecting }] = useRejectReviewMutation();
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

  const reviews = reviewsData?.data?.reviews || [];
  const pagination = reviewsData?.data?.pagination || {};
  const totalItems = pagination.totalCount || 0;
  const totalPages = pagination.totalPages || 1;

  // Actions
  const handleApprove = async (id) => {
    try {
      await approveReview(id).unwrap();
      toast.success("Review approved and published live!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to approve review");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectReview({ id, feedback: "Violates review standards" }).unwrap();
      toast.warning("Review marked as rejected.");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to reject review");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to permanently delete this review?"))
      return;
    try {
      await deleteReview(id).unwrap();
      toast.success("Review deleted permanently");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete review");
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <PageHeader
        title="Review Moderation"
        description="Verify and moderate customer feedback before it goes live across the marketplace."
      />

      {/* Outside Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="w-full sm:w-80">
          <SearchInput
            placeholder="Search buyer, product, comment..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          <div className="w-full sm:w-48">
            <SearchableSelect
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              options={REVIEW_STATUS_OPTIONS}
              placeholder="Status filter"
            />
          </div>

          <div className="w-full sm:w-40">
            <SearchableSelect
              value={selectedRating}
              onChange={(e) => {
                setSelectedRating(e.target.value);
                setCurrentPage(1);
              }}
              options={REVIEW_STAR_OPTIONS}
              placeholder="Rating filter"
            />
          </div>
        </div>
      </div>

      {/* Reviews Table Card */}
      <Card className="overflow-hidden bg-white border border-border shadow-xs">
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#5b52f9] animate-spin mx-auto" />
            <p className="text-xs text-gray-400">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <EmptyState
            variant="search"
            title="No reviews found"
            description="No customer reviews match your active filter or search criteria."
            onClear={() => {
              setSearch("");
              setSelectedStatus("all");
              setSelectedRating("all");
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/60 border-b border-gray-100">
                  <TableHead className="py-3 px-4 text-xs font-bold text-gray-700">
                    Buyer
                  </TableHead>
                  <TableHead className="py-3 px-4 text-xs font-bold text-gray-700">
                    Product & Seller
                  </TableHead>
                  <TableHead className="py-3 px-4 text-xs font-bold text-gray-700">
                    Rating
                  </TableHead>
                  <TableHead className="py-3 px-4 text-xs font-bold text-gray-700">
                    Comment
                  </TableHead>
                  <TableHead className="py-3 px-4 text-xs font-bold text-gray-700">
                    Status
                  </TableHead>
                  <TableHead className="py-3 px-4 text-xs font-bold text-gray-700 text-right">
                    Moderation Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((rev) => {
                  const revId = rev._id || rev.id;

                  return (
                    <TableRow
                      key={revId}
                      className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/40 transition-colors text-xs"
                    >
                      {/* Buyer */}
                      <TableCell className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <img
                            src={rev.buyerAvatar || "/review_avater.jpg"}
                            alt=""
                            className="w-7 h-7 rounded-full object-cover border border-gray-100 flex-shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-gray-900">
                              {rev.buyerName}
                            </p>
                            <p className="text-[11px] text-gray-400 font-mono">
                              {rev.buyerEmail || "Verified Buyer"}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Product & Seller */}
                      <TableCell className="py-3.5 px-4">
                        <div>
                          <p className="font-semibold text-gray-900 line-clamp-1">
                            {rev.productTitle}
                          </p>
                          <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                            <Store size={11} />
                            <span>
                              {rev.seller?.shopName ||
                                rev.sellerName ||
                                "Seller"}
                            </span>
                          </p>
                        </div>
                      </TableCell>

                      {/* Rating */}
                      <TableCell className="py-3.5 px-4 font-bold text-gray-900">
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star size={13} className="fill-amber-400" />
                          <span>{rev.rating}.0</span>
                        </div>
                      </TableCell>

                      {/* Comment preview */}
                      <TableCell className="py-3.5 px-4 max-w-xs">
                        <p className="text-gray-600 line-clamp-2">
                          &ldquo;{rev.comment}&rdquo;
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </p>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="py-3.5 px-4">
                        {rev.status === "approved" ? (
                          <Badge variant="success" className="text-[10px]">
                            Live / Approved
                          </Badge>
                        ) : rev.status === "pending" ? (
                          <Badge variant="warning" className="text-[10px]">
                            Pending Review
                          </Badge>
                        ) : (
                          <Badge variant="danger" className="text-[10px]">
                            Rejected
                          </Badge>
                        )}
                      </TableCell>

                      {/* Moderation Actions */}
                      <TableCell className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Approve Button */}
                          {rev.status !== "approved" && (
                            <Button
                              type="button"
                              variant="brand"
                              size="xs"
                              rounded="lg"
                              disabled={isApproving}
                              onClick={() => handleApprove(revId)}
                              className="text-[11px] bg-emerald-600 hover:bg-emerald-700"
                            >
                              Approve
                            </Button>
                          )}

                          {/* Reject Button */}
                          {rev.status === "pending" && (
                            <Button
                              type="button"
                              variant="outline-border"
                              size="xs"
                              rounded="lg"
                              disabled={isRejecting}
                              onClick={() => handleReject(revId)}
                              className="text-[11px] text-rose-600 hover:bg-rose-50"
                            >
                              Reject
                            </Button>
                          )}

                          {/* Inspect View */}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon_xs"
                            rounded="lg"
                            onClick={() => setInspectReview(rev)}
                            className="text-gray-400 hover:text-gray-700"
                            title="Inspect Review"
                          >
                            <Eye size={14} />
                          </Button>

                          {/* Delete */}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon_xs"
                            rounded="lg"
                            disabled={isDeleting}
                            onClick={() => handleDelete(revId)}
                            className="text-gray-400 hover:text-rose-600"
                            title="Delete Review"
                          >
                            <Trash2 size={13} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Pagination in its own Card */}
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

      {/* Inspect Review Modal */}
      {inspectReview && (
        <Modal
          isOpen={!!inspectReview}
          onClose={() => setInspectReview(null)}
          title={`Review Details - ${inspectReview.buyerName}`}
          maxWidth="max-w-md"
        >
          <div className="p-6 space-y-4">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs space-y-1">
              <div>
                <strong>Buyer:</strong> {inspectReview.buyerName} (
                {inspectReview.buyerEmail || "Verified"})
              </div>
              <div>
                <strong>Product:</strong> {inspectReview.productTitle}
              </div>
              <div>
                <strong>Seller:</strong>{" "}
                {inspectReview.seller?.shopName || inspectReview.sellerName}
              </div>
              <div>
                <strong>Rating:</strong> {inspectReview.rating} / 5 Stars
              </div>
              <div>
                <strong>Submitted:</strong>{" "}
                {new Date(inspectReview.createdAt).toLocaleString()}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                Full Comment
              </p>
              <div className="p-3 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 leading-relaxed">
                &ldquo;{inspectReview.comment}&rdquo;
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <Button
                type="button"
                variant="outline-border"
                size="sm"
                rounded="xl"
                onClick={() => setInspectReview(null)}
              >
                Close
              </Button>
              {inspectReview.status !== "approved" && (
                <Button
                  type="button"
                  variant="brand"
                  size="sm"
                  rounded="xl"
                  onClick={() => {
                    handleApprove(inspectReview._id || inspectReview.id);
                    setInspectReview(null);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Approve Review
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

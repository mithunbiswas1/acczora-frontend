// src/app/(dashboard)/buyer/purchases/page.jsx

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Eye,
  Download,
  Copy,
  Check,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Store,
  Star,
  MessageSquare,
  Loader2,
  Clock,
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
import Pagination from "@/components/ui/Pagination";
import SearchInput from "@/components/ui/SearchInput";
import SearchableSelect from "@/components/ui/SearchableSelect";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import CredentialViewer from "@/components/ui/CredentialViewer";
import { Button } from "@/components/ui/Button";
import LinkButton from "@/components/ui/LinkButton";
import Textarea from "@/components/ui/Textarea";
import { useGetBuyerOrdersQuery } from "@/redux/api/orderApi";
import {
  useGetBuyerReviewsQuery,
  useCreateReviewMutation,
} from "@/redux/api/reviewApi";
import { toast } from "sonner";

const STATUS_FILTER_OPTIONS = [
  { label: "All Status", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "Processing", value: "processing" },
];

export default function BuyerPurchasesPage() {
  const { data: ordersData, isLoading: isLoadingOrders } =
    useGetBuyerOrdersQuery();
  const { data: reviewsData } = useGetBuyerReviewsQuery();
  const [createReview, { isLoading: isSubmittingReview }] =
    useCreateReviewMutation();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modals
  const [selectedOrderForCredentials, setSelectedOrderForCredentials] =
    useState(null);
  const [selectedOrderForReview, setSelectedOrderForReview] = useState(null);

  // Review Form State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const orders = useMemo(() => {
    return Array.isArray(ordersData?.data?.orders)
      ? ordersData.data.orders
      : Array.isArray(ordersData?.data)
      ? ordersData.data
      : [];
  }, [ordersData]);

  const reviews = useMemo(() => {
    return Array.isArray(reviewsData?.data?.reviews)
      ? reviewsData.data.reviews
      : Array.isArray(reviewsData?.data)
      ? reviewsData.data
      : [];
  }, [reviewsData]);

  // Map orderId -> review object
  const reviewMap = useMemo(() => {
    const map = {};
    reviews.forEach((r) => {
      const orderId = r.order?._id || r.order;
      if (orderId) {
        map[orderId.toString()] = r;
      }
    });
    return map;
  }, [reviews]);

  // Filtering
  const filteredOrders = useMemo(() => {
    return orders.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesTitle = item.productTitle?.toLowerCase().includes(q);
        const matchesNumber = item.orderNumber?.toLowerCase().includes(q);
        const matchesSeller =
          item.seller?.shopName?.toLowerCase().includes(q) ||
          item.seller?.fullName?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesNumber && !matchesSeller) return false;
      }
      return true;
    });
  }, [orders, statusFilter, search]);

  // Pagination
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  const handleOpenReviewModal = (order) => {
    setSelectedOrderForReview(order);
    setRating(5);
    setComment("");
  };

  const handleCloseReviewModal = () => {
    setSelectedOrderForReview(null);
    setRating(5);
    setComment("");
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please write a short review comment");
      return;
    }

    try {
      const productId =
        selectedOrderForReview.product?._id || selectedOrderForReview.product;

      await createReview({
        productId,
        orderId: selectedOrderForReview._id || selectedOrderForReview.id,
        rating,
        comment: comment.trim(),
      }).unwrap();

      toast.success(
        "Review submitted! It is pending admin approval and visible in your dashboard."
      );
      handleCloseReviewModal();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to submit review");
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <PageHeader
        title="My Purchases & Orders"
        description="View your digital account credentials, automated deliveries, and order receipts."
      />

      {/* Outside Search & Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="w-full sm:w-80">
          <SearchInput
            placeholder="Search by order #, product, or seller..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="w-full sm:w-48">
          <SearchableSelect
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            options={STATUS_FILTER_OPTIONS}
            placeholder="Filter by status"
          />
        </div>
      </div>

      {/* Orders Table Card */}
      <Card className="overflow-hidden bg-white border border-border shadow-xs">
        {isLoadingOrders ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#5b52f9] animate-spin mx-auto" />
            <p className="text-xs text-gray-400">Loading your purchases...</p>
          </div>
        ) : totalItems === 0 ? (
          orders.length === 0 ? (
            <EmptyState
              variant="empty"
              title="No purchases yet"
              description="Start exploring our digital marketplace to buy verified digital accounts."
              actionHref="/marketplace"
              actionLabel="Explore Marketplace"
            />
          ) : (
            <EmptyState
              variant="search"
              title="No orders found"
              description="No orders match your search criteria or filter."
              onClear={() => {
                setSearch("");
                setStatusFilter("all");
              }}
            />
          )
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/60 border-b border-gray-100">
                  <TableHead className="py-3 px-4 text-xs font-bold text-gray-700">
                    Order ID
                  </TableHead>
                  <TableHead className="py-3 px-4 text-xs font-bold text-gray-700">
                    Product
                  </TableHead>
                  <TableHead className="py-3 px-4 text-xs font-bold text-gray-700">
                    Seller
                  </TableHead>
                  <TableHead className="py-3 px-4 text-xs font-bold text-gray-700">
                    Amount
                  </TableHead>
                  <TableHead className="py-3 px-4 text-xs font-bold text-gray-700">
                    Date
                  </TableHead>
                  <TableHead className="py-3 px-4 text-xs font-bold text-gray-700">
                    Status
                  </TableHead>
                  <TableHead className="py-3 px-4 text-xs font-bold text-gray-700 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.map((order) => {
                  const orderId = (order._id || order.id).toString();
                  const existingReview = reviewMap[orderId];
                  const deliveredCount =
                    order.deliveredCredentials?.length || order.quantity || 1;

                  return (
                    <TableRow
                      key={orderId}
                      className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/40 transition-colors text-xs"
                    >
                      {/* Order Number */}
                      <TableCell className="py-3.5 px-4 font-mono font-bold text-gray-900">
                        {order.orderNumber}
                      </TableCell>

                      {/* Product */}
                      <TableCell className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={
                              order.productThumbnail ||
                              order.product?.thumbnail ||
                              "/review_avater.jpg"
                            }
                            alt=""
                            className="w-8 h-8 rounded-lg object-cover border border-gray-100 flex-shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-gray-900 line-clamp-1">
                              {order.productTitle ||
                                order.product?.title ||
                                "Digital Account"}
                            </p>
                            <p className="text-[11px] text-gray-400">
                              Qty: {deliveredCount} account(s)
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Seller */}
                      <TableCell className="py-3.5 px-4 text-gray-700">
                        <div className="flex items-center gap-1.5">
                          <Store size={12} className="text-gray-400" />
                          <span>
                            {order.seller?.shopName ||
                              order.seller?.fullName ||
                              "Verified Merchant"}
                          </span>
                        </div>
                      </TableCell>

                      {/* Amount */}
                      <TableCell className="py-3.5 px-4 font-bold text-gray-900">
                        ${order.totalAmount}
                      </TableCell>

                      {/* Date */}
                      <TableCell className="py-3.5 px-4 text-gray-500 text-[11px]">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>

                      {/* Status */}
                      <TableCell className="py-3.5 px-4">
                        <Badge
                          variant={
                            order.status === "completed" ? "success" : "neutral"
                          }
                          className="text-[10px] capitalize"
                        >
                          {order.status || "Completed"}
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* View Accounts Page Link */}
                          <Link
                            href={`/buyer/purchases/${orderId}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-brand text-white hover:bg-brand/90 transition-colors shadow-2xs"
                          >
                            <Eye size={13} />
                            <span>View Accounts</span>
                          </Link>

                          {/* Review Action */}
                          {existingReview ? (
                            existingReview.is_approved ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                                <Check size={11} />
                                <span>{existingReview.rating}★ Live</span>
                              </span>
                            ) : (
                              <span
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200"
                                title="Pending admin approval - only visible to you"
                              >
                                <Clock size={11} />
                                <span>Pending Approval</span>
                              </span>
                            )
                          ) : (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              rounded="xl"
                              onClick={() => handleOpenReviewModal(order)}
                              className="text-xs"
                            >
                              <Star size={13} className="text-amber-500" />
                              <span>Review</span>
                            </Button>
                          )}
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

      {/* Review Modal */}
      {selectedOrderForReview && (
        <Modal
          isOpen={!!selectedOrderForReview}
          onClose={handleCloseReviewModal}
          title="Write a Product Review"
        >
          <form onSubmit={handleSubmitReview} className="p-6 space-y-5">
            <div>
              <p className="text-xs text-gray-400">Reviewing Product</p>
              <p className="text-sm font-bold text-gray-900 mt-0.5">
                {selectedOrderForReview.productTitle}
              </p>
              <p className="text-[11px] text-gray-500 mt-1">
                Order #{selectedOrderForReview.orderNumber}
              </p>
            </div>

            {/* Star Rating Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">
                Rating
              </label>
              <div className="flex items-center gap-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 text-gray-300 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      size={24}
                      className={
                        (hoverRating || rating) >= star
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-200"
                      }
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-gray-700 ml-2">
                  {rating} of 5 Stars
                </span>
              </div>
            </div>

            {/* Comment */}
            <div>
              <Textarea
                label="Your Review Feedback"
                required
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this account delivery, login smoothness, and seller support..."
              />
              <p className="text-[11px] text-gray-400 mt-1.5">
                Note: Upon submission, your review will be visible to you
                immediately. It will become public to all visitors once approved
                by admin.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <Button
                type="button"
                variant="outline-border"
                size="default"
                rounded="xl"
                onClick={handleCloseReviewModal}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="brand"
                size="default"
                rounded="xl"
                disabled={isSubmittingReview}
              >
                {isSubmittingReview && (
                  <Loader2 size={14} className="animate-spin" />
                )}
                <span>Submit Review</span>
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

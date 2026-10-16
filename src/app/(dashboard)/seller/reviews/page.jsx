// src/app/(dashboard)/seller/reviews/page.jsx

"use client";

import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  Star,
  MessageSquare,
  CheckCircle,
  Search,
  ThumbsUp,
  Loader2,
  Clock,
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import Pagination from "@/components/ui/Pagination";
import SearchInput from "@/components/ui/SearchInput";
import SearchableSelect from "@/components/ui/SearchableSelect";
import Textarea from "@/components/ui/Textarea";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import {
  useGetStoreReviewsQuery,
  useReplyToReviewMutation,
} from "@/redux/api/reviewApi";
import { toast } from "sonner";

const SELLER_RATING_OPTIONS = [
  { label: "All Ratings", value: "all" },
  { label: "5 Stars ★★★★★", value: "5" },
  { label: "4 Stars ★★★★", value: "4" },
  { label: "3 Stars ★★★", value: "3" },
  { label: "2 Stars ★★", value: "2" },
  { label: "1 Star ★", value: "1" },
];

export default function SellerReviewsPage() {
  const { user } = useSelector((state) => state.auth);
  const sellerId = user?._id || user?.id;

  const { data: reviewsData, isLoading } = useGetStoreReviewsQuery(sellerId, {
    skip: !sellerId,
  });

  const [replyToReview, { isLoading: isReplying }] =
    useReplyToReviewMutation();

  const [selectedRating, setSelectedRating] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Reply Modal
  const [activeReplyReview, setActiveReplyReview] = useState(null);
  const [replyText, setReplyText] = useState("");

  const rawReviews = useMemo(() => {
    return Array.isArray(reviewsData?.data?.reviews)
      ? reviewsData.data.reviews
      : Array.isArray(reviewsData?.data)
      ? reviewsData.data
      : [];
  }, [reviewsData]);

  // Filtering
  const filteredReviews = useMemo(() => {
    return rawReviews.filter((r) => {
      if (selectedRating !== "all" && String(r.rating) !== selectedRating)
        return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesProduct = r.productTitle?.toLowerCase().includes(q);
        const matchesBuyer = r.buyerName?.toLowerCase().includes(q);
        const matchesComment = r.comment?.toLowerCase().includes(q);
        if (!matchesProduct && !matchesBuyer && !matchesComment) return false;
      }
      return true;
    });
  }, [rawReviews, selectedRating, search]);

  // Pagination
  const totalItems = filteredReviews.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedReviews = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredReviews.slice(start, start + pageSize);
  }, [filteredReviews, currentPage, pageSize]);

  const handleOpenReplyModal = (rev) => {
    setActiveReplyReview(rev);
    setReplyText(rev.sellerReply || "");
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) {
      toast.error("Please enter a response message");
      return;
    }

    try {
      await replyToReview({
        id: activeReplyReview._id || activeReplyReview.id,
        reply: replyText.trim(),
      }).unwrap();

      toast.success("Reply published successfully!");
      setActiveReplyReview(null);
      setReplyText("");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to post reply");
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <PageHeader
        title="Store Customer Reviews"
        description="View approved reviews left by buyers on your digital accounts and engage with your customers."
      />

      {/* Outside Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="w-full sm:w-80">
          <SearchInput
            placeholder="Search by buyer, product, or comment..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="w-full sm:w-48">
          <SearchableSelect
            value={selectedRating}
            onChange={(e) => {
              setSelectedRating(e.target.value);
              setCurrentPage(1);
            }}
            options={SELLER_RATING_OPTIONS}
            placeholder="Filter by stars"
          />
        </div>
      </div>

      {/* Reviews List Card */}
      <Card className="overflow-hidden bg-white border border-border shadow-xs">
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#5b52f9] animate-spin mx-auto" />
            <p className="text-xs text-gray-400">Loading customer reviews...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <EmptyState
            variant="search"
            title="No reviews found"
            description="No customer reviews match your active filter."
            onClear={() => {
              setSearch("");
              setSelectedRating("all");
            }}
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {paginatedReviews.map((rev) => {
              const revId = rev._id || rev.id;

              return (
                <div
                  key={revId}
                  className="p-5 sm:p-6 hover:bg-gray-50/40 transition-colors space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={rev.buyerAvatar || "/review_avater.jpg"}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover border border-gray-100"
                      />
                      <div>
                        <p className="text-xs font-bold text-gray-900">
                          {rev.buyerName || "Verified Buyer"}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          Purchased:{" "}
                          <span className="font-semibold text-gray-700">
                            {rev.productTitle}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={13}
                            className={
                              i < rev.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-gray-200"
                            }
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-gray-400">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Comment */}
                  <p className="text-xs text-gray-700 leading-relaxed pl-1">
                    &ldquo;{rev.comment}&rdquo;
                  </p>

                  {/* Seller Reply Box */}
                  {rev.sellerReply ? (
                    <div className="mt-3 p-3.5 bg-purple-50/60 rounded-xl border border-purple-100/80 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#5b52f9] flex items-center gap-1.5 text-[11px]">
                          <MessageSquare size={12} />
                          Your Public Response
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="xs"
                          rounded="lg"
                          onClick={() => handleOpenReplyModal(rev)}
                          className="text-[11px] text-gray-500 hover:text-gray-900"
                        >
                          Edit
                        </Button>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {rev.sellerReply}
                      </p>
                    </div>
                  ) : (
                    <div className="pt-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="xs"
                        rounded="xl"
                        onClick={() => handleOpenReplyModal(rev)}
                        className="text-xs text-gray-700"
                      >
                        <MessageSquare size={12} className="text-[#5b52f9]" />
                        <span>Reply to Customer</span>
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
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

      {/* Reply Modal */}
      {activeReplyReview && (
        <Modal
          isOpen={!!activeReplyReview}
          onClose={() => setActiveReplyReview(null)}
          title="Reply to Customer Feedback"
        >
          <form onSubmit={handleSendReply} className="p-6 space-y-4">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs">
              <p className="font-bold text-gray-900">
                {activeReplyReview.buyerName} on{" "}
                {activeReplyReview.productTitle}
              </p>
              <p className="text-gray-600 italic mt-1">
                &ldquo;{activeReplyReview.comment}&rdquo;
              </p>
            </div>

            <Textarea
              label="Your Public Reply"
              required
              rows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a professional thank you or customer support response..."
            />

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
              <Button
                type="button"
                variant="outline-border"
                size="default"
                rounded="xl"
                onClick={() => setActiveReplyReview(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="brand"
                size="default"
                rounded="xl"
                disabled={isReplying}
              >
                {isReplying && <Loader2 size={14} className="animate-spin" />}
                <span>Post Reply</span>
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

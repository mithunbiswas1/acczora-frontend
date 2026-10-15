// src/app/(dashboard)/seller/reviews/page.jsx

"use client";

import { useState } from "react";
import { Star, MessageSquare, CheckCircle, Search, ThumbsUp } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Pagination from "@/components/ui/Pagination";
import SearchInput from "@/components/ui/SearchInput";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Typography, H3, P, Caption } from "@/components/ui/Typography";
import { toast } from "sonner";

const DEMO_REVIEWS = [
  {
    id: "rev-1",
    buyer: "Alex Mercer",
    product: "Netflix Premium UHD 4K (1 Month)",
    rating: 5,
    comment: "Delivered immediately in less than 5 seconds. Account works perfectly on my smart TV! Highly recommended seller.",
    date: "Oct 12, 2026",
    status: "approved",
    sellerReply: "Thank you for shopping with NovaStore! Enjoy your streaming.",
  },
  {
    id: "rev-2",
    buyer: "Sarah Jenkins",
    product: "Canva Pro Educational (1 Year)",
    rating: 5,
    comment: "Invitation link joined my Canva workspace flawlessly. All Pro templates and fonts unlocked right away.",
    date: "Oct 11, 2026",
    status: "approved",
    sellerReply: null,
  },
  {
    id: "rev-3",
    buyer: "Devin Vance",
    product: "ChatGPT Plus Shared Profile",
    rating: 5,
    comment: "Fast auto-delivery. GPT-4o and DALL-E work smoothly with no login hitches.",
    date: "Oct 10, 2026",
    status: "approved",
    sellerReply: "Glad to hear that, Devin! Reach out anytime if you need renewal.",
  },
  {
    id: "rev-4",
    buyer: "Elena Rostova",
    product: "NordVPN Dedicated IP (2 Years)",
    rating: 4,
    comment: "Great speed and clean dedicated IP. Good seller, responded fast to my query.",
    date: "Oct 08, 2026",
    status: "approved",
    sellerReply: null,
  },
  {
    id: "rev-5",
    buyer: "Carlos Mendes",
    product: "Spotify Family Slot (6 Months)",
    rating: 5,
    comment: "Accepted family invite with zero location issues. Best price on the platform.",
    date: "Oct 04, 2026",
    status: "approved",
    sellerReply: null,
  },
];

export default function SellerReviewsPage() {
  const [reviews, setReviews] = useState(DEMO_REVIEWS);
  const [searchTerm, setSearchTerm] = useState("");
  const [starFilter, setStarFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [replyingReview, setReplyingReview] = useState(null);
  const [replyText, setReplyText] = useState("");

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setReviews(
      reviews.map((r) =>
        r.id === replyingReview.id ? { ...r, sellerReply: replyText } : r
      )
    );
    toast.success("Reply posted to customer review!");
    setReplyingReview(null);
    setReplyText("");
  };

  const filtered = reviews.filter((r) => {
    const matchesSearch =
      r.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStar =
      starFilter === "all" || r.rating.toString() === starFilter;

    return matchesSearch && matchesStar;
  });

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-border">
        <div>
          <H3 className="text-xl font-bold text-gray-900">Customer Ratings & Reviews</H3>
          <P className="text-xs text-gray-500 mt-1">
            Real feedback from verified account buyers.
          </P>
        </div>
        <div className="flex items-center gap-3 bg-[#fffaf0] border border-amber-200 p-3 rounded-2xl">
          <div className="flex items-center gap-1 text-amber-500">
            <Star size={20} className="fill-amber-400 text-amber-400" />
            <span className="text-xl font-extrabold text-gray-900">4.9</span>
          </div>
          <Caption className="text-gray-500 font-semibold">
            Based on 184 verified sales
          </Caption>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-border flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="w-full md:w-80">
          <SearchInput
            placeholder="Search reviews by buyer or product..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Caption className="text-gray-400 font-medium">Rating:</Caption>
          <Select
            variant="filter"
            value={starFilter}
            onChange={(e) => {
              setStarFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-auto"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars ★★★★★</option>
            <option value="4">4 Stars ★★★★</option>
            <option value="3">3 Stars ★★★</option>
            <option value="2">2 Stars ★★</option>
            <option value="1">1 Star ★</option>
          </Select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-2xl border border-border divide-y divide-border overflow-hidden">
        {paginated.length === 0 ? (
          <EmptyState
            title="No reviews found"
            description="No customer reviews match your filter."
          />
        ) : (
          paginated.map((rev) => (
            <div key={rev.id} className="p-6 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">{rev.buyer}</span>
                    <Badge variant="active" size="sm">Verified Buyer</Badge>
                  </div>
                  <Caption className="text-gray-500 mt-0.5">
                    Purchased: <strong className="text-gray-700">{rev.product}</strong>
                  </Caption>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < rev.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}
                      />
                    ))}
                  </div>
                  <Caption className="text-gray-400">{rev.date}</Caption>
                </div>
              </div>

              <Typography variant="p" className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-3.5 rounded-xl border border-border/60">
                &ldquo;{rev.comment}&rdquo;
              </Typography>

              {rev.sellerReply ? (
                <div className="ml-4 pl-3 border-l-2 border-brand text-xs text-gray-600 bg-brand/5 p-3 rounded-r-xl">
                  <span className="font-bold text-brand block mb-0.5">Your Response:</span>
                  {rev.sellerReply}
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => {
                    setReplyingReview(rev);
                    setReplyText("");
                  }}
                  className="text-brand"
                >
                  <MessageSquare size={13} /> Reply to Buyer
                </Button>
              )}
            </div>
          ))
        )}

        <div className="p-4 bg-white border-t border-border">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={(p) => setCurrentPage(p)}
          />
        </div>
      </div>

      {/* Reply Modal */}
      {replyingReview && (
        <Modal
          isOpen={!!replyingReview}
          onClose={() => setReplyingReview(null)}
          title={`Reply to ${replyingReview.buyer}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleSendReply} className="space-y-4">
            <Caption className="text-gray-500 bg-gray-50 p-3 rounded-xl border border-border block">
              &ldquo;{replyingReview.comment}&rdquo;
            </Caption>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                Your Public Response
              </label>
              <textarea
                required
                rows={3}
                placeholder="Thank you for your purchase! We are glad you enjoyed the service..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full p-3 rounded-xl border border-border text-xs text-gray-900 focus:outline-none focus:border-brand"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                rounded="xl"
                onClick={() => setReplyingReview(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="brand"
                size="sm"
                rounded="xl"
              >
                Post Response
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

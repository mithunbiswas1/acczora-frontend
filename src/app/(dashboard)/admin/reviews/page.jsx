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
} from "lucide-react";
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
import Button from "@/components/ui/Button";
import Typography from "@/components/ui/Typography";
import Pagination from "@/components/ui/Pagination";
import SearchInput from "@/components/ui/SearchInput";
import SearchableSelect from "@/components/ui/SearchableSelect";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
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

const INITIAL_REVIEWS = [
  {
    id: "rev-101",
    buyer: "Alex Mercer",
    buyerEmail: "alex.m@gmail.com",
    seller: "NovaStore",
    product: "Netflix Premium UHD 4K (1 Month)",
    rating: 5,
    comment: "Delivered immediately in less than 5 seconds. Account works perfectly on my smart TV! Highly recommended seller.",
    date: "Oct 12, 2026",
    status: "approved",
  },
  {
    id: "rev-102",
    buyer: "Sarah Jenkins",
    buyerEmail: "sarah.j@outlook.com",
    seller: "NovaStore",
    product: "Canva Pro Educational (1 Year)",
    rating: 5,
    comment: "Invitation link joined my Canva workspace flawlessly. All Pro templates and fonts unlocked right away.",
    date: "Oct 11, 2026",
    status: "approved",
  },
  {
    id: "rev-103",
    buyer: "Devin Vance",
    buyerEmail: "devin.v@gmail.com",
    seller: "AI Accounts Global",
    product: "ChatGPT Plus Shared Profile",
    rating: 5,
    comment: "Fast auto-delivery. GPT-4o and DALL-E work smoothly with no login hitches.",
    date: "Oct 10, 2026",
    status: "pending",
  },
  {
    id: "rev-104",
    buyer: "Tariqul Islam",
    buyerEmail: "tariqul@gmail.com",
    seller: "DigitalVault BD",
    product: "Spotify Family Slot 6 Months",
    rating: 5,
    comment: "Great experience. Instant delivery directly in my buyer dashboard.",
    date: "Oct 10, 2026",
    status: "pending",
  },
  {
    id: "rev-105",
    buyer: "SpamBot99",
    buyerEmail: "bot99@trashmail.com",
    seller: "CyberSafe Store",
    product: "NordVPN Dedicated IP 2-Year Plan",
    rating: 1,
    comment: "Contact me on telegram @scammer for free accounts click here bit.ly/fake",
    date: "Oct 09, 2026",
    status: "rejected",
  },
];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [starFilter, setStarFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [inspectReview, setInspectReview] = useState(null);

  const handleApprove = (reviewId) => {
    setReviews(
      reviews.map((r) => (r.id === reviewId ? { ...r, status: "approved" } : r))
    );
    toast.success("Review approved! It is now live on the public product page.");
  };

  const handleReject = (reviewId) => {
    setReviews(
      reviews.map((r) => (r.id === reviewId ? { ...r, status: "rejected" } : r))
    );
    toast.error("Review rejected and hidden from public marketplace.");
  };

  const filtered = reviews.filter((r) => {
    const matchesSearch =
      r.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || r.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesStar =
      starFilter === "all" || r.rating.toString() === starFilter;

    return matchesSearch && matchesStatus && matchesStar;
  });

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const pendingCount = reviews.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-border">
        <div>
          <Typography variant="h3" weight="bold">
            Review Moderation System
          </Typography>
          <Typography variant="caption" color="tertiary" className="mt-1">
            Moderate buyer reviews. Only approved reviews appear publicly on product listings.
          </Typography>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
            {pendingCount} Pending Moderation
          </span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-border flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="w-full md:w-80">
          <SearchInput
            placeholder="Search by buyer, seller, product, or comment..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-gray-400 font-medium">Status:</span>
            <SearchableSelect
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              options={REVIEW_STATUS_OPTIONS}
              placeholder="All Statuses"
              size="sm"
              clearable={false}
              className="w-44"
            />
          </div>

          {/* Star Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-gray-400 font-medium">Rating:</span>
            <SearchableSelect
              value={starFilter}
              onChange={(e) => {
                setStarFilter(e.target.value);
                setCurrentPage(1);
              }}
              options={REVIEW_STAR_OPTIONS}
              placeholder="All Stars"
              size="sm"
              clearable={false}
              className="w-36"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        {paginated.length === 0 ? (
          <EmptyState
            title="No reviews found"
            description="No buyer feedback matches your current filter."
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Product & Seller</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Review Comment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Public Status</TableHead>
                  <TableHead className="text-right">Moderation Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((rev) => (
                  <TableRow key={rev.id}>
                    <TableCell>
                      <div>
                        <p className="font-bold text-gray-900 text-xs">{rev.buyer}</p>
                        <p className="text-[11px] text-gray-400">{rev.buyerEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="font-semibold text-gray-900 text-xs truncate">{rev.product}</p>
                        <p className="text-[11px] text-gray-400">Seller: {rev.seller}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={i < rev.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-xs text-gray-700 truncate" title={rev.comment}>
                        &ldquo;{rev.comment}&rdquo;
                      </p>
                    </TableCell>
                    <TableCell className="text-xs text-gray-500">{rev.date}</TableCell>
                    <TableCell>
                      <Badge variant={rev.status} dot>
                        {rev.status === "approved"
                          ? "Live on Store"
                          : rev.status === "rejected"
                            ? "Rejected"
                            : "Pending Approval"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {rev.status !== "approved" && (
                          <Button
                            variant="success"
                            size="xs"
                            rounded="lg"
                            onClick={() => handleApprove(rev.id)}
                          >
                            Approve
                          </Button>
                        )}
                        {rev.status !== "rejected" && (
                          <Button
                            variant="danger_subtle"
                            size="xs"
                            rounded="lg"
                            onClick={() => handleReject(rev.id)}
                          >
                            Reject
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="xs"
                          rounded="lg"
                          onClick={() => setInspectReview(rev)}
                          className="p-1 text-gray-400 hover:text-gray-700"
                          title="Read full review"
                        >
                          <Eye size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </div>

      {/* Pagination in its own Card */}
      {paginated.length > 0 && (
        <Card className="bg-white p-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={(p) => setCurrentPage(p)}
          />
        </Card>
      )}

      {/* Inspect Review Modal */}
      {inspectReview && (
        <Modal
          isOpen={!!inspectReview}
          onClose={() => setInspectReview(null)}
          title={`Review Details - ${inspectReview.buyer}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-xl border border-border text-xs space-y-1">
              <div><strong>Buyer:</strong> {inspectReview.buyer} ({inspectReview.buyerEmail})</div>
              <div><strong>Product:</strong> {inspectReview.product}</div>
              <div><strong>Seller:</strong> {inspectReview.seller}</div>
              <div><strong>Rating:</strong> {inspectReview.rating} / 5 Stars</div>
              <div><strong>Submitted:</strong> {inspectReview.date}</div>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Full Comment</p>
              <div className="p-3 bg-white border border-border rounded-xl text-xs text-gray-800 leading-relaxed">
                &ldquo;{inspectReview.comment}&rdquo;
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                rounded="xl"
                onClick={() => setInspectReview(null)}
              >
                Close
              </Button>
              {inspectReview.status !== "approved" && (
                <Button
                  variant="success"
                  size="sm"
                  rounded="xl"
                  onClick={() => {
                    handleApprove(inspectReview.id);
                    setInspectReview(null);
                  }}
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

// src/app/(dashboard)/admin/withdrawals/page.jsx

"use client";

import { useState } from "react";
import {
  Wallet,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  Store,
  Mail,
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
import Button from "@/components/ui/Button";
import Typography from "@/components/ui/Typography";
import Input from "@/components/ui/Input";
import Pagination from "@/components/ui/Pagination";
import SearchInput from "@/components/ui/SearchInput";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import { toast } from "sonner";

const INITIAL_WITHDRAWALS = [
  {
    id: "#WD-1083",
    seller: "NovaStore",
    sellerEmail: "seller@acczora.com",
    method: "USDT (TRC-20)",
    destination: "TQr99zMnkLw10Vx45ZaBcv1111Aa",
    amount: "$250.00",
    net: "$249.00",
    date: "Oct 12, 2026",
    status: "pending",
    txRef: "Awaiting Processing",
  },
  {
    id: "#WD-1084",
    seller: "DigitalVault BD",
    sellerEmail: "support@digitalvault.io",
    method: "bKash Personal",
    destination: "+8801712994821",
    amount: "$420.00",
    net: "$420.00",
    date: "Oct 12, 2026",
    status: "pending",
    txRef: "Awaiting Processing",
  },
  {
    id: "#WD-1085",
    seller: "AccountKing Global",
    sellerEmail: "king@accounts.net",
    method: "Binance Pay ID",
    destination: "binance_id_9921441",
    amount: "$1,100.00",
    net: "$1,100.00",
    date: "Oct 11, 2026",
    status: "pending",
    txRef: "Awaiting Processing",
  },
  {
    id: "#WD-1082",
    seller: "NovaStore",
    sellerEmail: "seller@acczora.com",
    method: "USDT (TRC-20)",
    destination: "TYz84kLmnPq92Vx45ZaBcv1098Xy",
    amount: "$450.00",
    net: "$449.00",
    date: "Oct 10, 2026",
    status: "completed",
    txRef: "TX-TRC20-9982410a8f9c1b72e0d3f4a",
  },
  {
    id: "#WD-1081",
    seller: "GameHaven",
    sellerEmail: "alex@gamehaven.com",
    method: "Binance Pay ID",
    destination: "binance_id_88294103",
    amount: "$300.00",
    net: "$300.00",
    date: "Oct 05, 2026",
    status: "completed",
    txRef: "BP-9982410294",
  },
  {
    id: "#WD-1078",
    seller: "QuickKeys Ltd",
    sellerEmail: "keys@quick.io",
    method: "bKash Personal",
    destination: "+8801999999999",
    amount: "$80.00",
    net: "$80.00",
    date: "Sep 25, 2026",
    status: "rejected",
    txRef: "Invalid Phone Number provided",
  },
];

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState(INITIAL_WITHDRAWALS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Modals for approval and rejection
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const [txRefInput, setTxRefInput] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  const handleApprove = (e) => {
    e.preventDefault();
    if (!selectedWithdrawal || !txRefInput.trim()) return;

    setWithdrawals(
      withdrawals.map((w) =>
        w.id === selectedWithdrawal.id
          ? { ...w, status: "completed", txRef: txRefInput.trim() }
          : w
      )
    );
    toast.success(`Withdrawal ${selectedWithdrawal.id} marked as completed!`);
    setIsApproveModalOpen(false);
    setSelectedWithdrawal(null);
    setTxRefInput("");
  };

  const handleReject = (e) => {
    e.preventDefault();
    if (!selectedWithdrawal || !rejectReason.trim()) return;

    setWithdrawals(
      withdrawals.map((w) =>
        w.id === selectedWithdrawal.id
          ? { ...w, status: "rejected", txRef: `Rejected: ${rejectReason.trim()}` }
          : w
      )
    );
    toast.error(`Withdrawal ${selectedWithdrawal.id} has been rejected.`);
    setIsRejectModalOpen(false);
    setSelectedWithdrawal(null);
    setRejectReason("");
  };

  const filtered = withdrawals.filter((w) => {
    const matchesSearch =
      w.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.sellerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.destination.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || w.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const pendingCount = withdrawals.filter((w) => w.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-border">
        <div>
          <Typography variant="h3" weight="bold">
            Seller Withdrawal Moderation
          </Typography>
          <Typography variant="caption" color="tertiary" className="mt-1">
            Authorize seller earnings disbursements, log transaction references, and manage payout queues.
          </Typography>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
            {pendingCount} Pending Requests
          </span>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-border flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="w-full md:w-80">
          <SearchInput
            placeholder="Search by ID, seller name, or address..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-gray-400 font-medium">Status:</span>
          <Select
            variant="filter"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-auto"
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending Only</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        {paginated.length === 0 ? (
          <EmptyState
            title="No withdrawal requests"
            description="No payout requests match your filter."
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Seller</TableHead>
                  <TableHead>Method & Destination</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Net Payout</TableHead>
                  <TableHead>Requested Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-xs font-semibold text-brand">
                      {item.id}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-bold text-gray-900 text-xs">{item.seller}</p>
                        <p className="text-[11px] text-gray-400">{item.sellerEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold text-gray-800 text-xs">{item.method}</p>
                        <p className="font-mono text-[11px] text-gray-500 max-w-xs truncate">
                          {item.destination}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-gray-600 font-medium">
                      {item.amount}
                    </TableCell>
                    <TableCell className="text-xs font-bold text-gray-900">
                      {item.net}
                    </TableCell>
                    <TableCell className="text-xs text-gray-500">{item.date}</TableCell>
                    <TableCell>
                      <Badge variant={item.status} dot>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {item.status === "pending" ? (
                        <div className="inline-flex items-center gap-1.5">
                          <Button
                            variant="success"
                            size="xs"
                            rounded="lg"
                            onClick={() => {
                              setSelectedWithdrawal(item);
                              setIsApproveModalOpen(true);
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="danger_subtle"
                            size="xs"
                            rounded="lg"
                            onClick={() => {
                              setSelectedWithdrawal(item);
                              setIsRejectModalOpen(true);
                            }}
                          >
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="font-mono text-[11px] text-gray-400 max-w-xs truncate inline-block">
                          {item.txRef}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="p-4 border-t border-border">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                pageSize={pageSize}
                onPageChange={(p) => setCurrentPage(p)}
              />
            </div>
          </>
        )}
      </div>

      {/* Approve Modal */}
      {isApproveModalOpen && selectedWithdrawal && (
        <Modal
          isOpen={isApproveModalOpen}
          onClose={() => setIsApproveModalOpen(false)}
          title={`Approve Payout - ${selectedWithdrawal.id}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleApprove} className="space-y-4">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 space-y-1">
              <div>
                <strong>Seller:</strong> {selectedWithdrawal.seller} ({selectedWithdrawal.sellerEmail})
              </div>
              <div>
                <strong>Amount to Send:</strong> {selectedWithdrawal.net} via {selectedWithdrawal.method}
              </div>
              <div className="font-mono truncate">
                <strong>Destination:</strong> {selectedWithdrawal.destination}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                Transaction Reference / Blockchain TxHash <span className="text-rose-500">*</span>
              </label>
              <Input
                required
                placeholder="e.g. TX-TRC20-xxxx-yyyy or BK-998241LA"
                value={txRefInput}
                onChange={(e) => setTxRefInput(e.target.value)}
              />
              <p className="text-[11px] text-gray-400 mt-1">
                This transaction reference will be saved in the seller&apos;s withdrawal ledger.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                rounded="xl"
                onClick={() => setIsApproveModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="success"
                size="sm"
                rounded="xl"
              >
                Confirm Payout
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Reject Modal */}
      {isRejectModalOpen && selectedWithdrawal && (
        <Modal
          isOpen={isRejectModalOpen}
          onClose={() => setIsRejectModalOpen(false)}
          title={`Reject Payout - ${selectedWithdrawal.id}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleReject} className="space-y-4">
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-800">
              Rejecting this withdrawal will refund the amount back to the seller&apos;s available balance.
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                Rejection Reason <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="e.g. Wallet address is invalid or flagged. Please provide a verified Binance Pay ID."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-3 rounded-xl border border-border text-xs text-gray-900 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                rounded="xl"
                onClick={() => setIsRejectModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="danger"
                size="sm"
                rounded="xl"
              >
                Confirm Rejection
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

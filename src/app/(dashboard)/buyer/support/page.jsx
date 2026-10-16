// src/app/(dashboard)/buyer/support/page.jsx

"use client";

import { useState } from "react";
import {
  LifeBuoy,
  Plus,
  Send,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShoppingBag,
} from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import Badge from "@/components/ui/Badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import SearchableSelect from "@/components/ui/SearchableSelect";
import Textarea from "@/components/ui/Textarea";
import { Typography, H2, H3, P, Caption } from "@/components/ui/Typography";
import { toast } from "sonner";

const BUYER_SUPPORT_CATEGORIES = [
  { label: "Account Credentials Stopped Working", value: "Replacement Warranty" },
  { label: "License / Product Key Invalid", value: "Invalid Key" },
  { label: "Payment or Billing Issue", value: "Billing" },
  { label: "Other Question", value: "General" },
];

const BUYER_TICKETS = [
  {
    id: "#TK-3011",
    orderId: "#ORD-9824",
    subject: "Netflix 4K account password changed by owner",
    category: "Replacement Warranty",
    status: "open",
    updatedAt: "45 mins ago",
    messages: [
      { sender: "You", text: "Purchased order #ORD-9824 2 days ago, but now credentials show wrong password. Need replacement or refund under warranty.", time: "45 mins ago" },
    ],
  },
  {
    id: "#TK-2940",
    orderId: "#ORD-9701",
    subject: "Steam key already redeemed error",
    category: "Invalid Key",
    status: "resolved",
    updatedAt: "1 week ago",
    messages: [
      { sender: "You", text: "The Steam key provided was already activated on another account.", time: "1 week ago" },
      { sender: "Admin Support", text: "Seller issued replacement key. Order closed successfully.", time: "6 days ago" },
    ],
  },
];

export default function BuyerSupportPage() {
  const [tickets, setTickets] = useState(BUYER_TICKETS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const [newTicket, setNewTicket] = useState({
    orderId: "",
    subject: "",
    category: "Replacement Warranty",
    message: "",
  });

  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!newTicket.subject.trim() || !newTicket.message.trim()) {
      toast.error("Please fill in subject and description");
      return;
    }

    const created = {
      id: `#TK-${Math.floor(3200 + Math.random() * 800)}`,
      orderId: newTicket.orderId.trim() || "N/A",
      subject: newTicket.subject.trim(),
      category: newTicket.category,
      status: "open",
      updatedAt: "Just now",
      messages: [
        { sender: "You", text: newTicket.message.trim(), time: "Just now" },
      ],
    };

    setTickets([created, ...tickets]);
    setIsModalOpen(false);
    setNewTicket({ orderId: "", subject: "", category: "Replacement Warranty", message: "" });
    toast.success("Support request submitted! We will investigate immediately.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <H2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
            Buyer Help & Warranty Claims
          </H2>
          <P className="text-xs text-gray-500 mt-1">
            Protected by ACCZORA Escrow & Buyer Guarantee. Get replacements or dispute resolutions.
          </P>
        </div>

        <Button
          variant="solid"
          size="default"
          onClick={() => setIsModalOpen(true)}
          icon={<Plus size={16} />}
        >
          Open Support Claim
        </Button>
      </div>

      {/* Buyer Protection Guarantee Banner */}
      <div className="bg-gradient-to-r from-brand/10 via-brand/5 to-white p-5 rounded-2xl border border-brand/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-brand text-white flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">100% ACCZORA Buyer Protection</p>
            <p className="text-xs text-gray-500">
              Your payments are held in escrow. If credentials do not match or stop working within warranty, you receive a free replacement or instant refund.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Active Claims"
          value={tickets.filter((t) => t.status === "open").length}
          icon={AlertCircle}
          trend="Under review by seller & staff"
          trendDirection="neutral"
        />
        <StatCard
          title="Resolved Inquiries"
          value={tickets.filter((t) => t.status === "resolved").length}
          icon={CheckCircle2}
          trend="Completed warranty claims"
          trendDirection="up"
        />
        <StatCard
          title="Average Resolution"
          value="< 2 hours"
          icon={LifeBuoy}
          trend="Escrow protection guarantee"
          trendDirection="up"
        />
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-2xl border border-border shadow-xs overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <H3 className="text-sm font-bold text-gray-900">My Warranty & Support Claims</H3>
          <span className="text-xs text-gray-500">{tickets.length} total</span>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Claim ID</TableHead>
              <TableHead>Order Ref</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-gray-400 text-xs">
                  You have no open warranty claims or support requests.
                </TableCell>
              </TableRow>
            ) : (
              tickets.map((t) => (
                <TableRow key={t.id} className="hover:bg-gray-50/60">
                  <TableCell className="font-semibold text-xs text-gray-900">{t.id}</TableCell>
                  <TableCell className="text-xs text-gray-600 font-mono">{t.orderId}</TableCell>
                  <TableCell>
                    <p className="text-xs font-medium text-gray-800 line-clamp-1 max-w-[280px]">
                      {t.subject}
                    </p>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md font-medium">
                      {t.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={t.status === "open" ? "danger" : "success"}
                      size="sm"
                    >
                      {t.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-gray-500 whitespace-nowrap">
                    {t.updatedAt}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedTicket(t)}
                      className="text-xs"
                    >
                      View Claim
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* New Claim Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Open a Warranty or Support Claim"
        >
          <form onSubmit={handleCreateTicket} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Order ID (Optional)</label>
              <Input
                placeholder="e.g. #ORD-9824"
                value={newTicket.orderId}
                onChange={(e) => setNewTicket({ ...newTicket, orderId: e.target.value })}
                className="w-full text-xs"
              />
            </div>

            <SearchableSelect
              label="Category"
              value={newTicket.category}
              onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
              options={BUYER_SUPPORT_CATEGORIES}
              placeholder="Select Category"
              size="md"
              clearable={false}
              className="w-full text-xs"
            />

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Subject</label>
              <Input
                placeholder="Brief summary of the problem..."
                value={newTicket.subject}
                onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                className="w-full text-xs"
              />
            </div>

            <Textarea
              label="Description"
              rows={4}
              placeholder="Please describe what happened when you tried to use the account/key..."
              value={newTicket.message}
              onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
              className="w-full text-xs"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="solid"
                size="sm"
                type="submit"
                icon={<Send size={13} />}
              >
                Submit Claim
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Claim Modal */}
      {selectedTicket && (
        <Modal
          isOpen={Boolean(selectedTicket)}
          onClose={() => setSelectedTicket(null)}
          title={`Claim ${selectedTicket.id}: ${selectedTicket.subject}`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Order:</span>
                <span className="text-xs font-mono font-bold text-gray-900">{selectedTicket.orderId}</span>
              </div>
              <Badge variant={selectedTicket.status === "open" ? "danger" : "success"} size="sm">
                {selectedTicket.status}
              </Badge>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {selectedTicket.messages.map((m, i) => (
                <div key={i} className="p-3 bg-gray-100/70 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-gray-700">
                    <span>{m.sender}</span>
                    <span className="text-gray-400 font-normal">{m.time}</span>
                  </div>
                  <p className="text-xs text-gray-800">{m.text}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedTicket(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

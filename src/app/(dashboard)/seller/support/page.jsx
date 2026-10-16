// src/app/(dashboard)/seller/support/page.jsx

"use client";

import { useState } from "react";
import {
  LifeBuoy,
  Plus,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FileQuestion,
  ExternalLink,
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

const SUPPORT_CATEGORIES = [
  { label: "Payout & Withdrawal", value: "Payout" },
  { label: "Store Quota / Limit", value: "Store Quota" },
  { label: "Merchant Verification", value: "Verification" },
  { label: "Order Dispute Assistance", value: "Order Dispute" },
  { label: "Technical Bug", value: "Technical" },
];

const SUPPORT_PRIORITIES = [
  { label: "Low (General question)", value: "low" },
  { label: "Medium (Requires assistance)", value: "medium" },
  { label: "High (Urgent payout/account issue)", value: "high" },
];

const SELLER_TICKETS = [
  {
    id: "#TK-3012",
    subject: "Payout delayed for USDT TRC20 withdrawal",
    category: "Payout",
    priority: "high",
    status: "open",
    updatedAt: "10 mins ago",
    messages: [
      { sender: "You", text: "Hello, my withdrawal of $450 via USDT hasn't been confirmed yet. Please verify TX.", time: "10 mins ago" },
    ],
  },
  {
    id: "#TK-2980",
    subject: "Requesting increase in daily product upload quota",
    category: "Store Quota",
    priority: "medium",
    status: "resolved",
    updatedAt: "3 days ago",
    messages: [
      { sender: "You", text: "We have reached our 50 listings cap and need to upload 100 new verified digital accounts.", time: "3 days ago" },
      { sender: "Admin Support", text: "Store listing limit increased to 250 products as a verified seller.", time: "3 days ago" },
    ],
  },
];

const FAQS = [
  {
    q: "How long does a withdrawal take to process?",
    a: "Crypto (USDT / Binance Pay) withdrawals are typically processed within 15–30 minutes. Mobile banking (bKash/Nagad) takes 1–3 hours during business hours.",
  },
  {
    q: "What is the platform commission rate?",
    a: "ACCZORA charges a standard 10% fee on successful account deliveries. Verified super sellers can qualify for reduced rates.",
  },
  {
    q: "How does buyer replacement warranty work?",
    a: "Sellers must honor the warranty period stated on their product listing (e.g. 24h, 7 days, 30 days). If valid credentials stop working within warranty, replacement must be supplied within 24 hours.",
  },
];

export default function SellerSupportPage() {
  const [tickets, setTickets] = useState(SELLER_TICKETS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // New Ticket Form State
  const [newTicket, setNewTicket] = useState({
    subject: "",
    category: "Payout",
    priority: "medium",
    message: "",
  });

  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!newTicket.subject.trim() || !newTicket.message.trim()) {
      toast.error("Please fill in subject and description");
      return;
    }

    const created = {
      id: `#TK-${Math.floor(3100 + Math.random() * 900)}`,
      subject: newTicket.subject.trim(),
      category: newTicket.category,
      priority: newTicket.priority,
      status: "open",
      updatedAt: "Just now",
      messages: [
        { sender: "You", text: newTicket.message.trim(), time: "Just now" },
      ],
    };

    setTickets([created, ...tickets]);
    setIsModalOpen(false);
    setNewTicket({ subject: "", category: "Payout", priority: "medium", message: "" });
    toast.success("Support ticket submitted! Our staff will respond shortly.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <H2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
            Seller Help & Support Center
          </H2>
          <P className="text-xs text-gray-500 mt-1">
            Contact ACCZORA merchant support for payouts, verification, disputes, and technical help.
          </P>
        </div>

        <Button
          variant="solid"
          size="default"
          onClick={() => setIsModalOpen(true)}
          icon={<Plus size={16} />}
        >
          Create Support Ticket
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Active Tickets"
          value={tickets.filter((t) => t.status === "open").length}
          icon={AlertCircle}
          trend="Awaiting support team response"
          trendDirection="neutral"
        />
        <StatCard
          title="Resolved Inquiries"
          value={tickets.filter((t) => t.status === "resolved").length}
          icon={CheckCircle2}
          trend="Past solved questions"
          trendDirection="up"
        />
        <StatCard
          title="Support SLA"
          value="< 30 mins"
          icon={Clock}
          trend="24/7 dedicated seller desk"
          trendDirection="up"
        />
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-2xl border border-border shadow-xs overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <H3 className="text-sm font-bold text-gray-900">My Support Tickets</H3>
          <span className="text-xs text-gray-500">{tickets.length} total tickets</span>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket ID</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-gray-400 text-xs">
                  You have not submitted any support tickets yet.
                </TableCell>
              </TableRow>
            ) : (
              tickets.map((t) => (
                <TableRow key={t.id} className="hover:bg-gray-50/60">
                  <TableCell className="font-semibold text-xs text-gray-900">{t.id}</TableCell>
                  <TableCell>
                    <p className="text-xs font-medium text-gray-800 line-clamp-1 max-w-[260px]">
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
                      variant={
                        t.priority === "high"
                          ? "danger"
                          : t.priority === "medium"
                            ? "warning"
                            : "default"
                      }
                      size="sm"
                    >
                      {t.priority.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        t.status === "open"
                          ? "danger"
                          : t.status === "in_progress"
                            ? "warning"
                            : "success"
                      }
                      size="sm"
                    >
                      {t.status.replace("_", " ")}
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
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Seller FAQ Accordion */}
      <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle size={18} className="text-brand" />
          <H3 className="text-sm font-bold text-gray-900">Frequently Asked Questions for Sellers</H3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {FAQS.map((faq, i) => (
            <div key={i} className="p-4 bg-gray-50/80 rounded-xl border border-gray-100 space-y-2">
              <p className="text-xs font-bold text-gray-900">{faq.q}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Create Ticket Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Open a New Support Ticket"
        >
          <form onSubmit={handleCreateTicket} className="space-y-4">
            <SearchableSelect
              label="Category"
              value={newTicket.category}
              onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
              options={SUPPORT_CATEGORIES}
              placeholder="Select Category"
              size="md"
              clearable={false}
              className="w-full text-xs"
            />

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Subject</label>
              <Input
                placeholder="Brief summary of your question or issue..."
                value={newTicket.subject}
                onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                className="w-full text-xs"
              />
            </div>

            <SearchableSelect
              label="Priority"
              value={newTicket.priority}
              onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
              options={SUPPORT_PRIORITIES}
              placeholder="Select Priority"
              size="md"
              clearable={false}
              className="w-full text-xs"
            />

            <Textarea
              label="Description"
              rows={4}
              placeholder="Please describe the issue in detail, include transaction IDs or order numbers..."
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
                Submit Ticket
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <Modal
          isOpen={Boolean(selectedTicket)}
          onClose={() => setSelectedTicket(null)}
          title={`Ticket ${selectedTicket.id}: ${selectedTicket.subject}`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Status:</span>
                <Badge variant={selectedTicket.status === "open" ? "danger" : "success"} size="sm">
                  {selectedTicket.status}
                </Badge>
              </div>
              <span className="text-xs text-gray-400">{selectedTicket.updatedAt}</span>
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

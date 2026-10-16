// src/app/(dashboard)/admin/support/page.jsx

"use client";

import { useState } from "react";
import {
  LifeBuoy,
  Search,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  Store,
  ChevronRight,
  Filter,
  Send,
} from "lucide-react";
import StatCard from "@/components/ui/StatCard";
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
import SearchInput from "@/components/ui/SearchInput";
import SearchableSelect from "@/components/ui/SearchableSelect";
import Textarea from "@/components/ui/Textarea";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { Typography, H2, H3, P, Caption } from "@/components/ui/Typography";
import { toast } from "sonner";

const STATUS_FILTER_OPTIONS = [
  { label: "All Statuses", value: "all" },
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in_progress" },
  { label: "Resolved", value: "resolved" },
];

const PRIORITY_FILTER_OPTIONS = [
  { label: "All Priorities", value: "all" },
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

const ROLE_FILTER_OPTIONS = [
  { label: "All Roles", value: "all" },
  { label: "Sellers", value: "seller" },
  { label: "Buyers", value: "buyer" },
];

const TICKET_STATUS_OPTIONS = [
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in_progress" },
  { label: "Resolved", value: "resolved" },
];

const INITIAL_TICKETS = [
  {
    id: "#TK-3012",
    user: "NovaStore",
    userRole: "seller",
    email: "seller@acczora.com",
    subject: "Payout delayed for USDT TRC20 withdrawal",
    category: "Payout",
    priority: "high",
    status: "open",
    updatedAt: "10 mins ago",
    messages: [
      { sender: "NovaStore", text: "Hello, my withdrawal of $450 via USDT hasn't been confirmed yet. Please verify TX.", time: "10 mins ago" },
    ],
  },
  {
    id: "#TK-3011",
    user: "John Doe",
    userRole: "buyer",
    email: "buyer@acczora.com",
    subject: "Netflix 4K account password changed by owner",
    category: "Order Issue",
    priority: "high",
    status: "open",
    updatedAt: "45 mins ago",
    messages: [
      { sender: "John Doe", text: "Purchased order #ORD-9824 2 days ago, but now credentials show wrong password. Need replacement or refund under warranty.", time: "45 mins ago" },
    ],
  },
  {
    id: "#TK-3010",
    user: "AlphaDigital",
    userRole: "seller",
    email: "alpha@merchant.io",
    subject: "Trade License & TIN Document verification request",
    category: "Verification",
    priority: "medium",
    status: "in_progress",
    updatedAt: "2 hours ago",
    messages: [
      { sender: "AlphaDigital", text: "Submitted our renewed company documents for store verification.", time: "2 hours ago" },
      { sender: "Admin Support", text: "Our compliance team is currently reviewing your documents.", time: "1 hour ago" },
    ],
  },
  {
    id: "#TK-3009",
    user: "Sarah Jenkins",
    userRole: "buyer",
    email: "sarah@gmail.com",
    subject: "Double charge on checkout via bKash",
    category: "Billing",
    priority: "medium",
    status: "resolved",
    updatedAt: "1 day ago",
    messages: [
      { sender: "Sarah Jenkins", text: "I was debited twice for order #ORD-9810.", time: "1 day ago" },
      { sender: "Admin Support", text: "Duplicate charge refunded back to your bKash wallet. Ref #BK-99120.", time: "1 day ago" },
    ],
  },
  {
    id: "#TK-3008",
    user: "PrimeAccounts",
    userRole: "seller",
    email: "prime@acc.net",
    subject: "API webhook failure on automated key delivery",
    category: "Technical",
    priority: "low",
    status: "resolved",
    updatedAt: "2 days ago",
    messages: [
      { sender: "PrimeAccounts", text: "Webhook endpoint timed out during peak sales.", time: "2 days ago" },
      { sender: "Admin Support", text: "Server rate limits adjusted. Webhook queue flushed.", time: "2 days ago" },
    ],
  },
];

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Selected ticket for modal
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState("");

  const filteredTickets = tickets.filter((t) => {
    const matchSearch =
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    const matchPriority = priorityFilter === "all" || t.priority === priorityFilter;
    const matchRole = roleFilter === "all" || t.userRole === roleFilter;

    return matchSearch && matchStatus && matchPriority && matchRole;
  });

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage) || 1;
  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openTicketsCount = tickets.filter((t) => t.status === "open").length;
  const inProgressCount = tickets.filter((t) => t.status === "in_progress").length;
  const resolvedCount = tickets.filter((t) => t.status === "resolved").length;

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedTicket) return;

    const updated = tickets.map((t) => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          status: "in_progress",
          updatedAt: "Just now",
          messages: [
            ...t.messages,
            { sender: "Admin Support", text: replyText.trim(), time: "Just now" },
          ],
        };
      }
      return t;
    });

    setTickets(updated);
    setSelectedTicket((prev) => ({
      ...prev,
      status: "in_progress",
      updatedAt: "Just now",
      messages: [
        ...prev.messages,
        { sender: "Admin Support", text: replyText.trim(), time: "Just now" },
      ],
    }));
    setReplyText("");
    toast.success("Reply sent to user!");
  };

  const handleUpdateStatus = (ticketId, newStatus) => {
    const updated = tickets.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t));
    setTickets(updated);
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket((prev) => ({ ...prev, status: newStatus }));
    }
    toast.success(`Ticket status updated to ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <H2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
            Support Desk & Dispute Resolution
          </H2>
          <P className="text-xs text-gray-500 mt-1">
            Manage buyer and seller inquiries, order warranty claims, and platform assistance tickets.
          </P>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Open Tickets"
          value={openTicketsCount}
          icon={AlertCircle}
          trend={`${openTicketsCount} require immediate attention`}
          trendDirection="neutral"
        />
        <StatCard
          title="In Progress"
          value={inProgressCount}
          icon={Clock}
          trend="Currently under review"
          trendDirection="neutral"
        />
        <StatCard
          title="Resolved Tickets"
          value={resolvedCount}
          icon={CheckCircle2}
          trend="Successfully closed"
          trendDirection="up"
        />
        <StatCard
          title="Average Response"
          value="18 mins"
          icon={LifeBuoy}
          trend="99.2% SLA satisfaction"
          trendDirection="up"
        />
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-border shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="flex-1">
          <SearchInput
            placeholder="Search by ticket ID, user, email or subject..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <SearchableSelect
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            options={STATUS_FILTER_OPTIONS}
            placeholder="All Statuses"
            size="sm"
            clearable={false}
            className="w-36 flex-shrink-0"
          />

          <SearchableSelect
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setCurrentPage(1);
            }}
            options={PRIORITY_FILTER_OPTIONS}
            placeholder="All Priorities"
            size="sm"
            clearable={false}
            className="w-36 flex-shrink-0"
          />

          <SearchableSelect
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            options={ROLE_FILTER_OPTIONS}
            placeholder="All Roles"
            size="sm"
            clearable={false}
            className="w-36 flex-shrink-0"
          />
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-2xl border border-border shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket ID</TableHead>
              <TableHead>User / Account</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-gray-500 text-xs">
                  No support tickets found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              paginatedTickets.map((ticket) => (
                <TableRow key={ticket.id} className="hover:bg-gray-50/60">
                  <TableCell className="font-semibold text-gray-900 text-xs">
                    {ticket.id}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-brand/10 text-brand flex items-center justify-center text-xs font-bold shrink-0">
                        {ticket.userRole === "seller" ? <Store size={13} /> : <User size={13} />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-900 truncate">{ticket.user}</p>
                        <p className="text-[11px] text-gray-400 truncate">{ticket.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-xs font-medium text-gray-800 line-clamp-1 max-w-[220px]">
                      {ticket.subject}
                    </p>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md font-medium">
                      {ticket.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        ticket.priority === "high"
                          ? "danger"
                          : ticket.priority === "medium"
                          ? "warning"
                          : "default"
                      }
                      size="sm"
                    >
                      {ticket.priority.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        ticket.status === "open"
                          ? "danger"
                          : ticket.status === "in_progress"
                          ? "warning"
                          : "success"
                      }
                      size="sm"
                    >
                      {ticket.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-gray-500 whitespace-nowrap">
                    {ticket.updatedAt}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedTicket(ticket)}
                      className="text-xs"
                    >
                      View & Reply
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination in its own Card */}
      <Card className="bg-white p-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </Card>

      {/* Ticket Details & Reply Modal */}
      {selectedTicket && (
        <Modal
          isOpen={Boolean(selectedTicket)}
          onClose={() => setSelectedTicket(null)}
          title={`Ticket ${selectedTicket.id}: ${selectedTicket.subject}`}
        >
          <div className="space-y-4">
            {/* Meta bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">From:</span>
                <span className="text-xs font-semibold text-gray-900">{selectedTicket.user}</span>
                <Badge variant={selectedTicket.userRole === "seller" ? "info" : "default"} size="sm">
                  {selectedTicket.userRole}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Change Status:</span>
                <SearchableSelect
                  value={selectedTicket.status}
                  onChange={(e) => handleUpdateStatus(selectedTicket.id, e.target.value)}
                  options={TICKET_STATUS_OPTIONS}
                  size="sm"
                  clearable={false}
                  className="w-32"
                />
              </div>
            </div>

            {/* Conversation Thread */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto p-1">
              {selectedTicket.messages.map((msg, index) => {
                const isAdmin = msg.sender === "Admin Support";
                return (
                  <div
                    key={index}
                    className={`flex flex-col ${isAdmin ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold text-gray-700">{msg.sender}</span>
                      <span className="text-[10px] text-gray-400">{msg.time}</span>
                    </div>
                    <div
                      className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                        isAdmin
                          ? "bg-brand text-white rounded-tr-none"
                          : "bg-gray-100 text-gray-800 rounded-tl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reply Input */}
            <div className="pt-2 border-t border-border space-y-2">
              <Textarea
                rows={3}
                placeholder="Type your response to user here..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full text-xs"
              />
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTicket(null)}
                >
                  Close
                </Button>
                <Button
                  variant="solid"
                  size="sm"
                  onClick={handleSendReply}
                  icon={<Send size={13} />}
                >
                  Send Reply
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

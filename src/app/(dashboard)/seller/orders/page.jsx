// src/app/(dashboard)/seller/orders/page.jsx

"use client";

import { useState } from "react";
import {
  Search,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  Download,
  Copy,
  Lock,
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
import Pagination from "@/components/ui/Pagination";
import SearchInput from "@/components/ui/SearchInput";
import SearchableSelect from "@/components/ui/SearchableSelect";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import CredentialViewer from "@/components/ui/CredentialViewer";
import { Button } from "@/components/ui/Button";
import { Typography, H3, P, Caption } from "@/components/ui/Typography";

const SELLER_ORDER_STATUS_OPTIONS = [
  { label: "All Orders", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "Disputed", value: "disputed" },
  { label: "Refunded", value: "refunded" },
];

const DEMO_ORDERS = [
  {
    id: "#ORD-9821",
    product: "Netflix Premium 4K (1 Month)",
    category: "Streaming",
    buyer: "Alex Mercer",
    buyerEmail: "alex.m@gmail.com",
    amount: "$14.50",
    date: "Oct 12, 2026",
    status: "completed",
    credentials: "alex_netf_user@netflix.com:SecretStream992",
    warrantyUntil: "Nov 12, 2026",
  },
  {
    id: "#ORD-9820",
    product: "Canva Pro Educational (1 Year)",
    category: "Design",
    buyer: "Sarah Jenkins",
    buyerEmail: "sarah.j@outlook.com",
    amount: "$9.00",
    date: "Oct 11, 2026",
    status: "completed",
    credentials: "https://www.canva.com/brand/join?token=xYz789_edu_invitation",
    warrantyUntil: "Oct 11, 2027",
  },
  {
    id: "#ORD-9819",
    product: "ChatGPT Plus Shared Profile",
    category: "AI Tools",
    buyer: "Devin Vance",
    buyerEmail: "devin.v@gmail.com",
    amount: "$12.00",
    date: "Oct 11, 2026",
    status: "completed",
    credentials: "chat_pro_share11@openai-team.com:PlusPass7721",
    warrantyUntil: "Nov 11, 2026",
  },
  {
    id: "#ORD-9818",
    product: "Spotify Family Slot (6 Months)",
    category: "Music",
    buyer: "Ravi Patel",
    buyerEmail: "ravi.p@yahoo.com",
    amount: "$7.50",
    date: "Oct 10, 2026",
    status: "completed",
    credentials: "spotify_family_invite@music.org:Sp0t1fyFam99",
    warrantyUntil: "Apr 10, 2027",
  },
  {
    id: "#ORD-9817",
    product: "NordVPN Dedicated IP (2 Years)",
    category: "VPN / Security",
    buyer: "Elena Rostova",
    buyerEmail: "elena@crypto.io",
    amount: "$22.00",
    date: "Oct 09, 2026",
    status: "completed",
    credentials: "vpn_dedicated_ip_user_88:NordVault339",
    warrantyUntil: "Nov 09, 2026",
  },
  {
    id: "#ORD-9815",
    product: "Discord Nitro 3 Months Promo Link",
    category: "Gaming",
    buyer: "Michael Brown",
    buyerEmail: "mike.b@gmail.com",
    amount: "$4.50",
    date: "Oct 08, 2026",
    status: "disputed",
    credentials: "https://discord.com/billing/promotions/unclaimed-token-xxx",
    warrantyUntil: "Oct 15, 2026",
  },
];

export default function SellerOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Filter orders
  const filteredOrders = DEMO_ORDERS.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyerEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-border">
        <div>
          <H3 className="text-xl font-bold text-gray-900">Order Deliveries</H3>
          <P className="text-xs text-gray-500 mt-1">
            Accounts automatically unlocked and delivered to buyers.
          </P>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 bg-gray-50 px-3 py-2 rounded-xl border border-border">
          <Lock size={14} className="text-brand" />
          Sold digital accounts are locked and immutable.
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-border flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="w-full md:w-80">
          <SearchInput
            placeholder="Search by order ID, buyer, or product..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Caption className="text-gray-400 font-medium">Status:</Caption>
          <SearchableSelect
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            options={SELLER_ORDER_STATUS_OPTIONS}
            placeholder="All Orders"
            size="sm"
            clearable={false}
            className="w-36"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        {paginatedOrders.length === 0 ? (
          <EmptyState
            title="No orders found"
            description="No orders match your search or filter criteria."
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Delivered Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs font-semibold text-brand">
                      {order.id}
                    </TableCell>
                    <TableCell>
                      <div>
                        <Typography variant="p" className="font-semibold text-gray-900 text-xs">{order.product}</Typography>
                        <Caption className="text-[11px] text-gray-400">{order.category}</Caption>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <Typography variant="p" className="font-medium text-gray-800 text-xs">{order.buyer}</Typography>
                        <Caption className="text-[11px] text-gray-400">{order.buyerEmail}</Caption>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-gray-500">{order.date}</TableCell>
                    <TableCell className="text-xs font-bold text-gray-900">
                      {order.amount}
                    </TableCell>
                    <TableCell>
                      <Badge variant={order.status} dot>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="xs"
                        rounded="lg"
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsDetailModalOpen(true);
                        }}
                      >
                        <Eye size={13} /> Inspect
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </div>

      {/* Pagination in its own Card */}
      {paginatedOrders.length > 0 && (
        <Card className="bg-white p-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </Card>
      )}

      {/* Order Detail & Delivered Credential Modal */}
      {isDetailModalOpen && selectedOrder && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={`Order Delivery Details - ${selectedOrder.id}`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-xl border border-border text-xs">
              <div>
                <Caption className="text-gray-400">Product:</Caption>
                <Typography variant="p" className="font-bold text-gray-900 mt-0.5">{selectedOrder.product}</Typography>
              </div>
              <div>
                <Caption className="text-gray-400">Total Paid:</Caption>
                <Typography variant="p" className="font-bold text-emerald-600 mt-0.5">{selectedOrder.amount}</Typography>
              </div>
              <div>
                <Caption className="text-gray-400">Buyer:</Caption>
                <Typography variant="p" className="font-semibold text-gray-800 mt-0.5">
                  {selectedOrder.buyer} ({selectedOrder.buyerEmail})
                </Typography>
              </div>
              <div>
                <Caption className="text-gray-400">Warranty Active Until:</Caption>
                <Typography variant="p" className="font-semibold text-gray-800 mt-0.5">{selectedOrder.warrantyUntil}</Typography>
              </div>
            </div>

            {/* Delivered Credentials Component */}
            <div>
              <Typography variant="h6" className="font-bold text-gray-700 uppercase tracking-wide mb-2">
                Delivered Digital Account
              </Typography>
              <CredentialViewer
                credentials={selectedOrder.credentials}
                productTitle={selectedOrder.product}
                orderId={selectedOrder.id}
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="primary"
                size="sm"
                rounded="xl"
                onClick={() => setIsDetailModalOpen(false)}
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

// src/app/(dashboard)/admin/orders/page.jsx

"use client";

import { useState } from "react";
import {
  Search,
  Eye,
  Store,
  User,
  ShieldCheck,
  Download,
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

const ORDER_STATUS_OPTIONS = [
  { label: "All Orders", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "Disputed", value: "disputed" },
  { label: "Refunded", value: "refunded" },
];

const ALL_ORDERS_DATA = [
  {
    id: "#ORD-9821",
    product: "Netflix Premium 4K (1 Month)",
    category: "Streaming",
    seller: "NovaStore",
    sellerEmail: "seller@acczora.com",
    buyer: "Alex Mercer",
    buyerEmail: "alex.m@gmail.com",
    amount: 14.5,
    commission: 1.45,
    sellerNet: 13.05,
    date: "Oct 12, 2026",
    status: "completed",
    credentials: "alex_netf_user@netflix.com:SecretStream992",
  },
  {
    id: "#ORD-9820",
    product: "Canva Pro Educational (1 Year)",
    category: "Design",
    seller: "NovaStore",
    sellerEmail: "seller@acczora.com",
    buyer: "Sarah Jenkins",
    buyerEmail: "sarah.j@outlook.com",
    amount: 9.0,
    commission: 0.9,
    sellerNet: 8.1,
    date: "Oct 11, 2026",
    status: "completed",
    credentials: "https://www.canva.com/brand/join?token=xYz789_edu_invitation",
  },
  {
    id: "#ORD-9819",
    product: "ChatGPT Plus Shared Profile",
    category: "AI Tools",
    seller: "AI Accounts Global",
    sellerEmail: "sales@aiaccounts.net",
    buyer: "Devin Vance",
    buyerEmail: "devin.v@gmail.com",
    amount: 12.0,
    commission: 1.2,
    sellerNet: 10.8,
    date: "Oct 11, 2026",
    status: "completed",
    credentials: "chat_pro_share11@openai-team.com:PlusPass7721",
  },
  {
    id: "#ORD-9818",
    product: "Spotify Family Slot (6 Months)",
    category: "Music",
    seller: "DigitalVault BD",
    sellerEmail: "support@digitalvault.io",
    buyer: "Ravi Patel",
    buyerEmail: "ravi.p@yahoo.com",
    amount: 7.5,
    commission: 0.75,
    sellerNet: 6.75,
    date: "Oct 10, 2026",
    status: "completed",
    credentials: "spotify_family_invite@music.org:Sp0t1fyFam99",
  },
  {
    id: "#ORD-9817",
    product: "NordVPN Dedicated IP (2 Years)",
    category: "VPN",
    seller: "CyberSafe Store",
    sellerEmail: "contact@cybersafe.org",
    buyer: "Elena Rostova",
    buyerEmail: "elena@crypto.io",
    amount: 22.0,
    commission: 2.2,
    sellerNet: 19.8,
    date: "Oct 09, 2026",
    status: "completed",
    credentials: "vpn_dedicated_ip_user_88:NordVault339",
  },
  {
    id: "#ORD-9815",
    product: "Discord Nitro 3 Months Promo Link",
    category: "Gaming",
    seller: "GameHaven",
    sellerEmail: "alex@gamehaven.com",
    buyer: "Michael Brown",
    buyerEmail: "mike.b@gmail.com",
    amount: 4.5,
    commission: 0.45,
    sellerNet: 4.05,
    date: "Oct 08, 2026",
    status: "disputed",
    credentials: "https://discord.com/billing/promotions/unclaimed-token-xxx",
  },
];

export default function AdminOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const filteredOrders = ALL_ORDERS_DATA.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.sellerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyerEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginated = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-border">
        <div>
          <H3 className="text-xl font-bold text-gray-900">All Marketplace Orders</H3>
          <P className="text-xs text-gray-500 mt-1">
            Real-time monitor for orders, digital escrow clearances, and platform commission breakdown.
          </P>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 bg-gray-50 px-3 py-2 rounded-xl border border-border">
          <Lock size={14} className="text-brand" /> Escrow Protection Active
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-border flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="w-full md:w-80">
          <SearchInput
            placeholder="Search order ID, product, seller, or buyer..."
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
            options={ORDER_STATUS_OPTIONS}
            placeholder="All Orders"
            size="sm"
            clearable={false}
            className="w-36"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        {paginated.length === 0 ? (
          <EmptyState
            title="No orders found"
            description="No orders match your search criteria."
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Seller</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Gross Amount</TableHead>
                  <TableHead>Acczora Fee (10%)</TableHead>
                  <TableHead>Seller Net</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs font-semibold text-brand">
                      {order.id}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <Typography variant="p" className="font-semibold text-gray-900 text-xs truncate">
                          {order.product}
                        </Typography>
                        <Caption className="text-[11px] text-gray-400">{order.date}</Caption>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <Typography variant="p" className="font-bold text-gray-800 text-xs">{order.seller}</Typography>
                        <Caption className="text-[11px] text-gray-400">{order.sellerEmail}</Caption>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <Typography variant="p" className="font-medium text-gray-800 text-xs">{order.buyer}</Typography>
                        <Caption className="text-[11px] text-gray-400">{order.buyerEmail}</Caption>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-bold text-gray-900">
                      ${order.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-xs font-bold text-brand">
                      +${order.commission.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-emerald-600">
                      ${order.sellerNet.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={order.status} dot>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon_sm"
                        rounded="lg"
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsDetailModalOpen(true);
                        }}
                        title="View order"
                      >
                        <Eye size={15} />
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

      {/* Order Detail Modal */}
      {isDetailModalOpen && selectedOrder && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={`Order Inspection: ${selectedOrder.id}`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl border border-border text-xs space-y-2">
              <div className="flex justify-between">
                <Caption className="text-gray-500">Product:</Caption>
                <strong className="text-gray-900">{selectedOrder.product}</strong>
              </div>
              <div className="flex justify-between">
                <Caption className="text-gray-500">Seller:</Caption>
                <strong className="text-gray-900">
                  {selectedOrder.seller} ({selectedOrder.sellerEmail})
                </strong>
              </div>
              <div className="flex justify-between">
                <Caption className="text-gray-500">Buyer:</Caption>
                <strong className="text-gray-900">
                  {selectedOrder.buyer} ({selectedOrder.buyerEmail})
                </strong>
              </div>
              <div className="flex justify-between">
                <Caption className="text-gray-500">Gross Paid:</Caption>
                <strong className="text-gray-900">${selectedOrder.amount.toFixed(2)}</strong>
              </div>
              <div className="flex justify-between">
                <Caption className="text-gray-500">Platform Revenue (10%):</Caption>
                <strong className="text-brand">
                  +${selectedOrder.commission.toFixed(2)}
                </strong>
              </div>
            </div>

            <div>
              <Typography variant="h6" className="font-bold text-gray-700 uppercase tracking-wide mb-2">
                Delivered Credentials
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

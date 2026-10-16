// src/app/(dashboard)/seller/orders/page.jsx

"use client";

import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  Search,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  Download,
  Copy,
  Lock,
  Loader2,
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
import { useGetSellerOrdersQuery } from "@/redux/api/orderApi";

const SELLER_ORDER_STATUS_OPTIONS = [
  { label: "All Orders", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "Processing", value: "processing" },
  { label: "Disputed", value: "disputed" },
  { label: "Refunded", value: "refunded" },
];

export default function SellerOrdersPage() {
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const { data: ordersData, isLoading } = useGetSellerOrdersQuery(undefined, {
    skip: !isLoggedIn,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const rawOrders = useMemo(() => {
    return Array.isArray(ordersData?.data?.orders)
      ? ordersData.data.orders
      : Array.isArray(ordersData?.data)
      ? ordersData.data
      : [];
  }, [ordersData]);

  const formattedOrders = useMemo(() => {
    return rawOrders.map((order) => {
      const credString = Array.isArray(order.deliveredCredentials)
        ? order.deliveredCredentials.map((c) => c.credential || c).join("\n")
        : order.deliveredCredentials || "";
      const orderIdStr = order.orderNumber || `#ORD-${String(order._id || order.id).slice(-6)}`;
      const formattedDate = order.createdAt
        ? new Date(order.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "Recent";

      return {
        id: orderIdStr,
        rawId: order._id || order.id,
        product: order.productTitle || order.product?.title || "Digital Product",
        category: order.product?.category?.name || "Digital Account",
        buyer: order.buyer?.fullName || order.buyer?.username || "Verified Buyer",
        buyerEmail: order.buyer?.email || "buyer@acczora.com",
        amount: `$${Number(order.totalAmount || 0).toFixed(2)}`,
        date: formattedDate,
        status: order.status || "completed",
        credentials: credString,
        warrantyUntil: "Active Guarantee",
      };
    });
  }, [rawOrders]);

  // Filter orders
  const filteredOrders = useMemo(() => {
    return formattedOrders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.buyerEmail.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || order.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [formattedOrders, searchTerm, statusFilter]);

  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedOrders = useMemo(() => {
    return filteredOrders.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
  }, [filteredOrders, currentPage, pageSize]);

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
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-brand animate-spin mx-auto" />
            <p className="text-xs text-gray-400">Loading order deliveries...</p>
          </div>
        ) : paginatedOrders.length === 0 ? (
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

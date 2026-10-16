// src/app/(dashboard)/buyer/purchases/page.jsx

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Eye,
  Download,
  Copy,
  Check,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Store,
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
import LinkButton from "@/components/ui/LinkButton";
import { Typography, H3, P, Caption } from "@/components/ui/Typography";
import { toast } from "sonner";

const BUYER_PURCHASES_DATA = [
  {
    id: "#ORD-9821",
    product: "Netflix Premium UHD 4K (1 Month)",
    category: "Streaming",
    seller: "NovaStore",
    sellerEmail: "seller@acczora.com",
    price: "$14.50",
    date: "Oct 12, 2026",
    warrantyUntil: "Nov 12, 2026",
    status: "active",
    credentials: "alex_netf_user@netflix.com:SecretStream992",
    instructions: "Login on netflix.com. Use Profile 3 (Alex). Do not change password.",
  },
  {
    id: "#ORD-9820",
    product: "Canva Pro Educational (1 Year)",
    category: "Design",
    seller: "NovaStore",
    sellerEmail: "seller@acczora.com",
    price: "$9.00",
    date: "Oct 11, 2026",
    warrantyUntil: "Oct 11, 2027",
    status: "active",
    credentials: "https://www.canva.com/brand/join?token=xYz789_edu_invitation",
    instructions: "Click the invitation link while logged into your personal Canva account.",
  },
  {
    id: "#ORD-9818",
    product: "Spotify Family Slot (6 Months)",
    category: "Music",
    seller: "DigitalVault BD",
    sellerEmail: "support@digitalvault.io",
    price: "$7.50",
    date: "Oct 10, 2026",
    warrantyUntil: "Apr 10, 2027",
    status: "active",
    credentials: "spotify_family_invite@music.org:Sp0t1fyFam99|Address: 124 Main St, London",
    instructions: "Accept family invitation using provided UK address.",
  },
  {
    id: "#ORD-9810",
    product: "ChatGPT Plus Shared 1-Profile",
    category: "AI Tools",
    seller: "AI Accounts Global",
    sellerEmail: "sales@aiaccounts.net",
    price: "$12.00",
    date: "Sep 28, 2026",
    warrantyUntil: "Oct 28, 2026",
    status: "active",
    credentials: "chat_pro_share11@openai-team.com:PlusPass7721",
    instructions: "Log in with email and password. Use 2FA code if prompted.",
  },
  {
    id: "#ORD-9799",
    product: "NordVPN Dedicated IP (2 Years)",
    category: "VPN",
    seller: "CyberSafe Store",
    sellerEmail: "contact@cybersafe.org",
    price: "$22.00",
    date: "Aug 15, 2026",
    warrantyUntil: "Sep 15, 2026 (Expired)",
    status: "expired",
    credentials: "vpn_dedicated_ip_user_88:NordVault339",
    instructions: "Login on NordVPN app and connect to London dedicated IP #4.",
  },
];

export default function BuyerPurchasesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [selectedItem, setSelectedItem] = useState(null);
  const [isViewerModalOpen, setIsViewerModalOpen] = useState(false);

  const filteredPurchases = BUYER_PURCHASES_DATA.filter((item) => {
    const matchesSearch =
      item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.seller.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || item.category.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const totalItems = filteredPurchases.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginated = filteredPurchases.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getCategoryName = (cat) => {
    if (!cat) return "";
    if (typeof cat === "string") return cat;
    return cat.name || cat.title || cat.label || cat._id || "";
  };

  const categories = [
    "all",
    ...Array.from(
      new Set(
        BUYER_PURCHASES_DATA.map((p) => getCategoryName(p.category)).filter(Boolean)
      )
    ),
  ];

  const categoryOptions = categories.map((c) => ({
    label: c === "all" ? "All Categories" : c,
    value: c,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-border">
        <div>
          <H3 className="text-xl font-bold text-gray-900">My Purchased Accounts & Keys</H3>
          <P className="text-xs text-gray-500 mt-1">
            Access your delivered logins, copy credentials, download backup files, and track replacement warranties.
          </P>
        </div>
        <LinkButton
          href="/"
          variant="brand"
          size="sm"
          rounded="xl"
        >
          Buy More Accounts
        </LinkButton>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-border flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="w-full md:w-80">
          <SearchInput
            placeholder="Search by product, order ID, or seller..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Caption className="text-gray-400 font-medium">Category:</Caption>
          <SearchableSelect
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            options={categoryOptions}
            placeholder="All Categories"
            size="sm"
            clearable={false}
            className="w-40"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        {paginated.length === 0 ? (
          <EmptyState
            title="No purchased accounts found"
            description="You have not purchased any accounts matching this search."
            actionLabel="Browse Marketplace"
            onAction={() => window.location.assign("/")}
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product / Order</TableHead>
                  <TableHead>Seller Store</TableHead>
                  <TableHead>Delivered Date</TableHead>
                  <TableHead>Warranty Guarantee</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="max-w-xs">
                        <Typography variant="p" className="font-semibold text-gray-900 text-xs truncate">
                          {item.product}
                        </Typography>
                        <Caption className="text-[11px] text-gray-400 font-mono">{item.id}</Caption>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Store size={12} className="text-brand" />
                        <span className="text-xs font-semibold text-gray-800">{item.seller}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-gray-500">{item.date}</TableCell>
                    <TableCell>
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1">
                        <ShieldCheck size={12} /> {item.warrantyUntil}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs font-bold text-gray-900">{item.price}</TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-2">
                        <Button
                          variant="brand"
                          size="xs"
                          rounded="lg"
                          onClick={() => {
                            setSelectedItem(item);
                            setIsViewerModalOpen(true);
                          }}
                        >
                          View Credentials
                        </Button>
                        <LinkButton
                          href={`/buyer/support?orderId=${item.id}&product=${encodeURIComponent(item.product)}`}
                          variant="outline"
                          size="xs"
                          rounded="lg"
                          title="Claim warranty / replacement"
                        >
                          Claim
                        </LinkButton>
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

      {/* Credential Viewer Modal */}
      {isViewerModalOpen && selectedItem && (
        <Modal
          isOpen={isViewerModalOpen}
          onClose={() => setIsViewerModalOpen(false)}
          title={`Digital Account - ${selectedItem.product}`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-xl border border-border text-xs space-y-1">
              <div><strong>Order ID:</strong> {selectedItem.id}</div>
              <div><strong>Seller:</strong> {selectedItem.seller}</div>
              <div><strong>Warranty Status:</strong> {selectedItem.warrantyUntil}</div>
            </div>

            {/* Credential Viewer */}
            <div>
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                Account Credentials
              </p>
              <CredentialViewer
                credentials={selectedItem.credentials}
                productTitle={selectedItem.product}
                orderId={selectedItem.id}
              />
            </div>

            {selectedItem.instructions && (
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-xs text-blue-900">
                <strong>Seller Instructions:</strong> {selectedItem.instructions}
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t border-border">
              <Link
                href={`/buyer/support?orderId=${selectedItem.id}&product=${encodeURIComponent(selectedItem.product)}`}
                className="text-xs font-semibold text-amber-600 hover:underline flex items-center gap-1"
              >
                <AlertCircle size={14} /> Account Not Working? File Claim
              </Link>
              <Button
                variant="primary"
                size="sm"
                rounded="xl"
                onClick={() => setIsViewerModalOpen(false)}
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

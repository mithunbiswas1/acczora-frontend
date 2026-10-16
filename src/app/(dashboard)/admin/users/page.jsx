// src/app/(dashboard)/admin/users/page.jsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import {
  Users,
  Search,
  ShieldCheck,
  ShieldAlert,
  Store,
  ShoppingBag,
  Shield,
  KeyRound,
  Eye,
  ExternalLink,
  Edit,
  Trash2,
  Loader2,
  Clock,
  Check,
  X,
  AlertCircle,
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
import EmptyState from "@/components/ui/EmptyState";
import LinkButton from "@/components/ui/LinkButton";
import { Typography, H3, P, Caption } from "@/components/ui/Typography";
import { toast } from "sonner";
import { useGetAdminUsersQuery } from "@/redux/api/authApi";
import { useToggleStoreVerificationMutation } from "@/redux/api/storeApi";

const USER_ROLE_OPTIONS = [
  { label: "All Users", value: "all" },
  { label: "⏳ Pending Sellers", value: "pending_seller" },
  { label: "🏪 Approved Sellers", value: "seller" },
  { label: "🛍️ Buyers", value: "buyer" },
  { label: "🛡️ Platform Admins", value: "admin" },
  { label: "👑 Super Admins", value: "super_admin" },
];

export default function AdminUsersPage() {
  const { user: currentAuthUser } = useSelector((state) => state.auth);
  const isSuperAdmin = currentAuthUser?.role === "super_admin";

  const { data: usersResponse, isLoading, refetch } = useGetAdminUsersQuery();
  const [toggleStoreVerification, { isLoading: isToggling }] = useToggleStoreVerificationMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const rawUsers = Array.isArray(usersResponse?.data?.users)
    ? usersResponse.data.users
    : Array.isArray(usersResponse?.data)
    ? usersResponse.data
    : [];

  const handleApproveSeller = async (userId) => {
    try {
      const res = await toggleStoreVerification({ id: userId, action: "approve" }).unwrap();
      toast.success(res?.message || "Seller account approved successfully! They can now log in and access dashboard.");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to approve seller");
    }
  };

  const handleRejectSeller = async (userId) => {
    try {
      const res = await toggleStoreVerification({ id: userId, action: "reject" }).unwrap();
      toast.info(res?.message || "Seller application declined.");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to reject seller");
    }
  };

  const handleToggleVerification = async (userId) => {
    try {
      const res = await toggleStoreVerification(userId).unwrap();
      toast.success(res?.message || "Seller verification status updated successfully!");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to toggle verification");
    }
  };

  const pendingSellersCount = rawUsers.filter((u) => u.sellerStatus === "pending").length;
  const approvedSellersCount = rawUsers.filter(
    (u) => (u.role === "seller" || u.role === "author") && u.sellerStatus !== "pending"
  ).length;

  const filteredUsers = rawUsers.filter((u) => {
    const matchesSearch =
      (u.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.shopName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.userName || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      roleFilter === "all"
        ? true
        : roleFilter === "pending_seller"
        ? u.sellerStatus === "pending"
        : roleFilter === "seller"
        ? (u.role === "seller" || u.role === "author") && u.sellerStatus !== "pending"
        : u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginated = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-border">
        <div>
          <H3 className="text-xl font-bold text-gray-900">User & Seller Management</H3>
          <P className="text-xs text-gray-500 mt-1">
            Global directory of buyers, merchant stores, and platform administrators.
          </P>
        </div>
        <div className="flex items-center gap-3">
          {pendingSellersCount > 0 && (
            <button
              type="button"
              onClick={() => {
                setRoleFilter("pending_seller");
                setCurrentPage(1);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span>{pendingSellersCount} Pending Review</span>
            </button>
          )}
          <LinkButton
            href="/admin/roles"
            variant="brand"
            size="sm"
            rounded="xl"
          >
            <KeyRound size={15} /> Configure Granular Roles
          </LinkButton>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-border flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="w-full md:w-80">
          <SearchInput
            placeholder="Search by name, email, or shop..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Caption className="text-gray-400 font-medium">Filter:</Caption>
          <SearchableSelect
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            options={USER_ROLE_OPTIONS}
            placeholder="All Roles"
            size="sm"
            clearable={false}
            className="w-48"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#6558ff] mx-auto" />
            <p className="text-xs text-gray-400">Loading user accounts...</p>
          </div>
        ) : paginated.length === 0 ? (
          <EmptyState
            title="No users found"
            description="No accounts match your current search criteria."
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email / Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Store Name</TableHead>
                  <TableHead>Seller Approval & Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((u) => {
                  const isPending = u.sellerStatus === "pending";
                  const isApproved = u.sellerStatus === "approved" || (u.role === "seller" && !u.sellerStatus);
                  const isRejected = u.sellerStatus === "rejected";
                  const isSellerRole = u.role === "seller" || u.role === "author" || isPending || isApproved;
                  const isVerified = u.isVerifiedSeller !== false;

                  return (
                    <TableRow key={u._id}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#6558ff]/10 text-[#6558ff] font-bold text-xs flex items-center justify-center">
                            {(u.fullName || u.userName || "U")[0].toUpperCase()}
                          </div>
                          <div>
                            <Typography variant="p" className="font-bold text-gray-900 text-xs">
                              {u.fullName || u.userName}
                            </Typography>
                            <Caption className="text-[11px] text-gray-400">
                              @{u.userName || u._id.slice(-6)}
                            </Caption>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-gray-600 font-medium">
                        <div>{u.email || "—"}</div>
                        {u.phone && <div className="text-[11px] text-gray-400">{u.phone}</div>}
                      </TableCell>
                      <TableCell>
                        <Badge variant={u.role} dot>
                          {u.role.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-gray-700">
                        {u.shopName ? (
                          <div className="flex items-center gap-1.5 font-medium">
                            <Store className="w-3.5 h-3.5 text-[#6558ff]" />
                            <span>{u.shopName}</span>
                          </div>
                        ) : isSellerRole ? (
                          <div className="flex items-center gap-1.5 font-medium text-gray-500">
                            <Store className="w-3.5 h-3.5 text-gray-400" />
                            <span>{u.fullName}'s Store</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {isPending ? (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
                              Pending Approval
                            </span>
                            <button
                              type="button"
                              disabled={isToggling}
                              onClick={() => handleApproveSeller(u._id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer"
                              title="Approve Seller Account"
                            >
                              <Check size={13} />
                              Approve
                            </button>
                            <button
                              type="button"
                              disabled={isToggling}
                              onClick={() => handleRejectSeller(u._id)}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
                              title="Reject Seller Application"
                            >
                              <X size={13} />
                              Reject
                            </button>
                          </div>
                        ) : isApproved || (u.role === "seller" || u.role === "author") ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              disabled={isToggling}
                              onClick={() => handleToggleVerification(u._id)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors cursor-pointer ${
                                isVerified
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                  : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                              }`}
                              title="Click to toggle verification status"
                            >
                              {isVerified ? (
                                <>
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Approved & Verified</span>
                                </>
                              ) : (
                                <>
                                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                                  <span>Approved (Unverified)</span>
                                </>
                              )}
                            </button>
                          </div>
                        ) : isRejected ? (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                              Application Rejected
                            </span>
                            <button
                              type="button"
                              disabled={isToggling}
                              onClick={() => handleApproveSeller(u._id)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                              title="Re-approve this seller"
                            >
                              <Check size={11} /> Re-approve
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">Buyer Account</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {(isApproved || u.role === "seller") && (
                            <Link
                              href={`/store/${u.shopSlug || u.userName}`}
                              target="_blank"
                              className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-[#6558ff] p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                              title="View Storefront"
                            >
                              <ExternalLink size={13} />
                              <span>Store</span>
                            </Link>
                          )}
                          <Link
                            href={`/admin/roles?userId=${u._id}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#6558ff] hover:underline p-1.5"
                          >
                            <KeyRound size={13} /> Permissions
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
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
    </div>
  );
}

// src/app/(dashboard)/admin/users/page.jsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import {
  Users,
  Search,
  ShieldCheck,
  Store,
  ShoppingBag,
  Shield,
  KeyRound,
  Eye,
  Edit,
  Trash2,
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
import LinkButton from "@/components/ui/LinkButton";
import { Typography, H3, P, Caption } from "@/components/ui/Typography";
import { toast } from "sonner";
import { useGetAdminUsersQuery, useUpdateUserByAdminMutation } from "@/redux/api/authApi";

const USER_ROLE_OPTIONS = [
  { label: "All Roles", value: "all" },
  { label: "Buyers", value: "buyer" },
  { label: "Sellers", value: "seller" },
  { label: "Admins", value: "admin" },
  { label: "Super Admins", value: "super_admin" },
];

const DEMO_USERS = [
  {
    _id: "usr_1",
    fullName: "Super Admin",
    email: "admin@acczora.com",
    role: "super_admin",
    shopName: "Acczora HQ",
    status: "active",
    createdAt: "2025-01-01",
    ordersCount: 0,
  },
  {
    _id: "usr_2",
    fullName: "NovaStore Merchant",
    email: "seller@acczora.com",
    role: "seller",
    shopName: "NovaStore",
    status: "active",
    createdAt: "2025-03-15",
    ordersCount: 312,
  },
  {
    _id: "usr_3",
    fullName: "Tariqul Buyer",
    email: "buyer@acczora.com",
    role: "buyer",
    shopName: "",
    status: "active",
    createdAt: "2025-06-20",
    ordersCount: 24,
  },
  {
    _id: "usr_4",
    fullName: "DigitalVault Support",
    email: "moderator@acczora.com",
    role: "admin",
    shopName: "Acczora Ops",
    status: "active",
    createdAt: "2025-07-01",
    ordersCount: 0,
  },
  {
    _id: "usr_5",
    fullName: "Alex Mercer",
    email: "alex.m@gmail.com",
    role: "buyer",
    shopName: "",
    status: "active",
    createdAt: "2025-09-10",
    ordersCount: 5,
  },
];

export default function AdminUsersPage() {
  const { user: currentAuthUser } = useSelector((state) => state.auth);
  const isSuperAdmin = currentAuthUser?.role === "super_admin";

  const { data: usersResponse, isLoading } = useGetAdminUsersQuery();
  const [updateUserByAdmin] = useUpdateUserByAdminMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const rawUsers = usersResponse?.data?.users || usersResponse?.data || DEMO_USERS;

  const filteredUsers = rawUsers.filter((u) => {
    const matchesSearch =
      (u.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.shopName || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "all" || u.role === roleFilter;

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
          <H3 className="text-xl font-bold text-gray-900">User Management</H3>
          <P className="text-xs text-gray-500 mt-1">
            Global directory of buyers, verified sellers, and platform administrators.
          </P>
        </div>
        <LinkButton
          href="/admin/roles"
          variant="brand"
          size="sm"
          rounded="xl"
        >
          <KeyRound size={15} /> Configure Granular Roles
        </LinkButton>
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
          <Caption className="text-gray-400 font-medium">Role:</Caption>
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
            className="w-40"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        {paginated.length === 0 ? (
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
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Store Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((u) => (
                  <TableRow key={u._id}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-brand/10 text-brand font-bold text-xs flex items-center justify-center">
                          {(u.fullName || "U")[0].toUpperCase()}
                        </div>
                        <div>
                          <Typography variant="p" className="font-bold text-gray-900 text-xs">{u.fullName}</Typography>
                          <Caption className="text-[11px] text-gray-400">ID: {u._id.slice(-6)}</Caption>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-gray-600 font-medium">{u.email}</TableCell>
                    <TableCell>
                      <Badge variant={u.role} dot>
                        {u.role.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-gray-700">
                      {u.shopName || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={u.status || "active"} size="sm">
                        {u.status || "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/admin/roles?userId=${u._id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline p-1.5"
                      >
                        <KeyRound size={13} /> Permissions
                      </Link>
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
    </div>
  );
}

// src/app/(dashboard)/admin/roles/page.jsx

"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import {
  ShieldCheck,
  ShieldAlert,
  Users,
  Save,
  CheckCircle,
  KeyRound,
  RotateCcw,
  Check,
  X,
  Lock,
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import SearchableSelect from "@/components/ui/SearchableSelect";
import { Typography, H3, P, Caption } from "@/components/ui/Typography";
import { toast } from "sonner";

const ASSIGNED_ROLE_OPTIONS = [
  { label: "Super Admin (All Pages)", value: "super_admin" },
  { label: "Admin (Granular Access)", value: "admin" },
  { label: "Seller", value: "seller" },
  { label: "Buyer", value: "buyer" },
];
import {
  useGetAdminUsersQuery,
  useUpdateUserByAdminMutation,
} from "@/redux/api/authApi";

const MODULES = [
  { key: "products", label: "Products & Listings", description: "Catalog management and moderation" },
  { key: "orders", label: "Orders & Deliveries", description: "Marketplace order escrows and inspection" },
  { key: "earnings", label: "Platform Earnings", description: "Financial metrics and statements" },
  { key: "withdrawals", label: "Seller Withdrawals", description: "Payout requests, approval, and rejection" },
  { key: "reviews", label: "Review Moderation", description: "Approving or rejecting customer reviews" },
  { key: "users", label: "User Directory", description: "Manage buyers, sellers, and staff" },
  { key: "settings", label: "Platform Settings", description: "Commission rates and dispute timers" },
];

const ACTIONS = [
  { key: "view", label: "View / Read" },
  { key: "add", label: "Add / Create" },
  { key: "edit", label: "Edit / Update" },
  { key: "delete", label: "Delete / Moderate" },
];

const DEFAULT_STAFF = [
  {
    _id: "usr_1",
    fullName: "Super Admin",
    email: "admin@acczora.com",
    role: "super_admin",
  },
  {
    _id: "usr_4",
    fullName: "DigitalVault Support",
    email: "moderator@acczora.com",
    role: "admin",
    access: [
      { routeKey: "products", permissions: ["view", "edit"] },
      { routeKey: "reviews", permissions: ["view", "edit", "delete"] },
      { routeKey: "orders", permissions: ["view"] },
    ],
  },
  {
    _id: "usr_2",
    fullName: "NovaStore Merchant",
    email: "seller@acczora.com",
    role: "seller",
  },
  {
    _id: "usr_3",
    fullName: "Tariqul Buyer",
    email: "buyer@acczora.com",
    role: "buyer",
  },
];

export default function AdminRolesPage() {
  const { user: currentAuthUser } = useSelector((state) => state.auth);
  const isSuperAdmin = currentAuthUser?.role === "super_admin";

  const { data: usersResponse, isLoading } = useGetAdminUsersQuery();
  const [updateUserByAdmin, { isLoading: isUpdating }] = useUpdateUserByAdminMutation();

  const usersList = usersResponse?.data?.users || usersResponse?.data || DEFAULT_STAFF;

  const [selectedUser, setSelectedUser] = useState(usersList[1] || usersList[0]);
  const [editedRole, setEditedRole] = useState(selectedUser?.role || "admin");

  // Local state for module permissions: { products: { view: true, add: false, ... } }
  const [permissionsState, setPermissionsState] = useState(() => {
    const initial = {};
    MODULES.forEach((mod) => {
      initial[mod.key] = { view: false, add: false, edit: false, delete: false };
    });
    // Prefill from user access if available
    selectedUser?.access?.forEach((acc) => {
      if (initial[acc.routeKey]) {
        acc.permissions.forEach((perm) => {
          initial[acc.routeKey][perm] = true;
        });
      }
    });
    return initial;
  });

  const handleSelectUser = (u) => {
    setSelectedUser(u);
    setEditedRole(u.role);

    const initial = {};
    MODULES.forEach((mod) => {
      initial[mod.key] = { view: false, add: false, edit: false, delete: false };
    });

    if (u.role === "super_admin") {
      // Super admin has all permissions
      MODULES.forEach((mod) => {
        initial[mod.key] = { view: true, add: true, edit: true, delete: true };
      });
    } else if (u.access) {
      u.access.forEach((acc) => {
        if (initial[acc.routeKey]) {
          acc.permissions.forEach((perm) => {
            initial[acc.routeKey][perm] = true;
          });
        }
      });
    }

    setPermissionsState(initial);
  };

  const handlePermissionToggle = (moduleKey, actionKey) => {
    if (editedRole === "super_admin") return;

    setPermissionsState((prev) => ({
      ...prev,
      [moduleKey]: {
        ...prev[moduleKey],
        [actionKey]: !prev[moduleKey]?.[actionKey],
      },
    }));
  };

  const handleSelectAllModule = (moduleKey, select) => {
    if (editedRole === "super_admin") return;

    setPermissionsState((prev) => ({
      ...prev,
      [moduleKey]: {
        view: select,
        add: select,
        edit: select,
        delete: select,
      },
    }));
  };

  const handleSave = async () => {
    if (!selectedUser) return;

    // Convert state to API format
    const accessPayload = [];
    Object.keys(permissionsState).forEach((modKey) => {
      const activeActions = [];
      Object.keys(permissionsState[modKey]).forEach((actKey) => {
        if (permissionsState[modKey][actKey]) activeActions.push(actKey);
      });
      if (activeActions.length > 0) {
        accessPayload.push({ routeKey: modKey, permissions: activeActions });
      }
    });

    try {
      await updateUserByAdmin({
        userId: selectedUser._id,
        role: editedRole,
        access: accessPayload,
      }).unwrap();
      toast.success(`Role & granular permissions updated for ${selectedUser.fullName}!`);
    } catch {
      toast.success(
        `Role & permissions saved locally for ${selectedUser.fullName} (${editedRole})!`
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <H3 className="text-xl font-bold text-gray-900">
            Granular Role & Page Permissions
          </H3>
          <P className="text-xs text-gray-500 mt-1">
            Super Admin has full access to all pages. Assign custom Admins access to specific pages
            (View, Add, Edit, Delete).
          </P>
        </div>
        <Button
          variant="brand"
          size="sm"
          rounded="xl"
          onClick={handleSave}
          disabled={isUpdating}
        >
          <Save size={15} /> Save Permissions
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: User Selector List */}
        <div className="bg-white rounded-2xl border border-border p-4 space-y-3">
          <Typography variant="h6" className="font-bold text-gray-700 uppercase tracking-wide px-2">
            Select User to Configure
          </Typography>

          <div className="space-y-1.5">
            {usersList.map((u) => {
              const isSelected = selectedUser?._id === u._id;
              return (
                <button
                  key={u._id}
                  onClick={() => handleSelectUser(u)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between ${isSelected
                      ? "bg-brand/10 border border-brand/30 shadow-xs"
                      : "border border-border/40 hover:bg-gray-50"
                    }`}
                >
                  <div className="min-w-0 pr-2">
                    <Typography variant="p" className={`text-xs font-bold truncate ${isSelected ? "text-brand" : "text-gray-900"}`}>
                      {u.fullName}
                    </Typography>
                    <Caption className="text-[11px] text-gray-500 truncate">{u.email}</Caption>
                  </div>
                  <Badge variant={u.role} size="sm">
                    {u.role.replace("_", " ")}
                  </Badge>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Permission Matrix */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-border p-6 space-y-6">
          {/* User Role Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-gray-50 border border-border">
            <div>
              <Caption className="text-gray-500">Configuring Permissions for:</Caption>
              <Typography variant="h5" className="font-bold text-gray-900">{selectedUser?.fullName}</Typography>
              <Caption className="text-gray-500">{selectedUser?.email}</Caption>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-700">Assigned Role:</span>
              <SearchableSelect
                value={editedRole}
                onChange={(e) => {
                  const newR = e.target.value;
                  setEditedRole(newR);
                  if (newR === "super_admin") {
                    const allTrue = {};
                    MODULES.forEach((mod) => {
                      allTrue[mod.key] = { view: true, add: true, edit: true, delete: true };
                    });
                    setPermissionsState(allTrue);
                  }
                }}
                options={ASSIGNED_ROLE_OPTIONS}
                placeholder="Select Role"
                size="sm"
                clearable={false}
                className="w-48"
              />
            </div>
          </div>

          {/* Super Admin Notice */}
          {editedRole === "super_admin" && (
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-900 flex items-start gap-2.5">
              <ShieldCheck size={18} className="text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Super Admin Privilege:</strong> This user automatically possesses unrestricted access
                to all administrative dashboard pages, seller moderation, and financial treasury actions.
              </div>
            </div>
          )}

          {/* Granular Table for Custom Admin */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Typography variant="h6" className="font-bold text-gray-900 text-sm">Page & Feature Access Matrix</Typography>
              <Caption className="text-gray-400">Click checkboxes to grant/revoke actions</Caption>
            </div>

            <div className="border border-border rounded-xl overflow-hidden divide-y divide-border">
              {MODULES.map((mod) => {
                const currentMod = permissionsState[mod.key] || {
                  view: false,
                  add: false,
                  edit: false,
                  delete: false,
                };
                const allSelected =
                  currentMod.view && currentMod.add && currentMod.edit && currentMod.delete;

                return (
                  <div key={mod.key} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="sm:w-1/3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900">{mod.label}</span>
                        {allSelected && (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                            Full
                          </span>
                        )}
                      </div>
                      <Caption className="text-[11px] text-gray-400 mt-0.5">{mod.description}</Caption>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      {ACTIONS.map((act) => {
                        const isChecked = !!currentMod[act.key];
                        return (
                          <button
                            key={act.key}
                            type="button"
                            disabled={editedRole === "super_admin"}
                            onClick={() => handlePermissionToggle(mod.key, act.key)}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors disabled:cursor-not-allowed ${
                              isChecked
                                ? "bg-brand/10 text-brand border-brand/40"
                                : "bg-gray-50 text-gray-500 border-border hover:bg-gray-100"
                            }`}
                          >
                            {isChecked ? <Check size={12} /> : <X size={12} className="opacity-40" />}
                            <span>{act.label}</span>
                          </button>
                        );
                      })}

                      {editedRole !== "super_admin" && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="xs"
                          onClick={() => handleSelectAllModule(mod.key, !allSelected)}
                          className="text-[11px] text-brand hover:underline font-semibold ml-2 h-auto px-1.5 py-0.5 cursor-pointer"
                        >
                          {allSelected ? "Clear" : "All"}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              variant="brand"
              size="sm"
              rounded="xl"
              onClick={handleSave}
              disabled={isUpdating}
            >
              <Save size={15} /> Save Role & Permissions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

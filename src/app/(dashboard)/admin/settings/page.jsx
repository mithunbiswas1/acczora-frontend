// src/app/(dashboard)/admin/settings/page.jsx

"use client";

import { useState } from "react";
import { Save, ShieldCheck, DollarSign, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { Typography, H3, P, Caption } from "@/components/ui/Typography";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    platformFeePercent: 10,
    minWithdrawalUsd: 20,
    escrowHoldingHours: 24,
    disputeGracePeriodHours: 48,
    requireReviewApproval: true,
    maintenanceMode: false,
    supportEmail: "support@acczora.com",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    toast.success("Platform settings saved and synchronized!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-border shadow-xs">
        <H3 className="text-xl font-bold text-gray-900">Platform Global Settings</H3>
        <P className="text-xs text-gray-500 mt-1">
          Configure commission take rates, minimum withdrawal thresholds, and warranty timers.
        </P>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Marketplace Economics */}
        <div className="bg-white p-6 rounded-2xl border border-border shadow-xs space-y-4">
          <div className="border-b border-border pb-3">
            <Typography variant="h6" className="font-bold text-gray-900 text-sm">
              Marketplace Economics
            </Typography>
            <Caption className="text-gray-500">Platform revenue fee and payout limits</Caption>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Platform Commission Fee (%)"
              type="number"
              min="0"
              max="50"
              name="platformFeePercent"
              value={settings.platformFeePercent}
              onChange={handleChange}
              suffix={<span className="text-xs font-bold text-gray-400">%</span>}
              helperText="Deducted automatically from gross sale before credited to seller available balance."
            />

            <Input
              label="Minimum Seller Withdrawal Threshold ($ USD)"
              type="number"
              min="5"
              name="minWithdrawalUsd"
              value={settings.minWithdrawalUsd}
              onChange={handleChange}
              prefix="$"
              prefixPadding="pl-8"
              helperText="Minimum balance required before a seller can submit a payout request."
            />
          </div>
        </div>

        {/* Escrow & Buyer Warranty Rules */}
        <div className="bg-white p-6 rounded-2xl border border-border shadow-xs space-y-4">
          <div className="border-b border-border pb-3">
            <Typography variant="h6" className="font-bold text-gray-900 text-sm">
              Escrow & Warranty Timers
            </Typography>
            <Caption className="text-gray-500">Protection holding times for accounts</Caption>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Escrow Clearance Holding Time (Hours)"
              type="number"
              min="1"
              name="escrowHoldingHours"
              value={settings.escrowHoldingHours}
              onChange={handleChange}
              helperText="Funds stay in seller pending escrow for this duration to allow buyer verification."
            />

            <Input
              label="Dispute Grace Period (Hours)"
              type="number"
              min="1"
              name="disputeGracePeriodHours"
              value={settings.disputeGracePeriodHours}
              onChange={handleChange}
              helperText="Allowed response window for sellers before auto-refunding disputed accounts."
            />
          </div>
        </div>

        {/* Moderation Policies */}
        <div className="bg-white p-6 rounded-2xl border border-border shadow-xs space-y-4">
          <div className="border-b border-border pb-3">
            <Typography variant="h6" className="font-bold text-gray-900 text-sm">
              Moderation Policies
            </Typography>
            <Caption className="text-gray-500">Content and review publication controls</Caption>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-gray-50 transition-colors">
              <Checkbox
                id="requireReviewApproval"
                checked={settings.requireReviewApproval}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    requireReviewApproval: !!checked,
                  }))
                }
              />
              <label htmlFor="requireReviewApproval" className="cursor-pointer">
                <span className="text-xs font-bold text-gray-900 block">
                  Require Admin Approval for Customer Reviews
                </span>
                <Caption className="text-gray-500">
                  When enabled, reviews submitted by buyers must be approved in Admin &gt; Reviews before appearing publicly.
                </Caption>
              </label>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-gray-50 transition-colors">
              <Checkbox
                id="maintenanceMode"
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    maintenanceMode: !!checked,
                  }))
                }
              />
              <label htmlFor="maintenanceMode" className="cursor-pointer">
                <span className="text-xs font-bold text-gray-900 block">
                  Marketplace Maintenance Mode
                </span>
                <Caption className="text-gray-500">
                  Temporarily disable new checkout orders while performing upgrades.
                </Caption>
              </label>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="brand"
            size="default"
            icon={<Save size={16} />}
          >
            Save Platform Settings
          </Button>
        </div>
      </form>
    </div>
  );
}

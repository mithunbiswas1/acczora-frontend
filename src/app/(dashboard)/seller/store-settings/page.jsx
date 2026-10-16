// src/app/(dashboard)/seller/store-settings/page.jsx

"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { Save, Store, ShieldCheck, Mail, Bell, MessageCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { Checkbox } from "@/components/ui/Checkbox";
import { Typography, H3, P, Caption } from "@/components/ui/Typography";
import { toast } from "sonner";

export default function SellerStoreSettingsPage() {
  const { user } = useSelector((state) => state.auth);

  const [settings, setSettings] = useState({
    shopName: user?.shopName || "NovaStore",
    email: user?.email || "seller@acczora.com",
    telegramHandle: "@novastore_support",
    bio: "Trusted digital accounts seller since 2023. Fast 24/7 automated delivery for streaming, productivity, and VPN accounts with verified warranty.",
    autoDeliveryNote: "Thanks for purchasing! Please check your order details for credentials and instructions. Leave a review if you are satisfied with our service.",
    emailNotificationOnSale: true,
    emailNotificationOnDispute: true,
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
    toast.success("Store settings updated successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-border shadow-xs flex items-center justify-between">
        <div>
          <H3 className="text-xl font-bold text-gray-900">Store Profile & Settings</H3>
          <P className="text-xs text-gray-500 mt-1">
            Customize your storefront identity, customer support links, and notification alerts.
          </P>
        </div>
        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 flex items-center gap-1.5">
          <ShieldCheck size={14} />
          Verified Merchant
        </span>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand & Store Profile */}
        <div className="bg-white p-6 rounded-2xl border border-border shadow-xs space-y-4">
          <div className="border-b border-border pb-3">
            <Typography variant="h5" className="font-bold text-gray-900 text-sm">
              Storefront Details
            </Typography>
            <Caption className="text-gray-500">
              Public information displayed on your seller profile and listings
            </Caption>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Store / Shop Name</label>
              <Input
                name="shopName"
                value={settings.shopName}
                onChange={handleChange}
                className="w-full text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Support Email</label>
              <Input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                className="w-full text-xs"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-gray-700">
                Telegram / Discord Handle (for buyer inquiries)
              </label>
              <Input
                name="telegramHandle"
                value={settings.telegramHandle}
                onChange={handleChange}
                placeholder="@yourhandle"
                className="w-full text-xs"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Textarea
                label="Store Bio / Description"
                name="bio"
                rows={3}
                value={settings.bio}
                onChange={handleChange}
                className="w-full text-xs"
              />
            </div>
          </div>
        </div>

        {/* Automated Delivery & Notes */}
        <div className="bg-white p-6 rounded-2xl border border-border shadow-xs space-y-4">
          <div className="border-b border-border pb-3">
            <Typography variant="h5" className="font-bold text-gray-900 text-sm">
              Order Fulfillment & Instructions
            </Typography>
            <Caption className="text-gray-500">
              Note automatically delivered to buyer upon order completion
            </Caption>
          </div>

          <div className="space-y-1.5">
            <Textarea
              label="Default Auto-Delivery Message"
              name="autoDeliveryNote"
              rows={3}
              value={settings.autoDeliveryNote}
              onChange={handleChange}
              className="w-full text-xs"
            />
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white p-6 rounded-2xl border border-border shadow-xs space-y-4">
          <div className="border-b border-border pb-3">
            <Typography variant="h5" className="font-bold text-gray-900 text-sm">
              Notification Preferences
            </Typography>
            <Caption className="text-gray-500">
              Email alerts for real-time sales and customer issues
            </Caption>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Checkbox
                id="emailNotificationOnSale"
                checked={settings.emailNotificationOnSale}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    emailNotificationOnSale: !!checked,
                  }))
                }
              />
              <label htmlFor="emailNotificationOnSale" className="cursor-pointer">
                <p className="text-xs font-semibold text-gray-800">Email alert on new order sale</p>
                <p className="text-[11px] text-gray-400">Receive instant notification whenever a buyer orders</p>
              </label>
            </div>

            <div className="flex items-center gap-3">
              <Checkbox
                id="emailNotificationOnDispute"
                checked={settings.emailNotificationOnDispute}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    emailNotificationOnDispute: !!checked,
                  }))
                }
              />
              <label htmlFor="emailNotificationOnDispute" className="cursor-pointer">
                <p className="text-xs font-semibold text-gray-800">Email alert on support claim or dispute</p>
                <p className="text-[11px] text-gray-400">Get notified if an account warranty issue is filed</p>
              </label>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Button
            type="submit"
            variant="solid"
            size="default"
            icon={<Save size={16} />}
          >
            Save Store Settings
          </Button>
        </div>
      </form>
    </div>
  );
}

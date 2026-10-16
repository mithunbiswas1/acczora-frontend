// src/app/(dashboard)/seller/store-settings/page.jsx

"use client";

import { useState, useEffect } from "react";
import { Save, ShieldCheck, Loader2 } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { Checkbox } from "@/components/ui/Checkbox";
import { Card } from "@/components/ui/Card";
import {
  useGetStoreSettingsQuery,
  useUpdateStoreSettingsMutation,
} from "@/redux/api/storeApi";
import { toast } from "sonner";

export default function SellerStoreSettingsPage() {
  const { data: storeData, isLoading: isFetching } = useGetStoreSettingsQuery();
  const [updateStoreSettings, { isLoading: isUpdating }] =
    useUpdateStoreSettingsMutation();

  const [settings, setSettings] = useState({
    shopName: "",
    shopSlug: "",
    supportEmail: "",
    telegramHandle: "",
    bio: "",
    autoDeliveryNote: "",
    emailNotificationOnSale: true,
    emailNotificationOnDispute: true,
  });

  // Populate loaded settings from API
  useEffect(() => {
    if (storeData?.data) {
      const data = storeData.data;
      setSettings({
        shopName: data.shopName || "",
        shopSlug: data.shopSlug || "",
        supportEmail: data.supportEmail || "",
        telegramHandle: data.telegramHandle || "",
        bio: data.bio || data.shopDescription || "",
        autoDeliveryNote: data.autoDeliveryNote || "",
        emailNotificationOnSale: data.emailNotificationOnSale ?? true,
        emailNotificationOnDispute: data.emailNotificationOnDispute ?? true,
      });
    }
  }, [storeData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!settings.shopName.trim()) {
      toast.error("Store / Shop Name is required");
      return;
    }

    try {
      await updateStoreSettings(settings).unwrap();
      toast.success("Store settings updated successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update store settings");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Unified Page Header */}
      <PageHeader
        title="Store Profile & Settings"
        description="Customize your storefront identity, customer support links, and notification alerts."
        action={
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
            <ShieldCheck size={14} />
            Verified Merchant
          </span>
        }
      />

      {isFetching ? (
        <Card className="p-12 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#5b52f9] animate-spin mx-auto" />
          <p className="text-xs text-gray-400">Loading store profile...</p>
        </Card>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Brand & Store Profile */}
          <Card className="p-6 space-y-4">
            <div className="border-b border-border pb-3">
              <h2 className="font-bold text-gray-900 text-sm">
                Storefront Details
              </h2>
              <p className="text-xs text-gray-500">
                Public information displayed on your seller profile and listings
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Store / Shop Name"
                name="shopName"
                value={settings.shopName}
                onChange={handleChange}
                placeholder="e.g. NovaStore Digital"
                required
              />

              <Input
                label="Store URL Slug (acczora.com/store/slug)"
                name="shopSlug"
                value={settings.shopSlug}
                onChange={handleChange}
                placeholder="e.g. novastore"
              />

              <Input
                type="email"
                label="Customer Support Email"
                name="supportEmail"
                value={settings.supportEmail}
                onChange={handleChange}
                placeholder="support@novastore.com"
              />

              <Input
                label="Telegram / Discord Support Handle"
                name="telegramHandle"
                value={settings.telegramHandle}
                onChange={handleChange}
                placeholder="@novastore_support"
              />

              <div className="md:col-span-2">
                <Textarea
                  label="Store Bio / Description"
                  name="bio"
                  rows={3}
                  value={settings.bio}
                  onChange={handleChange}
                  placeholder="Tell buyers about your digital accounts, delivery warranty, and reliability..."
                />
              </div>
            </div>
          </Card>

          {/* Automated Delivery & Notes */}
          <Card className="p-6 space-y-4">
            <div className="border-b border-border pb-3">
              <h2 className="font-bold text-gray-900 text-sm">
                Order Fulfillment & Instructions
              </h2>
              <p className="text-xs text-gray-500">
                Note automatically delivered to buyer upon order completion
              </p>
            </div>

            <Textarea
              label="Default Auto-Delivery Message"
              name="autoDeliveryNote"
              rows={3}
              value={settings.autoDeliveryNote}
              onChange={handleChange}
              placeholder="e.g. Thanks for purchasing! Your account credentials have been auto-delivered above. Please contact our Telegram support if you have any questions."
            />
          </Card>

          {/* Notifications */}
          <Card className="p-6 space-y-4">
            <div className="border-b border-border pb-3">
              <h2 className="font-bold text-gray-900 text-sm">
                Notification Preferences
              </h2>
              <p className="text-xs text-gray-500">
                Email alerts for real-time sales and customer issues
              </p>
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
                <label
                  htmlFor="emailNotificationOnSale"
                  className="cursor-pointer"
                >
                  <p className="text-xs font-semibold text-gray-800">
                    Email alert on new order sale
                  </p>
                  <p className="text-[11px] text-gray-400">
                    Receive instant notification whenever a buyer orders
                  </p>
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
                <label
                  htmlFor="emailNotificationOnDispute"
                  className="cursor-pointer"
                >
                  <p className="text-xs font-semibold text-gray-800">
                    Email alert on support claim or dispute
                  </p>
                  <p className="text-[11px] text-gray-400">
                    Get notified if an account warranty issue is filed
                  </p>
                </label>
              </div>
            </div>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="submit"
              variant="brand"
              size="default"
              rounded="xl"
              disabled={isUpdating}
              className="px-6"
            >
              {isUpdating ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              <span>Save Store Settings</span>
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

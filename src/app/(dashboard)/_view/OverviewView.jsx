// src/app/(dashboard)/_view/OverviewView.jsx

"use client";

import React from "react";
import { useSelector } from "react-redux";
import OverviewBanner from "../_components/overview/OverviewBanner";
import OverviewStatCards from "../_components/overview/OverviewStatCards";
import SalesOverviewChart from "../_components/overview/SalesOverviewChart";
import RecentOrdersTable from "../_components/overview/RecentOrdersTable";
import TopProductsTable from "../_components/overview/TopProductsTable";

export default function OverviewView({
  role = "seller",
  customName,
  bannerSubtitle = "Here's what's happening with your store.",
  actionLabel = "View Store",
  actionHref,
  stats,
  orders,
  topProducts,
  ordersTitle = "Team Hiring Performance",
}) {
  const { user } = useSelector((state) => state.auth);

  const displayName =
    customName ||
    user?.shopName ||
    user?.fullName ||
    (role === "admin" ? "NovaStore" : "NovaStore");

  const resolvedActionHref =
    actionHref || (role === "admin" ? "/store/novastore" : "/store/novastore");

  const ordersLink = role === "admin" ? "/admin/orders" : "/seller/orders";
  const productsLink = role === "admin" ? "/admin/products" : "/seller/products";

  return (
    <div className="space-y-6">
      {/* 1. Lilac Gradient Banner */}
      <OverviewBanner
        name={displayName}
        greeting="Welcome back"
        subtitle={bannerSubtitle}
        actionLabel={actionLabel}
        actionHref={resolvedActionHref}
      />

      {/* 2. Four Stat Cards */}
      <OverviewStatCards stats={stats} />

      {/* 3. Sales Overview Chart with Dual Area Waves & Peak Tooltip */}
      <SalesOverviewChart title="Sales Overview" peakAmount="$7,900" />

      {/* 4. Recent Orders Table (Team Hiring Performance) */}
      <RecentOrdersTable
        title={ordersTitle}
        viewAllHref={ordersLink}
        orders={orders}
      />

      {/* 5. Top Products Card */}
      <TopProductsTable
        title="Top products"
        viewAllHref={productsLink}
        products={topProducts}
      />
    </div>
  );
}

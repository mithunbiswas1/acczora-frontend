// src/app/(dashboard)/seller/overview/page.jsx

"use client";

import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import OverviewView from "../../_view/OverviewView";
import { useGetSellerOrdersQuery } from "@/redux/api/orderApi";
import { useGetSellerProductsQuery } from "@/redux/api/productApi";
import {
  TotalSalesIcon,
  CartFlatbedBoxesIcon,
  CubesIcon,
  DashboardStarIcon,
} from "@/icons";

export default function SellerOverviewPage() {
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const { data: ordersData } = useGetSellerOrdersQuery(undefined, { skip: !isLoggedIn });
  const { data: productsData } = useGetSellerProductsQuery(undefined, { skip: !isLoggedIn });

  const rawOrders = useMemo(() => {
    return Array.isArray(ordersData?.data?.orders)
      ? ordersData.data.orders
      : Array.isArray(ordersData?.data)
      ? ordersData.data
      : [];
  }, [ordersData]);

  const rawProducts = useMemo(() => {
    return Array.isArray(productsData?.data?.products)
      ? productsData.data.products
      : Array.isArray(productsData?.data)
      ? productsData.data
      : [];
  }, [productsData]);

  // Dynamic statistics
  const totalSales = useMemo(() => {
    return rawOrders.reduce((acc, o) => acc + (Number(o.totalAmount) || 0), 0);
  }, [rawOrders]);

  const stats = useMemo(() => {
    return [
      {
        label: "Total Sales",
        value: `$${totalSales.toFixed(2)}`,
        change: `$${totalSales.toFixed(2)} USD`,
        subtext: "Lifetime store earnings",
        iconBg: "bg-brand/10 text-brand",
        icon: TotalSalesIcon,
      },
      {
        label: "Orders Delivered",
        value: String(rawOrders.length),
        change: `${rawOrders.filter(o => o.status === 'completed').length} completed`,
        subtext: "Automated deliveries",
        iconBg: "bg-[#dcfce7] text-[#16a34a]",
        icon: CartFlatbedBoxesIcon,
      },
      {
        label: "Active Products",
        value: String(rawProducts.length),
        subtext: `${rawProducts.filter(p => p.status === 'active').length} live in marketplace`,
        iconBg: "bg-[#e0e7ff] text-[#4f46e5]",
        icon: CubesIcon,
      },
      {
        label: "Rating",
        value: "5.0",
        subtext: "Verified seller trust",
        iconBg: "bg-[#fef3c7] text-[#d97706]",
        icon: DashboardStarIcon,
      },
    ];
  }, [totalSales, rawOrders, rawProducts]);

  const recentOrders = useMemo(() => {
    if (rawOrders.length === 0) return undefined;
    return rawOrders.slice(0, 5).map((order) => {
      const formattedDate = order.createdAt
        ? new Date(order.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        : "Recent";

      return {
        orderId: order.orderNumber || `#ACC${String(order._id || order.id).slice(-5)}`,
        product: order.productTitle || order.product?.title || "Digital Account",
        category: order.product?.category?.name || "Account",
        buyer: order.buyer?.fullName || order.buyer?.username || "Verified Buyer",
        buyerAvatar: order.buyer?.avatar || "",
        date: formattedDate,
        amount: `$${Number(order.totalAmount || 0).toFixed(2)}`,
        status: order.status === "completed" ? "Completed" : "Processing",
      };
    });
  }, [rawOrders]);

  const topProducts = useMemo(() => {
    if (rawProducts.length === 0) return undefined;
    return rawProducts.slice(0, 4).map((p) => {
      const salesCount = p.sales || p.soldCount || 0;
      const revenue = (salesCount * (Number(p.price) || 0)).toFixed(2);
      return {
        title: p.title,
        category: p.category?.name || "Digital Account",
        sales: salesCount,
        revenue: `$${revenue}`,
      };
    });
  }, [rawProducts]);

  return (
    <OverviewView
      role="seller"
      customName={user?.shopName || user?.fullName || "Seller"}
      bannerSubtitle="Here's what's happening with your digital account store."
      actionLabel="My Products"
      actionHref="/seller/products"
      ordersTitle="Recent Order Deliveries"
      stats={stats}
      orders={recentOrders}
      topProducts={topProducts}
    />
  );
}

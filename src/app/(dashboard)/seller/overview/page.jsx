// src/app/(dashboard)/seller/overview/page.jsx

"use client";

import React from "react";
import OverviewView from "../../_view/OverviewView";

export default function SellerOverviewPage() {
  return (
    <OverviewView
      role="seller"
      bannerSubtitle="Here's what's happening with your store."
      actionLabel="View Store"
      actionHref="/store/novastore"
      ordersTitle="Team Hiring Performance"
    />
  );
}

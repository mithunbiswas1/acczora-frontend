// src/app/(dashboard)/seller/page.jsx

import { redirect } from "next/navigation";

export default function SellerIndexPage() {
  redirect("/seller/overview");
}

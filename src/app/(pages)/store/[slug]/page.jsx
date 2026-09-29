// src/app/(pages)/store/[slug]/page.jsx

import { redirect } from "next/navigation";

export default async function LegacyStorePage({ params }) {
  const { slug } = await params;
  redirect(`/seller/${slug || "nova-store"}`);
}

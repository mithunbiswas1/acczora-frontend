// src/middleware.js

import { NextResponse } from "next/server";

// Edge-safe JWT payload decoder without external dependencies
function decodeJwtPayload(token) {
  try {
    if (!token || typeof token !== "string") return null;
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Retrieve auth token and userRole from cookies
  const accessToken = request.cookies.get("accessToken")?.value;
  let userRole = request.cookies.get("userRole")?.value;

  // Fallback: decode role from JWT accessToken if userRole cookie is not present
  if (!userRole && accessToken) {
    const payload = decodeJwtPayload(accessToken);
    if (payload?.role) {
      userRole = payload.role;
    }
  }

  const normalizedRole = userRole?.toLowerCase();
  const isAuthenticated = Boolean(accessToken);

  const isProtectedPath =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/seller") ||
    pathname.startsWith("/buyer") ||
    pathname.startsWith("/dashboard");

  const isAuthPath =
    pathname.startsWith("/login") ||
    pathname.startsWith("/registration") ||
    pathname.startsWith("/sign-in");

  // 1. Unauthenticated users trying to access protected dashboard routes
  if (isProtectedPath && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Helper for determining the canonical overview path for each role
  const getRoleOverviewPath = (role) => {
    if (role === "admin" || role === "super_admin") return "/admin/overview";
    if (role === "seller") return "/seller/overview";
    if (role === "buyer" || role === "customer") return "/buyer/overview";
    return "/login";
  };

  // 2. Authenticated users trying to access login/register pages
  if (isAuthPath && isAuthenticated && normalizedRole) {
    return NextResponse.redirect(new URL(getRoleOverviewPath(normalizedRole), request.url));
  }

  // 3. /dashboard or /dashboard/ -> direct redirect to role overview
  if ((pathname === "/dashboard" || pathname === "/dashboard/") && isAuthenticated && normalizedRole) {
    return NextResponse.redirect(new URL(getRoleOverviewPath(normalizedRole), request.url));
  }

  // 4. Strict Role-Based Access Control (RBAC)
  if (isAuthenticated && normalizedRole) {
    // ADMIN / SUPER_ADMIN
    if (normalizedRole === "admin" || normalizedRole === "super_admin") {
      // Admins are prohibited from directly accessing seller or buyer overview/pages
      if (pathname.startsWith("/seller") || pathname.startsWith("/buyer")) {
        return NextResponse.redirect(new URL("/admin/overview", request.url));
      }
    }
    // SELLER
    else if (normalizedRole === "seller") {
      // Sellers are prohibited from accessing admin or buyer pages
      if (pathname.startsWith("/admin") || pathname.startsWith("/buyer")) {
        return NextResponse.redirect(new URL("/seller/overview", request.url));
      }
    }
    // BUYER / CUSTOMER
    else if (normalizedRole === "buyer" || normalizedRole === "customer") {
      // Buyers are prohibited from accessing admin or seller pages
      if (pathname.startsWith("/admin") || pathname.startsWith("/seller")) {
        return NextResponse.redirect(new URL("/buyer/overview", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/seller/:path*",
    "/buyer/:path*",
    "/dashboard/:path*",
    "/login",
    "/registration",
    "/sign-in",
  ],
};

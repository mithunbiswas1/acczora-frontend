// src/app/(auth)/become-a-seller/page.jsx

"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Upload,
  CheckCircle2,
  Store,
  UserCheck,
  Shield,
  ArrowRight,
  Clock,
  AlertCircle,
  LayoutDashboard,
} from "lucide-react";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { useBecomeSellerMutation, useRegistrationMutation } from "@/redux/api/authApi";
import { updateUser } from "@/redux/slice/authSlice";
import { AuthInput, AuthButton } from "../_components";

export default function BecomeSellerPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isLoggedIn } = useSelector((state) => state.auth);

  const [becomeSellerMutation, { isLoading: isUpgrading }] = useBecomeSellerMutation();
  const [registerMutation, { isLoading: isRegistering }] = useRegistrationMutation();

  const nidFrontRef = useRef(null);
  const nidBackRef = useRef(null);

  const [isSubmittedPending, setIsSubmittedPending] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    country: "Bangladesh",
    nidNumber: "",
    shopName: "",
    shopDescription: "",
  });

  const [nidFrontFile, setNidFrontFile] = useState(null);
  const [nidBackFile, setNidBackFile] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});

  // Auto pre-fill if user is logged in
  useEffect(() => {
    if (user) {
      if (user.sellerStatus === "pending") {
        setIsSubmittedPending(true);
      }
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || (user.fullName ? user.fullName.split(" ")[0] : ""),
        lastName: user.lastName || (user.fullName ? user.fullName.split(" ").slice(1).join(" ") : ""),
        email: user.email || "",
        phone: user.phone || "",
        country: user.country || "Bangladesh",
        nidNumber: user.nidNumber || "",
        shopName: user.shopName || (user.fullName ? `${user.fullName}'s Store` : ""),
        shopDescription: user.shopDescription || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be under 5MB");
        return;
      }
      if (type === "front") {
        setNidFrontFile(file);
        toast.success(`NID Front uploaded: ${file.name}`);
      } else {
        setNidBackFile(file);
        toast.success(`NID Back uploaded: ${file.name}`);
      }
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First Name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last Name is required";

    if (!isLoggedIn) {
      if (!formData.email.trim()) {
        newErrors.email = "Email Address is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }

      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters long";
      }
    }

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";
    if (!formData.nidNumber.trim()) newErrors.nidNumber = "NID Number is required";
    if (!formData.shopName.trim()) newErrors.shopName = "Store Name is required";

    if (!agreed) {
      newErrors.agreed = "You must agree to the Seller Terms & Marketplace Policies";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const fullPayload = new FormData();
    fullPayload.append("firstName", formData.firstName.trim());
    fullPayload.append("lastName", formData.lastName.trim());
    fullPayload.append("fullName", `${formData.firstName.trim()} ${formData.lastName.trim()}`);
    fullPayload.append("phone", formData.phone.trim());
    fullPayload.append("country", formData.country.trim());
    fullPayload.append("nidNumber", formData.nidNumber.trim());
    fullPayload.append("shopName", formData.shopName.trim());
    fullPayload.append("shopDescription", formData.shopDescription.trim());

    if (nidFrontFile) {
      fullPayload.append("nidFront", nidFrontFile);
    }
    if (nidBackFile) {
      fullPayload.append("nidBack", nidBackFile);
    }

    try {
      if (isLoggedIn) {
        // Upgrade existing logged-in buyer to seller
        const response = await becomeSellerMutation(fullPayload).unwrap();
        const updatedUserData = response?.data?.user;

        if (updatedUserData) {
          dispatch(updateUser(updatedUserData));
        }

        setIsSubmittedPending(true);
        toast.success("Your seller application has been submitted and is currently pending admin approval.");
      } else {
        // Direct registration as a Seller
        fullPayload.append("email", formData.email.trim().toLowerCase());
        fullPayload.append("password", formData.password);
        fullPayload.append("role", "seller");

        await registerMutation(fullPayload).unwrap();
        setIsSubmittedPending(true);
        toast.success("Your seller account has been created and is currently pending admin approval.");
      }
    } catch (err) {
      const errMsg =
        err?.data?.message || err?.message || "Failed to submit seller registration. Please try again.";
      toast.error(errMsg);
    }
  };

  const isLoading = isUpgrading || isRegistering;
  const isAlreadyApprovedSeller = user?.sellerStatus === "approved" || (isLoggedIn && user?.role === "seller" && user?.sellerStatus !== "pending");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-10 px-4 sm:px-6">
      {/* Top Logo */}
      <div className="mb-6 text-center">
        <Link href="/" className="inline-flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="ACCZORA"
            width={160}
            height={42}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>
      </div>

      {/* Already Approved Seller View */}
      {isAlreadyApprovedSeller ? (
        <div className="w-full max-w-[580px] bg-white rounded-2xl border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200 shadow-sm">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              You are an Approved Seller!
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Your merchant store <strong className="text-slate-900">{user?.shopName || "Store"}</strong> is active and verified on the ACCZORA marketplace.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/seller/overview"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#6558ff] hover:bg-[#5345f5] text-white text-xs font-semibold shadow-md transition-all text-center"
            >
              <LayoutDashboard size={14} /> Go to Seller Dashboard
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all text-center"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      ) : isSubmittedPending || user?.sellerStatus === "pending" ? (
        /* Pending Admin Review Confirmation Card */
        <div className="w-full max-w-[580px] bg-white rounded-2xl border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-200 shadow-sm">
            <Clock className="w-8 h-8 animate-pulse text-amber-600" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Application Under Review
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Your seller account application has been submitted and is currently <strong>pending administrator approval</strong>. Once an administrator approves your store, you will be able to log in and access your merchant dashboard.
            </p>
          </div>

          <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-4 max-w-md mx-auto text-left text-xs space-y-2">
            <div className="flex justify-between items-center py-1 border-b border-amber-100/70">
              <span className="text-slate-500 font-medium">Store Name:</span>
              <span className="font-bold text-slate-800">{formData.shopName || user?.shopName || "Merchant Store"}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-amber-100/70">
              <span className="text-slate-500 font-medium">Email / Account:</span>
              <span className="font-semibold text-slate-800">{formData.email || user?.email || user?.phone || "—"}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500 font-medium">Current Status:</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px]">
                <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
                Pending Admin Approval
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#6558ff] hover:bg-[#5345f5] text-white text-xs font-semibold shadow-md transition-all text-center"
            >
              Go to Sign In
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all text-center"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      ) : (
        /* Seller Registration Form */
        <div className="w-full max-w-[640px] bg-white rounded-2xl border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-9">
          {/* Card Header */}
          <div className="pb-5 mb-6 border-b border-slate-100">
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#6558ff] flex items-center justify-center">
                <Store className="w-4.5 h-4.5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Become a Seller
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Start selling your digital products, accounts, and services to thousands of buyers worldwide.
            </p>

            {isLoggedIn && (
              <div className="mt-3.5 p-3 rounded-xl bg-indigo-50/60 border border-indigo-100/80 flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#6558ff] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  <UserCheck className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs text-slate-700 min-w-0">
                  <p className="font-semibold text-slate-900">
                    Logged in as <span className="text-[#6558ff]">{user?.email || user?.fullName}</span>
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    Your account will submit an application to become a verified Merchant / Seller on ACCZORA.
                  </p>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. PERSONAL INFORMATION */}
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#6558ff]" />
                  Personal Verification
                </h2>
                <span className="text-[11px] text-slate-400 font-medium">Step 1 of 2</span>
              </div>

              <div className="space-y-3.5">
                {/* First Name & Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <AuthInput
                    label="First Name"
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Abdullah"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                  />
                  <AuthInput
                    label="Last Name"
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Al Masum"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                  />
                </div>

                {/* Email Address & Password (if not logged in) */}
                {!isLoggedIn && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <AuthInput
                      label="Email Address"
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      error={errors.email}
                    />
                    <AuthInput
                      label="Password"
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      error={errors.password}
                    />
                  </div>
                )}

                {/* Country & Phone Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <AuthInput
                    label="Country"
                    id="country"
                    name="country"
                    type="text"
                    placeholder="Bangladesh"
                    value={formData.country}
                    onChange={handleChange}
                    error={errors.country}
                  />
                  <AuthInput
                    label="Phone Number"
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+8801XXXXXXXXX"
                    value={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
                  />
                </div>

                {/* NID Number */}
                <AuthInput
                  label="NID Number"
                  id="nidNumber"
                  name="nidNumber"
                  type="text"
                  placeholder="10 or 17 digit National ID"
                  value={formData.nidNumber}
                  onChange={handleChange}
                  error={errors.nidNumber}
                />

                {/* Optional NID Uploads */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* NID Front */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-800">
                        NID Front Side
                      </label>
                      <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        Optional
                      </span>
                    </div>
                    <div
                      onClick={() => nidFrontRef.current?.click()}
                      className="border border-dashed border-slate-200 hover:border-[#6558ff]/60 rounded-xl p-3 flex items-center justify-between bg-slate-50/50 hover:bg-indigo-50/20 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 flex items-center justify-center shrink-0">
                          <Upload className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-slate-700 truncate">
                            {nidFrontFile ? nidFrontFile.name : "Upload front side"}
                          </p>
                          <p className="text-[10px] text-slate-400">PNG, JPG up to 5MB</p>
                        </div>
                      </div>
                      <input
                        ref={nidFrontRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "front")}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* NID Back */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-800">
                        NID Back Side
                      </label>
                      <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        Optional
                      </span>
                    </div>
                    <div
                      onClick={() => nidBackRef.current?.click()}
                      className="border border-dashed border-slate-200 hover:border-[#6558ff]/60 rounded-xl p-3 flex items-center justify-between bg-slate-50/50 hover:bg-indigo-50/20 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 flex items-center justify-center shrink-0">
                          <Upload className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-slate-700 truncate">
                            {nidBackFile ? nidBackFile.name : "Upload back side"}
                          </p>
                          <p className="text-[10px] text-slate-400">PNG, JPG up to 5MB</p>
                        </div>
                      </div>
                      <input
                        ref={nidBackRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "back")}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. STORE SETTINGS (Connected to User) */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3.5">
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-[#6558ff]" />
                  Store Settings
                </h2>
                <span className="text-[11px] text-slate-400 font-medium">Step 2 of 2</span>
              </div>

              <div className="space-y-3.5">
                <AuthInput
                  label="Store Name"
                  id="shopName"
                  name="shopName"
                  type="text"
                  placeholder="Apex Digital Vault"
                  value={formData.shopName}
                  onChange={handleChange}
                  error={errors.shopName}
                />

                <div className="w-full">
                  <label
                    htmlFor="shopDescription"
                    className="block text-xs font-semibold text-slate-800 mb-1.5"
                  >
                    Store Description
                  </label>
                  <textarea
                    id="shopDescription"
                    name="shopDescription"
                    rows={3}
                    placeholder="Provide a brief summary of the digital products or services you offer..."
                    value={formData.shopDescription}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#6558ff] focus:ring-1 focus:ring-[#6558ff] transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs sm:text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => {
                    setAgreed(e.target.checked);
                    if (errors.agreed) {
                      setErrors((prev) => ({ ...prev, agreed: "" }));
                    }
                  }}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#6558ff] focus:ring-[#6558ff] accent-[#6558ff] cursor-pointer"
                />
                <span>
                  I agree to ACCZORA's{" "}
                  <Link href="/seller-terms" className="text-[#6558ff] hover:underline font-semibold">
                    Seller Terms
                  </Link>{" "}
                  and Marketplace Policies.
                </span>
              </label>
              {errors.agreed && (
                <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.agreed}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <AuthButton type="submit" loading={isLoading}>
                {isLoggedIn ? "Submit Seller Application" : "Create Seller Account"}
              </AuthButton>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

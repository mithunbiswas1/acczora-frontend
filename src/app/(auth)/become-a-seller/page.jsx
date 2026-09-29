// src/app/(auth)/become-a-seller/page.jsx

"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Upload, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { AuthInput, AuthButton } from "../_components";

const categoriesList = [
  "Social Media Accounts",
  "Gaming Accounts",
  "Email Accounts",
  "Software & Apps",
  "AI Tools & Subscriptions",
  "Business & E-commerce",
  "Developer Tools",
  "Streaming Services",
  "Education & Courses",
  "Productivity Tools",
  "Other Digital Products",
];

export default function BecomeSellerPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    nidPassport: "",
    storeName: "",
    storeDescription: "",
    category: "",
  });

  const [logoFile, setLogoFile] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size must be under 2MB");
        return;
      }
      setLogoFile(file);
      toast.success(`Logo selected: ${file.name}`);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email Address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone Number is required";
    if (!formData.nidPassport.trim())
      newErrors.nidPassport = "NID/Passport is required";
    if (!formData.storeName.trim())
      newErrors.storeName = "Store Name is required";
    if (!formData.storeDescription.trim())
      newErrors.storeDescription = "Store Description is required";
    if (!formData.category)
      newErrors.category = "Please select a category";
    if (!agreed)
      newErrors.agreed = "You must agree to the Seller Terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      // Simulate submission API call
      await new Promise((res) => setTimeout(res, 800));
      setLoading(false);
      toast.success("Application submitted successfully!");
      router.push("/seller-application-submitted");
    } catch {
      setLoading(false);
      toast.error("Failed to submit application. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center py-8 sm:py-14 px-4">
      {/* Top Logo */}
      <div className="mb-6 sm:mb-8 text-center">
        <Link href="/" className="inline-flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="ACCZORA"
            width={160}
            height={42}
            className="h-9 sm:h-10 w-auto object-contain"
            priority
          />
        </Link>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-[580px] sm:max-w-[620px] bg-white rounded-2xl border border-border shadow-[0_2px_16px_rgba(0,0,0,0.03)] p-6 sm:p-9">
        {/* Card Header */}
        <div className="pb-4 mb-5 border-b border-border">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight text-left">
            Become a Seller
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 text-left">
            Tell us about yourself and your store.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Section 1: Personal Information */}
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-gray-900 mb-3 text-left">
              Personal Information
            </h2>

            <div className="space-y-3.5">
              <AuthInput
                label="Full Name"
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Abdullah Al Masum"
                value={formData.fullName}
                onChange={handleChange}
                error={errors.fullName}
              />

              {/* Email Address & Phone Number Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <AuthInput
                  label="Email Address"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="masumuxui@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                />

                <AuthInput
                  label="Phone Number"
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="01234-56789"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                />
              </div>

              <AuthInput
                label="NID/Passport"
                id="nidPassport"
                name="nidPassport"
                type="text"
                placeholder="0123456789"
                value={formData.nidPassport}
                onChange={handleChange}
                error={errors.nidPassport}
              />
            </div>
          </div>

          {/* Section 2: Store Information */}
          <div className="pt-2">
            <h2 className="text-xs sm:text-sm font-bold text-gray-900 mb-3 text-left">
              Store Information
            </h2>

            <div className="space-y-3.5">
              <AuthInput
                label="Store Name"
                id="storeName"
                name="storeName"
                type="text"
                placeholder="Masums Store"
                value={formData.storeName}
                onChange={handleChange}
                error={errors.storeName}
              />

              {/* Store Description Textarea */}
              <div className="w-full">
                <label
                  htmlFor="storeDescription"
                  className="block text-xs font-semibold text-gray-800 mb-1.5"
                >
                  Store Description
                </label>
                <textarea
                  id="storeDescription"
                  name="storeDescription"
                  rows={3}
                  placeholder="Description"
                  value={formData.storeDescription}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 sm:py-3 text-sm rounded-lg border bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none transition-colors resize-none ${
                    errors.storeDescription
                      ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-border focus:border-[#6558ff] focus:ring-1 focus:ring-[#6558ff]"
                  }`}
                />
                {errors.storeDescription && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.storeDescription}
                  </p>
                )}
              </div>

              {/* What do you plan to sell? Select Dropdown */}
              <div className="w-full">
                <label
                  htmlFor="category"
                  className="block text-xs font-semibold text-gray-800 mb-1.5"
                >
                  What do you plan to sell?
                </label>
                <div className="relative">
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 sm:py-3 text-sm rounded-lg border bg-white appearance-none cursor-pointer focus:outline-none transition-colors ${
                      formData.category ? "text-gray-900" : "text-gray-400"
                    } ${
                      errors.category
                        ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        : "border-border focus:border-[#6558ff] focus:ring-1 focus:ring-[#6558ff]"
                    }`}
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    {categoriesList.map((cat) => (
                      <option key={cat} value={cat} className="text-gray-900">
                        {cat}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.category && (
                  <p className="text-xs text-red-500 mt-1">{errors.category}</p>
                )}
              </div>

              {/* Store Logo Upload Box */}
              <div className="w-full">
                <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                  Store logo
                </label>
                <div className="border border-dashed border-border rounded-lg p-3 sm:p-3.5 flex items-center justify-between bg-white hover:border-[#6558ff]/60 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 text-[#6558ff] flex items-center justify-center shrink-0">
                      <Upload className="w-4.5 h-4.5 stroke-[1.8]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate">
                        {logoFile ? logoFile.name : "Upload your store logo"}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {logoFile
                          ? `${(logoFile.size / 1024).toFixed(1)} KB`
                          : "PNG or JPG, up to 2MB"}
                      </p>
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="border border-border hover:bg-gray-50 active:bg-gray-100 text-gray-700 text-xs font-medium px-3.5 py-1.5 rounded-lg transition-colors shrink-0"
                  >
                    {logoFile ? "Change" : "Upload"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Terms Agreement Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2 cursor-pointer select-none text-xs sm:text-sm text-gray-600">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => {
                  setAgreed(e.target.checked);
                  if (errors.agreed) {
                    setErrors((prev) => ({ ...prev, agreed: "" }));
                  }
                }}
                className="mt-0.5 w-4 h-4 rounded border-border text-[#6558ff] focus:ring-[#6558ff] accent-[#6558ff] cursor-pointer"
              />
              <span>
                I agree to ACCZORA's{" "}
                <Link
                  href="/seller-terms"
                  className="text-[#6558ff] hover:underline font-medium"
                >
                  Seller Terms and Marketplace Policies.
                </Link>
              </span>
            </label>
            {errors.agreed && (
              <p className="text-xs text-red-500 mt-1">{errors.agreed}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <AuthButton type="submit" loading={loading}>
              Submit Application
            </AuthButton>
          </div>
        </form>
      </div>
    </div>
  );
}

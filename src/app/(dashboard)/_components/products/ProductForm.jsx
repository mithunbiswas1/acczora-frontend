// src/app/(dashboard)/_components/products/ProductForm.jsx

"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Upload,
  Plus,
  Trash2,
  X,
  FileSpreadsheet,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  FileText,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import LinkButton from "@/components/ui/LinkButton";
import ImageUpload from "@/components/ui/ImageUpload";
import SearchableSelect from "@/components/ui/SearchableSelect";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "@/redux/api/productApi";
import { useGetCategoriesQuery } from "@/redux/api/categoryApi";
import { useGetSubcategoriesQuery } from "@/redux/api/subcategoryApi";
import { ALL_COUNTRIES } from "@/data/countries";
import { toast } from "sonner";
import { cn } from "@/lib/cn";

const VERIFICATION_OPTIONS = [
  { value: "Email Verified", label: "Email Verified" },
  { value: "Phone Verified", label: "Phone Verified" },
  { value: "Identity / KYC Verified", label: "Identity / KYC Verified" },
  { value: "2FA / Authenticator Enabled", label: "2FA / Authenticator Enabled" },
  { value: "Fully Verified (Email + Phone + ID)", label: "Fully Verified (Email + Phone + ID)" },
  { value: "Unverified / Fresh Account", label: "Unverified / Fresh Account" },
];

export default function ProductForm({
  mode = "add", // "add" or "edit"
  productId,
  initialData = {},
  basePath = "/admin/products", // or "/seller/products"
}) {
  const router = useRouter();
  const csvInputRef = useRef(null);

  // APIs
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useGetCategoriesQuery({ all: "true" });
  const { data: subcategoriesData, isLoading: isSubcategoriesLoading } =
    useGetSubcategoriesQuery({ all: "true" });
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const isSubmitting = isCreating || isUpdating;

  const rawCategories = useMemo(() => {
    const list =
      categoriesData?.data?.categories ||
      categoriesData?.data ||
      categoriesData?.categories ||
      [];
    return Array.isArray(list) ? list : [];
  }, [categoriesData]);

  const rawSubcategories = useMemo(() => {
    const list =
      subcategoriesData?.data?.subcategories ||
      subcategoriesData?.data ||
      subcategoriesData?.subcategories ||
      [];
    return Array.isArray(list) ? list : [];
  }, [subcategoriesData]);

  // Form State - No Auto Fill
  const [title, setTitle] = useState(initialData.title || "");
  const [categoryId, setCategoryId] = useState(
    initialData.category?._id || initialData.category || ""
  );
  const [subcategoryId, setSubcategoryId] = useState(
    initialData.subcategory?._id || initialData.subcategory || ""
  );
  const [country, setCountry] = useState(
    initialData.country || initialData.region || ""
  );
  const [region, setRegion] = useState(
    initialData.region || initialData.country || ""
  );
  const [verification, setVerification] = useState(
    initialData.verification || ""
  );
  const [tags, setTags] = useState(
    Array.isArray(initialData.tags) ? initialData.tags : []
  );
  const [tagInput, setTagInput] = useState("");
  const [description, setDescription] = useState(initialData.description || "");

  // Tag helper handlers
  const handleAddTag = (tagToAdd) => {
    const clean = (tagToAdd || tagInput).trim();
    if (!clean) return;
    if (!tags.includes(clean)) {
      setTags((prev) => [...prev, clean]);
    }
    setTagInput("");
  };

  const handleRemoveTag = (indexToRemove) => {
    setTags((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  // Media images (array of File or URL strings)
  const [mediaImages, setMediaImages] = useState(
    initialData.media && initialData.media.length > 0
      ? initialData.media
      : []
  );

  // Pricing
  const [price, setPrice] = useState(
    initialData.price !== undefined ? String(initialData.price) : ""
  );
  const [discount, setDiscount] = useState(
    initialData.salePrice !== undefined && initialData.salePrice !== 0
      ? String(initialData.salePrice)
      : ""
  );

  // Uploaded Info (Credentials / Accounts array)
  // Format: { email: "", password: "", recoveryEmail: "", twoFactor: "" }
  const [credentials, setCredentials] = useState(
    initialData.uploadedInfo && initialData.uploadedInfo.length > 0
      ? initialData.uploadedInfo.map((row) => ({
        email: row.email || row.account || "",
        password: row.password || row.pass || "",
        recoveryEmail: row.recoveryEmail || row.recoverEmail || row.password2 || "",
        twoFactor: row.twoFactor || row.two_factor || row.pin || "",
      }))
      : [
        { email: "", password: "", recoveryEmail: "", twoFactor: "" },
      ]
  );

  // Sync state if initialData arrives asynchronously in edit mode
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      if (initialData.title) setTitle(initialData.title);
      if (initialData.category) {
        setCategoryId(initialData.category?._id || initialData.category);
      }
      if (initialData.subcategory) {
        setSubcategoryId(initialData.subcategory?._id || initialData.subcategory);
      }
      if (initialData.country) setCountry(initialData.country);
      if (initialData.region) setRegion(initialData.region);
      if (initialData.verification) setVerification(initialData.verification);
      if (Array.isArray(initialData.tags)) setTags(initialData.tags);
      if (initialData.description) setDescription(initialData.description);
      if (initialData.media && initialData.media.length > 0) {
        setMediaImages(initialData.media);
      }
      if (initialData.price !== undefined) setPrice(String(initialData.price));
      if (initialData.salePrice !== undefined) setDiscount(String(initialData.salePrice));
      if (initialData.uploadedInfo && initialData.uploadedInfo.length > 0) {
        setCredentials(
          initialData.uploadedInfo.map((row) => ({
            email: row.email || row.account || "",
            password: row.password || row.pass || "",
            recoveryEmail: row.recoveryEmail || row.recoverEmail || row.password2 || "",
            twoFactor: row.twoFactor || row.two_factor || row.pin || "",
          }))
        );
      }
    }
  }, [initialData]);

  // Subcategories filtered strictly by selected category
  const availableSubcategories = useMemo(() => {
    if (!categoryId) return [];
    return rawSubcategories.filter((sub) => {
      const parentId = sub.category?._id || sub.category;
      return String(parentId) === String(categoryId);
    });
  }, [rawSubcategories, categoryId]);

  // Handle Category Change -> Reset subcategory
  const handleCategoryChange = (e) => {
    const newCatId = e.target.value;
    setCategoryId(newCatId);
    setSubcategoryId("");
  };

  // Add blank Credential Row
  const handleAddCredentialRow = () => {
    setCredentials((prev) => [
      ...prev,
      { email: "", password: "", recoveryEmail: "", twoFactor: "" },
    ]);
  };

  // Update Credential field
  const handleCredentialChange = (index, field, value) => {
    setCredentials((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  // Remove Credential Row
  const handleRemoveCredentialRow = (index) => {
    if (credentials.length <= 1) {
      setCredentials([{ email: "", password: "", recoveryEmail: "", twoFactor: "" }]);
      return;
    }
    setCredentials((prev) => prev.filter((_, i) => i !== index));
  };

  // CSV / TXT File Upload & Parser
  const handleCsvFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const lines = text
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      if (lines.length === 0) {
        toast.error("The uploaded file is empty.");
        return;
      }

      const parsedRows = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Determine separator: comma, colon, pipe, or tab
        let parts = [];
        if (line.includes(",")) {
          parts = line.split(",").map((p) => p.trim());
        } else if (line.includes(":")) {
          parts = line.split(":").map((p) => p.trim());
        } else if (line.includes("|")) {
          parts = line.split("|").map((p) => p.trim());
        } else if (line.includes("\t")) {
          parts = line.split("\t").map((p) => p.trim());
        } else {
          parts = [line];
        }

        // If line 1 is header (e.g. email, password), skip it
        if (
          i === 0 &&
          (parts[0].toLowerCase().includes("email") ||
            parts[0].toLowerCase().includes("username"))
        ) {
          continue;
        }

        parsedRows.push({
          email: parts[0] || "",
          password: parts[1] || "",
          recoveryEmail: parts[2] || "",
          twoFactor: parts[3] || "",
        });
      }

      if (parsedRows.length > 0) {
        // Filter out empty rows from current list before appending
        const existingNonEmpty = credentials.filter(
          (c) => c.email || c.password || c.recoveryEmail || c.twoFactor
        );
        setCredentials([...existingNonEmpty, ...parsedRows]);
        toast.success(`Successfully parsed ${parsedRows.length} account credentials!`);
      } else {
        toast.warning("No valid credential rows found in file.");
      }
    } catch (err) {
      toast.error("Failed to read file. Please ensure it is a valid CSV or TXT file.");
    }

    if (csvInputRef.current) {
      csvInputRef.current.value = "";
    }
  };

  // Form submission
  const handleSubmit = async (submitStatus = "active") => {
    if (!title.trim()) {
      toast.error("Product Title is required");
      return;
    }

    if (!price || isNaN(Number(price))) {
      toast.error("A valid Product Price is required");
      return;
    }

    // Filter valid non-empty credentials
    const validCredentials = credentials.filter(
      (c) => c.email?.trim() || c.password?.trim()
    );

    const payload = {
      title: title.trim(),
      category: categoryId || undefined,
      subcategory: subcategoryId || undefined,
      description: description.trim(),
      country: region || country || "Global / Worldwide",
      region: region || "Global / Worldwide",
      verification: verification || "Email Verified",
      tags: tags,
      price: Number(price),
      salePrice: discount ? Number(discount) : 0,
      stock: validCredentials.length > 0 ? validCredentials.length : 1,
      media: mediaImages.map((m) => (typeof m === "string" ? m : m.name)),
      thumbnail:
        typeof mediaImages[0] === "string"
          ? mediaImages[0]
          : "/product_demo_image.jpg",
      uploadedInfo: validCredentials,
      status: submitStatus,
      is_active: submitStatus === "active",
    };

    try {
      if (mode === "edit") {
        await updateProduct({ id: productId, ...payload }).unwrap();
        toast.success("Product updated successfully!");
      } else {
        await createProduct(payload).unwrap();
        toast.success(
          submitStatus === "draft"
            ? "Product saved as Draft!"
            : "Product published successfully!"
        );
      }
      router.push(basePath);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save product");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-8 space-y-7 pb-20">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link
          href={basePath}
          className="hover:text-gray-900 transition-colors flex items-center gap-1"
        >
          <ArrowLeft size={13} />
          <span>Products</span>
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">
          {mode === "edit" ? "Edit Product" : "Add Products"}
        </span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          {mode === "edit" ? "Edit Product" : "Add Product"}
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          {mode === "edit"
            ? "Update your product details and credentials."
            : "Create a new product for your store."}
        </p>
      </div>

      {/* =========================================================================
          SECTION 1: BASIC INFORMATION
         ========================================================================= */}
      <Card className="p-6 sm:p-7 space-y-5">
        <CardHeader className="p-0 pb-1 space-y-0.5">
          <CardTitle className="text-sm font-bold text-gray-900 tracking-tight">
            Basic Information
          </CardTitle>
          <CardDescription className="text-xs text-gray-400">
            Enter the basic details shown to buyers.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 space-y-5">
          {/* Product Title */}
          <Input
            label="Product Title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a clear product title"
          />

          {/* Category & Subcategory Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category Searchable Select */}
            <div>
              <SearchableSelect
                label="Category"
                value={categoryId}
                onChange={handleCategoryChange}
                options={rawCategories}
                placeholder="Select category..."
                required
              />
            </div>

            {/* Subcategory Searchable Select */}
            <div>
              <SearchableSelect
                label="Subcategory"
                value={subcategoryId}
                onChange={(e) => setSubcategoryId(e.target.value)}
                options={availableSubcategories}
                placeholder={
                  categoryId
                    ? "Select subcategory..."
                    : "First select a category"
                }
                disabled={!categoryId}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <Textarea
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the product, and what is included..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* =========================================================================
          SECTION 2: PRODUCT MEDIA
         ========================================================================= */}
      <Card className="p-6 sm:p-7 space-y-4">
        <CardHeader className="p-0 pb-1 space-y-0.5">
          <CardTitle className="text-sm font-bold text-gray-900 tracking-tight">
            Product Media
          </CardTitle>
          <CardDescription className="text-xs text-gray-400">
            Upload showcase images for buyers to see.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 space-y-4">
          {/* Reusable ImageUpload with Multiple support */}
          <ImageUpload
            label="Product Images"
            value={mediaImages}
            onChange={(files) => setMediaImages(files)}
            multiple={true}
            maxFiles={8}
            helperText="PNG, JPG or WEBP - Max 5MB - Up to 8 images"
          />
        </CardContent>
      </Card>

      {/* =========================================================================
          SECTION 3: ACCOUNT SPECIFICATIONS
         ========================================================================= */}
      <Card className="p-6 sm:p-7 space-y-5">
        <CardHeader className="p-0 pb-1 space-y-0.5">
          <CardTitle className="text-sm font-bold text-gray-900 tracking-tight">
            Account Specifications
          </CardTitle>
          <CardDescription className="text-xs text-gray-400">
            Provide details according to the selected category and platform.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 space-y-5">
          {/* Region & Verification Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Region / Country */}
            <div>
              <SearchableSelect
                label="Region"
                value={region}
                onChange={(e) => {
                  setRegion(e.target.value);
                  setCountry(e.target.value);
                }}
                options={ALL_COUNTRIES}
                placeholder="Select region..."
              />
            </div>

            {/* Verification Status */}
            <div>
              <SearchableSelect
                label="Verification"
                value={verification}
                onChange={(e) => setVerification(e.target.value)}
                options={VERIFICATION_OPTIONS}
                placeholder="Select verification..."
              />
            </div>
          </div>

          {/* Clean Minimalist Features Input */}
          <div>
            <Input
              label="Feature"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  handleAddTag();
                } else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
                  handleRemoveTag(tags.length - 1);
                }
              }}
              placeholder={
                tags.length === 0
                  ? "Add Features (e.g. level 80, private profile) and press Enter"
                  : "Add Features..."
              }
            />
            {tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                {tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-800 text-xs font-medium border border-gray-200 animate-in fade-in zoom-in-95"
                  >
                    <span>{t}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon_xs"
                      onClick={() => handleRemoveTag(idx)}
                      className="h-4 w-4 p-0 text-gray-400 hover:text-gray-700"
                      title="Remove"
                    >
                      <X size={12} />
                    </Button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* =========================================================================
          SECTION 4: PRICING
         ========================================================================= */}
      <Card className="p-6 sm:p-7 space-y-4">
        <CardHeader className="p-0 pb-1 space-y-0.5">
          <CardTitle className="text-sm font-bold text-gray-900 tracking-tight">
            Pricing
          </CardTitle>
          <CardDescription className="text-xs text-gray-400">
            Set your product regular price and optional discounted price.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Price ($)"
              required
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="24.00"
              prefix="$"
            />

            <Input
              label="Discount Price ($)"
              type="number"
              step="0.01"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="18.00"
              prefix="$"
            />
          </div>
        </CardContent>
      </Card>

      {/* =========================================================================
          SECTION 5: PRODUCTS / CREDENTIALS (UPLOADED INFO)
         ========================================================================= */}
      <Card className="p-6 sm:p-7 space-y-5">
        <CardHeader className="p-0 pb-1 space-y-0.5">
          <CardTitle className="text-sm font-bold text-gray-900 tracking-tight">
            Products
          </CardTitle>
          <CardDescription className="text-xs text-gray-400">
            Upload Products Info
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 space-y-5">

        {/* Hidden CSV File Input */}
        <input
          ref={csvInputRef}
          type="file"
          accept=".csv,.txt,.xlsx,.xls"
          onChange={handleCsvFileUpload}
          className="hidden"
        />

        {/* CSV Dropzone */}
        <div
          onClick={() => csvInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files) {
              handleCsvFileUpload({ target: { files: e.dataTransfer.files } });
            }
          }}
          className="border-2 border-dashed border-gray-200 hover:border-[#5b52f9]/70 rounded-2xl p-7 text-center cursor-pointer transition-all bg-gray-50/40 hover:bg-gray-50/80 group"
        >
          <div className="w-11 h-11 rounded-2xl bg-purple-50 text-[#5b52f9] flex items-center justify-center mx-auto mb-2.5 group-hover:scale-105 transition-transform">
            <Upload size={20} />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-gray-800">
            Choose a file or drag and drop it here
          </p>
          <p className="text-[11px] text-gray-400 mt-1">
            txt, csv, xlsx - Up to 10MB
          </p>
        </div>

        {/* Uploaded Info Credentials Section */}
        <div className="pt-2 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-900 tracking-tight">
              Uploaded Info ({credentials.length} items)
            </span>
            <span className="text-[11px] text-gray-400">
              Auto-delivered to buyer upon purchase
            </span>
          </div>

          {/* Credentials Table / Rows */}
          <div className="space-y-2.5">
            {/* Column Labels */}
            <div className="hidden sm:grid grid-cols-12 gap-3 px-1 text-[11px] font-semibold text-gray-500">
              <span className="col-span-4">Email / Username</span>
              <span className="col-span-3">Password</span>
              <span className="col-span-3">Recovery Email</span>
              <span className="col-span-2">2FA / Key</span>
            </div>

            {/* Rows */}
            {credentials.map((cred, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 items-center bg-gray-50/60 p-2 sm:p-2.5 rounded-xl border border-gray-100 transition-colors"
              >
                {/* Email */}
                <div className="sm:col-span-4">
                  <Input
                    value={cred.email}
                    onChange={(e) =>
                      handleCredentialChange(idx, "email", e.target.value)
                    }
                    placeholder="e.g. user01df@gmail.com"
                    inputSize="sm"
                  />
                </div>

                {/* Password */}
                <div className="sm:col-span-3">
                  <Input
                    value={cred.password}
                    onChange={(e) =>
                      handleCredentialChange(idx, "password", e.target.value)
                    }
                    placeholder="Password"
                    inputSize="sm"
                  />
                </div>

                {/* Recovery Email */}
                <div className="sm:col-span-3">
                  <Input
                    value={cred.recoveryEmail}
                    onChange={(e) =>
                      handleCredentialChange(idx, "recoveryEmail", e.target.value)
                    }
                    placeholder="Recovery email"
                    inputSize="sm"
                  />
                </div>

                {/* 2FA & Delete button */}
                <div className="sm:col-span-2 flex items-center gap-2">
                  <Input
                    value={cred.twoFactor}
                    onChange={(e) =>
                      handleCredentialChange(idx, "twoFactor", e.target.value)
                    }
                    placeholder="2FA / Pin"
                    inputSize="sm"
                  />

                  {/* Delete Row Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon_xs"
                    rounded="lg"
                    onClick={() => handleRemoveCredentialRow(idx)}
                    className="text-gray-400 hover:text-rose-500 hover:bg-rose-50 flex-shrink-0"
                    title="Remove row"
                  >
                    <Trash2 size={15} />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Add More Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            rounded="xl"
            onClick={handleAddCredentialRow}
            className="mt-2 text-xs font-semibold text-gray-700 shadow-xs"
          >
            <Plus size={14} className="text-[#5b52f9]" />
            <span>Add More</span>
          </Button>
        </div>
        </CardContent>
      </Card>

      {/* =========================================================================
          FOOTER ACTION BUTTONS
         ========================================================================= */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <LinkButton
          href={basePath}
          variant="outline-border"
          size="default"
          rounded="xl"
          className="text-xs sm:text-sm font-semibold text-gray-700"
        >
          Cancel
        </LinkButton>

        <Button
          type="button"
          variant="outline"
          size="default"
          rounded="xl"
          disabled={isSubmitting}
          onClick={() => handleSubmit("draft")}
          className="text-xs sm:text-sm font-semibold text-gray-800"
        >
          Save to Draft
        </Button>

        <Button
          type="button"
          variant="brand"
          size="default"
          rounded="xl"
          disabled={isSubmitting}
          onClick={() => handleSubmit("active")}
          className="text-xs sm:text-sm font-semibold"
        >
          {isSubmitting && <Loader2 size={15} className="animate-spin" />}
          <span>{mode === "edit" ? "Update Product" : "Publish Product"}</span>
        </Button>
      </div>
    </div>
  );
}

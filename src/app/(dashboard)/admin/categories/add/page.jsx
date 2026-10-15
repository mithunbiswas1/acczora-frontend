// src/app/(dashboard)/admin/categories/add/page.jsx

"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Upload, Loader2, ArrowLeft } from "lucide-react";
import { useCreateCategoryMutation } from "@/redux/api/categoryApi";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Card from "@/components/ui/Card";
import ImageUpload from "@/components/ui/ImageUpload";
import SlugInput from "@/components/ui/SlugInput";
import { toast } from "sonner";

export default function AddCategoryPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  // APIs
  const [createCategory, { isLoading: isCreatingCat }] = useCreateCategoryMutation();

  // Form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [iconPreview, setIconPreview] = useState(null);
  const [iconFile, setIconFile] = useState(null);

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(autoSlug);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      await createCategory({
        name: name.trim(),
        slug: slug.trim() || undefined,
        description: description.trim(),
        icon: iconPreview || "",
        image: iconPreview || "",
      }).unwrap();

      toast.success(`Category "${name}" created successfully!`);
      router.push("/admin/categories");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create category");
    }
  };

  return (
    <div className="max-w-xl mx-auto py-4 sm:py-8 space-y-6">
      {/* Back navigation */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link
          href="/admin/categories"
          className="hover:text-gray-900 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Categories</span>
        </Link>
      </div>

      {/* Main Card */}
      <Card className="p-0 overflow-hidden shadow-xl border border-border">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-5 border-b border-gray-100">
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Add Category
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Create a root category to organize your products.
            </p>
          </div>

          <Link
            href="/admin/categories"
            className="w-8 h-8 rounded-xl bg-[#fef2f2] text-[#ef4444] hover:bg-[#fee2e2] flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer"
            aria-label="Close"
          >
            <X size={16} />
          </Link>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Category Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-800 mb-1.5">
              Category Name <span className="text-rose-500">*</span>
            </label>
            <Input
              value={name}
              onChange={handleNameChange}
              placeholder="e.g. Streaming, Software, Gaming"
              required
              className="text-xs sm:text-sm"
            />
          </div>

          {/* Category Slug */}
          <SlugInput
            label="Category Slug"
            value={slug}
            onChange={(val) => setSlug(val)}
            sourceValue={name}
            prefix="acczora.com/category/"
            placeholder="e.g. streaming"
            required
          />

          {/* Category Icon Upload */}
          <ImageUpload
            label="Category Icon"
            value={iconFile || iconPreview}
            onChange={(file) => {
              setIconFile(file);
              if (file instanceof File) {
                setIconPreview(URL.createObjectURL(file));
              } else {
                setIconPreview(null);
              }
            }}
            multiple={false}
            helperText="SVG, PNG, JPG, or WEBP (max. 5MB)"
          />

          {/* Description */}
          <div>
            <Textarea
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the category..."
              rows={3}
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <Link
              href="/admin/categories"
              className="px-6 py-2.5 rounded-xl border border-gray-200 bg-white text-xs sm:text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors inline-block"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isCreatingCat}
              className="px-6 py-2.5 rounded-xl bg-[#6366f1] hover:bg-[#5558e6] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isCreatingCat && <Loader2 size={14} className="animate-spin" />}
              <span>Save Category</span>
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}

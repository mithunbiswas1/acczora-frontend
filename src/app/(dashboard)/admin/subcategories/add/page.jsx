// src/app/(dashboard)/admin/subcategories/add/page.jsx

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useCreateSubcategoryMutation } from "@/redux/api/subcategoryApi";
import { useGetAllCategoriesActiveQuery } from "@/redux/api/categoryApi";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Card from "@/components/ui/Card";
import ImageUpload from "@/components/ui/ImageUpload";
import SearchableSelect from "@/components/ui/SearchableSelect";
import SlugInput from "@/components/ui/SlugInput";
import LinkButton from "@/components/ui/LinkButton";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

export default function AddSubcategoryPage() {
  const router = useRouter();

  // APIs
  const { data: categoriesData, isLoading: isLoadingCats } =
    useGetAllCategoriesActiveQuery();
  const [createSubcategory, { isLoading: isCreatingSub }] =
    useCreateSubcategoryMutation();

  const parentCategories = useMemo(() => {
    const list =
      categoriesData?.data?.categories ||
      categoriesData?.data ||
      categoriesData?.categories ||
      [];
    if (!Array.isArray(list)) return [];
    return list
      .filter((cat) => cat.is_active !== false)
      .map((cat) => ({
        value: cat._id || cat.id,
        label: cat.name,
        name: cat.name,
        image: cat.image || "/review_avater.jpg",
      }));
  }, [categoriesData]);

  // Form states
  const [parentCategoryId, setParentCategoryId] = useState("");
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

    if (!parentCategoryId) {
      toast.error("Please select a parent category");
      return;
    }

    if (!name.trim()) {
      toast.error("Sub-category name is required");
      return;
    }

    try {
      await createSubcategory({
        name: name.trim(),
        slug: slug.trim() || undefined,
        category: parentCategoryId,
        description: description.trim(),
        icon: iconPreview || "/review_avater.jpg",
        image: iconPreview || "/review_avater.jpg",
      }).unwrap();

      toast.success(`Sub-category "${name}" created successfully!`);
      router.push("/admin/subcategories");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create sub-category");
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* 1. Parent Category Searchable Dropdown */}
        <SearchableSelect
          label="Select Parent Category"
          value={parentCategoryId}
          onChange={(e) => setParentCategoryId(e.target.value)}
          options={parentCategories}
          placeholder={
            isLoadingCats
              ? "Loading categories..."
              : "Search and choose a parent category..."
          }
          disabled={isLoadingCats}
          required
        />

        {/* 2. Sub-Category Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-800 mb-1.5">
            Sub-Category Name <span className="text-rose-500">*</span>
          </label>
          <Input
            value={name}
            onChange={handleNameChange}
            placeholder="e.g. Netflix Premium, ChatGPT Plus, Canva Pro"
            required
            className="text-xs sm:text-sm"
          />
        </div>

        {/* 3. Sub-Category Slug */}
        <SlugInput
          label="Sub-Category Slug"
          value={slug}
          onChange={(val) => setSlug(val)}
          sourceValue={name}
          prefix="acczora.com/sub/"
          placeholder="e.g. netflix-premium"
          required
        />

        {/* 4. Sub-Category Icon Upload */}
        <ImageUpload
          label="Sub-Category Icon"
          value={iconFile || iconPreview}
          onChange={(file) => {
            setIconFile(file);
            if (file instanceof File) {
              setIconPreview(URL.createObjectURL(file));
            } else if (!file) {
              setIconPreview(null);
            }
          }}
          multiple={false}
          helperText="Upload brand icon or logo (SVG, PNG, JPG, or WEBP)"
        />

        {/* 5. Description */}
        <div>
          <Textarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the sub-category..."
            rows={3}
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3">
          <LinkButton
            href="/admin/subcategories"
            variant="outline-border"
            size="default"
            rounded="xl"
            className="px-6"
          >
            Cancel
          </LinkButton>
          <Button
            type="submit"
            variant="brand"
            size="default"
            rounded="xl"
            disabled={isCreatingSub || isLoadingCats}
            className="px-6"
          >
            {isCreatingSub && <Loader2 size={14} className="animate-spin" />}
            <span>Save Sub-Category</span>
          </Button>
        </div>
      </form>
    </Card>
  );
}

// src/app/(dashboard)/admin/categories/add/page.jsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useCreateCategoryMutation } from "@/redux/api/categoryApi";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Card from "@/components/ui/Card";
import ImageUpload from "@/components/ui/ImageUpload";
import SlugInput from "@/components/ui/SlugInput";
import LinkButton from "@/components/ui/LinkButton";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

export default function AddCategoryPage() {
  const router = useRouter();

  // APIs
  const [createCategory, { isLoading: isCreatingCat }] =
    useCreateCategoryMutation();

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
        image: iconPreview || "/review_avater.jpg",
      }).unwrap();

      toast.success(`Category "${name}" created successfully!`);
      router.push("/admin/categories");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create category");
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* 1. Category Name */}
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

        {/* 2. Category Slug */}
        <SlugInput
          label="Category Slug"
          value={slug}
          onChange={(val) => setSlug(val)}
          sourceValue={name}
          prefix="acczora.com/category/"
          placeholder="e.g. streaming"
          required
        />

        {/* 3. Category Image Upload */}
        <ImageUpload
          label="Category Image"
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
          helperText="Upload category image or icon (SVG, PNG, JPG, or WEBP)"
        />

        {/* 4. Description */}
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
          <LinkButton
            href="/admin/categories"
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
            disabled={isCreatingCat}
            className="px-6"
          >
            {isCreatingCat && <Loader2 size={14} className="animate-spin" />}
            <span>Save Category</span>
          </Button>
        </div>
      </form>
    </Card>
  );
}

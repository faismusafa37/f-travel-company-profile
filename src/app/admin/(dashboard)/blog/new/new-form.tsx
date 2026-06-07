"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import { createBlogPostAction } from "@/app/actions/blog";
import { uploadImageAction } from "@/app/actions/upload";

const blogPostSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  featuredImage: z.string().optional().nullable(),
  categoryId: z.string().min(1, "Category is required"),
  tags: z.string().optional().nullable(),
  status: z.enum(["PUBLISHED", "DRAFT"]),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof blogPostSchema>;

interface NewBlogFormProps {
  categories: {
    id: string;
    name: string;
  }[];
}

export function NewBlogForm({ categories }: NewBlogFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featuredImage: "",
      categoryId: "",
      tags: "",
      status: "DRAFT",
      seoTitle: "",
      seoDescription: "",
    },
  });

  const selectedStatus = watch("status");
  const selectedCategoryId = watch("categoryId");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue("title", val);
    const slug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setValue("slug", slug);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      let imageUrl = data.featuredImage || "";

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadRes = await uploadImageAction(formData);
        if (uploadRes.success && uploadRes.url) {
          imageUrl = uploadRes.url;
        } else {
          toast.error("Failed to upload image, saving without new media.");
        }
      }

      const res = await createBlogPostAction({
        ...data,
        featuredImage: imageUrl || null,
        tags: data.tags || null,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
      });

      if (res.success) {
        toast.success("Blog post created successfully");
        router.push("/admin/blog");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to create blog post");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin/blog">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h2 className="text-2xl font-bold text-slate-900">Write New Blog Post</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="border-0 shadow-sm mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Content Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Post Title</Label>
                <Input 
                  id="title" 
                  placeholder="e.g. 10 Reasons to Visit Bali" 
                  {...register("title", { onChange: handleTitleChange })}
                />
                {errors.title && (
                  <p className="text-xs text-red-500 font-semibold">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input 
                  id="slug" 
                  placeholder="e.g. 10-reasons-to-visit-bali" 
                  {...register("slug")}
                />
                {errors.slug && (
                  <p className="text-xs text-red-500 font-semibold">{errors.slug.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="categoryId">Category</Label>
                <Select 
                  value={selectedCategoryId} 
                  onValueChange={(val) => setValue('categoryId', val || "")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoryId && (
                  <p className="text-xs text-red-500 font-semibold">{errors.categoryId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input id="tags" placeholder="e.g. Bali, Travel, Tips" {...register("tags")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={selectedStatus} 
                  onValueChange={(val) => setValue('status', val as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea 
                id="excerpt" 
                placeholder="Brief summary of the post..."
                {...register("excerpt")}
              />
              {errors.excerpt && (
                <p className="text-xs text-red-500 font-semibold">{errors.excerpt.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Full Content</Label>
              <Textarea 
                id="content" 
                placeholder="Write the full post here..."
                className="min-h-[250px]"
                {...register("content")}
              />
              {errors.content && (
                <p className="text-xs text-red-500 font-semibold">{errors.content.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Media */}
        <Card className="border-0 shadow-sm mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Featured Image</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {imagePreview ? (
              <div className="relative rounded-lg overflow-hidden h-64 border border-slate-200 bg-slate-50">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-full object-cover" 
                />
                <button 
                  type="button" 
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                    setValue("featuredImage", "");
                  }}
                  className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-md cursor-pointer"
                >
                  Remove Image
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center flex flex-col items-center justify-center">
                <Upload className="w-10 h-10 text-slate-400 mb-3" />
                <p className="text-sm text-slate-500 mb-4">Select a photo for the blog post header</p>
                <div className="relative">
                  <input 
                    type="file" 
                    id="file-input" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button type="button" variant="outline" size="sm">Choose Image</Button>
                </div>
              </div>
            )}
            <div className="space-y-2 pt-2">
              <Label htmlFor="featuredImage">Or Image URL</Label>
              <Input 
                id="featuredImage" 
                placeholder="https://images.unsplash.com/photo-..." 
                {...register("featuredImage")}
                onChange={(e) => {
                  setValue("featuredImage", e.target.value);
                  setImagePreview(e.target.value || null);
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* SEO Settings */}
        <Card className="border-0 shadow-sm mb-6">
          <CardHeader>
            <CardTitle className="text-lg">SEO Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="seoTitle">SEO Title</Label>
              <Input 
                id="seoTitle" 
                placeholder="Custom page title for search engines" 
                {...register("seoTitle")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seoDescription">SEO Description</Label>
              <Textarea 
                id="seoDescription" 
                placeholder="Meta description for search engines..." 
                {...register("seoDescription")}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Link href="/admin/blog">
            <Button variant="outline" type="button" disabled={isLoading}>Cancel</Button>
          </Link>
          <Button type="submit" className="bg-orange-500 hover:bg-orange-600 font-bold" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : "Publish Post"}
          </Button>
        </div>
      </form>
    </div>
  );
}

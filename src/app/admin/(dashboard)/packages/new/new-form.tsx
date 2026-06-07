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
import { createPackageAction } from "@/app/actions/packages";
import { uploadImageAction } from "@/app/actions/upload";

const travelPackageSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  destinationId: z.string().min(1, "Destination is required"),
  price: z.number().min(0, "Price must be a positive number"),
  duration: z.number().int().min(1, "Duration must be at least 1 day"),
  shortDescription: z.string().min(10, "Short description must be at least 10 characters"),
  fullDescription: z.string().min(10, "Full description must be at least 10 characters"),
  featuredImage: z.string().optional().nullable(),
  status: z.enum(["PUBLISHED", "DRAFT"]),
});

type FormValues = z.infer<typeof travelPackageSchema>;

interface NewPackageFormProps {
  destinations: {
    id: string;
    title: string;
  }[];
}

export function NewPackageForm({ destinations }: NewPackageFormProps) {
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
    resolver: zodResolver(travelPackageSchema),
    defaultValues: {
      title: "",
      slug: "",
      destinationId: "",
      price: 0,
      duration: 1,
      shortDescription: "",
      fullDescription: "",
      featuredImage: "",
      status: "DRAFT",
    },
  });

  const selectedStatus = watch("status");
  const selectedDestinationId = watch("destinationId");

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

      const res = await createPackageAction({
        ...data,
        featuredImage: imageUrl || null,
      });

      if (res.success) {
        toast.success("Travel package created successfully");
        router.push("/admin/packages");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to create package");
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
        <Link href="/admin/packages">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h2 className="text-2xl font-bold text-slate-900">Add New Travel Package</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="border-0 shadow-sm mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Package Title</Label>
                <Input 
                  id="title" 
                  placeholder="e.g. 7-Day Bali Escape" 
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
                  placeholder="e.g. 7-day-bali-escape" 
                  {...register("slug")}
                />
                {errors.slug && (
                  <p className="text-xs text-red-500 font-semibold">{errors.slug.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price">Price (Rp)</Label>
                <Input id="price" type="number" {...register("price", { valueAsNumber: true })} />
                {errors.price && (
                  <p className="text-xs text-red-500 font-semibold">{errors.price.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (Days)</Label>
                <Input id="duration" type="number" {...register("duration", { valueAsNumber: true })} />
                {errors.duration && (
                  <p className="text-xs text-red-500 font-semibold">{errors.duration.message}</p>
                )}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="destinationId">Destination</Label>
                <Select 
                  value={selectedDestinationId} 
                  onValueChange={(val) => setValue('destinationId', val || "")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {destinations.map((d) => (
                      <SelectItem key={d.id} value={d.id}>{d.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.destinationId && (
                  <p className="text-xs text-red-500 font-semibold">{errors.destinationId.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDescription">Short Description</Label>
              <Textarea 
                id="shortDescription" 
                placeholder="Brief summary of the package..."
                {...register("shortDescription")}
              />
              {errors.shortDescription && (
                <p className="text-xs text-red-500 font-semibold">{errors.shortDescription.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullDescription">Full Description</Label>
              <Textarea 
                id="fullDescription" 
                placeholder="Detailed description of the journey..."
                className="min-h-[150px]"
                {...register("fullDescription")}
              />
              {errors.fullDescription && (
                <p className="text-xs text-red-500 font-semibold">{errors.fullDescription.message}</p>
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
                <p className="text-sm text-slate-500 mb-4">Select a photo for the package card header</p>
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

        <div className="flex justify-end space-x-4">
          <Link href="/admin/packages">
            <Button variant="outline" type="button" disabled={isLoading}>Cancel</Button>
          </Link>
          <Button type="submit" className="bg-orange-500 hover:bg-orange-600 font-bold" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : "Save Package"}
          </Button>
        </div>
      </form>
    </div>
  );
}

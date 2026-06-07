"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, Trash2, Loader2 } from "lucide-react";
import { addGalleryImageAction, deleteGalleryImageAction } from "@/app/actions/gallery";
import { uploadImageAction } from "@/app/actions/upload";

const galleryImageSchema = z.object({
  url: z.string().optional().nullable(),
  alt: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  destinationId: z.string().optional().nullable(),
  travelPackageId: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof galleryImageSchema>;

interface GalleryImageItem {
  id: string;
  url: string;
  alt: string | null;
  category: string | null;
  destinationId: string | null;
  travelPackageId: string | null;
}

interface GalleryDashboardProps {
  initialImages: GalleryImageItem[];
  destinations: { id: string; title: string }[];
  packages: { id: string; title: string }[];
}

export function GalleryDashboard({ initialImages, destinations, packages }: GalleryDashboardProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(galleryImageSchema),
    defaultValues: {
      url: "",
      alt: "",
      category: "Nature",
      destinationId: "",
      travelPackageId: "",
    },
  });

  const selectedCategory = watch("category");
  const selectedDest = watch("destinationId");
  const selectedPkg = watch("travelPackageId");

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
    setIsSaving(true);
    try {
      let finalUrl = data.url || "";

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadRes = await uploadImageAction(formData);
        if (uploadRes.success && uploadRes.url) {
          finalUrl = uploadRes.url;
        } else {
          toast.error("Failed to upload image.");
          setIsSaving(false);
          return;
        }
      }

      if (!finalUrl) {
        toast.error("Please select an image file or provide a URL.");
        setIsSaving(false);
        return;
      }

      const res = await addGalleryImageAction({
        ...data,
        url: finalUrl,
        destinationId: data.destinationId || null,
        travelPackageId: data.travelPackageId || null,
      });

      if (res.success) {
        toast.success("Image added to gallery successfully");
        reset({
          url: "",
          alt: "",
          category: "Nature",
          destinationId: "",
          travelPackageId: "",
        });
        setImagePreview(null);
        setImageFile(null);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to add image");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    setIsDeleting(id);
    try {
      const res = await deleteGalleryImageAction(id);
      if (res.success) {
        toast.success("Image deleted successfully");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to delete image");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Manage Gallery</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form */}
        <Card className="border-0 shadow-sm h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Add Image to Gallery</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label>Image Source</Label>
                {imagePreview ? (
                  <div className="relative rounded-lg overflow-hidden h-48 border border-slate-200 bg-slate-50">
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
                        setValue("url", "");
                      }}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded-full font-bold shadow-md cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center flex flex-col items-center justify-center">
                    <Upload className="w-8 h-8 text-slate-400 mb-2" />
                    <p className="text-xs text-slate-500 mb-2">Upload a photo from your computer</p>
                    <div className="relative">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Button type="button" variant="outline" size="sm">Choose File</Button>
                    </div>
                  </div>
                )}
                <div className="pt-2">
                  <Input 
                    placeholder="Or enter Image URL..." 
                    {...register("url")} 
                    onChange={(e) => {
                      setValue("url", e.target.value);
                      setImagePreview(e.target.value || null);
                    }}
                  />
                  {errors.url && (
                    <p className="text-xs text-red-500 font-semibold mt-1">{errors.url.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alt">Description (Alt Text)</Label>
                <Input id="alt" placeholder="e.g. Sunset in Bali beach" {...register("alt")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={selectedCategory || ""} onValueChange={(val) => setValue('category', val || "")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nature">Nature</SelectItem>
                    <SelectItem value="City">City</SelectItem>
                    <SelectItem value="Culture">Culture</SelectItem>
                    <SelectItem value="Beach">Beach</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="destinationId">Associate Destination (Optional)</Label>
                <Select value={selectedDest || ""} onValueChange={(val) => setValue('destinationId', val === "none" ? null : val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Destination" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {destinations.map((d) => (
                      <SelectItem key={d.id} value={d.id}>{d.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="travelPackageId">Associate Travel Package (Optional)</Label>
                <Select value={selectedPkg || ""} onValueChange={(val) => setValue('travelPackageId', val === "none" ? null : val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Travel Package" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {packages.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 font-bold" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : "Add to Gallery"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Gallery Grid List */}
        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Gallery Images ({initialImages.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {initialImages.length === 0 ? (
              <div className="text-center py-20 text-slate-500">
                No images in the gallery yet. Upload one to get started.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {initialImages.map((img) => (
                  <div 
                    key={img.id} 
                    className={`relative aspect-square group rounded-xl overflow-hidden border border-slate-100 bg-slate-50 ${
                      isDeleting === img.id ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    <img 
                      src={img.url} 
                      alt={img.alt || "Gallery image"} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-white bg-orange-500 px-2 py-0.5 rounded-full">
                          {img.category || "General"}
                        </span>
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="h-7 w-7 bg-red-600 hover:bg-red-700"
                          onClick={() => handleDelete(img.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                      {img.alt && (
                        <p className="text-xs text-white line-clamp-2 leading-tight font-medium bg-slate-950/40 p-1.5 rounded">
                          {img.alt}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

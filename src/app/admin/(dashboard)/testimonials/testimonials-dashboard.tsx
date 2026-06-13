"use client";

import { useState, useMemo } from "react";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Upload, Trash2, Edit, Loader2, Star, ArrowLeft, ArrowRight } from "lucide-react";
import { createTestimonialAction, updateTestimonialAction, deleteTestimonialAction, toggleTestimonialStatusAction } from "@/app/actions/testimonials";
import { uploadImageAction } from "@/app/actions/upload";

const testimonialSchema = z.object({
  clientName: z.string().min(2, "Name must be at least 2 characters"),
  clientRole: z.string().min(2, "Role is required"),
  clientImage: z.string().optional().nullable(),
  company: z.string().min(2, "Company is required"),
  trip: z.string().min(2, "Trip details are required"),
  content: z.string().min(5, "Content is required"),
  rating: z.number().int().min(1).max(5),
  status: z.enum(["PUBLISHED", "DRAFT"]),
});

type FormValues = z.infer<typeof testimonialSchema>;

interface TestimonialItem {
  id: string;
  clientName: string;
  clientRole: string | null;
  clientImage: string | null;
  company: string | null;
  trip: string | null;
  content: string;
  rating: number;
  status: string;
}

export function TestimonialsDashboard({ initialTestimonials }: { initialTestimonials: TestimonialItem[] }) {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const router = useRouter();
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.ceil(testimonials.length / itemsPerPage);
  
  const paginatedTestimonials = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return testimonials.slice(startIndex, startIndex + itemsPerPage);
  }, [testimonials, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      clientName: "",
      clientRole: "",
      clientImage: "",
      company: "",
      trip: "",
      content: "",
      rating: 5,
      status: "PUBLISHED",
    },
  });

  const selectedStatus = watch("status");
  const selectedRating = watch("rating");

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

  const handleEdit = (t: TestimonialItem) => {
    setEditingTestimonial(t);
    reset({
      clientName: t.clientName,
      clientRole: t.clientRole || "",
      clientImage: t.clientImage || "",
      company: t.company || "",
      trip: t.trip || "",
      content: t.content,
      rating: t.rating,
      status: t.status as any,
    });
    setImagePreview(t.clientImage);
    setImageFile(null);
  };

  const handleCancelEdit = () => {
    setEditingTestimonial(null);
    reset({
      clientName: "",
      clientRole: "",
      clientImage: "",
      company: "",
      trip: "",
      content: "",
      rating: 5,
      status: "PUBLISHED",
    });
    setImagePreview(null);
    setImageFile(null);
  };

  const onSubmit = async (data: FormValues) => {
    setIsSaving(true);
    try {
      let finalImageUrl = data.clientImage || "";

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadRes = await uploadImageAction(formData);
        if (uploadRes.success && uploadRes.url) {
          finalImageUrl = uploadRes.url;
        } else {
          toast.error("Failed to upload client photo.");
        }
      }

      let res;
      if (editingTestimonial) {
        res = await updateTestimonialAction(editingTestimonial.id, {
          ...data,
          clientImage: finalImageUrl || null,
        });
      } else {
        res = await createTestimonialAction({
          ...data,
          clientImage: finalImageUrl || null,
        });
      }

      if (res.success) {
        toast.success(editingTestimonial ? "Testimonial updated successfully" : "Testimonial created successfully");
        
        if (res.testimonial) {
          if (editingTestimonial) {
            setTestimonials(prev => prev.map(t => t.id === editingTestimonial.id ? res.testimonial : t));
          } else {
            setTestimonials(prev => [res.testimonial, ...prev]);
          }
        }

        handleCancelEdit();
        router.refresh(); // Keep for create/edit to ensure complete sync
      } else {
        toast.error(res.error || "Failed to save testimonial");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    setIsActionLoading(id);
    try {
      const res = await deleteTestimonialAction(id);
      if (res.success) {
        toast.success("Testimonial deleted successfully");
        setTestimonials(prev => prev.filter(t => t.id !== id));
      } else {
        toast.error(res.error || "Failed to delete testimonial");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleToggleStatus = async (id: string) => {
    setIsActionLoading(id);
    try {
      const res = await toggleTestimonialStatusAction(id);
      if (res.success) {
        toast.success(`Testimonial status updated to ${res.status}`);
        setTestimonials(prev => prev.map(t => t.id === id ? { ...t, status: res.status as string } : t));
      } else {
        toast.error(res.error || "Failed to toggle status");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsActionLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Form Area */}
      <Card className="border-0 shadow-sm h-fit">
        <CardHeader>
          <CardTitle className="text-lg">
            {editingTestimonial ? `Edit Testimonial` : "Add Testimonial"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input id="clientName" placeholder="e.g. Aditya Pratama" {...register("clientName")} />
              {errors.clientName && (
                <p className="text-xs text-red-500 font-semibold">{errors.clientName.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientRole">Role / Title</Label>
                <Input id="clientRole" placeholder="e.g. HR Director" {...register("clientRole")} />
                {errors.clientRole && (
                  <p className="text-xs text-red-500 font-semibold">{errors.clientRole.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" placeholder="e.g. PT. Equine Global" {...register("company")} />
                {errors.company && (
                  <p className="text-xs text-red-500 font-semibold">{errors.company.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="trip">Trip Details</Label>
                <Input id="trip" placeholder="e.g. Outing to Bali" {...register("trip")} />
                {errors.trip && (
                  <p className="text-xs text-red-500 font-semibold">{errors.trip.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="rating">Rating</Label>
                <Select value={String(selectedRating)} onValueChange={(val) => setValue('rating', Number(val))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="1">1 Star</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Review Content</Label>
              <Textarea id="content" placeholder="Write client's feedback here..." {...register("content")} />
              {errors.content && (
                <p className="text-xs text-red-500 font-semibold">{errors.content.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Client Photo (Optional)</Label>
              {imagePreview ? (
                <div className="relative rounded-lg overflow-hidden h-24 border border-slate-200 bg-slate-50 flex items-center justify-center">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="h-20 w-20 rounded-full object-cover" 
                  />
                  <button 
                    type="button" 
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                      setValue("clientImage", "");
                    }}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-0.5 rounded-full font-bold shadow-md cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center flex flex-col items-center justify-center">
                  <Upload className="w-6 h-6 text-slate-400 mb-1" />
                  <p className="text-xs text-slate-500 mb-2">Upload avatar</p>
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
              <div className="pt-1">
                <Input 
                  placeholder="Or Photo URL..." 
                  {...register("clientImage")} 
                  onChange={(e) => {
                    setValue("clientImage", e.target.value);
                    setImagePreview(e.target.value || null);
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={selectedStatus} onValueChange={(val) => setValue('status', val as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-2">
              {editingTestimonial && (
                <Button type="button" variant="outline" className="flex-1" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              )}
              <Button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600 font-bold" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : editingTestimonial ? "Save Changes" : "Create Review"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* List Area */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex justify-end">
          <Select 
            defaultValue="10"
            value={itemsPerPage.toString()} 
            onValueChange={(val) => {
              setItemsPerPage(Number(val));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="10 / page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 / page</SelectItem>
              <SelectItem value="10">10 / page</SelectItem>
              <SelectItem value="25">25 / page</SelectItem>
              <SelectItem value="50">50 / page</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="border-0 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto overflow-y-auto max-h-[500px] w-full relative">
              <Table>
                <TableHeader className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Trip/Company</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTestimonials.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                      No testimonials found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedTestimonials.map((t) => (
                    <TableRow 
                      key={t.id} 
                      className={isActionLoading === t.id ? "opacity-50 pointer-events-none" : ""}
                    >
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <img 
                            src={t.clientImage || "/team/placeholder.png"} 
                            alt={t.clientName} 
                            className="h-9 w-9 rounded-full object-cover border border-slate-100" 
                          />
                          <div>
                            <p className="font-semibold text-slate-900 leading-tight">{t.clientName}</p>
                            <p className="text-xs text-slate-500">{t.clientRole}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-slate-600">
                        <p className="font-medium text-slate-800">{t.trip}</p>
                        <p>{t.company}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-amber-500">
                          {Array.from({ length: t.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <button 
                          onClick={() => handleToggleStatus(t.id)}
                          className="hover:scale-102 transition-transform cursor-pointer"
                        >
                          <Badge variant={t.status === "PUBLISHED" ? "default" : "secondary"}>
                            {t.status}
                          </Badge>
                        </button>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                          onClick={() => handleEdit(t)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(t.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center p-4 border-t border-slate-100 bg-slate-50/50">
              <p className="text-xs text-slate-500">
                Showing {(currentPage-1)*itemsPerPage + 1} to {Math.min(currentPage*itemsPerPage, testimonials.length)} of {testimonials.length} records
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ArrowLeft className="w-4 h-4 mr-1" /> Prev
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

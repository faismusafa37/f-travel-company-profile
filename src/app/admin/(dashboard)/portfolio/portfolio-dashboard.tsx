"use client";

import { useState, useMemo, useDeferredValue, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Trash2, Edit, Loader2, Search, ArrowLeft, ArrowRight, Upload, Star } from "lucide-react";
import { createPortfolioProjectAction, updatePortfolioProjectAction, deletePortfolioProjectAction, togglePortfolioProjectStatusAction, getPortfolioProjectImagesAction, getAllPortfolioProjectsAction } from "@/app/actions/portfolio";
import { uploadImageAction } from "@/app/actions/upload";

const portfolioProjectSchema = z.object({
  client: z.string().min(2, "Client name must be at least 2 characters"),
  activity: z.string().min(2, "Activity is required"),
  location: z.string().min(2, "Location is required"),
  category: z.string().min(2, "Category is required"),
  original: z.string().min(5, "Original text is required"),
  year: z.string().min(4, "Year is required"),
  status: z.enum(["PUBLISHED", "DRAFT"]),
  images: z.array(z.object({
    url: z.string(),
    caption: z.string().optional(),
    sortOrder: z.number()
  })).optional()
});

type FormValues = z.infer<typeof portfolioProjectSchema>;

interface ProjectItem {
  id: string;
  client: string;
  activity: string;
  location: string;
  category: string;
  original: string;
  year: string;
  status: string;
  images?: { id?: string; url: string; caption?: string | null; sortOrder?: number }[];
}

export function PortfolioDashboard({ initialProjects = [] }: { initialProjects?: ProjectItem[] }) {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [isLoadingProjects, setIsLoadingProjects] = useState(initialProjects.length === 0);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<{url: string, caption?: string, sortOrder: number}[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Load projects purely on client to bypass RSC payload bottleneck
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await getAllPortfolioProjectsAction();
        if (res.success && res.projects) {
          // @ts-ignore
          setProjects(res.projects);
        }
      } catch (e) {
        console.error("Failed to load projects", e);
      } finally {
        setIsLoadingProjects(false);
      }
    };
    if (initialProjects.length === 0) {
      loadProjects();
    }
  }, [initialProjects.length]);

  // Search, Filter, Pagination state
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(portfolioProjectSchema),
    defaultValues: {
      client: "",
      activity: "",
      location: "",
      category: "Outing & Gathering",
      original: "",
      year: new Date().getFullYear().toString(),
      status: "PUBLISHED",
      images: [],
    },
  });

  const selectedStatus = watch("status");
  const selectedCategory = watch("category");

  // Sync inputs helper when user types original text
  const handleOriginalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue("original", val);
    
    // Auto guess fields from original string to be helpful
    const lowercase = val.toLowerCase();
    
    // Guess category
    if (lowercase.includes("booth camp") || lowercase.includes("boot camp") || lowercase.includes("team building") || lowercase.includes("treasure hunt") || lowercase.includes("leadership training")) {
      setValue("category", "Team Building & Bootcamp");
    } else if (lowercase.includes("study tour")) {
      setValue("category", "Study & Special Tour");
    } else if (lowercase.includes("meeting") || lowercase.includes("rakor") || lowercase.includes("capacity building")) {
      setValue("category", "Meeting & Conference");
    } else if (lowercase.includes("gathering") || lowercase.includes("family gathering")) {
      setValue("category", "Outing & Gathering");
    }

    // Guess client (words before "outing", "gathering", "study tour")
    const matchClient = val.match(/^(.+?)(?:\souting|\sgathering|\sstudy|\sbooth|\sboot|\smeeting|\srakor|\scapacity)/i);
    if (matchClient) {
      setValue("client", matchClient[1].trim());
    }

    // Guess location (words after "ke", "di")
    const matchLoc = val.match(/(?:\s[kK]e\s|\sdi\s|\sdi Desa Wisata\s)(.+)$/i);
    if (matchLoc) {
      setValue("location", matchLoc[1].trim());
    }

    // Guess activity
    if (lowercase.includes("family gathering")) setValue("activity", "Family Gathering");
    else if (lowercase.includes("gathering")) setValue("activity", "Gathering");
    else if (lowercase.includes("booth camp") || lowercase.includes("boot camp")) setValue("activity", "Bootcamp");
    else if (lowercase.includes("team building")) setValue("activity", "Team Building");
    else if (lowercase.includes("study tour")) setValue("activity", "Study Tour");
    else if (lowercase.includes("rakor")) setValue("activity", "Rapat Koordinasi (RAKOR)");
    else if (lowercase.includes("meeting")) setValue("activity", "Meeting & Tour");
    else if (lowercase.includes("outing")) setValue("activity", "Corporate Outing");
  };

  const handleEdit = async (p: ProjectItem) => {
    setEditingProject(p);
    
    // Fast initial render without images
    setUploadedImages([]);
    reset({
      client: p.client,
      activity: p.activity,
      location: p.location,
      category: p.category,
      original: p.original,
      year: p.year,
      status: p.status as any,
      images: [],
    });

    // Fetch images asynchronously to keep it fast
    try {
      const res = await getPortfolioProjectImagesAction(p.id);
      if (res.success && res.images) {
        const fetchedImages = res.images.map((img: any) => ({ 
          url: img.url, 
          caption: img.caption || undefined, 
          sortOrder: img.sortOrder || 0 
        }));
        setUploadedImages(fetchedImages);
        setValue("images", fetchedImages);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
    setUploadedImages([]);
    reset({
      client: "",
      activity: "",
      location: "",
      category: "Outing & Gathering",
      original: "",
      year: new Date().getFullYear().toString(),
      status: "PUBLISHED",
      images: [],
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const newImages = [...uploadedImages];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);
        const res = await uploadImageAction(formData);
        if (res.success && res.url) {
          newImages.push({ url: res.url, sortOrder: newImages.length });
        } else {
          toast.error(`Failed to upload ${file.name}`);
        }
      }
      setUploadedImages(newImages);
      setValue("images", newImages);
    } catch (error) {
      toast.error("An error occurred during upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...uploadedImages];
    newImages.splice(index, 1);
    // update sort order
    newImages.forEach((img, i) => img.sortOrder = i);
    setUploadedImages(newImages);
    setValue("images", newImages);
  };

  const handleSetMainImage = (index: number) => {
    if (index === 0) return;
    const newImages = [...uploadedImages];
    const [selected] = newImages.splice(index, 1);
    newImages.unshift(selected); // Move to index 0
    newImages.forEach((img, i) => img.sortOrder = i);
    setUploadedImages(newImages);
    setValue("images", newImages);
  };

  const onSubmit = async (data: FormValues) => {
    setIsSaving(true);
    try {
      let res;
      if (editingProject) {
        res = await updatePortfolioProjectAction(editingProject.id, data);
      } else {
        res = await createPortfolioProjectAction(data);
      }

      if (res.success) {
        toast.success(editingProject ? "Project updated successfully" : "Project created successfully");
        handleCancelEdit();
        // Refresh local state to avoid slow router.refresh()
        const newRes = await getAllPortfolioProjectsAction();
        if (newRes.success && newRes.projects) {
          // @ts-ignore
          setProjects(newRes.projects);
        }
      } else {
        toast.error(res.error || "Failed to save project");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    setIsActionLoading(id);
    try {
      const res = await deletePortfolioProjectAction(id);
      if (res.success) {
        toast.success("Project deleted successfully");
        setProjects(prev => prev.filter(p => p.id !== id));
      } else {
        toast.error(res.error || "Failed to delete project");
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
      const res = await togglePortfolioProjectStatusAction(id);
      if (res.success) {
        toast.success(`Project status updated to ${res.status}`);
        setProjects(prev => prev.map(p => p.id === id ? { ...p, status: res.status as string } : p));
      } else {
        toast.error(res.error || "Failed to toggle status");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsActionLoading(null);
    }
  };

  // Filtered projects
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesSearch = 
        p.original.toLowerCase().includes(deferredSearchQuery.toLowerCase()) ||
        p.client.toLowerCase().includes(deferredSearchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(deferredSearchQuery.toLowerCase());
      
      const matchesCategory = 
        categoryFilter === "All" || p.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [initialProjects, searchQuery, categoryFilter]);

  // Paginated projects
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProjects.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProjects, currentPage]);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const uniqueCategories = useMemo(() => {
    const cats = new Set<string>();
    projects.forEach(p => cats.add(p.category));
    return Array.from(cats);
  }, [projects]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Form Panel */}
      <Card className="border-0 shadow-sm h-fit">
        <CardHeader>
          <CardTitle className="text-lg font-bold">
            {editingProject ? `Edit Outing Project` : "Add Outing Project"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="original">Original Text Display</Label>
              <Input 
                id="original" 
                placeholder="e.g. BNI KC BSD outing ke Bali" 
                {...register("original", { onChange: handleOriginalChange })}
              />
              {errors.original && (
                <p className="text-xs text-red-500 font-semibold">{errors.original.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="client">Client Name</Label>
              <Input id="client" placeholder="e.g. BNI KC BSD" {...register("client")} />
              {errors.client && (
                <p className="text-xs text-red-500 font-semibold">{errors.client.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="activity">Activity Type</Label>
                <Input id="activity" placeholder="e.g. Corporate Outing" {...register("activity")} />
                {errors.activity && (
                  <p className="text-xs text-red-500 font-semibold">{errors.activity.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="e.g. Bali" {...register("location")} />
                {errors.location && (
                  <p className="text-xs text-red-500 font-semibold">{errors.location.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input id="year" placeholder="e.g. 2024" {...register("year")} />
                {errors.year && (
                  <p className="text-xs text-red-500 font-semibold">{errors.year.message}</p>
                )}
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category Filter</Label>
              <Select value={selectedCategory} onValueChange={(val) => setValue('category', val || "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Outing & Gathering">Outing & Gathering</SelectItem>
                  <SelectItem value="Team Building & Bootcamp">Team Building & Bootcamp</SelectItem>
                  <SelectItem value="Study & Special Tour">Study & Special Tour</SelectItem>
                  <SelectItem value="Meeting & Conference">Meeting & Conference</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-xs text-red-500 font-semibold">{errors.category.message}</p>
              )}
            </div>

            {/* Image Upload Section */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <Label>Portfolio Photos</Label>
              <div className="flex flex-wrap gap-4">
                {uploadedImages.map((img, idx) => (
                  <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200 group">
                    <img src={img.url} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                    
                    {idx === 0 && (
                      <div className="absolute top-1 left-1 bg-orange-500 text-white p-0.5 rounded shadow-sm z-10" title="Main Display Image">
                        <Star className="w-3 h-3 fill-current" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {idx !== 0 && (
                        <button
                          type="button"
                          onClick={() => handleSetMainImage(idx)}
                          className="p-1.5 bg-white/20 hover:bg-white/40 rounded-full transition-colors"
                          title="Set as Display Image"
                        >
                          <Star className="w-4 h-4 text-white" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="p-1.5 bg-red-500/80 hover:bg-red-500 rounded-full transition-colors"
                        title="Remove Image"
                      >
                        <Trash2 className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                ))}
                
                <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-orange-500 hover:bg-orange-50/50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {isUploading ? <Loader2 className="w-6 h-6 text-slate-400 animate-spin" /> : <Upload className="w-6 h-6 text-slate-400" />}
                  </div>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                </label>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              {editingProject && (
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
                ) : editingProject ? "Save Changes" : "Create Project"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* List Panel */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search by client, location, original name..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9"
            />
          </div>
          <Select 
            value={categoryFilter} 
            onValueChange={(val) => {
              setCategoryFilter(val || "All");
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              <SelectItem value="Outing & Gathering">Outing & Gathering</SelectItem>
              <SelectItem value="Team Building & Bootcamp">Team Building & Bootcamp</SelectItem>
              <SelectItem value="Study & Special Tour">Study & Special Tour</SelectItem>
              <SelectItem value="Meeting & Conference">Meeting & Conference</SelectItem>
            </SelectContent>
          </Select>
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
                    <TableHead>Activity (Full)</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingProjects ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                        <div className="flex items-center justify-center">
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Loading projects...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : paginatedProjects.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                        No outing records found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedProjects.map((p) => (
                      <TableRow 
                        key={p.id} 
                        className={isActionLoading === p.id ? "opacity-50 pointer-events-none" : ""}
                      >
                        <TableCell className="font-semibold text-slate-900">
                          {p.original}
                        </TableCell>
                        <TableCell className="text-xs text-slate-500 font-medium">
                          {p.category}
                        </TableCell>
                        <TableCell className="text-slate-600 text-sm">
                          {p.year}
                        </TableCell>
                        <TableCell>
                          <button 
                            onClick={() => handleToggleStatus(p.id)}
                            className="hover:scale-102 transition-transform cursor-pointer"
                          >
                            <Badge variant={p.status === "PUBLISHED" ? "default" : "secondary"}>
                              {p.status}
                            </Badge>
                          </button>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                            onClick={() => handleEdit(p)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(p.id)}
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
                  Showing {(currentPage-1)*itemsPerPage + 1} to {Math.min(currentPage*itemsPerPage, filteredProjects.length)} of {filteredProjects.length} records
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

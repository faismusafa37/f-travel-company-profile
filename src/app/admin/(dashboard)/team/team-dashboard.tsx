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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Upload, Trash2, Edit, Loader2 } from "lucide-react";
import { createTeamMemberAction, updateTeamMemberAction, deleteTeamMemberAction, toggleTeamMemberStatusAction } from "@/app/actions/team";
import { uploadImageAction } from "@/app/actions/upload";

const teamMemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().min(2, "Role is required"),
  quote: z.string().min(5, "Quote is required"),
  image: z.string().optional().nullable(),
  order: z.number().int(),
  status: z.enum(["PUBLISHED", "DRAFT"]),
});

type FormValues = z.infer<typeof teamMemberSchema>;

interface TeamMemberItem {
  id: string;
  name: string;
  role: string;
  quote: string;
  image: string;
  order: number;
  status: string;
}

export function TeamDashboard({ initialTeam }: { initialTeam: TeamMemberItem[] }) {
  const router = useRouter();
  const [editingMember, setEditingMember] = useState<TeamMemberItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);
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
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      name: "",
      role: "",
      quote: "",
      image: "",
      order: 0,
      status: "PUBLISHED",
    },
  });

  const selectedStatus = watch("status");

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

  const handleEdit = (member: TeamMemberItem) => {
    setEditingMember(member);
    reset({
      name: member.name,
      role: member.role,
      quote: member.quote,
      image: member.image,
      order: member.order,
      status: member.status as any,
    });
    setImagePreview(member.image);
    setImageFile(null);
  };

  const handleCancelEdit = () => {
    setEditingMember(null);
    reset({
      name: "",
      role: "",
      quote: "",
      image: "",
      order: 0,
      status: "PUBLISHED",
    });
    setImagePreview(null);
    setImageFile(null);
  };

  const onSubmit = async (data: FormValues) => {
    setIsSaving(true);
    try {
      let finalImageUrl = data.image || "";

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadRes = await uploadImageAction(formData);
        if (uploadRes.success && uploadRes.url) {
          finalImageUrl = uploadRes.url;
        } else {
          toast.error("Failed to upload profile photo.");
        }
      }

      if (!finalImageUrl) {
        toast.error("Please upload an image or provide a URL.");
        setIsSaving(false);
        return;
      }

      let res;
      if (editingMember) {
        res = await updateTeamMemberAction(editingMember.id, {
          ...data,
          image: finalImageUrl,
        });
      } else {
        res = await createTeamMemberAction({
          ...data,
          image: finalImageUrl,
        });
      }

      if (res.success) {
        toast.success(editingMember ? "Team member updated successfully" : "Team member created successfully");
        handleCancelEdit();
        router.refresh();
      } else {
        toast.error(res.error || "Failed to save team member");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;
    setIsActionLoading(id);
    try {
      const res = await deleteTeamMemberAction(id);
      if (res.success) {
        toast.success("Team member deleted successfully");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to delete team member");
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
      const res = await toggleTeamMemberStatusAction(id);
      if (res.success) {
        toast.success(`Team member status updated to ${res.status}`);
        router.refresh();
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
            {editingMember ? `Edit Member: ${editingMember.name}` : "Add Team Member"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="e.g. Wahyu Prabowo" {...register("name")} />
              {errors.name && (
                <p className="text-xs text-red-500 font-semibold">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Position / Role</Label>
              <Input id="role" placeholder="e.g. Chief Executive Officer" {...register("role")} />
              {errors.role && (
                <p className="text-xs text-red-500 font-semibold">{errors.role.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="quote">Quote / Commitment</Label>
              <Textarea id="quote" placeholder="e.g. Committed to making every trip run perfectly." {...register("quote")} />
              {errors.quote && (
                <p className="text-xs text-red-500 font-semibold">{errors.quote.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Profile Picture</Label>
              {imagePreview ? (
                <div className="relative rounded-lg overflow-hidden h-32 border border-slate-200 bg-slate-50 flex items-center justify-center">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="h-full w-full object-cover" 
                  />
                  <button 
                    type="button" 
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                      setValue("image", "");
                    }}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-0.5 rounded-full font-bold shadow-md cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center flex flex-col items-center justify-center">
                  <Upload className="w-6 h-6 text-slate-400 mb-1" />
                  <p className="text-xs text-slate-500 mb-2">Upload profile photo</p>
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
                  {...register("image")} 
                  onChange={(e) => {
                    setValue("image", e.target.value);
                    setImagePreview(e.target.value || null);
                  }}
                />
                {errors.image && (
                  <p className="text-xs text-red-500 font-semibold mt-1">{errors.image.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="order">Sort Order</Label>
                <Input id="order" type="number" {...register("order", { valueAsNumber: true })} />
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

            <div className="flex gap-2 pt-2">
              {editingMember && (
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
                ) : editingMember ? "Save Changes" : "Add Member"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* List Area */}
      <Card className="border-0 shadow-sm lg:col-span-2 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto w-full">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Photo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Sort Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialTeam.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                      No team members found.
                    </TableCell>
                  </TableRow>
                ) : (
                  initialTeam.map((member) => (
                    <TableRow 
                      key={member.id} 
                      className={isActionLoading === member.id ? "opacity-50 pointer-events-none" : ""}
                    >
                      <TableCell>
                        <img 
                          src={member.image || "/team/placeholder.png"} 
                          alt={member.name} 
                          className="h-10 w-10 rounded-full object-cover border border-slate-100" 
                        />
                      </TableCell>
                      <TableCell className="font-semibold text-slate-900">{member.name}</TableCell>
                      <TableCell className="text-slate-600 text-sm">{member.role}</TableCell>
                      <TableCell className="text-slate-500 text-sm">{member.order}</TableCell>
                      <TableCell>
                        <button 
                          onClick={() => handleToggleStatus(member.id)}
                          className="hover:scale-102 transition-transform cursor-pointer"
                        >
                          <Badge variant={member.status === "PUBLISHED" ? "default" : "secondary"}>
                            {member.status}
                          </Badge>
                        </button>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                          onClick={() => handleEdit(member)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(member.id)}
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
        </CardContent>
      </Card>
    </div>
  );
}

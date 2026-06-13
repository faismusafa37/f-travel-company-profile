"use client";

import { useState, useEffect } from "react";
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
import { Upload, Trash2, Edit, Plus, Loader2 } from "lucide-react";
import { createClientAction, updateClientAction, deleteClientAction, toggleClientStatusAction } from "@/app/actions/clients";
import { uploadImageAction } from "@/app/actions/upload";

const clientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  logoUrl: z.string().optional().nullable(),
  logoText: z.string().optional().nullable(),
  bgColor: z.string().optional().nullable(),
  textColor: z.string().optional().nullable(),
  order: z.number().int(),
  status: z.enum(["PUBLISHED", "DRAFT"]),
});

type FormValues = z.infer<typeof clientSchema>;

interface ClientItem {
  id: string;
  name: string;
  logoUrl: string | null;
  logoText: string | null;
  bgColor: string | null;
  textColor: string | null;
  order: number;
  status: string;
}

export function ClientsDashboard({ initialClients }: { initialClients: ClientItem[] }) {
  const router = useRouter();
  const [editingClient, setEditingClient] = useState<ClientItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.max(1, Math.ceil(initialClients.length / itemsPerPage));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const paginatedClients = initialClients.slice((validCurrentPage - 1) * itemsPerPage, validCurrentPage * itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [initialClients.length, currentPage, totalPages]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      logoUrl: "",
      logoText: "",
      bgColor: "from-blue-700 to-indigo-800",
      textColor: "text-white",
      order: 0,
      status: "PUBLISHED",
    },
  });

  const selectedStatus = watch("status");

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (client: ClientItem) => {
    setEditingClient(client);
    reset({
      name: client.name,
      logoUrl: client.logoUrl || "",
      logoText: client.logoText || "",
      bgColor: client.bgColor || "from-blue-700 to-indigo-800",
      textColor: client.textColor || "text-white",
      order: client.order,
      status: client.status as any,
    });
    setLogoPreview(client.logoUrl);
    setLogoFile(null);
  };

  const handleCancelEdit = () => {
    setEditingClient(null);
    reset({
      name: "",
      logoUrl: "",
      logoText: "",
      bgColor: "from-blue-700 to-indigo-800",
      textColor: "text-white",
      order: 0,
      status: "PUBLISHED",
    });
    setLogoPreview(null);
    setLogoFile(null);
  };

  const onSubmit = async (data: FormValues) => {
    setIsSaving(true);
    try {
      let finalLogoUrl = data.logoUrl || "";

      if (logoFile) {
        const formData = new FormData();
        formData.append("file", logoFile);
        const uploadRes = await uploadImageAction(formData);
        if (uploadRes.success && uploadRes.url) {
          finalLogoUrl = uploadRes.url;
        } else {
          toast.error("Failed to upload logo image.");
        }
      }

      let res;
      if (editingClient) {
        res = await updateClientAction(editingClient.id, {
          ...data,
          logoUrl: finalLogoUrl || null,
        });
      } else {
        res = await createClientAction({
          ...data,
          logoUrl: finalLogoUrl || null,
        });
      }

      if (res.success) {
        toast.success(editingClient ? "Client updated successfully" : "Client created successfully");
        handleCancelEdit();
        router.refresh();
      } else {
        toast.error(res.error || "Failed to save client");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this client?")) return;
    setIsActionLoading(id);
    try {
      const res = await deleteClientAction(id);
      if (res.success) {
        toast.success("Client deleted successfully");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to delete client");
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
      const res = await toggleClientStatusAction(id);
      if (res.success) {
        toast.success(`Client status updated to ${res.status}`);
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
            {editingClient ? `Edit Client: ${editingClient.name}` : "Add New Client"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Client Name</Label>
              <Input id="name" placeholder="e.g. PT. Equine Global" {...register("name")} />
              {errors.name && (
                <p className="text-xs text-red-500 font-semibold">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Logo Source</Label>
              {logoPreview ? (
                <div className="relative rounded-lg overflow-hidden h-24 border border-slate-200 bg-slate-50 flex items-center justify-center">
                  <img 
                    src={logoPreview} 
                    alt="Logo Preview" 
                    className="max-h-20 max-w-[80%] object-contain" 
                  />
                  <button 
                    type="button" 
                    onClick={() => {
                      setLogoFile(null);
                      setLogoPreview(null);
                      setValue("logoUrl", "");
                    }}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-0.5 rounded-full font-bold shadow-md cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center flex flex-col items-center justify-center">
                  <Upload className="w-6 h-6 text-slate-400 mb-1" />
                  <p className="text-xs text-slate-500 mb-2">Upload PNG logo</p>
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleLogoChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button type="button" variant="outline" size="sm">Choose File</Button>
                  </div>
                </div>
              )}
              <div className="pt-1">
                <Input 
                  placeholder="Or Logo Image URL..." 
                  {...register("logoUrl")} 
                  onChange={(e) => {
                    setValue("logoUrl", e.target.value);
                    setLogoPreview(e.target.value || null);
                  }}
                />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Or fallback CSS logo (for slider)</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="logoText">Short Initials</Label>
                  <Input id="logoText" placeholder="e.g. EG" {...register("logoText")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order">Sort Order</Label>
                  <Input id="order" type="number" {...register("order", { valueAsNumber: true })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="space-y-2">
                  <Label htmlFor="bgColor">BG Class (Tailwind/CSS)</Label>
                  <Input id="bgColor" placeholder="from-blue-700 to-indigo-800" {...register("bgColor")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="textColor">Text Color Class</Label>
                  <Input id="textColor" placeholder="text-white" {...register("textColor")} />
                </div>
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
              {editingClient && (
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
                ) : editingClient ? "Save Changes" : "Create Client"}
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
                  <TableHead>Preview logo</TableHead>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Sort Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedClients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                      No clients found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedClients.map((client) => (
                    <TableRow 
                      key={client.id} 
                      className={isActionLoading === client.id ? "opacity-50 pointer-events-none" : ""}
                    >
                      <TableCell>
                        {client.logoUrl ? (
                          <img src={client.logoUrl} alt={client.name} className="h-8 max-w-[80px] object-contain" />
                        ) : (
                          <div className={`h-8 w-16 rounded flex items-center justify-center text-xs font-bold bg-gradient-to-br ${client.bgColor || 'from-slate-200 to-slate-350'} ${client.textColor || 'text-slate-700'}`}>
                            {client.logoText || client.name.substring(0,2).toUpperCase()}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-semibold text-slate-900">{client.name}</TableCell>
                      <TableCell className="text-slate-500 text-sm">{client.order}</TableCell>
                      <TableCell>
                        <button 
                          onClick={() => handleToggleStatus(client.id)}
                          className="hover:scale-102 transition-transform cursor-pointer"
                        >
                          <Badge variant={client.status === "PUBLISHED" ? "default" : "secondary"}>
                            {client.status}
                          </Badge>
                        </button>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                          onClick={() => handleEdit(client)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(client.id)}
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
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/50">
              <div className="text-xs text-slate-500">
                Showing <span className="font-medium">{(validCurrentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(validCurrentPage * itemsPerPage, initialClients.length)}</span> of <span className="font-medium">{initialClients.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={validCurrentPage === 1}
                  className="h-8 text-xs px-3"
                >
                  Prev
                </Button>
                <div className="text-xs font-medium px-1">
                  Page {validCurrentPage} of {totalPages}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={validCurrentPage === totalPages}
                  className="h-8 text-xs px-3"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { deletePackageAction, togglePackageStatusAction } from "@/app/actions/packages";
import { useRouter } from "next/navigation";

interface PackageItem {
  id: string;
  title: string;
  price: number;
  duration: number;
  status: string;
  destination: {
    title: string;
  };
}

export function PackagesTable({ initialPackages }: { initialPackages: PackageItem[] }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this travel package?")) return;
    setIsLoading(id);
    try {
      const res = await deletePackageAction(id);
      if (res.success) {
        toast.success("Package deleted successfully");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to delete package");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(null);
    }
  };

  const handleToggleStatus = async (id: string) => {
    setIsLoading(id);
    try {
      const res = await togglePackageStatusAction(id);
      if (res.success) {
        toast.success(`Package status updated to ${res.status}`);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to toggle status");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="overflow-x-auto w-full">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {initialPackages.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                No travel packages found. Create one to get started.
              </TableCell>
            </TableRow>
          ) : (
            initialPackages.map((pkg) => (
              <TableRow key={pkg.id} className={isLoading === pkg.id ? "opacity-50 pointer-events-none" : ""}>
                <TableCell className="font-medium text-slate-900">{pkg.title}</TableCell>
                <TableCell>{pkg.destination.title}</TableCell>
                <TableCell>Rp {Number(pkg.price).toLocaleString("id-ID")}</TableCell>
                <TableCell>{pkg.duration} Days</TableCell>
                <TableCell>
                  <button 
                    onClick={() => handleToggleStatus(pkg.id)}
                    className="hover:scale-102 transition-transform cursor-pointer"
                  >
                    <Badge variant={pkg.status === "PUBLISHED" ? "default" : "secondary"}>
                      {pkg.status}
                    </Badge>
                  </button>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Link href={`/admin/packages/${pkg.id}/edit`}>
                    <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-600 hover:bg-blue-50">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(pkg.id)}
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
  );
}

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, Power } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { deleteDestinationAction, toggleDestinationStatusAction } from "@/app/actions/destinations";
import { useRouter } from "next/navigation";

interface DestinationItem {
  id: string;
  title: string;
  city: string;
  country: string;
  category: string | null;
  status: string;
}

export function DestinationsTable({ initialDestinations }: { initialDestinations: DestinationItem[] }) {
  const [destinations, setDestinations] = useState(initialDestinations);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this destination?")) return;
    setIsLoading(id);
    try {
      const res = await deleteDestinationAction(id);
      if (res.success) {
        toast.success("Destination deleted successfully");
        setDestinations(prev => prev.filter(d => d.id !== id));
      } else {
        toast.error(res.error || "Failed to delete destination");
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
      const res = await toggleDestinationStatusAction(id);
      if (res.success) {
        toast.success(`Destination status updated to ${res.status}`);
        setDestinations(prev => prev.map(d => d.id === id ? { ...d, status: res.status as string } : d));
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
            <TableHead>Country/City</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {destinations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                No destinations found. Create one to get started.
              </TableCell>
            </TableRow>
          ) : (
            destinations.map((dest) => (
              <TableRow key={dest.id} className={isLoading === dest.id ? "opacity-50 pointer-events-none" : ""}>
                <TableCell className="font-medium text-slate-900">{dest.title}</TableCell>
                <TableCell>{dest.city}, {dest.country}</TableCell>
                <TableCell>{dest.category || "—"}</TableCell>
                <TableCell>
                  <button 
                    onClick={() => handleToggleStatus(dest.id)}
                    className="hover:scale-102 transition-transform cursor-pointer"
                  >
                    <Badge variant={dest.status === "PUBLISHED" ? "default" : "secondary"}>
                      {dest.status}
                    </Badge>
                  </button>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Link href={`/admin/destinations/${dest.id}/edit`}>
                    <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-600 hover:bg-blue-50">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(dest.id)}
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

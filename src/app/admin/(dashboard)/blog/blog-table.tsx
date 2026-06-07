"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { deleteBlogPostAction, toggleBlogPostStatusAction } from "@/app/actions/blog";
import { useRouter } from "next/navigation";

interface BlogPostItem {
  id: string;
  title: string;
  createdAt: Date;
  status: string;
  category: {
    name: string;
  } | null;
}

export function BlogTable({ initialPosts }: { initialPosts: BlogPostItem[] }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    setIsLoading(id);
    try {
      const res = await deleteBlogPostAction(id);
      if (res.success) {
        toast.success("Blog post deleted successfully");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to delete blog post");
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
      const res = await toggleBlogPostStatusAction(id);
      if (res.success) {
        toast.success(`Blog post status updated to ${res.status}`);
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
            <TableHead>Category</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {initialPosts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                No blog posts found. Create one to get started.
              </TableCell>
            </TableRow>
          ) : (
            initialPosts.map((post) => (
              <TableRow key={post.id} className={isLoading === post.id ? "opacity-50 pointer-events-none" : ""}>
                <TableCell className="font-medium text-slate-900 line-clamp-1 max-w-[250px]">{post.title}</TableCell>
                <TableCell>{post.category?.name || "—"}</TableCell>
                <TableCell>{new Date(post.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <button 
                    onClick={() => handleToggleStatus(post.id)}
                    className="hover:scale-102 transition-transform cursor-pointer"
                  >
                    <Badge variant={post.status === "PUBLISHED" ? "default" : "secondary"}>
                      {post.status}
                    </Badge>
                  </button>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Link href={`/admin/blog/${post.id}/edit`}>
                    <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-600 hover:bg-blue-50">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(post.id)}
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

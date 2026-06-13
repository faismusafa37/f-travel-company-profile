"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import prisma from "@/lib/prisma";

const blogPostSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  featuredImage: z.string().optional().nullable(),
  categoryId: z.string().min(1, "Category is required"),
  tags: z.string().optional().nullable(),
  status: z.enum(["PUBLISHED", "DRAFT"]).default("DRAFT"),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
});

export async function createBlogCategoryAction(name: string, slug: string) {
  try {
    const cat = await prisma.blogCategory.create({
      data: { name, slug }
    });
    return { success: true, category: cat };
  } catch (error) {
    console.error("Create blog category error:", error);
    return { success: false, error: "Failed to create category" };
  }
}

export async function createBlogPostAction(data: z.infer<typeof blogPostSchema>) {
  try {
    const parsed = blogPostSchema.parse(data);

    // Check if slug is unique
    const existing = await prisma.blogPost.findUnique({
      where: { slug: parsed.slug }
    });

    if (existing) {
      return { success: false, error: "A blog post with this slug already exists" };
    }

    const post = await prisma.blogPost.create({
      data: {
        title: parsed.title,
        slug: parsed.slug,
        excerpt: parsed.excerpt,
        content: parsed.content,
        featuredImage: parsed.featuredImage,
        categoryId: parsed.categoryId,
        tags: parsed.tags,
        status: parsed.status,
        seoTitle: parsed.seoTitle,
        seoDescription: parsed.seoDescription,
      }
    });

    revalidatePath("/blog");
    revalidatePath("/admin/blog");
    return { success: true, blogPost: post };
  } catch (error) {
    console.error("Create blog post error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Failed to create blog post" };
  }
}

export async function updateBlogPostAction(id: string, data: z.infer<typeof blogPostSchema>) {
  try {
    const parsed = blogPostSchema.parse(data);

    // Check if slug is unique for other post
    const existing = await prisma.blogPost.findFirst({
      where: { 
        slug: parsed.slug,
        NOT: { id }
      }
    });

    if (existing) {
      return { success: false, error: "A blog post with this slug already exists" };
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title: parsed.title,
        slug: parsed.slug,
        excerpt: parsed.excerpt,
        content: parsed.content,
        featuredImage: parsed.featuredImage,
        categoryId: parsed.categoryId,
        tags: parsed.tags,
        status: parsed.status,
        seoTitle: parsed.seoTitle,
        seoDescription: parsed.seoDescription,
      }
    });

    revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/blog");
    revalidatePath("/admin/blog");
    return { success: true, blogPost: post };
  } catch (error) {
    console.error("Update blog post error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Failed to update blog post" };
  }
}

export async function deleteBlogPostAction(id: string) {
  try {
    await prisma.blogPost.delete({
      where: { id }
    });

    revalidatePath("/blog");
    revalidatePath("/admin/blog");
    return { success: true };
  } catch (error) {
    console.error("Delete blog post error:", error);
    return { success: false, error: "Failed to delete blog post" };
  }
}

export async function toggleBlogPostStatusAction(id: string) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { id }
    });
    if (!post) return { success: false, error: "Blog post not found" };

    const newStatus = post.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    await prisma.blogPost.update({
      where: { id },
      data: { status: newStatus }
    });

    revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/blog");
    revalidatePath("/admin/blog");
    return { success: true, status: newStatus };
  } catch (error) {
    console.error("Toggle blog post status error:", error);
    return { success: false, error: "Failed to toggle status" };
  }
}


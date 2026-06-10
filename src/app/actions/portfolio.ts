"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const prisma = new PrismaClient();

const portfolioProjectSchema = z.object({
  client: z.string().min(2, "Client name must be at least 2 characters"),
  activity: z.string().min(2, "Activity is required"),
  location: z.string().min(2, "Location is required"),
  category: z.string().min(2, "Category is required"),
  original: z.string().min(5, "Original text is required"),
  year: z.string().min(4, "Year is required"),
  status: z.enum(["PUBLISHED", "DRAFT"]).default("PUBLISHED"),
  images: z.array(z.object({
    url: z.string(),
    caption: z.string().optional(),
    sortOrder: z.number().default(0)
  })).optional()
});

export async function createPortfolioProjectAction(data: z.infer<typeof portfolioProjectSchema>) {
  try {
    const { images, ...parsedData } = portfolioProjectSchema.parse(data);
    const project = await prisma.portfolioProject.create({
      data: {
        ...parsedData,
        images: images && images.length > 0 ? {
          create: images.map(img => ({
            url: img.url,
            caption: img.caption,
            sortOrder: img.sortOrder
          }))
        } : undefined
      }
    });

    revalidatePath("/packages");
    revalidatePath("/admin/portfolio");
    revalidatePath("/gallery");
    return { success: true, project };
  } catch (error) {
    console.error("Create portfolio project error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Failed to create portfolio project" };
  }
}

export async function updatePortfolioProjectAction(id: string, data: z.infer<typeof portfolioProjectSchema>) {
  try {
    const { images, ...parsedData } = portfolioProjectSchema.parse(data);
    
    // First update the main project data
    const project = await prisma.portfolioProject.update({
      where: { id },
      data: parsedData
    });

    // Then update images if provided
    if (images !== undefined) {
      // Simplest way is to delete existing and recreate
      // (Assuming prisma generated client knows about PortfolioImage)
      // @ts-ignore
      await prisma.portfolioImage.deleteMany({
        where: { portfolioProjectId: id }
      });
      
      if (images.length > 0) {
        // @ts-ignore
        await prisma.portfolioImage.createMany({
          data: images.map(img => ({
            url: img.url,
            caption: img.caption,
            sortOrder: img.sortOrder,
            portfolioProjectId: id
          }))
        });
      }
    }

    revalidatePath("/packages");
    revalidatePath("/admin/portfolio");
    revalidatePath("/gallery");
    return { success: true, project };
  } catch (error) {
    console.error("Update portfolio project error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Failed to update portfolio project" };
  }
}

export async function deletePortfolioProjectAction(id: string) {
  try {
    await prisma.portfolioProject.delete({
      where: { id }
    });

    revalidatePath("/packages");
    revalidatePath("/admin/portfolio");
    return { success: true };
  } catch (error) {
    console.error("Delete portfolio project error:", error);
    return { success: false, error: "Failed to delete portfolio project" };
  }
}

export async function togglePortfolioProjectStatusAction(id: string) {
  try {
    const project = await prisma.portfolioProject.findUnique({
      where: { id }
    });
    if (!project) return { success: false, error: "Portfolio project not found" };

    const newStatus = project.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    await prisma.portfolioProject.update({
      where: { id },
      data: { status: newStatus }
    });

    revalidatePath("/packages");
    revalidatePath("/admin/portfolio");
    return { success: true, status: newStatus };
  } catch (error) {
    console.error("Toggle portfolio project status error:", error);
    return { success: false, error: "Failed to toggle status" };
  }
}

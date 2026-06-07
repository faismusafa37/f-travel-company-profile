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
});

export async function createPortfolioProjectAction(data: z.infer<typeof portfolioProjectSchema>) {
  try {
    const parsed = portfolioProjectSchema.parse(data);
    const project = await prisma.portfolioProject.create({
      data: parsed
    });

    revalidatePath("/packages");
    revalidatePath("/admin/portfolio");
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
    const parsed = portfolioProjectSchema.parse(data);
    const project = await prisma.portfolioProject.update({
      where: { id },
      data: parsed
    });

    revalidatePath("/packages");
    revalidatePath("/admin/portfolio");
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

"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const prisma = new PrismaClient();

const travelPackageSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  destinationId: z.string().min(1, "Destination is required"),
  price: z.number().min(0, "Price must be a positive number"),
  duration: z.number().int().min(1, "Duration must be at least 1 day"),
  shortDescription: z.string().min(10, "Short description must be at least 10 characters"),
  fullDescription: z.string().min(10, "Full description must be at least 10 characters"),
  itinerary: z.string().optional().default("[]"),
  included: z.string().optional().default("[]"),
  excluded: z.string().optional().default("[]"),
  featuredImage: z.string().optional().nullable(),
  status: z.enum(["PUBLISHED", "DRAFT"]).default("DRAFT"),
});

export async function createPackageAction(data: z.input<typeof travelPackageSchema>) {
  try {
    const parsed = travelPackageSchema.parse(data);

    // Check if slug is unique
    const existing = await prisma.travelPackage.findUnique({
      where: { slug: parsed.slug }
    });

    if (existing) {
      return { success: false, error: "A package with this slug already exists" };
    }

    const pkg = await prisma.travelPackage.create({
      data: {
        title: parsed.title,
        slug: parsed.slug,
        destinationId: parsed.destinationId,
        price: parsed.price,
        duration: parsed.duration,
        shortDescription: parsed.shortDescription,
        fullDescription: parsed.fullDescription,
        itinerary: parsed.itinerary,
        included: parsed.included,
        excluded: parsed.excluded,
        featuredImage: parsed.featuredImage,
        status: parsed.status,
      }
    });

    revalidatePath("/destinations");
    revalidatePath("/admin/packages");
    return { success: true, travelPackage: pkg };
  } catch (error) {
    console.error("Create package error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Failed to create package" };
  }
}

export async function updatePackageAction(id: string, data: z.input<typeof travelPackageSchema>) {
  try {
    const parsed = travelPackageSchema.parse(data);

    // Check if slug is unique for other package
    const existing = await prisma.travelPackage.findFirst({
      where: { 
        slug: parsed.slug,
        NOT: { id }
      }
    });

    if (existing) {
      return { success: false, error: "A package with this slug already exists" };
    }

    const pkg = await prisma.travelPackage.update({
      where: { id },
      data: {
        title: parsed.title,
        slug: parsed.slug,
        destinationId: parsed.destinationId,
        price: parsed.price,
        duration: parsed.duration,
        shortDescription: parsed.shortDescription,
        fullDescription: parsed.fullDescription,
        itinerary: parsed.itinerary,
        included: parsed.included,
        excluded: parsed.excluded,
        featuredImage: parsed.featuredImage,
        status: parsed.status,
      }
    });

    revalidatePath(`/packages/${pkg.slug}`);
    revalidatePath("/destinations");
    revalidatePath("/admin/packages");
    return { success: true, travelPackage: pkg };
  } catch (error) {
    console.error("Update package error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Failed to update package" };
  }
}

export async function deletePackageAction(id: string) {
  try {
    await prisma.travelPackage.delete({
      where: { id }
    });

    revalidatePath("/destinations");
    revalidatePath("/admin/packages");
    return { success: true };
  } catch (error) {
    console.error("Delete package error:", error);
    return { success: false, error: "Failed to delete package" };
  }
}

export async function togglePackageStatusAction(id: string) {
  try {
    const pkg = await prisma.travelPackage.findUnique({
      where: { id }
    });
    if (!pkg) return { success: false, error: "Package not found" };

    const newStatus = pkg.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    await prisma.travelPackage.update({
      where: { id },
      data: { status: newStatus }
    });

    revalidatePath(`/packages/${pkg.slug}`);
    revalidatePath("/destinations");
    revalidatePath("/admin/packages");
    return { success: true, status: newStatus };
  } catch (error) {
    console.error("Toggle package status error:", error);
    return { success: false, error: "Failed to toggle status" };
  }
}

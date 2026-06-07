"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const prisma = new PrismaClient();

const destinationSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  country: z.string().min(2, "Country is required"),
  city: z.string().min(2, "City is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  featuredImage: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  status: z.enum(["PUBLISHED", "DRAFT"]).default("DRAFT"),
});

export async function createDestinationAction(data: z.infer<typeof destinationSchema>) {
  try {
    const parsed = destinationSchema.parse(data);
    
    // Check if slug is unique
    const existing = await prisma.destination.findUnique({
      where: { slug: parsed.slug }
    });
    
    if (existing) {
      return { success: false, error: "A destination with this slug already exists" };
    }

    const dest = await prisma.destination.create({
      data: {
        title: parsed.title,
        slug: parsed.slug,
        country: parsed.country,
        city: parsed.city,
        description: parsed.description,
        featuredImage: parsed.featuredImage,
        category: parsed.category,
        status: parsed.status,
      }
    });

    revalidatePath("/");
    revalidatePath("/destinations");
    revalidatePath("/admin/destinations");
    return { success: true, destination: dest };
  } catch (error) {
    console.error("Create destination error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Failed to create destination" };
  }
}

export async function updateDestinationAction(id: string, data: z.infer<typeof destinationSchema>) {
  try {
    const parsed = destinationSchema.parse(data);
    
    // Check if slug is unique for other destination
    const existing = await prisma.destination.findFirst({
      where: { 
        slug: parsed.slug,
        NOT: { id }
      }
    });
    
    if (existing) {
      return { success: false, error: "A destination with this slug already exists" };
    }

    const dest = await prisma.destination.update({
      where: { id },
      data: {
        title: parsed.title,
        slug: parsed.slug,
        country: parsed.country,
        city: parsed.city,
        description: parsed.description,
        featuredImage: parsed.featuredImage,
        category: parsed.category,
        status: parsed.status,
      }
    });

    revalidatePath("/");
    revalidatePath("/destinations");
    revalidatePath(`/destinations/${dest.slug}`);
    revalidatePath("/admin/destinations");
    return { success: true, destination: dest };
  } catch (error) {
    console.error("Update destination error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Failed to update destination" };
  }
}

export async function deleteDestinationAction(id: string) {
  try {
    // Delete related packages first or rely on cascade
    // Check if there are packages
    const packagesCount = await prisma.travelPackage.count({
      where: { destinationId: id }
    });

    if (packagesCount > 0) {
      return { success: false, error: "Cannot delete destination that has travel packages" };
    }

    await prisma.destination.delete({
      where: { id }
    });

    revalidatePath("/");
    revalidatePath("/destinations");
    revalidatePath("/admin/destinations");
    return { success: true };
  } catch (error) {
    console.error("Delete destination error:", error);
    return { success: false, error: "Failed to delete destination" };
  }
}

export async function toggleDestinationStatusAction(id: string) {
  try {
    const dest = await prisma.destination.findUnique({
      where: { id }
    });
    if (!dest) return { success: false, error: "Destination not found" };

    const newStatus = dest.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    await prisma.destination.update({
      where: { id },
      data: { status: newStatus }
    });

    revalidatePath("/");
    revalidatePath("/destinations");
    revalidatePath(`/destinations/${dest.slug}`);
    revalidatePath("/admin/destinations");
    return { success: true, status: newStatus };
  } catch (error) {
    console.error("Toggle destination status error:", error);
    return { success: false, error: "Failed to toggle status" };
  }
}

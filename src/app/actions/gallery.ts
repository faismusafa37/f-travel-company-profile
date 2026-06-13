"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import prisma from "@/lib/prisma";

const galleryImageSchema = z.object({
  url: z.string().min(1, "Image URL is required"),
  alt: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  destinationId: z.string().optional().nullable(),
  travelPackageId: z.string().optional().nullable(),
});

export async function addGalleryImageAction(data: z.infer<typeof galleryImageSchema>) {
  try {
    const parsed = galleryImageSchema.parse(data);
    const img = await prisma.galleryImage.create({
      data: {
        url: parsed.url,
        alt: parsed.alt,
        category: parsed.category,
        destinationId: parsed.destinationId || null,
        travelPackageId: parsed.travelPackageId || null,
      }
    });

    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
    return { success: true, image: img };
  } catch (error) {
    console.error("Add gallery image error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Failed to add gallery image" };
  }
}

export async function deleteGalleryImageAction(id: string) {
  try {
    await prisma.galleryImage.delete({
      where: { id }
    });

    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
    return { success: true };
  } catch (error) {
    console.error("Delete gallery image error:", error);
    return { success: false, error: "Failed to delete gallery image" };
  }
}


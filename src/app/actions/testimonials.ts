"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import prisma from "@/lib/prisma";

const testimonialSchema = z.object({
  clientName: z.string().min(2, "Name must be at least 2 characters"),
  clientRole: z.string().min(2, "Role is required"),
  clientImage: z.string().optional().nullable(),
  company: z.string().min(2, "Company is required"),
  trip: z.string().min(2, "Trip details are required"),
  content: z.string().min(5, "Content is required"),
  rating: z.number().int().min(1).max(5).default(5),
  status: z.enum(["PUBLISHED", "DRAFT"]).default("PUBLISHED"),
});

export async function createTestimonialAction(data: z.infer<typeof testimonialSchema>) {
  try {
    const parsed = testimonialSchema.parse(data);
    const testimonial = await prisma.testimonial.create({
      data: parsed
    });

    revalidatePath("/");
    revalidatePath("/admin/testimonials");
    return { success: true, testimonial };
  } catch (error) {
    console.error("Create testimonial error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Failed to create testimonial" };
  }
}

export async function updateTestimonialAction(id: string, data: z.infer<typeof testimonialSchema>) {
  try {
    const parsed = testimonialSchema.parse(data);
    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: parsed
    });

    revalidatePath("/");
    revalidatePath("/admin/testimonials");
    return { success: true, testimonial };
  } catch (error) {
    console.error("Update testimonial error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Failed to update testimonial" };
  }
}

export async function deleteTestimonialAction(id: string) {
  try {
    await prisma.testimonial.delete({
      where: { id }
    });

    revalidatePath("/");
    revalidatePath("/admin/testimonials");
    return { success: true };
  } catch (error) {
    console.error("Delete testimonial error:", error);
    return { success: false, error: "Failed to delete testimonial" };
  }
}

export async function toggleTestimonialStatusAction(id: string) {
  try {
    const testimonial = await prisma.testimonial.findUnique({
      where: { id }
    });
    if (!testimonial) return { success: false, error: "Testimonial not found" };

    const newStatus = testimonial.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    await prisma.testimonial.update({
      where: { id },
      data: { status: newStatus }
    });

    revalidatePath("/");
    revalidatePath("/admin/testimonials");
    return { success: true, status: newStatus };
  } catch (error) {
    console.error("Toggle testimonial status error:", error);
    return { success: false, error: "Failed to toggle status" };
  }
}


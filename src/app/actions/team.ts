"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import prisma from "@/lib/prisma";

const teamMemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().min(2, "Role is required"),
  quote: z.string().min(5, "Quote is required"),
  image: z.string().min(1, "Image is required"),
  order: z.number().int().default(0),
  status: z.enum(["PUBLISHED", "DRAFT"]).default("PUBLISHED"),
});

export async function createTeamMemberAction(data: z.infer<typeof teamMemberSchema>) {
  try {
    const parsed = teamMemberSchema.parse(data);
    const member = await prisma.teamMember.create({
      data: parsed
    });

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/admin/team");
    return { success: true, member };
  } catch (error) {
    console.error("Create team member error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Failed to create team member" };
  }
}

export async function updateTeamMemberAction(id: string, data: z.infer<typeof teamMemberSchema>) {
  try {
    const parsed = teamMemberSchema.parse(data);
    const member = await prisma.teamMember.update({
      where: { id },
      data: parsed
    });

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/admin/team");
    return { success: true, member };
  } catch (error) {
    console.error("Update team member error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Failed to update team member" };
  }
}

export async function deleteTeamMemberAction(id: string) {
  try {
    await prisma.teamMember.delete({
      where: { id }
    });

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/admin/team");
    return { success: true };
  } catch (error) {
    console.error("Delete team member error:", error);
    return { success: false, error: "Failed to delete team member" };
  }
}

export async function toggleTeamMemberStatusAction(id: string) {
  try {
    const member = await prisma.teamMember.findUnique({
      where: { id }
    });
    if (!member) return { success: false, error: "Team member not found" };

    const newStatus = member.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    await prisma.teamMember.update({
      where: { id },
      data: { status: newStatus }
    });

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/admin/team");
    return { success: true, status: newStatus };
  } catch (error) {
    console.error("Toggle team member status error:", error);
    return { success: false, error: "Failed to toggle status" };
  }
}


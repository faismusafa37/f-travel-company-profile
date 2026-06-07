"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const prisma = new PrismaClient();

const clientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  logoUrl: z.string().optional().nullable(),
  logoText: z.string().optional().nullable(),
  bgColor: z.string().optional().nullable(),
  textColor: z.string().optional().nullable(),
  order: z.number().int().default(0),
  status: z.enum(["PUBLISHED", "DRAFT"]).default("PUBLISHED"),
});

export async function createClientAction(data: z.infer<typeof clientSchema>) {
  try {
    const parsed = clientSchema.parse(data);
    const client = await prisma.client.create({
      data: parsed
    });

    revalidatePath("/");
    revalidatePath("/admin/clients");
    return { success: true, client };
  } catch (error) {
    console.error("Create client error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Failed to create client" };
  }
}

export async function updateClientAction(id: string, data: z.infer<typeof clientSchema>) {
  try {
    const parsed = clientSchema.parse(data);
    const client = await prisma.client.update({
      where: { id },
      data: parsed
    });

    revalidatePath("/");
    revalidatePath("/admin/clients");
    return { success: true, client };
  } catch (error) {
    console.error("Update client error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Failed to update client" };
  }
}

export async function deleteClientAction(id: string) {
  try {
    await prisma.client.delete({
      where: { id }
    });

    revalidatePath("/");
    revalidatePath("/admin/clients");
    return { success: true };
  } catch (error) {
    console.error("Delete client error:", error);
    return { success: false, error: "Failed to delete client" };
  }
}

export async function toggleClientStatusAction(id: string) {
  try {
    const client = await prisma.client.findUnique({
      where: { id }
    });
    if (!client) return { success: false, error: "Client not found" };

    const newStatus = client.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    await prisma.client.update({
      where: { id },
      data: { status: newStatus }
    });

    revalidatePath("/");
    revalidatePath("/admin/clients");
    return { success: true, status: newStatus };
  } catch (error) {
    console.error("Toggle client status error:", error);
    return { success: false, error: "Failed to toggle status" };
  }
}

"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";

export async function getSettingsAction(): Promise<Record<string, string>> {
  try {
    const settings = await prisma.siteSetting.findMany();
    return settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return {};
  }
}

export async function saveSettingsAction(settings: Record<string, string>) {
  try {
    const upserts = Object.entries(settings).map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        update: { value: value || "" },
        create: { key, value: value || "" },
      })
    );
    await prisma.$transaction(upserts);
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/contact");
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error) {
    console.error("Failed to save settings:", error);
    return { success: false, error: "Failed to save settings" };
  }
}


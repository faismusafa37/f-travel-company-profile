import { SettingsForm } from "./settings-form";

import prisma from "@/lib/prisma";

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSetting.findMany();
  
  // Convert array to object for easier consumption
  const settingsMap = settings.reduce((acc, setting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {} as Record<string, string>);

  return <SettingsForm settingsMap={settingsMap} />;
}


import { NewPackageForm } from "./new-form";

import prisma from "@/lib/prisma";

export default async function NewPackagePage() {
  const destinations = await prisma.destination.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { title: "asc" }
  });

  return <NewPackageForm destinations={destinations} />;
}


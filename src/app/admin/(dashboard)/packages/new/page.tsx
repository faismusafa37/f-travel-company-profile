import { PrismaClient } from "@prisma/client";
import { NewPackageForm } from "./new-form";

const prisma = new PrismaClient();

export default async function NewPackagePage() {
  const destinations = await prisma.destination.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { title: "asc" }
  });

  return <NewPackageForm destinations={destinations} />;
}

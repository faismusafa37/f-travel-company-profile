import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { EditPackageForm } from "./edit-form";

const prisma = new PrismaClient();

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPackagePage({ params }: PageProps) {
  const resolvedParams = await params;
  const pkg = await prisma.travelPackage.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!pkg) {
    notFound();
  }

  const destinations = await prisma.destination.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { title: "asc" }
  });

  // Convert Prisma Decimal to plain Number to avoid Client Component serialization errors
  const serializedPkg = {
    ...pkg,
    price: Number(pkg.price),
  };

  return <EditPackageForm travelPackage={serializedPkg} destinations={destinations} />;
}

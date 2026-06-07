import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { EditDestinationForm } from "./edit-form";

const prisma = new PrismaClient();

export default async function EditDestinationPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const dest = await prisma.destination.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!dest) {
    notFound();
  }

  return <EditDestinationForm destination={dest} />;
}

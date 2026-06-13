
import { notFound } from "next/navigation";
import { EditDestinationForm } from "./edit-form";

import prisma from "@/lib/prisma";

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

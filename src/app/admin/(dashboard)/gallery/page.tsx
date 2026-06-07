import { PrismaClient } from "@prisma/client";
import { GalleryDashboard } from "./gallery-dashboard";

const prisma = new PrismaClient();

export default async function AdminGalleryPage() {
  const images = await prisma.galleryImage.findMany({
    orderBy: { createdAt: "desc" }
  });

  const destinations = await prisma.destination.findMany({
    where: { status: "PUBLISHED" },
    select: { id: true, title: true },
    orderBy: { title: "asc" }
  });

  const packages = await prisma.travelPackage.findMany({
    where: { status: "PUBLISHED" },
    select: { id: true, title: true },
    orderBy: { title: "asc" }
  });

  return (
    <GalleryDashboard 
      initialImages={images} 
      destinations={destinations} 
      packages={packages} 
    />
  );
}

import { PrismaClient } from "@prisma/client";
import { GalleryClient } from "./gallery-client";

const prisma = new PrismaClient();

export const metadata = {
  title: "Gallery | F-Travel",
  description: "Browse beautiful moments captured from our travels.",
};

import { getDictionary } from "@/i18n/get-dictionary";
import { Locale } from "@/i18n/i18n-config";

export default async function GalleryPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  const galleryImages = await prisma.galleryImage.findMany({
    orderBy: { createdAt: "desc" }
  });

  const portfolioImages = await prisma.portfolioImage.findMany({
    include: { portfolioProject: true },
    orderBy: { createdAt: "desc" }
  });

  // Normalize and combine
  const combinedImages = [
    ...galleryImages.map(img => ({
      id: img.id,
      url: img.url,
      alt: img.alt,
      category: img.category,
      createdAt: img.createdAt
    })),
    ...portfolioImages.map(img => ({
      id: img.id,
      url: img.url,
      alt: img.caption || `${img.portfolioProject.client} - ${img.portfolioProject.activity}`,
      category: "Portfolio", // or img.portfolioProject.category
      createdAt: img.createdAt
    }))
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return <GalleryClient images={combinedImages} dict={dict} />;
}

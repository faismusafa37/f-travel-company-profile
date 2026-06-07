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

  const images = await prisma.galleryImage.findMany({
    orderBy: { createdAt: "desc" }
  });

  return <GalleryClient images={images} dict={dict} />;
}

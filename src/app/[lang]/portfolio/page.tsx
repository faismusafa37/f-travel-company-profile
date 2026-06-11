import { PrismaClient } from "@prisma/client";
import { PortfolioClient } from "./portfolio-client";

const prisma = new PrismaClient();

export const metadata = {
  title: "Corporate Outing Portfolio | F-Travel Organizer",
  description: "Browse our premium portfolio of over 150+ corporate outings, team building workshops, meetings, and gatherings organized across Indonesia and globally.",
};

import { getDictionary } from "@/i18n/get-dictionary";
import { Locale } from "@/i18n/i18n-config";

export default async function PortfolioPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  const projects = await prisma.portfolioProject.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { year: "desc" },
    include: { images: true }
  });

  return <PortfolioClient initialProjects={projects} dict={dict} />;
}

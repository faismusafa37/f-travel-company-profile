import { PrismaClient } from "@prisma/client";
import { PortfolioDashboard } from "./portfolio-dashboard";

const prisma = new PrismaClient();

export default async function AdminPortfolioPage() {
  const projects = await prisma.portfolioProject.findMany({
    orderBy: { createdAt: "desc" },
    include: { images: true }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Manage Corporate Outings Portfolio</h2>
      </div>

      <PortfolioDashboard initialProjects={projects} />
    </div>
  );
}

import { PortfolioDashboard } from "./portfolio-dashboard";

import prisma from "@/lib/prisma";

export default async function AdminPortfolioPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Manage Corporate Outings Portfolio</h2>
      </div>

      <PortfolioDashboard />
    </div>
  );
}


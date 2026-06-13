import { TeamDashboard } from "./team-dashboard";

import prisma from "@/lib/prisma";

export default async function AdminTeamPage() {
  const members = await prisma.teamMember.findMany({
    orderBy: { order: "asc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Manage Team Members</h2>
      </div>

      <TeamDashboard initialTeam={members} />
    </div>
  );
}


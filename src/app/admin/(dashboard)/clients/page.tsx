import { PrismaClient } from "@prisma/client";
import { ClientsDashboard } from "./clients-dashboard";

const prisma = new PrismaClient();

export default async function AdminClientsPage() {
  const clients = await prisma.client.findMany({
    orderBy: { order: "asc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Manage Enterprise Clients</h2>
      </div>

      <ClientsDashboard initialClients={clients} />
    </div>
  );
}

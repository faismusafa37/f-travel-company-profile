import { PrismaClient } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";
import { DestinationsTable } from "./destinations-table";

const prisma = new PrismaClient();

export default async function AdminDestinationsPage() {
  const destinations = await prisma.destination.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Manage Destinations</h2>
        <Link href="/admin/destinations/new">
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Plus className="w-4 h-4 mr-2" />
            Add Destination
          </Button>
        </Link>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <DestinationsTable initialDestinations={destinations} />
        </CardContent>
      </Card>
    </div>
  );
}

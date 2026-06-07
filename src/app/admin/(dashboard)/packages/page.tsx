import { PrismaClient } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";
import { PackagesTable } from "./packages-table";

const prisma = new PrismaClient();

export default async function AdminPackagesPage() {
  const dbPackages = await prisma.travelPackage.findMany({
    include: { destination: true },
    orderBy: { createdAt: "desc" }
  });

  const packages = dbPackages.map(pkg => ({
    ...pkg,
    price: Number(pkg.price)
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Manage Travel Packages</h2>
        <Link href="/admin/packages/new">
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Plus className="w-4 h-4 mr-2" />
            Add Package
          </Button>
        </Link>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <PackagesTable initialPackages={packages} />
        </CardContent>
      </Card>
    </div>
  );
}

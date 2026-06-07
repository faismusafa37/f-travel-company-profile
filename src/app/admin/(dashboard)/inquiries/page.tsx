import { PrismaClient } from "@prisma/client";
import { InquiriesList } from "./inquiries-list";

const prisma = new PrismaClient();

export default async function AdminInquiriesPage() {
  const inquiries = await prisma.contactInquiry.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Contact Inquiries</h2>
      </div>

      <InquiriesList initialInquiries={inquiries} />
    </div>
  );
}

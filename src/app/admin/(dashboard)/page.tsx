import { PrismaClient } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map, Briefcase, FileText, MessageSquare, Settings } from "lucide-react";

const prisma = new PrismaClient();

export default async function AdminDashboardPage() {
  const [destinationsCount, packagesCount, blogCount, inquiriesCount] = await Promise.all([
    prisma.destination.count(),
    prisma.travelPackage.count(),
    prisma.blogPost.count(),
    prisma.contactInquiry.count(),
  ]);

  const stats = [
    { name: "Total Destinations", value: destinationsCount, icon: Map, color: "text-blue-500", bg: "bg-blue-100" },
    { name: "Total Packages", value: packagesCount, icon: Briefcase, color: "text-orange-500", bg: "bg-orange-100" },
    { name: "Blog Posts", value: blogCount, icon: FileText, color: "text-green-500", bg: "bg-green-100" },
    { name: "New Inquiries", value: inquiriesCount, icon: MessageSquare, color: "text-purple-500", bg: "bg-purple-100" },
  ];

  const recentInquiries = await prisma.contactInquiry.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name} className="border-0 shadow-sm">
              <CardContent className="p-6 flex items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${stat.bg} ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.name}</p>
                  <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Recent Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            {recentInquiries.length === 0 ? (
              <p className="text-slate-500 text-sm">No recent inquiries found.</p>
            ) : (
              <div className="space-y-4">
                {recentInquiries.map((inq) => (
                  <div key={inq.id} className="flex flex-col border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-slate-900">{inq.name}</h4>
                      <span className="text-xs text-slate-400">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 truncate mb-1">{inq.email}</p>
                    <p className="text-sm text-slate-600 line-clamp-2">{inq.message}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <a href="/admin/packages/new" className="flex items-center p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                <Briefcase className="w-5 h-5 text-orange-500 mr-3" />
                <span className="text-sm font-medium">Add Package</span>
              </a>
              <a href="/admin/destinations/new" className="flex items-center p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                <Map className="w-5 h-5 text-blue-500 mr-3" />
                <span className="text-sm font-medium">Add Destination</span>
              </a>
              <a href="/admin/blog/new" className="flex items-center p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                <FileText className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-sm font-medium">Write Post</span>
              </a>
              <a href="/admin/settings" className="flex items-center p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                <Settings className="w-5 h-5 text-slate-500 mr-3" />
                <span className="text-sm font-medium">Site Settings</span>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

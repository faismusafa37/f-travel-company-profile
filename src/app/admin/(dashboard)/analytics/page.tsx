import { PrismaClient } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Eye, Calendar, Clock } from "lucide-react";
import { MostVisitedChart } from "@/components/admin/most-visited-chart";

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const now = new Date();
  
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thisWeek = new Date(now);
  thisWeek.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
  thisWeek.setHours(0, 0, 0, 0);
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Fetch metrics
  const totalVisits = await prisma.websiteVisit.count();
  
  // Use distinct session IDs for unique visitors
  const totalVisitorsRaw = await prisma.websiteVisit.findMany({
    distinct: ['sessionId'],
    select: { sessionId: true }
  });
  const totalVisitors = totalVisitorsRaw.length;

  const todayVisitorsRaw = await prisma.websiteVisit.findMany({
    where: { createdAt: { gte: today } },
    distinct: ['sessionId'],
    select: { sessionId: true }
  });
  const todayVisitors = todayVisitorsRaw.length;

  const weekVisitorsRaw = await prisma.websiteVisit.findMany({
    where: { createdAt: { gte: thisWeek } },
    distinct: ['sessionId'],
    select: { sessionId: true }
  });
  const weekVisitors = weekVisitorsRaw.length;

  const monthVisitorsRaw = await prisma.websiteVisit.findMany({
    where: { createdAt: { gte: thisMonth } },
    distinct: ['sessionId'],
    select: { sessionId: true }
  });
  const monthVisitors = monthVisitorsRaw.length;

  // Most visited pages
  const topPagesRaw = await prisma.websiteVisit.groupBy({
    by: ['path'],
    _count: {
      path: true,
    },
    orderBy: {
      _count: {
        path: 'desc',
      },
    },
    take: 10,
  });

  // Recent visits
  const recentVisits = await prisma.websiteVisit.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVisitors}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVisits}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Visitors</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayVisitors}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week's</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weekVisitors}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month's</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthVisitors}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Most Visited Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <MostVisitedChart data={topPagesRaw as any} />
          </CardContent>
        </Card>

        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Path</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentVisits.map((visit) => (
                  <TableRow key={visit.id}>
                    <TableCell className="font-medium truncate max-w-[150px]">{visit.path}</TableCell>
                    <TableCell>{visit.country}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {visit.createdAt.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
                {recentVisits.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">No data available yet</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

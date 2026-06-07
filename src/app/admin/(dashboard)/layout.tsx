import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MapPin, LayoutDashboard, Map, Briefcase, FileText, Image as ImageIcon, MessageSquare, Settings, LogOut, Building2, Users, Star, FolderOpen, LineChart } from "lucide-react";
import LogoutButton from "./logout-button";
import { AdminMobileNav } from "@/components/layout/admin-mobile-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Analytics', href: '/admin/analytics', icon: LineChart },
    { name: 'Destinations', href: '/admin/destinations', icon: Map },
    { name: 'Packages', href: '/admin/packages', icon: Briefcase },
    { name: 'Outing Portfolio', href: '/admin/portfolio', icon: FolderOpen },
    { name: 'Blog', href: '/admin/blog', icon: FileText },
    { name: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
    { name: 'Clients Logos', href: '/admin/clients', icon: Building2 },
    { name: 'Team Members', href: '/admin/team', icon: Users },
    { name: 'Testimonials', href: '/admin/testimonials', icon: Star },
    { name: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex fixed h-full z-20">
        <div className="h-20 flex items-center px-6 bg-slate-950">
          <Link href="/admin" className="flex items-center w-full">
            <img src="/logo-footer.png" alt="F Travel Logo" className="w-48 h-auto object-contain" />
          </Link>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-3 py-2.5 text-sm font-medium rounded-md hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <Icon className="w-5 h-5 mr-3 text-slate-400" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <p className="text-white font-medium truncate max-w-[140px]">{session.user?.name}</p>
              <p className="text-xs text-slate-500 truncate max-w-[140px]">{session.user?.email}</p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen w-full overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center px-4 md:px-6 sticky top-0 z-10">
          <AdminMobileNav 
            userName={session.user?.name}
            userEmail={session.user?.email}
            logoutButton={<LogoutButton />}
          />
          <h1 className="text-lg font-semibold text-slate-900">Admin Dashboard</h1>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

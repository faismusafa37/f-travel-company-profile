"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Menu, X, LayoutDashboard, Map, Briefcase, FileText, Image as ImageIcon, MessageSquare, Settings, Building2, Users, Star, FolderOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AdminMobileNavProps {
  userName?: string | null;
  userEmail?: string | null;
  logoutButton: React.ReactNode;
}

export function AdminMobileNav({ userName, userEmail, logoutButton }: AdminMobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
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
    <>
      {/* Mobile Header Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="mr-2 p-2 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 md:hidden transition-colors"
        aria-label="Open sidebar"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />

            {/* Sidebar drawer content */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 left-0 w-64 bg-slate-900 text-slate-300 flex flex-col z-50 md:hidden shadow-xl"
            >
              <div className="h-16 flex items-center justify-between px-6 bg-slate-950">
                <Link 
                  href="/admin" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center text-white font-bold text-lg"
                >
                  <MapPin className="w-5 h-5 text-orange-500 mr-2" />
                  F Travel CMS
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  aria-label="Close sidebar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-4 flex-1 overflow-y-auto">
                <div className="space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                          isActive 
                            ? "bg-slate-800 text-white" 
                            : "hover:bg-slate-800 hover:text-white"
                        }`}
                      >
                        <Icon className={`w-5 h-5 mr-3 ${isActive ? "text-orange-500" : "text-slate-400"}`} />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 bg-slate-950 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="text-sm min-w-0 flex-1 mr-2">
                    <p className="text-white font-medium truncate">{userName}</p>
                    <p className="text-xs text-slate-500 truncate">{userEmail}</p>
                  </div>
                  <div onClick={() => setIsOpen(false)}>
                    {logoutButton}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

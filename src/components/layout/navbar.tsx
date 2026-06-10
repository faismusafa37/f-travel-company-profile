"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { LanguageSwitcher } from "./language-switcher";

export function Navbar({ lang = "id", dict }: { lang?: "id" | "en", dict?: any }) {
  const d = dict || {
    home: "Home", about: "About Us", portfolio: "Portofolio", gallery: "Gallery", blog: "Blog", contact: "Contact Us", dashboard: "Dashboard", login: "Login", logout: "Logout"
  };
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const navLinks = [
    { href: `/${lang}`, label: d.home },
    { href: `/${lang}/about`, label: d.about },
    { href: `/${lang}/portfolio`, label: d.portfolio },
    { href: `/${lang}/gallery`, label: d.gallery },
    { href: `/${lang}/blog`, label: d.blog },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-20 items-center justify-between">
        <div className="flex gap-6 md:gap-10">
          <Link href={`/${lang}`} className="flex items-center space-x-2">
            <img src="/logo.png" alt="F Travel Logo" className="h-14 w-auto" />
          </Link>
          <nav className="hidden md:flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center text-base font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Desktop Contact Us & Login buttons */}
        <div className="hidden md:flex items-center justify-end space-x-3">
          <LanguageSwitcher currentLang={lang} />
          <Link href={`/${lang}/contact`}>
            <Button variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50 hover:text-orange-700">
              {d.contact}
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center space-x-2">
          <LanguageSwitcher currentLang={lang} />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-slate-100 transition-colors"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden border-b bg-background overflow-hidden"
          >
            <div className="px-4 sm:px-6 py-4 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-lg font-medium text-muted-foreground hover:text-primary py-2 transition-colors border-b border-slate-50 last:border-0"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 flex flex-col gap-2">
                <Link href={`/${lang}/contact`} onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full border-orange-500 text-orange-600 hover:bg-orange-50">
                    Contact Us
                  </Button>
                </Link>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}


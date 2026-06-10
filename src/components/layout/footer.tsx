"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Phone, MapPin, Send, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer({ settings = {}, lang = "id", dict }: { settings?: Record<string, string>, lang?: "id" | "en", dict?: any }) {
  const d = dict || {
    quickLinks: "Quick Links", getInTouch: "Get In Touch", newsletter: "Newsletter", newsletterDesc: "Subscribe to get special packages, destination updates, and travel guides.", emailPlaceholder: "Your email address"
  };
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="relative bg-slate-950 text-slate-200 border-t border-slate-900 overflow-hidden">
      {/* Subtle Coordinate Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Decorative gradient blur */}
      <div className="absolute -left-48 -bottom-48 w-96 h-96 bg-orange-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute right-0 top-0 w-80 h-80 bg-blue-600/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Column 1: Brand & Tagline */}
          <div className="flex flex-col space-y-6">
            <Link href="/" className="flex items-center space-x-2.5">
              <img src="/logo-footer.png" alt="F Travel Logo" className="h-24 md:h-28 w-auto drop-shadow-md" />
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              #FindYourExperience
            </p>

            {/* Coordinates Badge */}
            <div className="inline-flex items-center gap-2 bg-slate-900/80 border border-slate-800/60 rounded-full px-4 py-1.5 w-fit">
              <MapPin className="w-3.5 h-3.5 text-orange-500" />
              <span className="text-[11px] font-mono text-slate-400">
                HQ: Yogyakarta, ID &bull; -7.797615833416885, 110.38667798466993
              </span>
            </div>
          </div>

          {/* Column 2: Navigation / Quick Links */}
          <div className="flex flex-col space-y-6">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {d.quickLinks}
            </h4>
            <ul className="space-y-3.5 text-slate-400 text-sm">
              <li>
                <Link href={`/${lang}`} className="hover:text-orange-500 transition-colors flex items-center gap-1">
                  Home
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/about`} className="hover:text-orange-500 transition-colors flex items-center gap-1">
                  About Us
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/packages`} className="hover:text-orange-500 transition-colors flex items-center gap-1">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/gallery`} className="hover:text-orange-500 transition-colors flex items-center gap-1">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/blog`} className="hover:text-orange-500 transition-colors flex items-center gap-1">
                  Blog
                </Link>
              </li>
              <li>
                <a href="https://wa.me/628561106196?text=Halo,%20saya%20ingin%20menggunakan%20layanan%20F-Travel" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors flex items-center gap-1">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div className="flex flex-col space-y-6">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {d.getInTouch}
            </h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <span>{settings.address || "No.1 A, Jl. Cantel Baru, Semaki, Kec. Umbulharjo, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55166"}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-orange-500 shrink-0" />
                <a href={`mailto:${settings.contact_email || "hello@f-travel.com"}`} className="hover:text-orange-500 transition-colors">
                  {settings.contact_email || "hello@ftravel.com"}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-orange-500 shrink-0" />
                <a href={`tel:${settings.phone?.replace(/[^+\d]/g, "") || "628561106196"}`} className="hover:text-orange-500 transition-colors">
                  {settings.phone || "+62 8561106196"}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="flex flex-col space-y-6">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {d.newsletter}
            </h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              {d.newsletterDesc}
            </p>

            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-2 relative max-w-md">
              <input
                type="email"
                placeholder={d.emailPlaceholder}
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-slate-200 text-sm placeholder-slate-500 focus:outline-none focus:border-orange-500/80 focus:ring-1 focus:ring-orange-500/50 transition-all"
              />
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white rounded-2xl px-5 py-3 h-auto sm:absolute sm:right-1.5 sm:top-1.5 sm:py-1.5 sm:px-3">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Socials */}
        <div className="mt-16 pt-8 border-t border-slate-900/60 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-slate-500 order-2 md:order-1 text-center md:text-left">
            &copy; {new Date().getFullYear()} F-Travel. All rights reserved. Managed with excellence.
          </p>

          {/* Social Icons */}
          <div className="flex items-center space-x-3.5 order-1 md:order-2">
            <a href={settings.instagram || "#"} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-slate-900/80 border border-slate-800/80 hover:border-orange-500/40 hover:bg-orange-500/10 flex items-center justify-center text-slate-400 hover:text-orange-500 transition-all duration-300">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href={settings.youtube || "#"} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-slate-900/80 border border-slate-800/80 hover:border-orange-500/40 hover:bg-orange-500/10 flex items-center justify-center text-slate-400 hover:text-orange-500 transition-all duration-300">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.53 3.5 12 3.5 12 3.5s-7.53 0-9.388.556a3.003 3.003 0 0 0-2.11 2.107C0 8.017 0 12 0 12s0 3.983.502 5.837a3.003 3.003 0 0 0 2.11 2.107C4.47 20.5 12 20.5 12 20.5s7.53 0 9.388-.556a3.003 3.003 0 0 0 2.11-2.107C24 15.983 24 12 24 12s0-3.983-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}

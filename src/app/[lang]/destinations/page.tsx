import { PrismaClient } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import Link from "next/link";

const prisma = new PrismaClient();

export const metadata = {
  title: "Destinations | F-Travel",
  description: "Explore our wide range of breathtaking travel destinations.",
};

import { getDictionary } from "@/i18n/get-dictionary";
import { Locale } from "@/i18n/i18n-config";

export default async function DestinationsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  const destinations = await prisma.destination.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">{dict.destinations.hero.title}</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          {dict.destinations.hero.description}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {destinations.map((dest) => (
          <Link key={dest.id} href={`/destinations/${dest.slug}`} className="block">
            <div className="relative w-full aspect-[3/4.2] rounded-[2.2rem] overflow-hidden group cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.12)] transition-all duration-500">
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                style={{ backgroundImage: `url('${dest.featuredImage || 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=2070&auto=format&fit=crop'}')` }}
              />

              {/* Smooth dark vignette overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

              {/* Bottom Text Panel */}
              <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8 text-left">
                <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight transform group-hover:-translate-y-1.5 transition-transform duration-500">
                  {dest.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold tracking-wider text-slate-200/95 uppercase mt-2.5 transform group-hover:-translate-y-1 transition-transform duration-500">
                  <MapPin className="w-4 h-4 text-orange-500 fill-orange-500 shrink-0" />
                  <span>{dest.country}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

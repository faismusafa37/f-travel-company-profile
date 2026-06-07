import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const prisma = new PrismaClient();

import { getDictionary } from "@/i18n/get-dictionary";
import { Locale } from "@/i18n/i18n-config";

export default async function DestinationDetailPage({ params }: { params: Promise<{ slug: string, lang: string }> }) {
  const { slug, lang } = await params;
  const dict = await getDictionary(lang as Locale);

  const dest = await prisma.destination.findUnique({
    where: { slug },
    include: {
      packages: {
        where: { status: "PUBLISHED" },
      }
    },
  });

  if (!dest) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen pb-20">
      {/* Hero */}
      <div 
        className="h-[60vh] min-h-[400px] bg-cover bg-center relative"
        style={{ backgroundImage: `url('${dest.featuredImage || 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=2070&auto=format&fit=crop'}')` }}
      >
        <div className="absolute inset-0 bg-slate-900/50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full flex flex-col justify-end pb-16 text-center">
          <div className="flex items-center justify-center text-orange-400 mb-4 font-medium">
            <MapPin className="w-5 h-5 mr-2 shrink-0" />
            <span className="text-lg md:text-xl truncate">{dest.country}</span>
          </div>
          <h1 className="text-3xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
            {dest.title}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">{dict.destinations.detail.about} {dest.title}</h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            {dest.description}
          </p>
        </div>

        <div>
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">{dict.destinations.detail.availablePackages}</h2>
              <p className="text-slate-500 mt-2">{dict.destinations.detail.exploreText} {dest.title}.</p>
            </div>
          </div>

          {dest.packages.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-500">
              {dict.destinations.detail.noPackages}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {dest.packages.map((pkg) => (
                <Card key={pkg.id} className="overflow-hidden flex flex-col h-full border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div 
                    className="h-56 bg-cover bg-center relative"
                    style={{ backgroundImage: `url('${pkg.featuredImage || 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop'}')` }}
                  >
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-slate-900">
                      Rp {Number(pkg.price).toLocaleString("id-ID")}
                    </div>
                  </div>
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">{pkg.title}</h3>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-3">{pkg.shortDescription}</p>
                    
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center text-slate-500 text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        {pkg.duration} {dict.destinations.detail.days}
                      </div>
                      <Link href={`/${lang}/packages/${pkg.slug}`}>
                        <Button variant="ghost" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 p-0 h-auto font-medium">
                          {dict.destinations.detail.viewDetails}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

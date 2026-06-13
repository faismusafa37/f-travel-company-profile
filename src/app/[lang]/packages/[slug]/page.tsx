
import { MapPin, Calendar, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import Image from "next/image";

import prisma from "@/lib/prisma";

export default async function PackageDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pkg = await prisma.travelPackage.findUnique({
    where: { slug },
    include: { destination: true },
  });

  if (!pkg) {
    notFound();
  }

  const itinerary = pkg.itinerary ? JSON.parse(pkg.itinerary) : [];
  const included = pkg.included ? JSON.parse(pkg.included) : [];
  const excluded = pkg.excluded ? JSON.parse(pkg.excluded) : [];

  return (
    <div className="flex flex-col min-h-screen pb-20">
      {/* Hero */}
      <div 
        className="h-[50vh] min-h-[400px] bg-cover bg-center relative"
        style={{ backgroundImage: `url('${pkg.featuredImage || 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop'}')` }}
      >
        <div className="absolute inset-0 bg-slate-900/60" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full flex flex-col justify-end pb-12">
          <div className="inline-flex items-center text-orange-400 mb-4 font-medium bg-slate-950/50 px-3 py-1 rounded-full w-fit max-w-full">
            <MapPin className="w-4 h-4 mr-2 shrink-0" />
            <span className="truncate">{pkg.destination.title}, {pkg.destination.country}</span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            {pkg.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-slate-200">
            <div className="flex items-center text-lg">
              <Calendar className="w-5 h-5 mr-2 text-orange-400" />
              {pkg.duration} Days
            </div>
            <div className="text-2xl font-bold text-white">
              Rp {Number(pkg.price).toLocaleString("id-ID")}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Overview</h2>
              <div className="prose prose-slate max-w-none text-slate-600">
                <p>{pkg.fullDescription}</p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Itinerary</h2>
              <div className="space-y-6">
                {itinerary.map((item: any, index: number) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 text-orange-600 font-bold">
                        {item.day}
                      </div>
                      {index !== itinerary.length - 1 && (
                        <div className="w-px h-full bg-slate-200 my-2" />
                      )}
                    </div>
                    <div className="pb-8 pt-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                      <p className="text-slate-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sticky top-24">
              <div className="text-3xl font-bold text-slate-900 mb-2">
                Rp {Number(pkg.price).toLocaleString("id-ID")}
                <span className="text-base font-normal text-slate-500"> / person</span>
              </div>
              <p className="text-slate-600 mb-6">{pkg.shortDescription}</p>
              <a href={`https://wa.me/628561106196?text=Halo,%20saya%20tertarik%20dengan%20paket%20${encodeURIComponent(pkg.title)}`} target="_blank" rel="noopener noreferrer" className="block w-full mb-4">
                <Button size="lg" className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                  Book This Package
                </Button>
              </a>
              <a href={`https://wa.me/628561106196?text=Halo,%20saya%20ingin%20bertanya%20tentang%20paket%20${encodeURIComponent(pkg.title)}`} target="_blank" rel="noopener noreferrer" className="block w-full">
                <Button size="lg" variant="outline" className="w-full">
                  Ask a Question
                </Button>
              </a>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">What's Included</h3>
              <ul className="space-y-3">
                {included.map((item: string, i: number) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 shrink-0" />
                    <span className="text-slate-600">{item}</span>
                  </li>
                ))}
              </ul>

              <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">What's Excluded</h3>
              <ul className="space-y-3">
                {excluded.map((item: string, i: number) => (
                  <li key={i} className="flex items-start">
                    <XCircle className="w-5 h-5 text-red-400 mr-3 shrink-0" />
                    <span className="text-slate-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


import { notFound } from "next/navigation";
import { MapPin, Briefcase, Calendar, Image as ImageIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getDictionary } from "@/i18n/get-dictionary";
import { Locale } from "@/i18n/i18n-config";

import prisma from "@/lib/prisma";

export default async function PortfolioDetailPage({ params }: { params: Promise<{ lang: string, id: string }> }) {
  const { lang, id } = await params;
  const dict = await getDictionary(lang as Locale);

  const project = await prisma.portfolioProject.findUnique({
    where: { id },
    include: { images: { orderBy: { sortOrder: 'asc' } } }
  });

  if (!project || project.status !== "PUBLISHED") {
    notFound();
  }

  // Use the first image as featured, or a fallback
  const featuredImage = project.images.length > 0 
    ? project.images[0].url 
    : "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop";

  return (
    <div className="flex flex-col min-h-screen pb-20 bg-slate-50">
      {/* Hero Section */}
      <div 
        className="h-[50vh] min-h-[400px] bg-cover bg-center relative"
        style={{ backgroundImage: `url('${featuredImage}')` }}
      >
        <div className="absolute inset-0 bg-slate-900/60" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full flex flex-col justify-end pb-12">
          
          <Link href={`/${lang}/portfolio`} className="inline-flex items-center text-slate-300 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {dict?.portfolioDetail?.back || "Back to Portfolio"}
          </Link>
          
          <div className="inline-flex items-center text-orange-400 mb-4 font-medium bg-slate-950/50 px-3 py-1 rounded-full w-fit max-w-full">
            <MapPin className="w-4 h-4 mr-2 shrink-0" />
            <span className="truncate">{project.location}</span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            {project.client}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-slate-200">
            <div className="flex items-center text-lg">
              <Briefcase className="w-5 h-5 mr-2 text-orange-400" />
              {project.activity}
            </div>
            <div className="flex items-center text-lg">
              <Calendar className="w-5 h-5 mr-2 text-orange-400" />
              {project.year}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 gap-12">
          <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">{dict?.portfolioDetail?.overview || "Project Overview"}</h2>
            <div className="prose prose-slate max-w-none text-slate-600">
              <p className="text-lg leading-relaxed italic border-l-4 border-orange-500 pl-4 py-1 bg-slate-50/50">
                "{project.original}"
              </p>
            </div>
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-slate-500 font-medium">{dict?.portfolioDetail?.client || "Client"}</p>
                <p className="text-lg font-bold text-slate-900">{project.client}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">{dict?.portfolioDetail?.category || "Category"}</p>
                <p className="text-lg font-bold text-slate-900">{project.category}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">{dict?.portfolioDetail?.location || "Location"}</p>
                <p className="text-lg font-bold text-slate-900">{project.location}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">{dict?.portfolioDetail?.year || "Year"}</p>
                <p className="text-lg font-bold text-slate-900">{project.year}</p>
              </div>
            </div>
          </section>

          {/* Image Gallery */}
          {project.images.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-orange-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900">{dict?.portfolioDetail?.gallery || "Event Gallery"}</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {project.images.map((img) => (
                  <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-[4/3] bg-slate-100 border border-slate-200">
                    <img 
                      src={img.url} 
                      alt={img.caption || `${project.client} - ${project.activity}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <p className="text-white text-sm font-medium line-clamp-2">
                        {img.caption || `${project.client} - ${project.activity}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

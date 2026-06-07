import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, ArrowRight, Star } from "lucide-react";
import { PrismaClient } from "@prisma/client";
import { Hero } from "@/components/home/hero";
import { ClientsSlider } from "@/components/home/clients";
import { OurServices } from "@/components/home/services";
import { TestimonialsSlider } from "@/components/home/testimonials";
import { OurTeam } from "@/components/home/team";
import { ExperiencesSection } from "@/components/home/experiences";
import { FeaturedDestinationsSlider } from "@/components/home/featured-destinations";

import { getDictionary } from "@/i18n/get-dictionary";
import { Locale } from "@/i18n/i18n-config";

const prisma = new PrismaClient();

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  const [
    featuredDestinations,
    dbClients,
    dbTeam,
    dbTestimonials,
    dbSettings
  ] = await Promise.all([
    prisma.destination.findMany({
      where: { status: "PUBLISHED" },
      take: 8,
    }),
    prisma.client.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { order: "asc" }
    }),
    prisma.teamMember.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { order: "asc" }
    }),
    prisma.testimonial.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" }
    }),
    prisma.siteSetting.findMany()
  ]);

  const settingsMap = dbSettings.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {} as Record<string, string>);

  const heroStats = {
    customers: settingsMap['stat_customers'],
    experienceYears: settingsMap['stat_experience_years'],
    destinations: settingsMap['stat_destinations'],
    rating: settingsMap['stat_rating'],
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Video & Stats */}
      <Hero 
        title={settingsMap['hero_title']}
        subtitle={settingsMap['hero_subtitle']}
        video={settingsMap['hero_video']}
        stats={heroStats}
      />

      {/* Our Services Section */}
      <OurServices dict={dict} />

      {/* Experiences Section */}
      <ExperiencesSection dict={dict} />

      {/* Featured Destinations */}
      <FeaturedDestinationsSlider destinations={featuredDestinations} lang={lang} dict={dict} />

      {/* Our Clients Section */}
      <ClientsSlider clients={dbClients} dict={dict} />

      {/* Testimonials Section */}
      <TestimonialsSlider testimonials={dbTestimonials} dict={dict} />
      
      {/* Our Team Section */}
      <OurTeam members={dbTeam} dict={dict} />

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-500 text-white text-center py-24 md:py-32">
        
        {/* Coordinate Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none" />

        {/* Radial Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.15))] pointer-events-none" />

        {/* Topographic Contour Lines - Left Peak */}
        <svg className="absolute -left-24 -bottom-24 w-[500px] h-[500px] text-white/8 pointer-events-none" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
          <circle cx="20" cy="80" r="10" />
          <circle cx="20" cy="80" r="20" />
          <circle cx="20" cy="80" r="30" />
          <circle cx="20" cy="80" r="40" />
          <circle cx="20" cy="80" r="50" />
          <circle cx="20" cy="80" r="60" />
          <circle cx="20" cy="80" r="70" />
          <circle cx="20" cy="80" r="85" strokeDasharray="1,1" />
          <circle cx="20" cy="80" r="100" />
        </svg>

        {/* Topographic Contour Lines - Right Peak */}
        <svg className="absolute -right-24 -top-24 w-[500px] h-[500px] text-white/8 pointer-events-none" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
          <circle cx="80" cy="20" r="10" />
          <circle cx="80" cy="20" r="20" />
          <circle cx="80" cy="20" r="30" />
          <circle cx="80" cy="20" r="40" />
          <circle cx="80" cy="20" r="50" />
          <circle cx="80" cy="20" r="60" />
          <circle cx="80" cy="20" r="70" />
          <circle cx="80" cy="20" r="85" strokeDasharray="1,1" />
          <circle cx="80" cy="20" r="100" />
        </svg>

        {/* Compass Rose */}
        <svg className="absolute right-12 bottom-12 md:right-24 md:bottom-24 w-28 h-28 text-white/10 pointer-events-none" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
          <circle cx="50" cy="50" r="42" strokeDasharray="2,2" />
          <circle cx="50" cy="50" r="32" />
          <path d="M50,10 L54,46 L90,50 L54,54 L50,90 L46,54 L10,50 L46,46 Z" fill="currentColor" className="fill-white/5" />
          <text x="47.5" y="8" className="fill-white/30 font-extrabold text-[8px]">N</text>
        </svg>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight leading-tight">
              {dict.home.readyToStart}
            </h2>
            <p className="text-lg md:text-xl text-orange-50 mb-10 max-w-[540px] mx-auto leading-relaxed font-medium">
              {dict.home.contactUsToday}
            </p>
            
            <a href={`https://wa.me/628561106196?text=${encodeURIComponent("Halo, saya ingin menggunakan layanan F-Travel")}`} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-white text-orange-600 border-0 hover:bg-slate-100 px-8 py-6 rounded-2xl font-bold text-base shadow-[0_10px_25px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 transition-all duration-300 group">
                {dict.home.contactUsNow}
                <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
          </div>
        </div>
      </section>


    </div>
  );
}

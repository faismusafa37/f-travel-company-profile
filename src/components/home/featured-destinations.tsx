"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { Destination } from "@prisma/client";

export function FeaturedDestinationsSlider({ 
  destinations, 
  lang, 
  dict 
}: { 
  destinations: Destination[], 
  lang: string, 
  dict: any 
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4); // Default to desktop

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerView(4);
      } else if (window.innerWidth >= 640) {
        setItemsPerView(2);
      } else {
        setItemsPerView(1);
      }
    };
    
    // Initial check
    handleResize();
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(destinations.length / itemsPerView);

  // Ensure activeIndex is valid if resize changes totalPages
  useEffect(() => {
    if (activeIndex >= totalPages && totalPages > 0) {
      setActiveIndex(totalPages - 1);
    }
  }, [totalPages, activeIndex]);

  const goToPage = (pageIndex: number) => {
    setActiveIndex(pageIndex);
  };

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">{dict.home.featuredDestinations}</h2>
            <p className="text-slate-500 mt-2">{dict.home.featuredDestinationsDesc}</p>
          </div>
          <Link href={`/${lang}/destinations`} className="hidden sm:flex items-center text-orange-600 hover:text-orange-700 font-medium">
            {dict.home.viewAll} <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
        
        {/* Slider Container */}
        <div className="relative overflow-hidden w-full py-4 -mx-4 px-4">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {destinations.map((dest) => (
              <div 
                key={dest.id} 
                className="flex-shrink-0 px-4"
                style={{ width: `${100 / itemsPerView}%` }}
              >
                <Link href={`/${lang}/destinations/${dest.slug}`} className="block h-full">
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
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Dots */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2.5 mt-10">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === activeIndex 
                    ? "bg-slate-700 w-8" 
                    : "bg-slate-300 hover:bg-slate-400 w-2.5"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

"use client";

import { useState, useEffect } from "react";
import { CalendarDays, Compass, Users, Mountain, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface Service {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  iconColor: string;
  tag: string;
}

const servicesList: Service[] = [
  {
    title: "Event Planner",
    tag: "Corporate & Social",
    description:
      "Designing and managing various events from meetings, training, workshops, intimate dinners, and gala dinners to farewell parties, with a professional and memorable touch.",
    icon: <CalendarDays className="w-8 h-8" />,
    gradient: "from-blue-500 to-indigo-600",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    title: "Corporate Outing & Gathering",
    tag: "Bonding Trips",
    description:
      "Delivering exciting journeys across various destinations with activities that foster togetherness. Every moment is designed to be a valuable and unforgettable experience.",
    icon: <Compass className="w-8 h-8" />,
    gradient: "from-orange-500 to-red-600",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
  {
    title: "Team Building & Outbound",
    tag: "Team Synergy",
    description:
      "Building teamwork and collaboration through interactive programs tailored to your team's needs. Fun, meaningful, and designed to strengthen professional bonding.",
    icon: <Users className="w-8 h-8" />,
    gradient: "from-emerald-500 to-teal-600",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    title: "Fun Adventure Experience",
    tag: "Adrenaline Rush",
    description:
      "Providing adrenaline-packed and thrilling experiences through offroad adventures, rafting, ATV rides, trekking, and other challenging outdoor activities.",
    icon: <Mountain className="w-8 h-8" />,
    gradient: "from-purple-500 to-pink-600",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
];

export function OurServices({ dict }: { dict: any }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4); // Default to desktop

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerView(4);
      } else if (window.innerWidth >= 768) {
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

  // Merge the icons/gradients from servicesList with the translated content
  const translatedServices = servicesList.map((service, i) => ({
    ...service,
    title: dict.services.list[i].title,
    tag: dict.services.list[i].tag,
    description: dict.services.list[i].description,
  }));

  const totalPages = Math.ceil(translatedServices.length / itemsPerView);

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
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative background grid/elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center mb-16 md:mb-20">
          <span className="text-sm font-semibold tracking-wider text-orange-600 uppercase">
            {dict.services.subtitle}
          </span>
          <h2 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            {dict.services.title}
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            {dict.services.description}
          </p>
        </div>

        {/* Services Slider */}
        <div className="relative overflow-hidden w-full py-4 -mx-4 px-4">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {translatedServices.map((service) => (
              <div 
                key={service.title} 
                className="flex-shrink-0 px-4"
                style={{ width: `${100 / itemsPerView}%` }}
              >
                <div
                  className="group relative bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden"
                >
                  {/* Radial background glow on hover */}
                  <div
                    className={`absolute -right-16 -top-16 w-32 h-32 rounded-full bg-gradient-to-br ${service.gradient} opacity-[0.03] group-hover:scale-[2.5] group-hover:opacity-[0.08] transition-all duration-500 blur-xl`}
                  />

                  {/* Service Tag */}
                  <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-4 block">
                    {service.tag}
                  </span>

                  {/* Icon Container */}
                  <div className="mb-6 relative">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} bg-opacity-10 flex items-center justify-center text-white shadow-md transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      {service.icon}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-orange-600 transition-colors">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-grow">
                    {service.description}
                  </p>
                </div>
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

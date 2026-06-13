"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Occasion {
  title: string;
  description: string;
  image: string;
  tag: string;
}

const occasionsList: Occasion[] = [
  {
    title: "Corporate Outing",
    tag: "Corporate Travel",
    description: "Inspiring destinations and seamless planning to recharge your team, fostering creativity and fresh perspectives.",
    image: "/occasions/corporate-outing.jpg",
  },
  {
    title: "Family Gathering",
    tag: "Bonding & Leisure",
    description: "Heartwarming reunions and multigenerational activities, creating cherished memories and fun for the whole family.",
    image: "/occasions/team-building.jpeg",
  },
  {
    title: "Fun Team Building",
    tag: "Team Synergy",
    description: "Action-packed icebreakers, interactive games, and collaborative challenges designed to build trust and strengthen bonding.",
    image: "/occasions/gala-dinner.jpeg",
  },
  {
    title: "Gala Event & Dinner",
    tag: "Milestones & Celebration",
    description: "Exquisite dining, beautiful thematic staging, and flawless hosting to celebrate your company milestones in style.",
    image: "/occasions/corporate-meeting.jpeg",
  },
  {
    title: "MICE & High Level Meeting",
    tag: "Executive & Business",
    description: "Professional settings, high-end audiovisual logistics, and smooth execution for executive conferences and corporate summits.",
    image: "/occasions/event-production.jpeg",
  },
  {
    title: "Event Show Management",
    tag: "Live Production",
    description: "Full-scale live production, choreography, lighting, directing, and stage synchronization for grand events and entertainment.",
    image: "/occasions/study-tour.jpeg",
  },
];

export function ExperiencesSection({ dict }: { dict: any }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3); // Default for large screens

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerView(3);
      } else if (window.innerWidth >= 768) {
        setItemsPerView(2);
      } else {
        setItemsPerView(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Merge the icons/gradients from occasionsList with the translated content
  const translatedOccasions = occasionsList.map((occasion, i) => ({
    ...occasion,
    title: dict.experiences.list[i].title,
    tag: dict.experiences.list[i].tag,
    description: dict.experiences.list[i].description,
  }));

  const totalPages = Math.ceil(translatedOccasions.length / itemsPerView);

  useEffect(() => {
    if (activeIndex >= totalPages && totalPages > 0) {
      setActiveIndex(totalPages - 1);
    }
  }, [totalPages, activeIndex]);

  const goToPage = (pageIndex: number) => {
    setActiveIndex(pageIndex);
  };

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden border-t border-slate-100">
      {/* Background accents */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(249,115,22,0.015),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(59,130,246,0.015),transparent_50%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <span className="text-sm font-bold tracking-wider text-orange-600 uppercase">
            {dict.experiences.subtitle}
          </span>
          <h2 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl max-w-3xl mx-auto leading-tight">
            {dict.experiences.title}
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            {dict.experiences.description}
          </p>
        </div>

        {/* Occasions Slider */}
        <div className="relative overflow-hidden w-full py-4 -mx-4 px-4">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {translatedOccasions.map((item) => (
              <div
                key={item.title}
                className="flex-shrink-0 px-4"
                style={{ width: `${100 / itemsPerView}%` }}
              >
                <div
                  className="group relative w-full rounded-3xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer h-full flex flex-col bg-white border border-slate-100"
                >
                  {/* Top Image */}
                  <div className="relative w-full h-56 sm:h-64 flex-shrink-0 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>

                  {/* Text Content */}
                  <div className="p-6 flex flex-col flex-1 z-10 text-left">
                    <div>
                      <span 
                        className="text-[10px] font-bold tracking-wider text-orange-600 uppercase mb-2 block"
                      >
                        {item.tag}
                      </span>

                      <h3 
                        className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight"
                      >
                        {item.title}
                        <span className="text-orange-500">.</span>
                      </h3>
                    </div>

                    <div className="mt-2 flex-1">
                      <p 
                        className="text-slate-600 text-left text-pretty text-xs md:text-sm font-medium leading-relaxed"
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>
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
                className={`h-2.5 rounded-full transition-all duration-300 ${i === activeIndex
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

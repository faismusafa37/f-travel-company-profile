"use client";

import React from "react";
import { motion } from "framer-motion";

interface Member {
  name: string;
  role: string;
  quote: string;
  image: string;
}

const teamMembers: Member[] = [
  {
    name: "Wahyu Prabowo",
    role: "Chief Executive Officer",
    quote: "Experienced in managing 100+ events across Indonesia.",
    image: "/team/wahyu_ceo.png",
  },
  {
    name: "Wiwit Novia Susanti",
    role: "Managing Director",
    quote: "Ensuring F-Travel runs efficiently and provides the best service.",
    image: "/team/wiwit_md.png",
  },
  {
    name: "Farras Alaydrus",
    role: "Event Coordinator",
    quote: "Specialized in planning and organizing events.",
    image: "/team/farras_event.png",
  },
  {
    name: "Fajri Alaydrus",
    role: "Tour Leader Coordinator",
    quote: "Committed to making every trip run perfectly.",
    image: "/team/fajri_tour.png",
  },
];

interface MemberProp {
  id: string;
  name: string;
  role: string;
  quote: string;
  image: string;
}

export function OurTeam({ members = [], dict }: { members?: MemberProp[], dict?: any }) {
  // If we have dict but no members from DB, use translated fallback
  const fallbackMembers = dict ? [
    { image: "/team/wahyu_ceo.png", ...dict.team.list[0] },
    { image: "/team/wiwit_md.png", ...dict.team.list[1] },
    { image: "/team/farras_event.png", ...dict.team.list[2] },
    { image: "/team/fajri_tour.png", ...dict.team.list[3] }
  ] : teamMembers;

  const displayMembers = members.length > 0 ? members : fallbackMembers.map((m, i) => ({
    id: `static-${i}`,
    ...m
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 18,
      },
    },
  };

  const renderMemberCard = (member: MemberProp, index: number, isSlider: boolean = false) => {
    const cardContent = (
      <>
        {/* Profile Image Container */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2rem] bg-slate-50 border border-slate-100 shadow-[0_4px_15px_rgba(0,0,0,0.02)] group-hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] group-hover:-translate-y-1 transition-all duration-300">
          {/* Background color box block for depth */}
          <div className="absolute inset-0 bg-slate-100" />
          <img
            src={member.image}
            alt={member.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Hover Quote overlay */}
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6 text-center">
            <p className="text-white text-sm font-medium italic leading-relaxed">
              "{member.quote}"
            </p>
          </div>
        </div>

        {/* Text Info */}
        <div className="mt-5 space-y-1 px-2">
          <h4 className="text-lg font-bold text-slate-950 group-hover:text-orange-600 transition-colors duration-300">
            {member.name}
          </h4>
          <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
            {member.role}
          </p>
          {/* Static Inline Quote representation for static viewports */}
          <p className="text-slate-500 text-xs italic mt-2.5 leading-relaxed pt-2.5 border-t border-slate-100 group-hover:border-orange-500/20 transition-colors">
            "{member.quote}"
          </p>
        </div>
      </>
    );

    if (isSlider) {
      return (
        <div key={`${member.id}-${index}`} className="group flex flex-col w-[280px] shrink-0">
          {cardContent}
        </div>
      );
    }

    return (
      <motion.div
        key={`${member.id}-${index}`}
        variants={itemVariants}
        className="group flex flex-col w-full"
      >
        {cardContent}
      </motion.div>
    );
  };

  return (
    <section className="py-24 bg-white border-t border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-semibold tracking-wider text-orange-600 uppercase">
            {dict?.team?.subtitle || "Meet the Experts"}
          </span>
          <h2 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            {dict?.team?.title || "Our Team"}
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
            {dict?.team?.description || "The passionate minds behind every successful journey and corporate gathering at F-Travel."}
          </p>
        </div>

        {/* Team Grid or Slider */}
        {displayMembers.length <= 4 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {displayMembers.map((member, i) => renderMemberCard(member, i, false))}
          </motion.div>
        ) : (
          <div className="relative flex overflow-hidden py-4 mask-gradient max-w-[100vw] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            <div 
              className="flex flex-row flex-nowrap w-max gap-8 hover:[animation-play-state:paused] cursor-pointer"
              style={{ animation: 'marquee-left 50s linear infinite' }}
            >
              {[...displayMembers, ...displayMembers].map((member, i) => 
                renderMemberCard(member, i, true)
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

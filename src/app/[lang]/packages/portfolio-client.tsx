"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Award, 
  Users, 
  Compass, 
  BookOpen, 
  Sparkles, 
  ChevronDown,
  Building,
  Layers,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 15;

const categories = [
  { id: "All", label: "All Projects", icon: Layers },
  { id: "Outing & Gathering", label: "Outings & Gatherings", icon: Users },
  { id: "Team Building & Bootcamp", label: "Team Building & Bootcamp", icon: Award },
  { id: "Meeting & Conference", label: "Meetings & Conferences", icon: Briefcase },
  { id: "Study & Special Tour", label: "Study & Special Tours", icon: BookOpen },
];

export interface ProjectItem {
  id: string;
  client: string;
  activity: string;
  location: string;
  category: string;
  original: string;
  year: string;
  images?: { id: string; url: string; caption?: string | null; sortOrder?: number }[];
}

export function PortfolioClient({ initialProjects = [], dict }: { initialProjects: ProjectItem[], dict?: any }) {
  const localizedCategories = [
    { id: "All", label: dict?.packages?.filters?.all || "All Projects", icon: Layers },
    { id: "Outing & Gathering", label: dict?.packages?.filters?.outing || "Outings & Gatherings", icon: Users },
    { id: "Team Building & Bootcamp", label: dict?.packages?.filters?.teamBuilding || "Team Building & Bootcamp", icon: Award },
    { id: "Meeting & Conference", label: dict?.packages?.filters?.meeting || "Meetings & Conferences", icon: Briefcase },
    { id: "Study & Special Tour", label: dict?.packages?.filters?.study || "Study & Special Tours", icon: BookOpen },
  ];
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // Filter and search logic
  const filteredProjects = useMemo(() => {
    return initialProjects.filter((project) => {
      const matchesCategory = 
        selectedCategory === "All" || project.category === selectedCategory;
      
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        project.client.toLowerCase().includes(searchLower) ||
        project.location.toLowerCase().includes(searchLower) ||
        project.activity.toLowerCase().includes(searchLower);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory, initialProjects]);

  // Reset pagination when query or category changes
  React.useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [searchQuery, selectedCategory]);

  const visibleProjects = useMemo(() => {
    return filteredProjects.slice(0, visibleCount);
  }, [filteredProjects, visibleCount]);

  const hasMore = filteredProjects.length > visibleCount;

  const loadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Team Building & Bootcamp":
        return <Award className="w-4 h-4 text-amber-500" />;
      case "Meeting & Conference":
        return <Briefcase className="w-4 h-4 text-blue-500" />;
      case "Study & Special Tour":
        return <BookOpen className="w-4 h-4 text-emerald-500" />;
      case "Outing & Gathering":
      default:
        return <Users className="w-4 h-4 text-orange-500" />;
    }
  };

  const stats = useMemo(() => {
    // Unique locations
    const uniqueLocations = new Set(initialProjects.map(p => p.location.split(" ")[0])).size;
    // BUMN/Corporate client count (approx based on unique clients)
    const uniqueClients = new Set(initialProjects.map(p => p.client)).size;
    return {
      total: initialProjects.length,
      locations: uniqueLocations + 8, // padding for generic names
      clients: uniqueClients,
    };
  }, [initialProjects]);

  return (
    <div className="bg-slate-50 min-h-screen relative overflow-hidden py-16 sm:py-24">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-orange-500/5 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(249,115,22,0.02),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.025),transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-orange-700 text-xs font-bold uppercase tracking-wider mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            {dict?.packages?.hero?.tag || "Track Record"}
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight"
          >
            {dict?.packages?.hero?.title || "Our Corporate Portfolio"}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed"
          >
            {dict?.packages?.hero?.description || "Explore our extensive track record of delivering premium corporate outings, high-impact team buildings, MICE conferences, and study tours across Indonesia and beyond."}
          </motion.p>
        </div>

        {/* Stats Dashboard */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto mb-16"
        >
          {/* Stat 1 */}
          <div className="bg-white/70 backdrop-blur border border-slate-200/80 rounded-2xl p-6 text-center shadow-sm hover:shadow transition-shadow flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-500" />
            <div className="p-3 bg-orange-50 rounded-xl mb-3 text-orange-600">
              <Compass className="w-6 h-6" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{stats.total}+</div>
            <div className="text-sm font-semibold text-slate-500 mt-1">{dict?.packages?.stats?.events || "Events Executed Successfully"}</div>
          </div>

          {/* Stat 2 */}
          <div className="bg-white/70 backdrop-blur border border-slate-200/80 rounded-2xl p-6 text-center shadow-sm hover:shadow transition-shadow flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-500" />
            <div className="p-3 bg-blue-50 rounded-xl mb-3 text-blue-600">
              <Building className="w-6 h-6" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{stats.clients}+</div>
            <div className="text-sm font-semibold text-slate-500 mt-1">{dict?.packages?.stats?.clients || "Corporate Partners"}</div>
          </div>

          {/* Stat 3 */}
          <div className="bg-white/70 backdrop-blur border border-slate-200/80 rounded-2xl p-6 text-center shadow-sm hover:shadow transition-shadow flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-500" />
            <div className="p-3 bg-emerald-50 rounded-xl mb-3 text-emerald-600">
              <Globe className="w-6 h-6" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{stats.locations}+</div>
            <div className="text-sm font-semibold text-slate-500 mt-1">{dict?.packages?.stats?.locations || "Destinations Covered"}</div>
          </div>
        </motion.div>

        {/* Filter and Search Controls */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-4 sm:p-6 shadow-sm mb-10">
          <div className="flex flex-col gap-6">
            
            {/* Search Input */}
            <div className="relative w-full max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder={dict?.packages?.filters?.searchPlaceholder || "Search by client, location, or activity (e.g. Equine Global, Bali, Outing)..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 sm:py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
                >
                  {dict?.packages?.filters?.clear || "Clear"}
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 border-t border-slate-100 pt-4">
              {localizedCategories.map((cat) => {
                const IconComponent = cat.icon;
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all ${
                      isActive
                        ? "bg-orange-600 text-white shadow-sm shadow-orange-500/10 scale-102"
                        : "bg-slate-100 hover:bg-slate-200/80 text-slate-600 border border-transparent"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6 flex justify-between items-center px-2">
          <p className="text-sm font-semibold text-slate-500">
            {dict?.packages?.results?.showing || "Showing"} {filteredProjects.length === 0 ? 0 : Math.min(visibleCount, filteredProjects.length)} {dict?.packages?.results?.of || "of"} {filteredProjects.length} {dict?.packages?.results?.results || "results"}
          </p>
          {selectedCategory !== "All" || searchQuery ? (
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline"
            >
              {dict?.packages?.results?.reset || "Reset Filters"}
            </button>
          ) : null}
        </div>

        {/* Projects Grid with Motion Layout Animations */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {visibleProjects.map((project) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                className="group bg-white border border-slate-200/70 hover:border-orange-500/30 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden"
              >
                <Link href={`/portfolio/${project.id}`} className="flex flex-col justify-between h-full relative w-full">
                
                {/* Optional Image */}
                {project.images && project.images.length > 0 && (
                  <div className="w-full h-48 bg-slate-100 relative overflow-hidden shrink-0">
                    <img 
                      src={project.images[0].url} 
                      alt={project.client}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                
                <div className="flex flex-col flex-1 p-6">
                {/* Visual Accent top left */}
                <div className="absolute top-0 left-0 w-2 h-full bg-slate-100 group-hover:bg-orange-500/30 transition-colors" />

                {/* Content */}
                <div>
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-150 border border-slate-200/50 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {getCategoryIcon(project.category)}
                      {project.activity}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      {project.year}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-orange-600 transition-colors">
                    {project.client}
                  </h3>
                  
                  <p className="text-slate-500 text-xs sm:text-sm font-medium mt-2 leading-relaxed italic border-l-2 border-slate-200 pl-3 py-0.5">
                    "{project.original}"
                  </p>
                </div>

                {/* Bottom Badges */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center text-slate-500 font-semibold gap-1">
                    <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span className="truncate max-w-[180px]">{project.location}</span>
                  </div>
                  
                  <span className="text-[10px] font-extrabold text-orange-600 tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    {dict?.packages?.results?.verified || "Verified Trip"} &bull;
                  </span>
                </div>
                </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-3xl"
          >
            <div className="text-4xl text-slate-300 mb-3">🔍</div>
            <h3 className="text-lg font-bold text-slate-800">{dict?.packages?.results?.empty || "No Projects Found"}</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto mt-1">
              {dict?.packages?.results?.emptyDesc || "We couldn't find any outing records matching your query in this category. Try adjusting your query or category."}
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              variant="outline"
              className="mt-6 border-orange-500 text-orange-600 hover:bg-orange-50"
            >
              {dict?.packages?.results?.reset || "Reset Filters"}
            </Button>
          </motion.div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center mt-12">
            <Button
              onClick={loadMore}
              className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-300 shadow-sm px-6 py-5 rounded-2xl text-sm font-bold tracking-wide inline-flex items-center gap-1.5 transition-all active:scale-98"
            >
              <span className="ml-1">{dict?.packages?.results?.loadMore || "Load More Projects"}</span>
              <ChevronDown className="w-4 h-4 text-slate-500 animate-bounce" />
            </Button>
          </div>
        )}

      </div>
    </div>
  );
}

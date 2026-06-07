"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DBGalleryImage {
  id: string;
  url: string;
  alt: string | null;
  category: string | null;
}

export function GalleryClient({ images = [], dict }: { images: DBGalleryImage[], dict?: any }) {
  const allLabel = dict?.gallery?.all || "All";
  const [selectedCategory, setSelectedCategory] = useState(allLabel);

  const categories = useMemo(() => {
    const list = new Set<string>();
    images.forEach(img => {
      if (img.category) list.add(img.category);
    });
    return [allLabel, ...Array.from(list)];
  }, [images, allLabel]);

  const filteredImages = useMemo(() => {
    if (selectedCategory === allLabel) return images;
    return images.filter(img => img.category === selectedCategory);
  }, [selectedCategory, images, allLabel]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-screen">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">{dict?.gallery?.hero?.title || "Travel Gallery"}</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          {dict?.gallery?.hero?.description || "Explore breathtaking moments captured by our travelers around the world."}
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((cat) => (
          <button 
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-2 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 ${
              selectedCategory === cat 
                ? "bg-orange-600 text-white shadow-md shadow-orange-500/10 scale-102" 
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {filteredImages.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 border border-dashed border-slate-200 rounded-3xl text-slate-500 max-w-lg mx-auto">
          {dict?.gallery?.empty || "No images uploaded in this category."}
        </div>
      ) : (
        <motion.div 
          layout
          className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((img) => (
              <motion.div
                layout
                key={img.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                className="break-inside-avoid relative group rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
              >
                <img 
                  src={img.url} 
                  alt={img.alt || "Travel Moment"} 
                  className="w-full h-auto object-cover transform group-hover:scale-103 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/40 transition-colors duration-300 flex items-end p-5">
                  {img.alt && (
                    <p className="text-white text-xs font-bold bg-slate-900/60 backdrop-blur-sm px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {img.alt}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

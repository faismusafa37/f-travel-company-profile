"use client";

import { useState, useEffect, useRef } from "react";
import { Star } from "lucide-react";
import { motion, Variants, useMotionValue, useTransform, useInView, animate } from "framer-motion";
import { Button } from "@/components/ui/button";

function StatCounter({ text }: { text: string }) {
  const match = text.match(/([0-9.]+)(.*)/);
  if (!match) return <>{text}</>;
  
  const num = parseFloat(match[1]);
  const suffix = match[2];
  const isFloat = match[1].includes(".");
  const isPadded = match[1].startsWith("0") && match[1].length > 1 && !isFloat;
  
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const count = useMotionValue(0);

  useEffect(() => {
    if (inView) {
      const controls = animate(count, num, { duration: 2, ease: "easeOut" });
      return controls.stop;
    }
  }, [inView, num, count]);

  const display = useTransform(count, (latest) => 
    isFloat ? latest.toFixed(1) : Math.round(latest).toString().padStart(isPadded ? 2 : 1, "0")
  );

  return (
    <span ref={ref} className="inline-flex">
      <motion.span>{display}</motion.span>
      <span>{suffix}</span>
    </span>
  );
}

const TypewriterText = ({ text }: { text: string }) => {
  const chars = text.split("");
  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        visible: { transition: { staggerChildren: 0.05, delayChildren: 0.5 } },
        hidden: {},
      }}
      className="inline-block font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-300 to-rose-500 drop-shadow-md"
    >
      {chars.map((char, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
};

interface HeroProps {
  title?: string;
  subtitle?: string;
  video?: string;
  stats?: {
    customers?: string;
    experienceYears?: string;
    destinations?: string;
    rating?: string;
  };
}

export function Hero({
  title = "Your Next Adventure Begins with F-Travel",
  subtitle = "“Find Your Experience”",
  video = "/If you want to go far, go together. Celebrating Ecomindo’s Silver Milestone, 25 years of excelle.mp4",
  stats = {
    customers: "10M+",
    experienceYears: "09+",
    destinations: "12K",
    rating: "5.0"
  }
}: HeroProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Fallback if video takes too long to load or fails
    const timer = setTimeout(() => {
      setIsVideoLoaded(true);
      setIsVideoPlaying(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleVideoPlay = () => {
    setIsVideoLoaded(true);
    setIsVideoPlaying(true);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  const statsContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.6,
      },
    },
  };

  const statItemVariants: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <>
      <div className="relative h-[60vh] md:h-[65vh] min-h-[400px] max-h-[600px] w-full flex flex-col justify-between bg-slate-950 text-white rounded-b-[2rem] md:rounded-b-[3rem]">
      {/* Video Background */}
      <div className="absolute inset-0 z-0 overflow-hidden rounded-b-[2rem] md:rounded-b-[3rem]">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          onPlay={handleVideoPlay}
          onLoadedData={handleVideoPlay}
          className={`w-full h-full object-cover transition-opacity duration-1000 ${isVideoPlaying ? "opacity-45" : "opacity-0"
            }`}
          src={video}
        />
        {/* Soft overlay gradient to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/70 z-0" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex items-center justify-center py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView={isVideoPlaying ? "visible" : "hidden"}
            viewport={{ once: false, amount: 0.1 }}
            className="space-y-8 max-w-4xl mx-auto"
          >
            {/* Title */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-tight text-white drop-shadow-xl"
            >
              {title.includes("F-Travel") ? (
                <>
                  {title.split("F-Travel")[0]}
                  <span className="font-serif italic font-bold text-orange-500 bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500 drop-shadow-md">
                    F-Travel
                  </span>
                  {title.split("F-Travel")[1]}
                </>
              ) : title}
            </motion.h1>

            {/* Subtitle */}
            <motion.div
              variants={itemVariants}
              className="text-xl sm:text-3xl font-medium max-w-2xl mx-auto drop-shadow-md"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <TypewriterText text={subtitle} />
            </motion.div>
          </motion.div>
        </div>
      </div>

      </div>

      {/* Floating Statistics Section */}
      <div className="relative z-20 w-full -mt-12 sm:-mt-16 md:-mt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-10 md:mb-16">
        <motion.div
          variants={statsContainerVariants}
          initial="hidden"
          whileInView={isVideoPlaying ? "visible" : "hidden"}
          viewport={{ once: false, amount: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 relative z-20"
        >
          {/* Stat 1 */}
          <motion.div variants={statItemVariants} className="bg-white text-slate-950 rounded-2xl p-4 sm:p-5 md:p-6 shadow-xl border border-slate-100 flex flex-col justify-center items-center text-center group hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-1">
              <StatCounter text={stats.customers} />
            </h3>
            <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-slate-500 uppercase tracking-wide">Total Customers</p>
          </motion.div>

          {/* Stat 2 */}
          <motion.div variants={statItemVariants} className="bg-white text-slate-950 rounded-2xl p-4 sm:p-5 md:p-6 shadow-xl border border-slate-100 flex flex-col justify-center items-center text-center group hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-1">
              <StatCounter text={stats.experienceYears} />
            </h3>
            <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-slate-500 uppercase tracking-wide">Years Of Experience</p>
          </motion.div>

          {/* Stat 3 */}
          <motion.div variants={statItemVariants} className="bg-white text-slate-950 rounded-2xl p-4 sm:p-5 md:p-6 shadow-xl border border-slate-100 flex flex-col justify-center items-center text-center group hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-1">
              <StatCounter text={stats.destinations} />
            </h3>
            <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-slate-500 uppercase tracking-wide">Total Destinations</p>
          </motion.div>

          {/* Stat 4 */}
          <motion.div variants={statItemVariants} className="bg-white text-slate-950 rounded-2xl p-4 sm:p-5 md:p-6 shadow-xl border border-slate-100 flex flex-col justify-center items-center text-center group hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center space-x-1 mb-1 justify-center">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900">
                <StatCounter text={stats.rating} />
              </h3>
              <Star className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 fill-amber-500 shrink-0" />
            </div>
            <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-slate-500 uppercase tracking-wide">Average Rating</p>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

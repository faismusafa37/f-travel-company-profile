"use client";

import React from "react";
import { Star } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  company: string;
  trip: string;
  content: string;
  rating: number;
}

const testimonialList: Testimonial[] = [
  {
    name: "Aditya Pratama",
    role: "HR Director",
    company: "PT. Equine Global Jakarta",
    trip: "Outing to Bali",
    content: "Luar biasa! Acara gathering kami di Bali kemarin dikemas sangat rapi. Dari welcoming dinner sampai team building di pantai, semua panitia F Travel sangat sigap.",
    rating: 5,
  },
  {
    name: "Rian Hidayat",
    role: "GA Manager",
    company: "PT. Niagaprima Paramitra",
    trip: "Outing to Yogyakarta",
    content: "Outing Jogja yang sangat berkesan! Jeep tour Merapi dan gala dinner-nya seru banget. Kerja sama tim jadi makin erat berkat game outbound yang kreatif.",
    rating: 5,
  },
  {
    name: "Fitri Handayani",
    role: "Branch Committee",
    company: "BNI KC BSD",
    trip: "Outing to Bali",
    content: "F Travel sukses banget bikin liburan kami di Bali jadi seru dan santai. Pelayanannya bintang lima, dari transportasi sampai hotel semuanya oke banget!",
    rating: 5,
  },
  {
    name: "Hendra Wijaya",
    role: "Employee Relations Specialist",
    company: "PT. Xsis Mitra Utama",
    trip: "Outing to Belitung",
    content: "Belitung trip was amazing! Hopping island, makan siang di pantai pasir putih, dan kulinernya mantap. F Travel bener-bener profesional ngurus segalanya.",
    rating: 5,
  },
  {
    name: "Sarah Safitri",
    role: "Operational Manager",
    company: "BNI KC Melawai Raya",
    trip: "Outing to Yogyakarta",
    content: "Sangat merekomendasikan F Travel untuk corporate outing. Koordinasi grup besar kami ke Jogja berjalan lancar, tertib, dan on-schedule!",
    rating: 5,
  },
  {
    name: "Budi Santoso",
    role: "Project Coordinator",
    company: "PT. Agung Toyota Pusat",
    trip: "Outing to Bali",
    content: "Gala dinner di Jimbaran dan agenda team building di Bali bener-bener top. Seluruh karyawan sangat enjoy dan puas dengan service-nya.",
    rating: 5,
  },
  {
    name: "Denny Setiawan",
    role: "CTO / Committee",
    company: "Ecomindo Sarana Cipta",
    trip: "Outing to Yogyakarta",
    content: "Dua jempol untuk F Travel! Team building di Jogja seru abis, program outbound interaktif dan mempererat bonding antar divisi.",
    rating: 5,
  },
  {
    name: "Amelia Putri",
    role: "L&D Specialist",
    company: "PT. Equine Global X Tugu Insurance",
    trip: "Booth Camp",
    content: "Kolaborasi booth camp berjalan sukses besar. Lokasinya strategis, fasilitas meeting lengkap, dan aktivitas ice breaking-nya fresh.",
    rating: 5,
  },
  {
    name: "Kevin Chandra",
    role: "Head of HR",
    company: "Bank Mestika Jakarta",
    trip: "Outing to Yogyakarta",
    content: "Event organizer paling responsif yang pernah kami pakai. Liburan Jogja kami lancar, aman, dan penuh keseruan dari awal sampai akhir.",
    rating: 5,
  },
  {
    name: "Linda Permatasari",
    role: "Corporate Secretary",
    company: "Mitratel",
    trip: "Outing to Thailand",
    content: "Outing luar negeri perdana bareng F Travel ke Thailand sukses besar! Pengurusan paspor group, akomodasi, dan guide lokal di Bangkok top banget.",
    rating: 5,
  },
  {
    name: "Ahmad Fauzi",
    role: "Department Head",
    company: "OJK Div.DPMV",
    trip: "Outing to Bogor",
    content: "Outing Bogor yang menyegarkan pikiran. Program outbound menantang tapi seru. Makanan enak dan vila yang disediakan sangat nyaman.",
    rating: 5,
  },
  {
    name: "Jessica Irene",
    role: "People Operations",
    company: "PT. Equine Global",
    trip: "Outing to Ciwidey Bandung",
    content: "Dinginnya Ciwidey langsung hangat dengan kebersamaan tim. Games outbound-nya seru banget dan mengasah problem solving kelompok.",
    rating: 5,
  },
];

// Split testimonials into 2 rows for left and right sliding marquee
const row1 = testimonialList.slice(0, 6);
const row2 = testimonialList.slice(6, 12);

interface DBTestimonial {
  id: string;
  clientName: string;
  clientRole: string | null;
  clientImage: string | null;
  company: string | null;
  trip: string | null;
  content: string;
  rating: number;
}

export function TestimonialsSlider({ testimonials = [], dict }: { testimonials?: DBTestimonial[], dict?: any }) {
  const displayTestimonials = testimonials.length > 0 ? testimonials.map(t => ({
    name: t.clientName,
    role: t.clientRole || "",
    company: t.company || "",
    trip: t.trip || "",
    content: t.content,
    rating: t.rating
  })) : testimonialList;

  const renderRow = (rowItems: Testimonial[], direction: "left" | "right") => {
    if (rowItems.length === 0) return null;
    const items = [...rowItems, ...rowItems];
    const marqueeClass = direction === "left" ? "animate-marquee-left" : "animate-marquee-right";

    return (
      <div className="relative flex overflow-hidden py-4">
        <div className={`${marqueeClass} flex gap-6 hover:[animation-play-state:paused] cursor-pointer`}>
          {items.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="w-[380px] bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-slate-800/80 hover:border-orange-500/40 hover:bg-slate-900/90 transition-all duration-300 flex flex-col justify-between shrink-0 shadow-lg"
            >
              <div>
                {/* Rating Stars */}
                <div className="flex mb-4 text-orange-400">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">
                  "{item.content}"
                </p>
              </div>

              {/* User / Company Details */}
              <div className="flex items-center pt-4 border-t border-slate-800/60">
                {/* Avatar with company initials */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-amber-600 flex items-center justify-center text-white font-extrabold text-xs mr-3 shadow-md shrink-0">
                  {item.company.charAt(0) === "P" && item.company.includes("PT.")
                    ? item.company.replace("PT. ", "").charAt(0)
                    : item.company.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm">{item.name}</h4>
                  <p className="text-xs text-slate-400 font-medium">
                    {item.company} &bull; <span className="text-orange-400">{item.trip}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Split testimonials into 2 rows for left and right sliding marquee
  const half = Math.ceil(displayTestimonials.length / 2);
  const row1 = displayTestimonials.slice(0, half);
  const row2 = displayTestimonials.slice(half);

  return (
    <section className="py-24 bg-slate-950 text-white overflow-hidden relative">
      {/* Decorative background gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16 relative z-10">
        <span className="text-sm font-semibold tracking-wider text-orange-500 uppercase">
          {dict?.testimonials?.subtitle || "Stories of Success"}
        </span>
        <h2 className="mt-2 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          {dict?.testimonials?.title || "What Our Clients Say"}
        </h2>
        <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {dict?.testimonials?.description || "Read real stories from corporate outings and gatherings managed by F-Travel across top destinations."}
        </p>
      </div>

      <div className="relative space-y-4 max-w-[100vw] mask-gradient z-10">
        {renderRow(row1, "left")}
        {renderRow(row2, "right")}
      </div>
    </section>
  );
}

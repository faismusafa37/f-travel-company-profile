"use client";

import React from "react";

interface Client {
  name: string;
  logo: React.ReactNode;
}

const clientList: Client[] = [
  // Row 1: IBM Companies and Tech
  {
    name: "Equine Global",
    logo: (
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-800 flex items-center justify-center text-white font-extrabold text-xs shadow-inner shrink-0">
        EG
      </div>
    ),
  },
  {
    name: "Optima Data",
    logo: (
      <div className="w-10 h-10 rounded-xl bg-sky-900 flex items-center justify-center text-white font-bold text-xs shadow-inner shrink-0">
        OPT
      </div>
    ),
  },
  {
    name: "Niagaprima Paramitra",
    logo: (
      <div className="w-10 h-10 rounded-xl bg-[#0F2C59] flex items-center justify-center text-[#FF8225] font-black text-sm shadow-inner shrink-0">
        NPP
      </div>
    ),
  },
  {
    name: "Xsis Mitra Utama",
    logo: (
      <div className="w-10 h-10 rounded-xl bg-[#1C1A5E] flex items-center justify-center text-white font-black text-xs italic shadow-inner shrink-0">
        Xsis
      </div>
    ),
  },
  {
    name: "Ecomindo",
    logo: (
      <div className="w-10 h-10 rounded-xl bg-[#0092D2] flex items-center justify-center shadow-inner shrink-0">
        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      </div>
    ),
  },
  {
    name: "TMS",
    logo: (
      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 flex items-center justify-center text-white font-black text-[10px] tracking-wider shadow-inner shrink-0">
        TMS
      </div>
    ),
  },
  {
    name: "Mitratel",
    logo: (
      <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-black text-xs shadow-inner shrink-0">
        MT
      </div>
    ),
  },
  // Row 2: Banking, Finance & Infrastructure
  {
    name: "BNI",
    logo: (
      <div className="w-10 h-10 rounded-xl bg-[#006675] flex items-center justify-center shadow-inner shrink-0">
        <span className="text-[#F15A24] font-black text-sm">BNI</span>
      </div>
    ),
  },
  {
    name: "Astra Infra",
    logo: (
      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-[#E31E24] font-black text-[9px] tracking-tighter shadow-inner shrink-0">
        ASTRA
      </div>
    ),
  },
  {
    name: "OJK",
    logo: (
      <div className="w-10 h-10 rounded-xl bg-[#9C2523] flex items-center justify-center text-[#D4AF37] font-black text-xs shadow-inner shrink-0">
        OJK
      </div>
    ),
  },
  {
    name: "BRIN",
    logo: (
      <div className="w-10 h-10 rounded-xl bg-[#D62828] flex items-center justify-center text-white font-extrabold text-[10px] shadow-inner shrink-0">
        BRIN
      </div>
    ),
  },
  {
    name: "PLN Icon Plus",
    logo: (
      <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-yellow-400 font-extrabold text-xs shadow-inner shrink-0">
        PLN
      </div>
    ),
  },
  {
    name: "Gigacover",
    logo: (
      <div className="w-10 h-10 rounded-xl bg-[#00D18B] flex items-center justify-center text-white font-black text-sm shadow-inner shrink-0">
        G
      </div>
    ),
  },
  {
    name: "Caldic",
    logo: (
      <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white font-black text-[9px] tracking-tighter shadow-inner shrink-0">
        CALDIC
      </div>
    ),
  },
  // Row 3: Brands, Services & Health
  {
    name: "Agung Toyota",
    logo: (
      <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-900 font-black text-[10px] shadow-inner shrink-0">
        AGUNG
      </div>
    ),
  },
  {
    name: "Kimia Farma",
    logo: (
      <div className="w-10 h-10 rounded-xl bg-blue-900 flex items-center justify-center text-white font-bold text-xs shadow-inner shrink-0">
        KF
      </div>
    ),
  },
  {
    name: "Jasa Marga",
    logo: (
      <div className="w-10 h-10 rounded-xl bg-[#004A8F] flex items-center justify-center text-white font-black text-xs shadow-inner shrink-0">
        JM
      </div>
    ),
  },
  {
    name: "Anteraja",
    logo: (
      <div className="w-10 h-10 rounded-xl bg-[#EC008C] flex items-center justify-center text-yellow-300 font-black text-[9px] tracking-tighter shadow-inner shrink-0">
        anter
      </div>
    ),
  },
  {
    name: "Manulife",
    logo: (
      <div className="w-10 h-10 rounded-xl bg-[#00A75A] flex items-center justify-center text-white font-extrabold text-[9px] shadow-inner shrink-0">
        ML
      </div>
    ),
  },
  {
    name: "Prodia",
    logo: (
      <div className="w-10 h-10 rounded-xl bg-[#FFD100] flex items-center justify-center text-[#1E3060] font-black text-[9px] shadow-inner shrink-0">
        Prodia
      </div>
    ),
  },
  {
    name: "HokBen",
    logo: (
      <div className="w-10 h-10 rounded-xl bg-[#E21C26] flex items-center justify-center text-white font-black text-xs shadow-inner shrink-0">
        HB
      </div>
    ),
  },
  {
    name: "PUPR",
    logo: (
      <div className="w-10 h-10 rounded-xl bg-[#003366] flex items-center justify-center text-[#FFCC00] font-black text-[9px] shadow-inner shrink-0">
        PUPR
      </div>
    ),
  },
];

// Split clients or order them differently for the 3 rows
const row1 = [
  clientList[0], // Equine Global
  clientList[1], // Optima Data
  clientList[2], // NPP
  clientList[3], // Xsis
  clientList[4], // Ecomindo
  clientList[5], // TMS
  clientList[6], // Mitratel
];

const row2 = [
  clientList[7], // BNI
  clientList[8], // Astra Infra
  clientList[9], // OJK
  clientList[10], // BRIN
  clientList[11], // PLN Icon Plus
  clientList[12], // Gigacover
  clientList[13], // Caldic
];

const row3 = [
  clientList[14], // Agung Toyota
  clientList[15], // Kimia Farma
  clientList[16], // Jasa Marga
  clientList[17], // Anteraja
  clientList[18], // Manulife
  clientList[19], // Prodia
  clientList[20], // HokBen
  clientList[21], // PUPR
];

interface DBClient {
  id: string;
  name: string;
  logoUrl: string | null;
  logoText: string | null;
  bgColor: string | null;
  textColor: string | null;
}

export function ClientsSlider({ clients = [], dict }: { clients?: DBClient[], dict?: any }) {
  // If no DB clients are passed, generate list using static data
  const displayClients = clients.length > 0 ? clients : clientList.map((c, i) => {
    // Attempt to parse out colors from hardcoded nodes
    let bgColor = "from-orange-500 to-amber-600";
    let textColor = "text-white";
    let logoText = c.name.substring(0, 3).toUpperCase();

    if (c.name === "Equine Global") {
      bgColor = "from-blue-700 to-indigo-800";
      logoText = "EG";
    } else if (c.name === "Optima Data") {
      bgColor = "from-sky-900 to-slate-800";
      logoText = "OPT";
    } else if (c.name === "Niagaprima Paramitra") {
      bgColor = "from-[#0F2C59] to-[#0d274f]";
      textColor = "text-[#FF8225]";
      logoText = "NPP";
    } else if (c.name === "Xsis Mitra Utama") {
      bgColor = "from-[#1C1A5E] to-indigo-950";
      logoText = "Xsis";
    } else if (c.name === "Mitratel") {
      bgColor = "from-red-600 to-red-800";
      logoText = "MT";
    }

    return {
      id: `static-${i}`,
      name: c.name,
      logoUrl: null,
      logoText,
      bgColor,
      textColor
    };
  });

  const renderFallbackLogo = (client: any) => {
    const bg = client.bgColor || "from-orange-500 to-amber-600";
    const text = client.textColor || "text-white";
    const initials = client.logoText || client.name.substring(0, 2).toUpperCase();
    
    return (
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${bg} flex items-center justify-center ${text} font-extrabold text-xs shadow-inner shrink-0`}>
        {initials}
      </div>
    );
  };

  const renderRow = (rowItems: any[], direction: "left" | "right") => {
    if (rowItems.length === 0) return null;
    const items = [...rowItems, ...rowItems];
    const marqueeClass = direction === "left" ? "animate-marquee-left" : "animate-marquee-right";

    return (
      <div className="relative flex overflow-hidden py-3">
        <div className={`${marqueeClass} flex gap-4 sm:gap-6 hover:[animation-play-state:paused] cursor-pointer`}>
          {items.map((client, index) => {
            const hasLogo = !!client.logoUrl;

            return (
              <div
                key={`${client.id}-${index}`}
                className={`flex items-center justify-center bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] select-none hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 w-[160px] sm:w-[200px] shrink-0 ${hasLogo ? 'h-20 sm:h-24 px-4 sm:px-8 py-4' : 'h-20 sm:h-24 px-4 sm:px-6 py-4 gap-3'}`}
              >
                {hasLogo ? (
                  <img 
                    src={client.logoUrl!} 
                    alt={client.name} 
                    className="max-w-full max-h-full object-contain" 
                  />
                ) : (
                  <>
                    {renderFallbackLogo(client)}
                    <span className="font-bold text-slate-800 tracking-tight text-xs sm:text-sm leading-tight text-left truncate">
                      {client.name}
                    </span>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Divide dynamically into 3 rows
  const row1 = displayClients.filter((_, i) => i % 3 === 0);
  const row2 = displayClients.filter((_, i) => i % 3 === 1);
  const row3 = displayClients.filter((_, i) => i % 3 === 2);

  return (
    <section className="pt-20 md:pt-28 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12 md:mb-16">
        <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          {dict?.clients?.title || "Our Clients"}
        </h2>
        <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
          {dict?.clients?.description || "Forward-thinking brands trust F-Travel to deliver outstanding journeys. We partner with leading enterprises to bring you the best travel experiences."}
        </p>
      </div>

      <div className="relative space-y-2 max-w-[100vw] mask-gradient">
        {renderRow(row1, "left")}
        {renderRow(row2, "right")}
        {renderRow(row3, "left")}
      </div>
    </section>
  );
}

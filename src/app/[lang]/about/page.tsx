import { Metadata } from "next";
import { ShieldCheck, Award, Users2, FileText, CheckCircle, Scale, Briefcase, Lightbulb, Leaf } from "lucide-react";
import { OurTeam } from "@/components/home/team";


import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "About Us | F-Travel",
  description: "Complete profile of F-Travel (PT Dua Rasi Nusantara) as a trusted Tour Organizer, Travel Consultant, and Event Planner.",
};

import { getDictionary } from "@/i18n/get-dictionary";
import { Locale } from "@/i18n/i18n-config";

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  const [dbSettings, dbTeam] = await Promise.all([
    prisma.siteSetting.findMany(),
    prisma.teamMember.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { order: "asc" }
    })
  ]);

  const settingsMap = dbSettings.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {} as Record<string, string>);

  const legalName = settingsMap['legal_name'] || "PT Dua Rasi Nusantara";
  const brandName = settingsMap['brand_name'] || "F-Travel (Trip Organizer & Travel Consultant)";
  const legalSku = settingsMap['legal_sku'] || "AHU-004271.AH.01.30.Tahun 2021";
  const legalNib = settingsMap['legal_nib'] || "0112210037644";
  const legalCert = settingsMap['legal_cert'] || "01122100376440001";

  // Removed hardcoded item variables

  const aboutDesc1 = dict.about.desc1;
  const aboutDesc2 = dict.about.desc2;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">

      {/* 1. Header Hero Banner */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-20 md:py-28">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-orange-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-sm font-semibold tracking-wider text-orange-500 uppercase">
            {dict.about.hero.subtitle}
          </span>
          <h1 className="mt-2 text-4xl md:text-6xl font-extrabold tracking-tight">
            {dict.about.hero.title}
          </h1>
        </div>
      </section>

      {/* 2. Main Narrative & Profile Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Column: Visual Highlights Card */}
            <div className="lg:col-span-5 relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-orange-500 to-amber-500 rounded-[2.5rem] opacity-10 blur-xl pointer-events-none" />
              <div className="relative bg-gradient-to-tr from-slate-900 to-slate-950 text-white rounded-[2rem] p-8 md:p-10 shadow-2xl border border-slate-800">
                <div className="mb-6 relative h-16 w-48 sm:h-30 sm:w-80">
                  <img src="/logo-footer.png" alt="F Travel Logo" className="object-contain w-full h-full object-left" />
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  {dict.about.quote}
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-orange-500 shrink-0" />
                    <span className="text-xs text-slate-200 font-semibold">{dict.about.features[0]}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-orange-500 shrink-0" />
                    <span className="text-xs text-slate-200 font-semibold">{dict.about.features[1]}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-orange-500 shrink-0" />
                    <span className="text-xs text-slate-200 font-semibold">{dict.about.features[2]}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Detailed Text */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-100 rounded-full text-xs font-semibold text-orange-600">
                {dict.about.profileTag}
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
                {dict.about.title}
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                {aboutDesc1}
              </p>
              <p className="text-slate-600 text-base leading-relaxed">
                {aboutDesc2}
              </p>
              {(dict.about as any).desc3 && (
                <p className="text-slate-600 text-base leading-relaxed">
                  {(dict.about as any).desc3}
                </p>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* 3. Mission & Vision Section */}
      <section className="py-24 bg-slate-50 border-y border-slate-200/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-28 relative z-10">

          {/* Row 1: Our Mission */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
            {/* Left: Overlapping Images */}
            <div className="lg:col-span-5 relative w-full aspect-[4/3] sm:aspect-square md:max-w-md lg:max-w-none mx-auto">
              <div className="absolute left-0 top-0 w-[72%] h-[82%] rounded-3xl overflow-hidden shadow-lg border border-slate-200/60">
                <img
                  src="/about/mission_large.jpg"
                  alt="Planning travel"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute right-0 bottom-0 w-[50%] h-[60%] rounded-3xl overflow-hidden shadow-2xl border-[6px] border-slate-50">
                <img
                  src="/about/mission_small.jpg"
                  alt="Group celebrating"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right: Text Content */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-sm font-semibold tracking-wider text-orange-600 uppercase">
                {dict.about.mission.tag}
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
                {dict.about.mission.title}
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                {dict.about.mission.description}
              </p>

              <ul className="space-y-3.5 pt-2">
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-slate-700 text-sm font-semibold">{dict.about.mission.points[0]}</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-slate-700 text-sm font-semibold">{dict.about.mission.points[1]}</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-slate-700 text-sm font-semibold">{dict.about.mission.points[2]}</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-slate-700 text-sm font-semibold">{dict.about.mission.points[3]}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Row 2: Our Vision */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center max-w-6xl mx-auto pt-16 border-t border-slate-200/50">
            <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
              <span className="text-sm font-semibold tracking-wider text-orange-600 uppercase">
                {dict.about.vision.tag}
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
                {dict.about.vision.title}
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                {dict.about.vision.description}
              </p>

              <ul className="space-y-3.5 pt-2">
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-slate-700 text-sm font-semibold">{dict.about.vision.points[0]}</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-slate-700 text-sm font-semibold">{dict.about.vision.points[1]}</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-slate-700 text-sm font-semibold">{dict.about.vision.points[2]}</span>
                </li>
              </ul>
            </div>

            {/* Right: Overlapping Images */}
            <div className="lg:col-span-5 relative w-full aspect-[4/3] sm:aspect-square md:max-w-md lg:max-w-none mx-auto order-1 lg:order-2">
              <div className="absolute right-0 top-0 w-[72%] h-[82%] rounded-3xl overflow-hidden shadow-lg border border-slate-200/60">
                <img
                  src="/about/vision_large.jpg"
                  alt="Team building circle"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute left-0 bottom-0 w-[50%] h-[60%] rounded-3xl overflow-hidden shadow-2xl border-[6px] border-slate-50">
                <img
                  src="/about/vision_small.jpg"
                  alt="Tour leader guide"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Values (Professional, Trust, Innovative, Sustainable) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900">{dict.about.whyChooseUs.title}</h2>
            <div className="mt-6 space-y-4 text-slate-600 max-w-4xl mx-auto text-base">
              <p className="font-semibold text-slate-800">{dict.about.whyChooseUs.desc1}</p>
              <p className="leading-relaxed">{dict.about.whyChooseUs.desc2}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {dict.about.whyChooseUs.items.map((item: any, idx: number) => {
              const icons = [Briefcase, ShieldCheck, Lightbulb, Leaf];
              const bgColors = ["bg-orange-100 text-orange-600", "bg-blue-100 text-blue-600", "bg-amber-100 text-amber-600", "bg-emerald-100 text-emerald-600"];
              const Icon = icons[idx % icons.length];
              const bgColor = bgColors[idx % bgColors.length];

              return (
                <div key={idx} className="text-center p-6 space-y-4 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                  <div className={`w-14 h-14 rounded-2xl ${bgColor} flex items-center justify-center mx-auto shadow-md`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">{item.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <OurTeam members={dbTeam} dict={dict} />

      {/* 5. Legal & Corporate Standing */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200/60 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-slate-900 to-slate-950 text-white px-8 py-6 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <Scale className="w-6 h-6 text-orange-500" />
                <h3 className="text-lg font-bold">{dict.about.legal.title}</h3>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                {dict.about.legal.badge}
              </span>
            </div>

            <div className="p-8 md:p-10 space-y-6">
              <p className="text-slate-600 text-sm leading-relaxed">
                {dict.about.legal.description.replace('{legalName}', legalName)}
              </p>

              {/* Legal Grid Specs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                <div className="flex gap-3">
                  <FileText className="w-5 h-5 text-orange-500 shrink-0 mt-1" />
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">{dict.about.legal.fields.entityName}</span>
                    <strong className="text-sm text-slate-800">{legalName}</strong>
                  </div>
                </div>

                <div className="flex gap-3">
                  <FileText className="w-5 h-5 text-orange-500 shrink-0 mt-1" />
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">{dict.about.legal.fields.brandName}</span>
                    <strong className="text-sm text-slate-800">{brandName}</strong>
                  </div>
                </div>

                <div className="flex gap-3">
                  <FileText className="w-5 h-5 text-orange-500 shrink-0 mt-1" />
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">{dict.about.legal.fields.decree}</span>
                    <strong className="text-sm text-slate-800">{legalSku}</strong>
                  </div>
                </div>

                <div className="flex gap-3">
                  <FileText className="w-5 h-5 text-orange-500 shrink-0 mt-1" />
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">{dict.about.legal.fields.nib}</span>
                    <strong className="text-sm text-[#0092D2] font-mono">{legalNib}</strong>
                  </div>
                </div>

                <div className="flex gap-3 md:col-span-2">
                  <FileText className="w-5 h-5 text-orange-500 shrink-0 mt-1" />
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">{dict.about.legal.fields.cert}</span>
                    <strong className="text-sm text-slate-800 font-mono">{legalCert}</strong>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

    </div>
  );
}

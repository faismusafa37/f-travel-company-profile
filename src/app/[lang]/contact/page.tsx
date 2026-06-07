import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { ContactForm } from "./contact-form";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const metadata = {
  title: "Contact Us | F-Travel",
  description: "Get in touch with F Travel for your next adventure.",
};

import { getDictionary } from "@/i18n/get-dictionary";
import { Locale } from "@/i18n/i18n-config";

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  const settings = await prisma.siteSetting.findMany();
  const settingsMap = settings.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {} as Record<string, string>);

  const address = settingsMap['address'] || "Jl. Malioboro No. 45, Yogyakarta, Indonesia";
  const phone = settingsMap['phone'] || "+62 8561106196";
  const email = settingsMap['contact_email'] || "hello@ftravel.com";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-screen">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">{dict.contact.hero.title}</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          {dict.contact.hero.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">{dict.contact.sections.form}</h2>
          <ContactForm dict={dict} />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">{dict.contact.sections.info}</h2>
          <div className="space-y-6">
            <div className="flex items-start">
              <MapPin className="w-6 h-6 text-orange-500 mr-4 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-900">{dict.contact.fields.address}</h3>
                <p className="text-slate-600 leading-relaxed">{address}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Phone className="w-6 h-6 text-orange-500 mr-4 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-900">{dict.contact.fields.phone}</h3>
                <p className="text-slate-600">{phone}</p>
                <p className="text-sm text-slate-500">{dict.contact.fields.phoneDetail}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Mail className="w-6 h-6 text-orange-500 mr-4 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-900">{dict.contact.fields.email}</h3>
                <p className="text-slate-600">{email}</p>
                <p className="text-sm text-slate-500">{dict.contact.fields.emailDetail}</p>
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-2xl overflow-hidden h-64 border border-slate-200 relative group">
            <iframe 
              src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
            />
            
            <a 
              href="https://share.google/zqcIreXwtTtWGxzYy"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg text-sm font-semibold text-slate-800 flex items-center hover:bg-white hover:scale-105 hover:text-orange-600 transition-all"
            >
              <MapPin className="w-4 h-4 text-orange-500 mr-1.5" />
              Open Maps <ArrowRight className="w-4 h-4 ml-1 text-slate-400" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

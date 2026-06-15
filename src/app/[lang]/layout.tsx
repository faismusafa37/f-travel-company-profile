import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FloatingWhatsApp } from "@/components/layout/whatsapp-button";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";

import { getDictionary } from "@/i18n/get-dictionary";
import { AnalyticsTracker } from "@/components/analytics-tracker";

const inter = Inter({ subsets: ["latin"] });
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  metadataBase: new URL("https://f-travel.id"),
  title: {
    default: "F-Travel | Trip Organizer & Travel Consultant",
    template: "%s | F-Travel Trip Organizer",
  },
  description: "F-Travel (PT Dua Rasi Nusantara) adalah penyedia jasa Premium Trip Organizer, Travel Consultant, dan Event Planner profesional yang berbasis di Yogyakarta dan melayani perjalanan ke seluruh Indonesia.",
  keywords: [
    "F-Travel",
    "PT Dua Rasi Nusantara",
    "Trip Organizer",
    "Travel Consultant",
    "Event Planner",
    "Corporate Outing Yogyakarta",
    "Corporate Outing Indonesia",
    "Team Building",
    "Family Gathering",
    "Paket Wisata Yogyakarta",
    "Paket Liburan Indonesia",
    "F-Travel Outing",
  ],
  authors: [{ name: "F-Travel Team", url: "https://f-travel.id" }],
  creator: "F-Travel Organizer",
  publisher: "PT Dua Rasi Nusantara",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://f-travel.id",
    siteName: "F-Travel",
    title: "F-Travel | Trip Organizer & Travel Consultant",
    description: "Penyedia jasa Premium Trip Organizer, Travel Consultant, dan Event Planner profesional untuk outbound, gathering, dan outing perusahaan.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "F-Travel - Find Your Experience",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "F-Travel | Trip Organizer & Travel Consultant",
    description: "Penyedia jasa Premium Trip Organizer, Travel Consultant, dan Event Planner profesional untuk outbound, gathering, dan outing perusahaan.",
    images: ["/og-image.jpg"],
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  const settingsList = await prisma.siteSetting.findMany().catch(() => []);
  const settings = settingsList.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  return (
    <html lang={lang}>
      <body
        className={`${inter.className} min-h-screen flex flex-col`}
      >
        <Providers>
          <Navbar lang={lang as "id" | "en"} dict={await getDictionary(lang as "id" | "en").then(d => d.navbar)} />
          <main className="flex-1">
            {children}
          </main>
          <Footer settings={settings} lang={lang as "id" | "en"} dict={await getDictionary(lang as "id" | "en").then(d => d.footer)} />
          <FloatingWhatsApp phoneNumber={settings.whatsapp_number || settings.phone} />
          <Toaster position="top-right" richColors />
          <AnalyticsTracker />
        </Providers>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FloatingWhatsApp } from "@/components/layout/whatsapp-button";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { PrismaClient } from "@prisma/client";
import { getDictionary } from "@/i18n/get-dictionary";
import { AnalyticsTracker } from "@/components/analytics-tracker";

const inter = Inter({ subsets: ["latin"] });
const prisma = new PrismaClient();

export const metadata: Metadata = {
  title: "F Travel #FindYourExperience",
  description: "Discover the world with premium travel experiences tailored just for you.",
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

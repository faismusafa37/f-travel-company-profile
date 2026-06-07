"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher({ currentLang }: { currentLang: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const toggleLanguage = () => {
    if (!pathname) return;
    
    // We expect pathname to start with /id/ or /en/ (e.g. /id/about)
    const segments = pathname.split("/");
    const newLang = currentLang === "id" ? "en" : "id";
    
    // Replace the first segment (which is the lang if it exists)
    // Actually, segments[1] is the lang because pathname starts with /
    if (segments[1] === "id" || segments[1] === "en") {
      segments[1] = newLang;
    } else {
      // If no lang prefix (shouldn't happen with our middleware), insert it
      segments.splice(1, 0, newLang);
    }
    
    const newUrl = segments.join("/") || "/";
    
    // Set a cookie so the middleware remembers it
    document.cookie = `NEXT_LOCALE=${newLang};path=/;max-age=31536000`;
    
    router.push(newUrl);
    router.refresh();
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="border-orange-200 hover:bg-orange-50 w-8 h-8 p-0 rounded-full flex items-center justify-center shrink-0 overflow-hidden"
      title={currentLang === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
    >
      <img 
        src={currentLang === "id" ? "https://flagcdn.com/w40/id.png" : "https://flagcdn.com/w40/gb.png"} 
        alt={currentLang.toUpperCase()} 
        className="w-full h-full object-cover"
      />
    </Button>
  );
}

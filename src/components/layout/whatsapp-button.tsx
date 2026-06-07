"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

export function FloatingWhatsApp({ phoneNumber }: { phoneNumber?: string }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything if it's an admin route or component hasn't mounted
  if (!mounted || pathname?.startsWith("/admin")) {
    return null;
  }

  // Use the provided number, or a fallback if none is provided.
  // We clean the number to only include digits for the WhatsApp URL.
  const cleanNumber = (phoneNumber || "628561106196").replace(/\D/g, "");
  
  // Ensure the number starts with country code (e.g., 62 for Indonesia) if it starts with 0
  const waNumber = cleanNumber.startsWith("0") 
    ? `62${cleanNumber.substring(1)}` 
    : cleanNumber;

  const waMessage = encodeURIComponent("Halo, saya ingin menggunakan layanan F-Travel");
  const waUrl = `https://wa.me/${waNumber}?text=${waMessage}`;

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#1ebd5b] hover:scale-110 transition-all duration-300 group"
      aria-label="Chat with us on WhatsApp"
    >
      {/* Ping animation effect */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-75 duration-1000"></span>
      
      {/* WhatsApp SVG Icon */}
      <svg
        viewBox="0 0 24 24"
        width="28"
        height="28"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="relative z-10 fill-current"
      >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
      </svg>
    </a>
  );
}

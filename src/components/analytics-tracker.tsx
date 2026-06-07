"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function generateSessionId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasTrackedInitialRender = useRef(false);

  useEffect(() => {
    // Generate or retrieve session ID
    let sessionId = sessionStorage.getItem("visitor_session_id");
    if (!sessionId) {
      sessionId = generateSessionId();
      sessionStorage.setItem("visitor_session_id", sessionId);
    }

    // Clean the pathname to remove language prefix (/en or /id) and ignore search parameters
    let cleanPath = pathname;
    if (cleanPath.startsWith("/en/") || cleanPath.startsWith("/id/")) {
      cleanPath = cleanPath.substring(3);
    } else if (cleanPath === "/en" || cleanPath === "/id") {
      cleanPath = "/";
    }
    const url = cleanPath;

    // Avoid double tracking on React Strict Mode initial render
    if (process.env.NODE_ENV === "development" && !hasTrackedInitialRender.current) {
      hasTrackedInitialRender.current = true;
      return;
    }

    const trackVisit = async () => {
      try {
        await fetch("/api/analytics/track", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId,
            path: url,
            referrer: document.referrer,
          }),
        });
      } catch (error) {
        console.error("Failed to track analytics:", error);
      }
    };

    trackVisit();
  }, [pathname, searchParams]);

  return null;
}

import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, path, referrer } = body;

    if (!sessionId || !path) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get IP address from headers
    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "Unknown";
    const userAgent = req.headers.get("user-agent") || "Unknown";

    let country = req.headers.get("x-vercel-ip-country") || "Unknown";

    if (country === "Unknown" && ipAddress !== "Unknown" && ipAddress !== "::1" && ipAddress !== "127.0.0.1") {
      try {
        const ipToFetch = ipAddress.split(",")[0].trim();
        const response = await fetch(`http://ip-api.com/json/${ipToFetch}`);
        const data = await response.json();
        if (data && data.country) {
          country = data.country;
        }
      } catch (e) {
        console.error("Failed to fetch country for IP:", ipAddress);
      }
    }

    if (country === "Unknown" && (ipAddress === "::1" || ipAddress === "127.0.0.1" || ipAddress.startsWith("192.168."))) {
      country = "Localhost";
    }

    await prisma.websiteVisit.create({
      data: {
        sessionId,
        path,
        country,
        userAgent,
        referrer,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking visit:", error);
    return NextResponse.json({ error: "Failed to track visit" }, { status: 500 });
  }
}


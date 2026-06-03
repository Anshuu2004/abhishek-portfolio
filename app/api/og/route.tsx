import { ImageResponse } from "next/og";

import { SITE } from "@/lib/site";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") ?? SITE.name;
  const kicker = searchParams.get("kicker") ?? SITE.tagline;
  const isShort = title.length <= 24;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "linear-gradient(180deg, #10131A 0%, #181B22 100%)",
          color: "#F5F5F5",
          fontFamily: "system-ui, sans-serif",
          padding: "72px 80px",
          justifyContent: "space-between",
        }}
      >
        {/* Top row: brand + accent dot */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#929498",
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            fontFamily: "ui-monospace, monospace",
          }}
        >
          <span
            style={{
              display: "flex",
              width: 12,
              height: 12,
              borderRadius: 999,
              background: "#F18A3A",
            }}
          />
          {SITE.shortName}
        </div>

        {/* Center: title + kicker */}
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: "#929498",
              letterSpacing: 3,
              textTransform: "uppercase",
              fontFamily: "ui-monospace, monospace",
            }}
          >
            {kicker}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: isShort ? 124 : 80,
              lineHeight: 1.05,
              fontWeight: 600,
              letterSpacing: -2,
              color: "#F5F5F5",
              maxWidth: "100%",
              wordBreak: "break-word",
            }}
          >
            {title}
          </div>
        </div>

        {/* Bottom row: location + accent rule */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#929498",
            fontSize: 22,
            letterSpacing: 3,
            textTransform: "uppercase",
            fontFamily: "ui-monospace, monospace",
          }}
        >
          <span>{SITE.location.city}, {SITE.location.country}</span>
          <div
            style={{
              display: "flex",
              width: 220,
              height: 4,
              background:
                "linear-gradient(90deg, transparent 0%, #F18A3A 100%)",
            }}
          />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

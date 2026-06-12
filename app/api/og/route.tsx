import { ImageResponse } from "next/og";

import { SITE } from "@/lib/site";

export const runtime = "edge";

/**
 * OG image v2 — matches the cinematic identity: deep blue-charcoal base,
 * ember radial glow, the caret-A monogram, and the proof metrics recruiters
 * should see before they even click. `?title=` / `?kicker=` still override
 * for per-page cards.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") ?? SITE.name;
  const kicker = searchParams.get("kicker") ?? SITE.tagline;
  const isShort = title.length <= 24;
  const isHome = !searchParams.get("title");

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "#0D1018",
          backgroundImage:
            "radial-gradient(820px 420px at 18% -8%, rgba(241,138,58,0.16), transparent 70%), radial-gradient(640px 360px at 88% 112%, rgba(241,138,58,0.08), transparent 70%)",
          color: "#F5F5F5",
          fontFamily: "system-ui, sans-serif",
          padding: "64px 80px",
          justifyContent: "space-between",
        }}
      >
        {/* Top row: monogram + brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            color: "#9CA0AB",
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            fontFamily: "ui-monospace, monospace",
          }}
        >
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 20 L12 4.5 L20 20"
              stroke="#F5F5F5"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect
              x="10.4"
              y="13.2"
              width="3.2"
              height="3.2"
              rx="0.6"
              fill="#F18A3A"
            />
          </svg>
          {SITE.shortName}
        </div>

        {/* Center: kicker + title */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontSize: 26,
              color: "#F18A3A",
              letterSpacing: 5,
              textTransform: "uppercase",
              fontFamily: "ui-monospace, monospace",
            }}
          >
            <div
              style={{
                display: "flex",
                width: 40,
                height: 2,
                background: "#F18A3A",
              }}
            />
            {kicker}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: isShort ? 116 : 76,
              lineHeight: 1.04,
              fontWeight: 600,
              letterSpacing: -3,
              color: "#F5F5F5",
              maxWidth: "100%",
              wordBreak: "break-word",
            }}
          >
            {title}
          </div>
        </div>

        {/* Bottom row: proof metrics (home) or location, + hairline */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#9CA0AB",
            fontSize: 21,
            letterSpacing: 2,
            fontFamily: "ui-monospace, monospace",
          }}
        >
          <span style={{ display: "flex", gap: 26 }}>
            {isHome ? (
              <>
                <span style={{ color: "#F5F5F5" }}>30 FPS edge ML</span>
                <span>·</span>
                <span style={{ color: "#F5F5F5" }}>1000+ tenant SaaS</span>
                <span>·</span>
                <span style={{ color: "#F5F5F5" }}>20+ modules</span>
              </>
            ) : (
              <span style={{ textTransform: "uppercase", letterSpacing: 3 }}>
                {SITE.location.city}, {SITE.location.country}
              </span>
            )}
          </span>
          <div
            style={{
              display: "flex",
              width: 220,
              height: 3,
              background:
                "linear-gradient(90deg, rgba(241,138,58,0) 0%, #F18A3A 100%)",
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

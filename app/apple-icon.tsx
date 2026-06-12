import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Apple touch icon — the caret-A mark on the site's charcoal. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0D1018",
        }}
      >
        <svg width="120" height="120" viewBox="0 0 64 64" fill="none">
          <path
            d="M16 46 L32 16 L48 46"
            stroke="#F5F5F5"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect
            x="28.4"
            y="33.6"
            width="7.2"
            height="7.2"
            rx="1.4"
            fill="#F18A3A"
          />
        </svg>
      </div>
    ),
    size
  );
}

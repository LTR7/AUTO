import { ImageResponse } from "next/og";
import { siteConfig } from "@/constants/site";

export const alt = siteConfig.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 45%, #533afd 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 150, fontWeight: 700, letterSpacing: -6 }}>AUTO</div>
        <div style={{ fontSize: 42, opacity: 0.92, marginTop: 8 }}>
          The Agentic AI Club for Builders
        </div>
      </div>
    ),
    { ...size },
  );
}

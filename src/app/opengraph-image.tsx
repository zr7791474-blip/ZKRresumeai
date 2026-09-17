import { ImageResponse } from "next/og";
import { APP_NAME } from "@/constants";

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
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0a0c 0%, #10141a 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 24,
            background: "#0a0a0c",
            border: "1px solid rgba(34,211,238,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 48,
            fontWeight: 700,
            color: "#22d3ee",
            marginBottom: 32,
          }}
        >
          Z
        </div>
        <div style={{ fontSize: 56, fontWeight: 700, color: "white" }}>{APP_NAME}</div>
        <div style={{ fontSize: 28, color: "#9ca3af", marginTop: 16 }}>
          Build Professional Resumes with AI
        </div>
      </div>
    ),
    { ...size }
  );
}

import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#16a34a",
          borderRadius: 6,
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22V8" />
          <path d="M4 12c0-4.4 3.6-8 8-8s8 3.6 8 8" />
          <path d="M12 2v2" />
          <path d="M4 12h2" />
          <path d="M18 12h2" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
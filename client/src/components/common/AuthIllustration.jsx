import React from "react";

export default function AuthIllustration() {
  return (
    <div style={{ width: "100%", maxWidth: 500, display: "flex", justifyContent: "center" }}>
      <svg
        viewBox="0 0 600 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "auto" }}
      >
        {/* Decorative soft background leaves */}
        <path
          d="M70 300C30 260 40 180 80 150C120 120 160 170 140 230C120 290 85 310 70 300Z"
          fill="#E0EDFF"
          opacity="0.8"
        />
        <path
          d="M500 240C540 210 560 150 520 120C480 90 450 140 460 200C470 260 490 250 500 240Z"
          fill="#D6E8FE"
          opacity="0.8"
        />
        <circle cx="150" cy="110" r="14" fill="#3B82F6" />
        <circle cx="480" cy="90" r="8" fill="#60A5FA" />
        <circle cx="90" cy="220" r="6" fill="#93C5FD" />
        <rect
          x="260"
          y="60"
          width="16"
          height="16"
          transform="rotate(45 260 60)"
          fill="#1E3A8A"
        />

        {/* Big stylized modern monitor screen */}
        <rect
          x="90"
          y="150"
          width="420"
          height="280"
          rx="14"
          fill="#FFFFFF"
          stroke="#D1D5DB"
          strokeWidth="4"
        />
        <rect
          x="110"
          y="170"
          width="380"
          height="240"
          rx="8"
          fill="#F8FAFC"
        />

        {/* Monitor Stand */}
        <path
          d="M275 434L260 470H340L325 434H275Z"
          fill="#CBD5E1"
        />
        <rect
          x="220"
          y="470"
          width="160"
          height="12"
          rx="6"
          fill="#2563EB"
        />

        {/* Inside monitor illustration: Dark drawing tablet */}
        <rect
          x="200"
          y="200"
          width="190"
          height="170"
          rx="12"
          transform="rotate(-8 200 200)"
          fill="#1E293B"
        />
        {/* Accent circle on tablet */}
        <circle cx="310" cy="270" r="24" fill="#EF4444" />
        <path
          d="M295 260L325 260M290 270L330 270M295 280L325 280"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Left hand holding edge */}
        <path
          d="M130 330C160 310 190 280 230 270C240 268 250 278 245 288C235 305 200 340 160 365C140 375 125 350 130 330Z"
          fill="#FBCFE8"
          stroke="#3B82F6"
          strokeWidth="2"
        />
        <path
          d="M120 360L160 330"
          stroke="#3B82F6"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Right hand holding pen/stylus */}
        <path
          d="M440 260C410 280 370 295 340 300C330 302 325 292 335 282C355 265 390 230 430 220C445 215 455 245 440 260Z"
          fill="#FBCFE8"
          stroke="#3B82F6"
          strokeWidth="2"
        />
        <line
          x1="380"
          y1="130"
          x2="330"
          y2="305"
          stroke="#EF4444"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <polygon points="325,318 335,305 322,302" fill="#1E293B" />
        <circle cx="370" cy="155" r="4" fill="#F8FAFC" />
        <circle cx="363" cy="180" r="4" fill="#F8FAFC" />
        <circle cx="356" cy="205" r="4" fill="#F8FAFC" />

        {/* Small bottom decorative shapes */}
        <circle cx="270" cy="385" r="4" fill="#2563EB" />
        <circle cx="285" cy="385" r="4" fill="#60A5FA" />
        <circle cx="300" cy="385" r="4" fill="#93C5FD" />
      </svg>
    </div>
  );
}

"use client";

import { useShowAnimation } from "@/providers/show-animation";

export default function HeaderEyes() {
  const { isShow } = useShowAnimation();

  if (!isShow) {
    return null;
  }

  return (
    <div
      className="header-eyes pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 100 40"
        className="header-eyes__svg"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path className="eyes-brow eyes-brow--left" d="M17 10 Q27 2 37 9" />

        <path className="eyes-brow eyes-brow--right" d="M63 9 Q73 2 83 10" />

        <ellipse cx="28" cy="27" rx="13" ry="16" fill="white" />
        <ellipse cx="72" cy="27" rx="13" ry="16" fill="white" />

        <g className="eyes-pupil eyes-pupil--left">
          <ellipse cx="31" cy="29" rx="5.5" ry="8" fill="#111" />
          <circle cx="33" cy="25" r="1.7" fill="white" stroke="none" />
        </g>

        <g className="eyes-pupil eyes-pupil--right">
          <ellipse cx="75" cy="29" rx="5.5" ry="8" fill="#111" />
          <circle cx="77" cy="25" r="1.7" fill="white" stroke="none" />
        </g>

        <ellipse cx="28" cy="27" rx="13" ry="16" />
        <ellipse cx="72" cy="27" rx="13" ry="16" />
      </svg>
    </div>
  );
}

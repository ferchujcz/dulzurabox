import React from "react";

export function Sparkle({
  className = "",
  size = 24,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`animate-twinkle ${className}`}
    >
      <path d="M12 0L13.8 8.2L22 12L13.8 15.8L12 24L10.2 15.8L2 12L10.2 8.2L12 0Z" />
    </svg>
  );
}

export function WaveDivider({
  className = "",
  fill = "#ffffff",
}: {
  className?: string;
  fill?: string;
}) {
  return (
    <div className={`w-full overflow-hidden leading-none ${className}`}>
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="relative block w-full h-10 md:h-16"
      >
        <path
          d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,50 L1200,120 L0,120 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}

export function Squiggle({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 20"
      className={`w-16 h-4 stroke-current fill-none stroke-[3] stroke-linecap-round ${className}`}
    >
      <path d="M 5,10 Q 15,0 25,10 T 45,10 T 65,10 T 85,10 T 95,10" />
    </svg>
  );
}

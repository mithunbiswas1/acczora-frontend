// src/app/(dashboard)/_components/BrandIcon.jsx

import React from "react";

export default function BrandIcon({ name, image, size = 32, className = "" }) {
  if (image) {
    return (
      <div
        className={`rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 bg-gray-50 border border-gray-100 ${className}`}
        style={{ width: size, height: size }}
      >
        <img
          src={image}
          alt={name || "Product"}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/review_avater.jpg";
          }}
        />
      </div>
    );
  }

  const brand = (name || "").toLowerCase();

  // 1. Netflix: Black squircle with red 'N'
  if (brand.includes("netflix")) {
    return (
      <div
        className={`rounded-lg bg-black flex items-center justify-center flex-shrink-0 shadow-xs ${className}`}
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#E50914]">
          <path d="M5.398 0v24c1.865-.366 3.684-.817 5.485-1.32V0H5.398zm7.719 0v20.485c1.892-.61 3.738-1.306 5.485-2.073V0h-5.485z" />
          <path d="M5.398 0h5.485l7.719 20.485h-5.485L5.398 0z" fill="#B81D24" />
        </svg>
      </div>
    );
  }

  // 2. Canva: Circle with vivid turquoise-purple-pink radial/linear gradient
  if (brand.includes("canva")) {
    return (
      <div
        className={`rounded-full flex items-center justify-center flex-shrink-0 shadow-xs overflow-hidden ${className}`}
        style={{
          width: size,
          height: size,
          background: "linear-gradient(135deg, #00C4CC 0%, #7D2AE8 50%, #FF007A 100%)",
        }}
      >
        <span className="text-white font-black text-xs italic font-serif">C</span>
      </div>
    );
  }

  // 3. Spotify / Mockup Octocat: Black circle with white silhouette (matching mockup)
  if (brand.includes("spotify")) {
    return (
      <div
        className={`rounded-full bg-[#18181b] flex items-center justify-center flex-shrink-0 shadow-xs ${className}`}
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
      </div>
    );
  }

  // 4. ChatGPT: Black rounded square with white spiral
  if (brand.includes("chatgpt") || brand.includes("openai")) {
    return (
      <div
        className={`rounded-lg bg-black flex items-center justify-center flex-shrink-0 shadow-xs ${className}`}
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
          <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.08 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.493zm-9.66-4.24a4.477 4.477 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.76zm-1.39-9.288a4.484 4.484 0 0 1 2.37-1.956v5.698a.79.79 0 0 0 .392.682l5.842 3.37-2.02 1.166a.08.08 0 0 1-.07 0l-4.839-2.793a4.506 4.506 0 0 1-1.675-6.167zm16.599 3.012-5.843-3.37 2.02-1.166a.08.08 0 0 1 .07 0l4.839 2.793a4.508 4.508 0 0 1-.676 8.105v-5.68a.79.79 0 0 0-.41-.682zm2.01-3.023-.141-.085-4.779-2.759a.775.775 0 0 0-.78 0L9.276 9.617V7.285a.08.08 0 0 1 .033-.062l4.84-2.793a4.5 4.5 0 0 1 6.53 4.654zM11.018 13.9l-2.433-1.39 2.433-1.405 2.433 1.405-2.433 1.39z" />
        </svg>
      </div>
    );
  }

  // 5. NordVPN: Orange circle with white logo
  if (brand.includes("nordvpn")) {
    return (
      <div
        className={`rounded-full bg-[#f97316] flex items-center justify-center flex-shrink-0 shadow-xs ${className}`}
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white stroke-white stroke-[0.5]">
          <path d="M12 4L3 9l9 5 9-5-9-5zM3 15l9 5 9-5M3 12l9 5 9-5" />
        </svg>
      </div>
    );
  }

  // Fallback
  return (
    <div
      className={`rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-700 font-bold text-xs ${className}`}
      style={{ width: size, height: size }}
    >
      {(name || "P").substring(0, 2).toUpperCase()}
    </div>
  );
}

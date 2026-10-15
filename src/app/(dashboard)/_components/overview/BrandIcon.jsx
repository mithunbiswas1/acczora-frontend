// src/app/(dashboard)/_components/overview/BrandIcon.jsx

import React from "react";

export default function BrandIcon({ name, size = 36, className = "" }) {
  const brand = (name || "").toLowerCase();

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
        <span className="text-white font-black text-sm italic font-serif">C</span>
      </div>
    );
  }

  if (brand.includes("spotify")) {
    return (
      <div
        className={`rounded-full bg-black flex items-center justify-center flex-shrink-0 shadow-xs ${className}`}
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#1DB954]">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.307c-.218.358-.683.473-1.042.254-2.857-1.746-6.453-2.14-10.689-1.173-.41.094-.816-.164-.91-.573-.093-.41.164-.816.574-.91 4.636-1.06 8.608-.614 11.813 1.345.359.219.473.684.254 1.057zm1.47-3.266c-.275.448-.86.59-1.308.314-3.27-2.01-8.254-2.593-12.122-1.417-.504.153-1.04-.134-1.193-.638-.153-.503.135-1.04.638-1.193 4.417-1.34 9.912-.686 13.67 1.626.448.276.59.86.315 1.308zm.126-3.41c-3.921-2.328-10.384-2.543-14.135-1.404-.6.182-1.24-.16-1.423-.76-.182-.6.16-1.24.76-1.423 4.312-1.31 11.446-1.06 15.96 1.62.538.32.713 1.018.394 1.557-.319.539-1.017.714-1.556.395z" />
        </svg>
      </div>
    );
  }

  if (brand.includes("chatgpt") || brand.includes("openai")) {
    return (
      <div
        className={`rounded-lg bg-black flex items-center justify-center flex-shrink-0 shadow-xs ${className}`}
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
          <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.08 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.493zm-9.66-4.24a4.477 4.477 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.76zm-1.39-9.288a4.484 4.484 0 0 1 2.37-1.956v5.698a.79.79 0 0 0 .392.682l5.842 3.37-2.02 1.166a.08.08 0 0 1-.07 0l-4.839-2.793a4.506 4.506 0 0 1-1.675-6.167zm16.599 3.012-5.843-3.37 2.02-1.166a.08.08 0 0 1 .07 0l4.839 2.793a4.508 4.508 0 0 1-.676 8.105v-5.68a.79.79 0 0 0-.41-.682zm2.01-3.023-.141-.085-4.779-2.759a.775.775 0 0 0-.78 0L9.276 9.617V7.285a.08.08 0 0 1 .033-.062l4.84-2.793a4.5 4.5 0 0 1 6.53 4.654zM11.018 13.9l-2.433-1.39 2.433-1.405 2.433 1.405-2.433 1.39z" />
        </svg>
      </div>
    );
  }

  if (brand.includes("nordvpn")) {
    return (
      <div
        className={`rounded-full bg-gradient-to-tr from-[#EA4335] via-[#FBBC05] to-[#4285F4] flex items-center justify-center flex-shrink-0 shadow-xs ${className}`}
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
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

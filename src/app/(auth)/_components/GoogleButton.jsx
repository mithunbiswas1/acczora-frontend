// src/app/(auth)/_components/GoogleButton.jsx

import Image from "next/image";

export default function GoogleButton({
  onClick,
  disabled = false,
  showDivider = true,
  dividerText = "or",
}) {
  return (
    <div className="w-full">
      {showDivider && (
        <div className="relative my-4 sm:my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs text-gray-400">
            <span className="bg-white px-3 font-normal">{dividerText}</span>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="w-full flex items-center justify-center gap-2.5 py-2.5 sm:py-2.5 px-4 rounded-lg border border-gray-200 hover:bg-gray-50/80 active:bg-gray-100 text-sm font-medium text-gray-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <Image
          src="/logo_image/google.png"
          alt="Google"
          width={18}
          height={18}
          className="w-4 h-4 object-contain"
        />
        <span>Continue with Google</span>
      </button>
    </div>
  );
}

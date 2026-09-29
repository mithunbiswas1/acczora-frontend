// src/app/(auth)/_components/AuthInput.jsx

"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function AuthInput({
  label,
  id,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
  autoComplete,
  className = "",
  disabled = false,
  ...props
}) {
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);

  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id || name}
          className="block text-xs font-semibold text-gray-800 mb-1.5"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        <input
          id={id || name}
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          className={`w-full px-3.5 py-2.5 sm:py-3 text-sm rounded-lg border bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none transition-colors ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              : "border-gray-200 focus:border-[#6558ff] focus:ring-1 focus:ring-[#6558ff]"
          } ${isPassword ? "pr-10" : ""} ${
            disabled ? "opacity-60 cursor-not-allowed bg-gray-50" : ""
          } ${className}`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            className="absolute right-3 p-1 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="w-4.5 h-4.5 stroke-[1.7]" />
            ) : (
              <Eye className="w-4.5 h-4.5 stroke-[1.7]" />
            )}
          </button>
        )}
      </div>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

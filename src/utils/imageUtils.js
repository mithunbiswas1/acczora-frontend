// src/utils/imageUtils.js

/**
 * Ensures any image source passed to Next.js <Image /> is a valid format:
 * - Absolute URL (http:// or https://)
 * - Valid relative path starting with "/"
 * - Safe fallback if invalid, null, undefined or empty
 */
export function getSafeImageSrc(src, fallback = "/product_demo_image.jpg") {
  if (!src) return fallback;

  if (typeof src !== "string") {
    if (typeof src === "object" && (src.src || src.url || src.image)) {
      return getSafeImageSrc(src.src || src.url || src.image, fallback);
    }
    return fallback;
  }

  const trimmed = src.trim();
  if (
    trimmed === "" ||
    trimmed === "undefined" ||
    trimmed === "null" ||
    trimmed === "[object Object]"
  ) {
    return fallback;
  }

  // Already absolute URL
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  // Starts with leading slash
  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  // Relative path without leading slash (e.g. "0.png" -> "/0.png")
  return `/${trimmed}`;
}

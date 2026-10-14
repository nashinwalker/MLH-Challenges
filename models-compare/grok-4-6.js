/**
 * Reverse a string by grapheme clusters (handles emoji, ZWJ sequences, accents).
 * Falls back to code-point iteration if Intl.Segmenter is unavailable.
 *
 * Edge cases:
 * - Surrogate pairs (🚀, 𝄞): split("") / index loops split UTF-16 pairs
 * - ZWJ sequences (👨‍👩‍👧‍👦): code-point reverse breaks the family
 * - Skin tones (👋🏽): base + modifier can separate
 * - Flags (🇺🇸): two regional indicators = one flag
 * - Combining marks (e + ́): mark can detach from base
 *
 * Time complexity: O(n) time, O(n) space
 * where n is the string length in UTF-16 code units.
 */
function reverseString(str) {
  if (typeof str !== "string") {
    throw new TypeError("Expected a string");
  }

  if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
    const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
    return [...segmenter.segment(str)].map((s) => s.segment).reverse().join("");
  }

  // Fallback: reverse by Unicode code points (fixes surrogates, not ZWJ families)
  return Array.from(str).reverse().join("");
}

module.exports = { reverseString };

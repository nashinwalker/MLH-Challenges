/**
 * Composer 2.5 solution: reverse a string by user-perceived characters
 * (grapheme clusters), not UTF-16 code units — so emojis, combining marks,
 * and ZWJ sequences stay intact.
 *
 * Edge cases:
 * - Empty string: return '' immediately
 * - Astral symbols / surrogate pairs (🚀): must not split UTF-16 halves
 * - Combining marks (e + ́): one grapheme with Intl.Segmenter
 * - ZWJ sequences (👨‍👩‍👧‍👦): only grapheme segmentation keeps the family intact
 * - Flags, skin tones, keycaps: multiple code points, one perceived character
 * - Unpaired surrogates: preserved as-is, not "fixed"
 *
 * Time: O(n) where n is UTF-16 length (g graphemes, g ≤ n)
 * Space: O(n) for the grapheme array plus the output string
 */

/**
 * @param {string} str
 * @returns {string}
 */
function reverseString(str) {
  if (typeof str !== "string") {
    throw new TypeError("reverseString expects a string");
  }

  if (str.length === 0) {
    return "";
  }

  const graphemes = splitGraphemes(str);
  graphemes.reverse();
  return graphemes.join("");
}

/**
 * @param {string} str
 * @returns {string[]}
 */
function splitGraphemes(str) {
  if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
    const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    return [...segmenter.segment(str)].map((part) => part.segment);
  }

  // Fallback: code points via Array.from — fixes surrogate pairs (🚀)
  // but may split ZWJ emoji sequences and some combining sequences.
  return Array.from(str);
}

module.exports = { reverseString };

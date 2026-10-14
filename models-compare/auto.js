/**
 * Auto (Cursor) solution: reverse a string by user-perceived characters
 * (grapheme clusters). Named third-party models were unavailable on this
 * plan, so this run used Auto.
 *
 * Why not str.split('').reverse().join('')?
 *   JS strings are UTF-16. Code points outside the BMP (most emoji) are
 *   stored as surrogate pairs. Splitting by code unit splits those pairs.
 *
 * Why not [...str] / Array.from(str)?
 *   Spread iterates by Unicode code point, so 🚀 stays intact, but ZWJ
 *   sequences (👨‍👩‍👧‍👦), combining marks, skin-tone modifiers, and flag
 *   pairs (🇺🇸) still split. Reversing those pieces breaks the glyph.
 *
 * Approach: Intl.Segmenter({ granularity: 'grapheme' }) (UAX #29),
 * reverse that array, join.
 *
 * Edge cases:
 *   - Empty string / null / undefined → ""
 *   - BMP ASCII/Latin: same as a naive reverse
 *   - Surrogate pairs: 🚀, 𝄞 stay one unit
 *   - ZWJ emoji: 👨‍👩‍👧‍👦 remains one family glyph
 *   - Combining marks / variation selectors stay attached
 *   - Regional-indicator flags (🇺🇸) stay one flag
 *   - Unpaired / lone surrogates: still emitted as segments
 *
 * Complexity (n = UTF-16 length, g = grapheme count, g ≤ n):
 *   Time  O(n) to segment + O(g) to reverse/join → O(n)
 *   Space O(n) for the segment array and the output string
 */
"use strict";

function reverseString(input) {
  if (input == null) return "";
  const str = typeof input === "string" ? input : String(input);
  if (str.length === 0) return "";

  const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
  const graphemes = [];
  for (const { segment } of segmenter.segment(str)) {
    graphemes.push(segment);
  }

  graphemes.reverse();
  return graphemes.join("");
}

module.exports = { reverseString };

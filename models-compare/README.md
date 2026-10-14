# Models Compare

Solutions to the same prompt from different models, one file per model.

## Prompt

Write a JavaScript function that reverses a string, properly handling Unicode characters and emojis (e.g., surrogate pairs like `👨‍👩‍👧‍👦` or `🚀`). Explain the edge cases and time complexity.

## Files

| File | Model |
|------|--------|
| `grok-4-6.js` | Grok 4.6 |

## Approach (`grok-4-6.js`)

`reverseString` reverses **grapheme clusters** (user-perceived characters), not UTF-16 code units.

1. Prefer `Intl.Segmenter` with `granularity: "grapheme"`.
2. If Segmenter is unavailable, fall back to `Array.from(str)` (code points). That keeps surrogate pairs intact but can still split ZWJ family emoji.

### Why naive reverse breaks Unicode

JavaScript strings are UTF-16. Emoji outside the BMP use **surrogate pairs**. Family emoji and skin tones are **multiple code points** joined with ZWJ or modifiers — one visual character, many code points.

```javascript
"🚀".split("").reverse().join("");           // often garbles surrogates
[..."👨‍👩‍👧‍👦"].reverse().join("");      // splits the family into pieces
```

### Edge cases

| Case | Example | What goes wrong |
|------|---------|-----------------|
| Surrogate pairs | `🚀`, `𝄞` | `.split("")` / index loops split pairs |
| ZWJ sequences | `👨‍👩‍👧‍👦` | Code-point reverse breaks the family |
| Skin tones | `👋🏽` | Base + modifier can separate |
| Flags | `🇺🇸` | Two regional indicators = one flag |
| Combining marks | `é` (e + ́) | Mark can detach from base |
| Empty / ASCII | `""`, `"abc"` | Fine with any method |

### Time and space complexity

**O(n) time, O(n) space**, where *n* is the string length in UTF-16 code units.

Segmenting, reversing the grapheme array, and joining are all linear. Extra space is needed for the segment array; in-place reverse is not practical because graphemes have unequal UTF-16 width.

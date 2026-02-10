# Development Guide

Ensure your code is _declarative_, _elegant_, _functional_, and _maintainable_. Prefer expressions, avoid nesting, and return early. Check your work using type checks and linting.

## Declarative Resilience

Write HTML/CSS/JS to be robust by default:

- Prefer semantic structure and native elements over extra wrappers or utility-only markup.
- Keep CSS selectors low-specificity and simple.
- Use class names intentionally for stable structure (for example component block + repeated child role), not for one-off visual tweaks.
- In scoped component styles, prefer readable local structure over selector tricks; choose the simplest pattern that stays explicit.
- Let layout adapt naturally with good defaults (wrapping, intrinsic sizing, empty-state handling) before adding special-case logic.
- For centered navigation or content flanked by uneven side elements, use declarative layout primitives (for example symmetric grid tracks) so alignment is mathematically correct.
- Treat imperative logic as a last mile tool for behavior that cannot be expressed declaratively.
- Optimize for extensibility: future changes should require adding small rules, not rewriting existing structure.

Checkout the [astro doc](https://v6.docs.astro.build/llms.txt) when working on anything specific to Asto.

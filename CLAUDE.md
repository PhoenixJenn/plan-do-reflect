# CLAUDE.md

Guidance for Claude (CLI or otherwise) when working in this repository.

## What this is

The website for Plan-Do-Reflect (see `~/Projects/claude_projects/plan-do-reflect/plan-of-attack.md` for the full project plan — that's the sibling repo with the content/taxonomy/catalog work; this repo is just the site).

## Current state (as of 2026-08-16)

A static HTML/CSS/JS prototype, not yet a framework. It exists to explore look-and-feel before committing to a final design and a build system:

- `index.html` — one page: top nav (the taxonomy's 7 root categories) + left sidebar nav (journey-ordered sub-categories, currently showing Self-Management's children) + a content mock for "Reflection Practice" (the homepage's organizing theme — see the project plan's "What we're building" section for why that node specifically).
- `css/tokens.css` — **the single source of design truth.** Four style directions, each a `[data-theme="a|b|c|d"]` block of CSS custom properties (colors, fonts). No other file should hardcode a hex value or font-family.
- `css/main.css` — layout and components. Reads only `var(--...)` from tokens.css. The one deliberate exception is `.theme-switch button[data-theme="x"]` — those need fixed reference colors so the toggle can show all four options regardless of which is active.
- `js/theme-toggle.js` — applies the chosen theme, persists it to `localStorage` under `pdr-theme`.

The 4 directions, and what to call them if referenced elsewhere:
- **A — Studio Ledger** (dusty rose / gray / white, Space Grotesk + Work Sans)
- **B — Command Blue** (vibrant blue / white / charcoal, Outfit + DM Sans)
- **C — Bright Margin** (white / gray / lime, Sora + Plus Jakarta Sans)
- **D — Kinetic Signal** (gray / black / bright yellow, Sora + Work Sans)

None chosen yet as final — that's the open question blocking further Phase 3/5 work (see the project plan's "Open questions for you").

## Design brief, if design work continues here

The user's brief, given directly and worth preserving verbatim intent: **"executive whimsical" — serious but fun, approachable but authoritative.** Explicitly rejected as too sterile: Masterclass, HBR, TED, FranklinCovey. Explicitly wants this different from the user's other three sites (dark/neon tech, comic-book, and dark cockpit-dashboard aesthetics respectively — none of those should be replicated here). Explicitly **hates serif fonts** — sans-serif only, no exceptions. Full brief and Gemini's response to it: `~/Projects/claude_projects/plan-do-reflect/work-in-progress/design-prompts.md` and `gemini-response.md`.

## Tech stack — not yet decided/migrated

Currently plain static HTML/CSS/JS (no build step), matching the pattern of the user's other `*-www` sites. The standing recommendation (made when discussed directly, not yet acted on) is to migrate to **Next.js** once a design direction is locked in: the user already knows React/Tailwind/Node, Next's App Router renders to static HTML by default, it satisfies a stated "no API layer" preference, and it won't need re-platforming when an agent/interactive features are added later (see the project plan's Phase 6). The `tokens.css` custom-property structure maps almost directly to a Tailwind theme config, so the migration should be mechanical once triggered — don't do it preemptively, wait for the style-direction decision first.

## Working conventions

- Don't hardcode colors or fonts in page markup or `main.css` — add/extend tokens in `tokens.css` instead. This is a hard requirement from the user (explicitly: "no hardcoded formats on individual pages" so a design pivot doesn't require touching every page).
- Content on this site (once real content starts landing) must be original — see the sibling repo's "Ground rules" on copyright/IP. Nothing from `reference/` (raw Pinterest images) or employer-branded Manager Toolbox material ships here directly.

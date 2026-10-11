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
- **Top nav and footer/theme-switch are not hand-authored per page.** Every page has `<div id="site-topnav"></div>` and `<div id="site-footer"></div>` placeholders; `js/site-chrome.js` (loaded first, `defer`, before `theme-toggle.js`) fills them in at runtime from one shared template, with the active nav item driven by `data-nav="..."` on `<body>`. To change the nav (add/remove/rename a section) or the footer, edit `js/site-chrome.js` once — never hand-edit the placeholder or add real nav/footer markup back into an individual page. Deliberately not `fetch()`-based, since this site is previewed by opening the HTML file directly (`file://`), which blocks `fetch()` of local files under CORS. New pages: add the two placeholder divs, set `data-nav` to the right top-level section (or omit it, like `index.html`, for no active highlight), and include the `site-chrome.js` script tag before the other deferred scripts — copy an existing page's `<head>`/script-tag block rather than retyping it.
- **The big page-title elements (page-hero h1, homepage hero-title) always render in Golos Text**, via `--font-title` in `tokens.css` and the permanent `.content h1, .hero-title, .page-title` rule in `main.css` — fixed across all three themes, unlike `--font-heading` (h2/h3/etc.), which is still redefined per `[data-theme]`. There is no picker or toggle for this anymore; it was decided and folded in.
- **Real-world examples under a bullet go in a `.li-example` gray box, not inline in the bullet's own sentence.** `<li><strong>Label</strong> — description.<span class="li-example">Company examples here.</span></li>` — keeps the definition scannable on its own and the citations visually separable. Established on `strategic-planning.html`'s Strategic Theme list; use it anywhere else a bulleted framework list wants to cite named companies/examples.

## When a page is "boring" / "boxy" / "bullety"

**`icon-library.html` is the design pattern reference — read its Components and Icons sections first, before inventing a new one-off treatment or re-scanning other pages for ideas.** It's kept current: every reusable pattern gets added there as part of the work that introduces it (see the Components section's own entries for the source page of each).

The toolkit, as of the last pass (vision-mission.html, organization.html, strategic-planning.html):
- **Concept Card Grid** (`.mvv-grid`/`.mvv-card`, add `.is-auto` for anything other than 3 cards) — turns "N related but distinct things" from a flat bulleted list into an icon-led card grid, one card per concept, each with its own accent color via an inline `--mvv-color` custom property (reuse the class names even for a non-MVV set of concepts — it's generic; coequal/non-sequential concepts can share one color instead of inventing N arbitrary distinctions).
- **Icon List Item** (`.stage-box-item.has-icon` / `-icon` / `-body`) — opt-in icon slot for an existing linked-list pattern. Opt-in on purpose since the base class is reused elsewhere without icons.
- **Matrix Diagram** (`.matrix-diagram`) — real-text 2x2 grid with axis labels, for any 2x2 framework.
- **Forces Diagram** (`.forces-diagram`) — real-text plus-shaped 5-cell grid (one center + four around it), for any "four things act on one central thing" framework.
- **Doodle Note** (`.doodle-note`/`.doodle-row`) — a small hand-drawn-style icon + gold left border for an aside/callout, without switching the body text to a handwriting font (tried once, felt like "too much work").
- **Pull Quote** (`.pull-quote`) — real, sourced book/person quotes only, gold left border.
- **Example Box** (`.example-box`/`.example-label`) — dashed border, for a worked example inside denser framework content.
- **`.li-example`** — see above; inline citation under one bullet rather than a full example box.
- A page that's still just `<ul>` bullets in `.section-block` boxes after applying the above is a sign to look for a grouping the content already implies (3+ related concepts → card grid; a 2x2 or 4-around-1 framework → the matching diagram; a sequence of named steps → numbered list `.num-list`/`.num-badge`; a worked example → example box) rather than leaving it as undifferentiated bullets.

**Check for a width cap eating the page's horizontal room before concluding a section is just "tall."** `.framework-list` (the shared wrapper for numbered framework-item steps, used on ~12 pages) caps at `max-width: 640px` for prose readability — exactly what makes a wide card grid or diagram wrap into far more rows than it needs, even though `.content` itself has no max-width and plenty of width is sitting unused beside it. Fix: add `.framework-list.is-wide` (widens the cap to 960px) to that one page, then cap the plain prose `<p>`/`<ul>` elements back to `max-width: 640px` individually with inline styles so body text doesn't stretch uncomfortably wide — only the grid/diagram/num-list elements should use the freed-up width. Established on strategic-planning.html.

**Line-length rule — don't leave a width uncapped.** Two standard measures, pick one rather than inventing a third or leaving `max-width: none`:
- **640px** — the default. Anything that's prose (a `<p>` of a sentence or more, an `<ul>` of explainer bullets, `.insight-aside` body text) gets this, as an inline `max-width: 640px` on the element itself if its container is wider. ~75-90 characters/line at this site's body sizes — the standard "reading measure," past which eyes struggle to track back to the next line start.
- **960px** — for a section whose content is wider than prose (a card grid, a diagram, a num-list with worked examples) but that still shouldn't sprawl to the container's full width on a large monitor. This is what `.framework-list.is-wide` sets. Tried fully uncapped (`max-width: none`) first — it read as "too wide" in practice: a 5-up card grid stretched thin, a 560px diagram stranded in a sea of whitespace. Capped-but-roomy beat unlimited.
- A component with its own explicit cap (`.matrix-diagram` at 460px, `.forces-diagram` at 560px) doesn't need either of the above — those are sized for their own content, not prose.

When a fix introduces a genuinely new reusable pattern (not a one-off), add it to `icon-library.html` in the same pass — that's what keeps this reference trustworthy instead of going stale like the rest of this file.

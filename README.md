# plan-do-reflect-www

Website for the Plan-Do-Reflect infographic library — see `~/Projects/claude_projects/plan-do-reflect/plan-of-attack.md` for the full project plan (content, taxonomy, catalog all live in that sibling repo).

**Current state:** a static HTML/CSS/JS prototype exploring look-and-feel, not a final build. Open `index.html` directly in a browser — no server needed. There's a style-direction toggle bottom-right (3 candidates, in this order: Kinetic Signal, Studio Ledger, Bright Margin); it swaps the whole page instantly and remembers your last choice.

The color/type system lives entirely in `css/tokens.css` as CSS custom properties — `css/main.css` and `index.html` only ever reference `var(--...)`, never a hardcoded hex or font name, so adding a new direction or changing the final one won't require touching individual pages.

See `CLAUDE.md` for fuller orientation (design brief, tech-stack plan, working conventions) if you're picking this back up in a new session.

Planned once a direction is chosen: filterable infographic gallery, Tip of the Day, Learning Plans, and an embedded agent — deployed to Vercel on the existing domain, likely migrated to Next.js (see `CLAUDE.md`).

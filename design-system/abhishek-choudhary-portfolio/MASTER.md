# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/abhishek-choudhary-portfolio/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Abhishek Choudhary Portfolio
**Direction:** Linear-grade dark minimal + AI-native engineer
**Category:** Personal portfolio for an AI-native full-stack engineer (target: SDE roles, US/EU)
**Updated:** 2026-05-23 (Issue #2)

---

## Global Rules

### Visual thesis

This site reads as **production engineer**, not **chatbot startup**. Dark, restrained, sharp. A single warm accent (amber) earns attention only on the elements that should be touched — CTAs, current-section pip, links on hover. Architecture diagrams and code are the dominant visual content, not gradients or photographs.

### Color Palette

All colors are expressed as HSL components (Tailwind v3 / shadcn convention). The CSS variables hold only the HSL components — `hsl(var(--background))` is the consumed form.

| Role | HSL | Hex (approx) | CSS Variable | Usage |
|---|---|---|---|---|
| Background | `222 16% 6%` | `#0D1018` | `--background` | Page background — deepened in the cinematic pass; blue-charcoal (trust undertone), never pure black |
| Foreground | `0 0% 96%` | `#F5F5F5` | `--foreground` | Primary text |
| Muted | `220 12% 12%` | `#1B1E26` | `--muted` | Translucent card washes (`bg-muted/30`) |
| Surface | `221 13% 9%` | `#14171F` | `--surface` | **Opaque** card surfaces (anything that stacks/overlaps, e.g. work-page card deck) |
| Muted foreground | `220 8% 64%` | `#9CA0AB` | `--muted-foreground` | Secondary text, labels |
| Border | `220 10% 16%` | `#252932` | `--border` | Hairline borders, dividers |
| Accent | `18 91% 58%` | `#F18A3A` | `--accent` | CTAs, active nav, link hover, current pip |
| Accent foreground | `20 80% 6%` | `#1A0E04` | `--accent-foreground` | Text on accent backgrounds |
| Ring | `18 91% 58%` | `#F18A3A` | `--ring` | Focus rings, identical to accent |

**Background depth layers** (combined to escape "flat void" perception):
1. Solid `--background` (the HSL above)
2. `<Noise />` overlay — ~3.5% opacity SVG turbulence, `mix-blend-overlay`, fixed across viewport
3. `<Spotlight />` — radial gradient at cursor position, `hsl(var(--accent) / 0.06)`, fixed
4. `<HeroAmbient />` — radial amber glow at top of hero only, 8% opacity, fades to transparent at 65% (doubles as the static fallback for the shader)
4b. `<EmberField />` — WebGL fbm ember heat-field over the hero, cursor-reactive, ~60% opacity canvas; see Motion section + anti-patterns exceptions
5. `<DotGrid />` — 24px grid with radial mask, hero-section-only

**Color rules:**
- Default page contrast: foreground on background = 19.4:1 (well above WCAG AAA).
- Accent is used **sparingly** — at most one accent element per viewport above-the-fold (the CTA), plus inline link hover and active nav pip.
- No purple, no neon, no pink, no AI-gradient backgrounds. Anti-pattern enforced in `docs/anti-patterns.md`.

### Typography

- **Sans:** Geist (loaded via `next/font/google`, variable `--font-sans`)
- **Mono:** Geist Mono (variable `--font-mono`)
- **Hierarchy:**
  - Display (hero name): `clamp(2.75rem, 8vw, 5rem)` — `font-weight: 600`, `letter-spacing: -0.02em`
  - H1 (page titles): `1.875rem` — `font-weight: 600`, `letter-spacing: -0.01em`
  - H2 (section titles): `1.25rem` — `font-weight: 600`
  - Body: `1rem` / `1.6` line-height
  - Body small: `0.875rem`
  - Mono labels / kicker text: `0.75rem`, uppercase, `letter-spacing: 0.15em`, `--muted-foreground`

**Geist character:** geometric, slightly humanist, very legible at small sizes. Designed for developer interfaces. Stays out of the way.

### Spacing Variables

| Token | Value | Usage |
|---|---|---|
| `--space-xs` | `4px` | Tight gaps inside controls |
| `--space-sm` | `8px` | Inline element gaps |
| `--space-md` | `16px` | Standard padding |
| `--space-lg` | `24px` | Section padding inside cards |
| `--space-xl` | `40px` | Card-to-card spacing |
| `--space-2xl` | `64px` | Section spacing (page-level) |
| `--space-3xl` | `96px` | Hero/section separators |

Layout grid: 12 columns at `≥ 1024px`, `max-width: 64rem (1024px)`, gutter `24px`. Below `1024px`, single-column with `24px` horizontal padding.

### Borders & radii

| Token | Value | Usage |
|---|---|---|
| `--radius` | `0.625rem` (10px) | Default — cards, buttons |
| `--radius-sm` | `calc(var(--radius) - 4px)` = 6px | Badges, pills |
| `--radius-md` | `calc(var(--radius) - 2px)` = 8px | Inputs |

Borders are **never** thicker than 1px. We do not use elevation/depth via thick borders; we use hairlines on muted backgrounds.

### Shadows

Shadows are used **only** for floating elements (toasts, popovers). Project cards, hero, and content surfaces use background-color contrast (`muted` over `background`) — not shadows.

| Level | Value | Usage |
|---|---|---|
| `--shadow-sm` | `0 1px 0 0 hsl(var(--border))` | Subtle bottom hairline |
| `--shadow-md` | `0 4px 16px -4px hsl(0 0% 0% / 0.4)` | Popovers, dropdowns |
| `--shadow-lg` | `0 12px 32px -8px hsl(0 0% 0% / 0.5)` | Modals only |

### Motion

| Token | Value | Usage |
|---|---|---|
| `--motion-fast` | `120ms` | Hover state transitions |
| `--motion-base` | `220ms` | Default transitions |
| `--motion-slow` | `420ms` | Fade-up reveals, page transitions |
| Easing: `cubic-bezier(0.2, 0.8, 0.2, 1)` | | Confident ease-out, no bouncy spring on UI |

All motion gated by `@media (prefers-reduced-motion: reduce)` → durations collapse to `0ms`.

**Cinematic layer (added 2026-06-12).** Scroll choreography stack: Lenis
(inertia scroll, desktop fine-pointer only) + GSAP ScrollTrigger/SplitText +
Framer Motion for micro-interactions. Grammar:

- *Scrubbed, not timed*: scroll-driven sequences (work-deck recede,
  featured-rail horizontal travel, outro character fill) map 1:1 to scroll
  position — the user is the playhead.
- *Masked line reveals* (`RevealText`) for headings; *blur-clear letter
  rise* (`LetterReveal`) for the hero name; *terminal scramble decode*
  (`ScrambleText`) for the role line — mount-once.
- *Ambient exceptions* (status dots, velocity marquee, `EmberField` WebGL
  ember shader) are documented in `docs/anti-patterns.md`.
- Every GSAP effect sits inside `gsap.matchMedia("(prefers-reduced-motion:
  no-preference)")`; Lenis and the shader bail out entirely for
  reduced-motion users.

**Display accent face (added 2026-06-12):** Instrument Serif italic
(`--font-display`, `font-display` utility) — single emphasised words inside
display headlines only ("real", "production"). Never for body, labels, or
more than one word per headline.

---

## Component Specs

### Buttons (from `components/ui/button.tsx`)

Already implemented per shadcn convention. Variants:

- `default` (primary): `bg-accent text-accent-foreground hover:bg-accent/90`
- `outline`: `border-border bg-transparent hover:bg-muted hover:text-foreground`
- `ghost`: `hover:bg-muted hover:text-foreground`
- `link`: `text-accent underline-offset-4 hover:underline`

Size scale: `sm` (h-8 px-3), `default` (h-9 px-4), `lg` (h-10 px-8), `icon` (h-9 w-9).

### Project Cards (lands in Issue #3)

Surface: `bg-muted` over `bg-background`. Border: 1px hairline `border-border`. Padding: `--space-lg`. Radius: `--radius`. Inside: architecture diagram (top), title + year (h2), summary, tech stack badges (mono labels), links row. Hover: border lifts to `border-foreground/30` over `--motion-fast`. No scale or shadow on hover (anti-pattern).

### Architecture diagrams (lands in Issue #5)

Hand-tuned inline SVG per hero project. Use `currentColor` for strokes so the diagram inherits foreground color (`--foreground` for primary, `--muted-foreground` for secondary). Accent color reserved for the "you are here" element only. Stroke width 1.5px. Type inside diagrams uses Geist Mono at 12px.

### Inputs (chat agent, contact form if added)

Background: `bg-muted`. Border: 1px `border-border`. Focus: `ring-1 ring-accent`. Padding: `12px 16px`. Radius: `--radius-md`. Mono font for code-style input affordances; sans for prose.

### Chat agent (lands in Issue #7)

Input is a single-line field with mono prefix `>` and a subtle blinking caret cue. Streamed output renders in `font-sans` with code blocks in Geist Mono on `bg-background` over the muted chat surface. Source citations appear as small mono labels under the answer.

---

## Style Guidelines

**Style:** Linear-grade dark minimal + AI-native engineer (production-code aesthetic).

**Keywords:** Restrained, sharp, dark, mono accents, hairline borders, generous whitespace, single warm accent, anti-gradient.

**Best For:** Engineer portfolios, developer-tool marketing, technical writing.

**Key Effects:**
- Sticky header with `bg-background/70 backdrop-blur` (subtle, not glassy)
- Fade-up on scroll for project cards (`opacity 0 → 1`, `translateY 12px → 0`, `--motion-slow`)
- Underline-on-hover for inline links (no color change)
- Magnetic micro-pull (≤ 6px) on the primary CTA button only
- A single one-time scramble effect on the hero thesis (Issue #12)

### Page Pattern

Multi-page site, not a single-scroll portfolio.

- `/` — Hero (name, thesis, AI agent CTA) → Featured Work (3 projects horizontal strip)
- `/work` — All 5 projects as cards (vertical stack on mobile, 2-col on desktop)
- `/work/[slug]` — Case study: Problem → Architecture → Decisions → Stack → Links
- `/writing` — Posts list (date desc)
- `/writing/[slug]` — MDX post with TOC, code highlighting, Mermaid
- `/about` — Narrative + structured facts
- `/contact` — Email, LinkedIn, GitHub (Cal.com optional)

---

## Anti-Patterns (Do NOT Use)

- ❌ **Purple / blue / pink AI gradients** — the "ChatGPT wrapper aesthetic" is what we are explicitly *not*
- ❌ **Emojis as icons** — use SVG (Lucide already installed)
- ❌ **Glass blur on top of content** — backdrop-blur only on the sticky header
- ❌ **Auto-playing motion** — all motion is on user trigger (hover/scroll/mount-once)
- ❌ **Scale transforms on hover** — they cause layout shift and feel cheap
- ❌ **Drop shadows on cards** — use border-color and surface contrast instead
- ❌ **Marketing-y copy** ("Welcome to my world!", "Let's build something amazing together") — write like an engineer, not a Webflow template
- ❌ **Decorative photography / hero images of laptops** — architecture diagrams or empty space, no stock
- ❌ **Toggleable themes (light mode)** — the site is dark, period; one less decision, one less state to test
- ❌ **Carousels** — anything important is worth a permanent place; carousels hide content
- ❌ **Low-contrast accent text** — accent on background must pass WCAG AA at minimum
- ❌ **Layout-shifting hovers** — no `transform: scale()` on interactive elements
- ❌ **Instant state changes** — always `--motion-fast` minimum (120ms)
- ❌ **Invisible focus states** — keyboard focus must be visible (`ring-1 ring-accent`)

---

## Pre-Delivery Checklist

Before merging any UI change, verify:

- [ ] No emojis used as icons (Lucide only)
- [ ] All clickable elements have `cursor: pointer`
- [ ] Hover/focus transitions use `--motion-fast` or `--motion-base`
- [ ] Text contrast ≥ 4.5:1 on body, ≥ 3:1 on large text (verified with a contrast tool)
- [ ] Focus states visible for keyboard navigation (`ring-1 ring-accent`)
- [ ] `prefers-reduced-motion: reduce` honored (motion durations → 0)
- [ ] Tested at 375 / 768 / 1024 / 1440 viewports
- [ ] No content hidden behind the sticky header
- [ ] No horizontal scroll on mobile
- [ ] No `console.log` or `console.error` left in shipped code
- [ ] No accent gradient (anti-pattern)
- [ ] Component uses design tokens, not raw Tailwind colors (`bg-background` not `bg-zinc-950`)

---

## Owner approval

- [ ] **Owner: approved palette + type direction** *(blocks Issue #2 completion)*


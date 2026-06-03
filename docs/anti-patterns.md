# Anti-Patterns — Things This Portfolio Does Not Do

This is the short list. The full design system + reasoning lives in
[`design-system/abhishek-choudhary-portfolio/MASTER.md`](../design-system/abhishek-choudhary-portfolio/MASTER.md).

Every PR should be checked against this list before merge.

## Visual

- ❌ **Purple / blue / pink AI gradients.** The "ChatGPT wrapper" look. We are positioned *against* that aesthetic.
- ❌ **Decorative photography.** No stock laptop hero shots, no people pointing at code. The dominant visual is an architecture diagram or empty space.
- ❌ **Emojis as icons.** Lucide (already installed) only.
- ❌ **Toggleable light mode.** Site is dark, period.
- ❌ **Glass blur over content.** Backdrop-blur is reserved for the sticky header alone.
- ❌ **Drop shadows on cards.** Use border + surface contrast.
- ❌ **Bouncy spring motion.** Confident ease-out only.

## Copy

- ❌ "Welcome to my world." / "Let's build something amazing together." / "Passionate about clean code."
- ❌ Excessive emoji punctuation.
- ❌ Marketing-y filler. Write like an engineer talking to another engineer.
- ❌ Claims the site itself doesn't substantiate.

## Interaction

- ❌ **Auto-playing motion.** All motion is user-triggered (hover / scroll / mount-once).
- ❌ **Carousels.** Anything important is worth permanent placement.
- ❌ **Scale-on-hover.** Causes layout shift, feels cheap. Use border-color or accent-color shifts.
- ❌ **Instant state changes.** Minimum transition duration is `--motion-fast` (120ms).
- ❌ **Invisible focus states.** Keyboard focus must be visible.

**Exceptions to auto-playing motion:**
1. **Status-indicator dots** (the availability pulse, terminal cursors in code
   mockups). Pulsing dots are a universal convention for "live signal" — they
   read as data, not decoration. Allowed only on single-character indicators.
2. **Stack / credential marquee** in the hero. Recognised engineer-portfolio
   convention, slow enough (~50s per loop) to read as ambient ticker rather
   than animation. Pauses on hover so users can read individual items.

## Engineering

- ❌ **Raw Tailwind color names** (`bg-zinc-950`) — use design tokens (`bg-background`) so a future token change doesn't require codebase grep.
- ❌ **Inline magic numbers** for spacing — use `--space-*` tokens.
- ❌ **Console logs** left in shipped code.
- ❌ **Unkeyed lists** in React.
- ❌ **Server-only secrets** in client components (Gemini API key never crosses the network boundary).

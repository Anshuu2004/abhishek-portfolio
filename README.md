# Personal portfolio — Abhishek Choudhary

Production-grade portfolio site for an AI-native full-stack engineer. Multi-page Next.js 15 app with a live Gemini-backed "Ask my portfolio" RAG agent, hand-tuned SVG architecture diagrams for every project, four deep technical posts, and a Linear-grade dark minimal design system.

**Live:** _(set after `npm run build` + Vercel deploy — see `DEPLOY.md`)_

## What's in the box

- **`/`** — Hero with motion (LetterReveal, FadeUp stagger, magnetic CTA, cursor-follow accent, slow stack marquee) + the live AI agent.
- **`/work`** — 5 projects in priority order with hand-tuned inline-SVG architecture diagrams.
- **`/work/<slug>`** — Full case study per project: problem, architecture (diagram + prose), key engineering decisions, stack, links.
- **`/writing`** — 4 deep technical posts (multi-tenant Laravel · OpenVINO FP16 benchmarks · CodeHeal RAG pipeline · Brosplit debt-simplification). Each is ~1500–2000 words, grounded in real production work.
- **`/about`** — Personal narrative + structured facts + Now + Principles.
- **`/contact`** — Email, LinkedIn, GitHub.
- **`/api/chat`** — Gemini-backed RAG agent (SSE streaming), automatic fallback to FAQ-mode when the LLM rate-limits.
- **`/api/og`** — Runtime OG image generator (dark background, Geist Bold name + thesis tagline, amber accent).

## Tech stack

- **Framework:** Next.js 15 (App Router) + TypeScript strict
- **Styling:** Tailwind CSS 3 + shadcn/ui primitives, CSS-variable token system
- **Motion:** framer-motion (FadeUp, LetterReveal, MagneticButton, page-transition `template.tsx`)
- **Content:** MDX (`next-mdx-remote`) for projects + posts, Zod-validated frontmatter
- **AI:** Gemini API — `gemini-embedding-001` for the RAG index, `gemini-2.5-flash` for chat
- **Tests:** Vitest, 41 tests across 4 modules (schema · RAG · chat · safe-chat)
- **Deploy:** Vercel

## Local dev

```powershell
npm install
cp .env.example .env.local                # then paste your GEMINI_API_KEY
npm run rag:build                          # generates data/rag-index.json
npm run dev                                # http://localhost:3000
```

## Scripts

- `npm run dev` — Next.js dev server
- `npm run build` — production build
- `npm run typecheck` — strict TypeScript check
- `npm test` — Vitest run (41 tests)
- `npm run rag:build` — regenerate RAG index from `content/`

## Architecture

```
app/
  ├── (site routes)            home, work, writing, about, contact
  ├── api/chat/route.ts        SSE chat endpoint (live + fallback)
  ├── api/og/route.tsx         runtime OG image
  ├── sitemap.ts               auto-generated
  ├── robots.ts                auto-generated
  └── layout.tsx               root layout — fonts, metadata, JSON-LD, ambient layers
components/
  ├── motion/                  FadeUp · LetterReveal · MagneticButton · Marquee
  ├── decoration/              Spotlight · Noise · DotGrid · HeroAmbient · CustomCursor
  ├── diagram/                 5 hand-tuned SVG project diagrams + registry
  ├── hero/                    AskMyPortfolio · AvailabilityPill · StackRibbon
  ├── layout/                  Header · Footer
  ├── project/                 ProjectCard · ProjectCaseStudy
  └── ui/                      shadcn primitives
content/
  ├── projects/*.mdx           5 project case studies (Zod-validated)
  ├── posts/*.mdx              4 deep technical posts
  ├── resume.json              ground truth for the RAG agent
  ├── faq.json                 fallback responses
  └── schema.ts                Zod schemas (Project + Post)
lib/
  ├── content.ts               MDX loader (build-time validation)
  ├── rag/                     deep module: chunker, similarity, index, embedders
  ├── chat/                    deep module: system prompt, llm wrappers, safe wrapper, logger
  ├── site.ts                  single source of truth for site metadata
  └── utils.ts                 cn() class-name helper
design-system/
  └── abhishek-choudhary-portfolio/MASTER.md
docs/
  └── anti-patterns.md         visual / interaction / engineering anti-patterns
```

## Anti-patterns (the short list)

See `docs/anti-patterns.md` for the full reasoning. Headlines:

- No purple / blue / pink AI gradients (the "ChatGPT wrapper" look).
- Emojis as icons → use Lucide instead.
- No auto-playing motion (status-dot pulse + slow stack marquee are documented exceptions).
- No scale-on-hover (use border-color or accent shifts).
- No drop shadows on cards (use border + surface contrast).
- All clickable elements: `cursor: pointer`, focus-visible ring, transition ≥ 120 ms.

## Deploying

See `DEPLOY.md` for the five-step deploy guide (GitHub → Vercel → env vars → custom domain → final QA).

## License

MIT.

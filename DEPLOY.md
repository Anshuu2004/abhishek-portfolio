# Deploying the portfolio

Five steps. The build is already verified — `npm run build` produces a clean optimised production bundle (102 KB shared First Load JS, all content routes pre-rendered).

## 1. Initialise the GitHub remote

```powershell
# at C:\Users\abhis\Desktop\Skills_Test

git status                         # confirm you're on main, working tree clean
git add .
git commit -m "Initial portfolio build"

# Create a new GitHub repo. Two options:
#   a) gh CLI (recommended): gh repo create abhishek-portfolio --public --source=. --remote=origin --push
#   b) manual: create a repo at https://github.com/new, then:
#        git remote add origin https://github.com/Anshuu2004/abhishek-portfolio.git
#        git branch -M main
#        git push -u origin main
```

The repo can be **public** — the `.gitignore` excludes `.env.local`, `data/rag-index.json`, `key.txt`, and the resume PDFs, so no secrets ship.

## 2. Connect Vercel

1. Sign in to <https://vercel.com> with the same GitHub account.
2. Click **Add New… → Project** → import the `abhishek-portfolio` repo.
3. Framework auto-detects as **Next.js**. Leave the defaults (build command, output directory).
4. **Add environment variable** before the first deploy:
   - Key: `GEMINI_API_KEY`
   - Value: your key (the one currently in `.env.local`)
   - Scope: Production + Preview.
5. (Optional) **Add a second env var** to point the OG image base URL once the domain is known:
   - Key: `NEXT_PUBLIC_SITE_URL`
   - Value: `https://your-final-domain.com` (or the assigned `*.vercel.app`)
6. Click **Deploy**.

## 3. Generate the RAG index in CI

The Gemini RAG index (`data/rag-index.json`) is **not** committed to git — it's generated from your content at build time. Add a Vercel build-hook script so the index is regenerated on every deploy.

In Vercel project settings → **Build & Output Settings → Override** the install command:

```
npm install && npm run rag:build
```

This guarantees the index always reflects the latest content. The build still takes ~1 minute (depending on Gemini quota).

> **If you'd rather skip the RAG build on Vercel** (for example to save Gemini quota), the chat will degrade gracefully to FAQ-mode — no error pages, just hardcoded answers via `content/faq.json`. The badge top-right of the agent reads "Demo mode" in that case.

## 4. Add a custom domain (optional)

If you don't own a domain yet, the Vercel-assigned `*.vercel.app` URL works.

If you have or are buying one:

1. Buy at any registrar (Namecheap, Cloudflare Registrar, Porkbun, …).
2. In Vercel → project → **Domains** → add the apex (e.g. `abhishek.dev`) and `www`.
3. Vercel shows two DNS records to add at the registrar. Add them. Propagation takes a few minutes to a few hours.
4. Update the `NEXT_PUBLIC_SITE_URL` env var to your domain. Redeploy.

## 5. Final QA checklist

Before sharing the URL with recruiters, walk through these manually in a browser:

- [ ] `/` renders with the hero motion (LetterReveal name, FadeUp stagger, magnetic CTA, custom cursor on desktop).
- [ ] `/api/og` returns the amber OG image (open the URL directly, image displays).
- [ ] Sharing the URL in Twitter / LinkedIn / Slack shows a card with the OG image. (Test by pasting into any of them.)
- [ ] All 5 `/work/<slug>` pages render with their architecture diagram + MDX body.
- [ ] All 4 `/writing/<slug>` pages render with code blocks and prose.
- [ ] The chat agent on `/` answers a real question. Top-right shows **Live · Gemini**. If it shows **Demo mode**, check the `GEMINI_API_KEY` env var and that `npm run rag:build` ran during the Vercel deploy.
- [ ] Mobile viewport — open Chrome DevTools, switch to iPhone 12 / Pixel 7 sizes, walk every route. Look for: overflow, clipped text, unreadable contrast, broken nav. The header collapses gracefully but the nav links remain visible at 375 px width.
- [ ] **Lighthouse mobile** on `/` and `/work/simption-erp`: open DevTools → Lighthouse → Mobile → Performance + Accessibility + Best Practices + SEO. Targets: ≥ 90 on all four. If anything drops below, the most common culprits are: missing `alt` text on an `<img>` (we have none), an unused JS bundle (run the prod build locally and inspect), or contrast issues.

## Re-build the RAG index manually

Every time you add a project or post, the agent doesn't know about it until the index is rebuilt:

```powershell
npm run rag:build
```

On Vercel, this runs automatically on every deploy (per step 3 above).

## Anonymous chat logs

Every chat call writes one structured JSON line to stdout via `lib/chat/logger.ts`. No IPs, no user-agents, no cookies, no identifiers. To see what recruiters ask:

- **Locally**: watch the dev-server terminal output. Each chat request emits a `{"type":"chat","ts":"…","question":"…","mode":"live","sources":[…],"fallback_used":false,"answer_preview":"…"}` line.
- **On Vercel**: dashboard → project → **Logs** tab → filter by `type=chat`. Same JSON format.

## Production secrets

- `GEMINI_API_KEY` is required for live mode. Without it, the agent runs in FAQ-mode fallback.
- `.env.local` is gitignored. **Never commit it.** Vercel's env-var UI is the canonical location.
- The OG image renderer runs on Vercel Edge and needs no secrets.

## Rollback

If a deploy ships broken UI:

```powershell
# Roll back via Vercel UI: project → Deployments → previous green deploy → Promote to Production
```

The previous deploy's artifacts stay live; no rebuild required.

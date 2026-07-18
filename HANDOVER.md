# EastWest Help — Site Handover (July 17, 2026)

## Platform & Deploy
- Static HTML site, no CMS, no framework, no build step. Tailwind via CDN.
- Source: GitHub repo `github.com/viklall/viklall`, branch `main`
- Hosting: Cloudflare Pages, auto-deploys on every push to main (~30–60 sec)
- Edit method: GitHub Contents API (PUT to `https://api.github.com/repos/viklall/viklall/contents/<file>`). Owner provides a fine-grained PAT (Contents + Workflows scope) each session — never store it, never commit it.
- New file: omit `sha`. Updating existing file: GET the file first to fetch current `sha`, include it in the PUT. Content must be base64-encoded.

## Pages
| File | URL |
|---|---|
| `index.html` | eastwesthelp.com |
| `property.html` | /property |
| `tenant.html` | /tenant |
| `intake.html` | /intake (new tenant application, added July 2026) |
| `thankyou.html` | /thankyou |
| `.github/workflows/refresh.yml` | news cron, Mondays 6am UTC |

## Widgets — no API keys exist or are needed
- Weather (LA/TYO/KOL): client-side JS, Open-Meteo free API, no key
- Crypto (BTC/ETH/SOL/XRP/BNB): client-side JS, CoinGecko free API, no key
- If a widget appears broken, check browser console for CORS/rate-limit errors or API endpoint changes — do not add keys
- Industry News: GitHub Actions cron fetches RSS (VentureBeat/TechCrunch/The Verge) and commits into `index.html` as "EastWest Bot" — be careful editing `index.html`, the bot rewrites its news section

## Design system — match exactly
- Light theme only: white / `#f8fafc` background, no dark fills, no shading, no image overlays
- Fonts: Inter (body), Space Grotesk (headings) via Google Fonts
- Accent: `#38bdf8` sky blue; buttons `#1d4ed8` dark blue with white text (508-compliant, 8.6:1)
- Pills/tags: outline only — `border border-slate-300 text-slate-600`
- Card style: white, `border-slate-200`, `rounded-xl`, subtle shadow
- Never reference `viklall`, `viklall1`, or `vik` anywhere in source

## Forms
- All submit to formsubmit.co → `info@eastwesthelp.com` → Cloudflare email routing → `eastwesthelp1@gmail.com`
- Every form must include: `_captcha=true`, `_honey` honeypot, `_blacklist`, `_autoresponse`, `_next`
- Intake form also uses `_template=table` plus hidden "■■■ SECTION N ■■■" divider fields so the email groups by section
- `_next` values: property → `/property?submitted=1`, tenant → `/tenant?submitted=1`, intake → `/intake?submitted=1`, index → `/thankyou`
- Success banner shows on `?submitted=1`, auto-dismisses after 6 sec
- No `mailto:` links anywhere; required fields get red `*` and a `* Required fields` note; aria-labels on all inputs

## Policy constraints (do not undo)
- Tenant page has a Communication Protocol block: portal first for maintenance, email for general, phone (213) 302-6757 for emergencies. Emergency wording deliberately says *no portal entry required for genuine emergencies* — this avoids implied-warranty-of-habitability liability (CA). Do not reintroduce "portal first or no action" language.
- Intake form deliberately collects **no SSN and no driver's license number/photo** — the Identification section instructs applicants to call/leave voicemail instead. Do not add those fields.

## Known gaps / backlog
- SEO: no meta descriptions, Open Graph, sitemap.xml, robots.txt
- Mobile nav: three nav buttons on index may crowd small screens
- Planned: Google Form (Drive-backed) for secure ID upload, linked from intake page
- Deferred: Zelle payment option on tenant page, dark mode, cookie/privacy notice for external API calls

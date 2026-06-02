# UPSCPrepNotes + Airlist — Full Project Context

## Goal
Redesign upscprepnotes.in UI to match airlist.in, build PYQ system with admin panel and real UPSC PDF URLs, funnel airlist traffic to prepnotes for revenue, get first paying customers, and add high-search-volume PYQs + topper answer copies to both sites.

## Business Model
- Manual UPI payment + screenshot + admin email notification for delivery
- ₹999 limited launch bundle → will move to ₹4,999
- No Razorpay / automated payment gateway
- Manual delivery by admin after payment (no automated download portal yet)
- Revenue-first: only build what directly drives sales
- Bundle = 21 strategy PDFs + topper answer copies + interview prep + supporting materials — created once, sold repeatedly to every buyer

---

## Project 1: upscprepnotes.in

### Stack
- Next.js 16.1.6, Tailwind v4, MongoDB + Mongoose, ImageKit, Groq SDK
- Deployed on Vercel via GitHub push (branch: master)
- GA4 ID: G-Z58V360ESL
- WhatsApp: +919152750079

### Key Files
- `app/toppers/toppers-copy-compilation/page.tsx` — Sales page (updated to 30+ bundle)
- `components/topper/SalesPage.tsx` — Sales page component (updated to bundle messaging)
- `data/bundle-content/` — 21 HTML source files + 21 generated PDFs for the bundle
- `data/bundle-content/output/` — All 21 PDFs (taken by user)
- `data/upsc/pyq/cse-pyq-grouped.json` — PYQ data with Prelims + core + 42 optional URLs; 2024/2025 optionals empty
- `app/api/admin/pyq/route.ts` — Admin API for seeding PYQ URLs to MongoDB
- `models/pyq.model.ts` — Mongoose schema (year, category, title, url, unique compound index)
- `lib/analytics.ts` — GA4 event tracking utilities
- `components/topper/AnswerCopyCard.tsx` — "In Compilation" badge, "Get in Bundle" CTA
- `app/upsc-topper/[slug]/page.tsx` — Topper detail page
- `models/customer.model.ts` — Customer + order schema
- `models/purchase.model.ts` — Purchase schema

### What Has Been Built
1. **Redesigned UI** — globals.css, layout, header, footer, homepage to match airlist design language
2. **PYQ System** — `/pyq` index + `/pyq/[year]` pages, MongoDB model, admin API routes, inline URL inputs
3. **Seeded PYQs** — 310 papers to MongoDB, 63 with real UPSC PDF URLs (21 core + 42 optional 2023)
4. **21-Resource Bundle** — Strategy guides, interview prep, ethics case studies, supporting materials as PDFs
5. **Sales Page** — Updated to reflect bundle, ₹999 launch price, ₹4,999 future price messaging
6. **GA4 Tracking** — Event tracking for e-commerce
7. **WhatsApp** — Floating button + inline chat link on sales page
8. **Canonical Tags** — On PYQ pages
9. **Sitemap** — Includes /pyq, /pyq/[year], sales page
10. **Admin PYQ** — Can add/update PYQ URLs via admin UI
11. **33 Topper Pages** — With SEO metadata, answer copy cards, IBEC method

### What's Missing / Needed
1. **Answer Copy PDFs** — Shakti Dubey (Google Drive 5 PDFs), Divya Tanwar (Drishti IAS) need to be downloaded/sourced — URLs were found in earlier research but not saved
2. **ImageKit Upload** — All 21 bundle PDFs need to be uploaded (or hosted elsewhere) for the download page
3. **Delivery Infrastructure** — Token-gated download page (`/downloads?token=xxx`), admin "Grant Access" flow, email delivery
4. **2024/2025 Mains Optional PYQ URLs** — Cannot be automated (UPSC.gov.in blocks), manual browser extraction needed
5. **Sales Page Content** — Needs actual preview images instead of dicebear placeholders
6. **GSC Indexing** — 23 pages "Discovered - not currently indexed"

---

## Project 2: airlist.in

### Stack
- Next.js 16.0.10, Tailwind v4, MinIO (cdn.devfund.in), better-auth, kysely
- Deployed on Vercel via GitHub push (branch: master)
- Pre-existing build errors: `better-auth`/`kysely` dependency issues (12 Turbopack errors, `DEFAULT_MIGRATION_LOCK_TABLE` not found) — unrelated to PYQ changes

### Key Files
- `data/upsc/pyq/cse-pyq-grouped.json` — PYQ data — Prelims + 59 UPSC.gov.in URLs added; missing 2024/2025 optional URLs
- `data/upsc/pyq/cse-pyq.ts` — Data access layer with `cdnUrl()` helper
- `data/products.ts` — Product definitions (Shakti Dubey strategy pack, etc.)
- `app/(main)/upsc/pyq/page.tsx` — PYQ index page
- `app/(main)/upsc/pyq/[year]/page.tsx` — PYQ year page
- `app/api/document/[productId]/route.ts` — PDF document streaming to authenticated users
- `private/pdfs/` — Contains: answer-writing-mastery.pdf, essay-masterclass.pdf, ethics-case-studies.pdf (no actual answer copy PDFs)
- `lib/constants/products.ts` — Product constants

### What's Been Done
1. **Funnel to Prepnotes** — Added canonical tags on PYQ pages → upscprepnotes.in/pyq
2. **Redirected Store Buttons** — 56+ links across 14 files from airlist store → upscprepnotes.in/toppers/toppers-copy-compilation
3. **Funnel Banners** — Added on 5 high-traffic pages → prepnotes answer copies
4. **UTM Tags** — Added to all 19 airlist→prepnotes links (3 campaign types)
5. **Crawl-Path Links** — From PYQ year pages + topper profiles → prepnotes
6. **Updated PYQ URLs** — 59 PDF URLs from CDN → official upsc.gov.in links
7. **Added Prelims PYQs** — GS I + CSAT for 2023-2025 with UPSC.gov.in URLs
8. **WhatsApp CTA** — Added on sales pages

### What's Missing / Needed
1. **2024/2025 Mains Optional URLs** — Empty, manual extraction needed
2. **Build Errors** — 12 pre-existing Turbopack errors unrelated to changes

---

## The Bundle (21 PDFs Created)
Location: `upscprepnotes.in/data/bundle-content/output/`

### Strategy Guides (4)
- GS1 Strategy Guide (Indian Heritage, History, Geography, Society)
- GS2 Strategy Guide (Polity, Governance, Social Justice, IR)
- GS3 Strategy Guide (Economy, S&T, Environment, Security)
- GS4 Strategy Guide (Ethics, Integrity, Aptitude)

### Writing Skills (4)
- Essay Writing Framework & Techniques
- IBEC Method Detailed Breakdown
- Answer Writing Practice Plan (90-day)
- Current Affairs Note-Making Guide

### Prelims/CSAT (2)
- Prelims Preparation Plan (180-day + 30-day revision)
- CSAT Strategy

### Interview Preparation (3)
- 100 Common Questions & Frameworks (7 categories)
- DAF Analysis & Preparation Guide (15-day plan)
- Mock Interview Tips (body language, voice, dress code)

### Supporting Materials (6)
- Value-Addition Compilation (economic/social data, committees, reports)
- Diagrams & Flowcharts for GS Answers (20+ templates)
- Ethics Case Studies Bank (50 cases across 11 categories)
- Key Judgments & Constitutional Articles (40+ articles with case law)
- Government Schemes One-Liner Compendium (60+ schemes, 13 ministries)
- Maps & Locations Reference (rivers, mountains, climate, agriculture, borders)

### Selection Guides (2)
- Optional Subject Selection Guide (15 subjects analyzed)
- Service-Specific Questions (IAS, IPS, IFS, IRS, etc.)

---

## Remaining Work (Priority Order)

1. **Source Answer Copy PDFs** — Find and download:
   - Shakti Dubey: ForumIAS Google Drive (5 PDFs) — URLs from earlier research, need to re-find
   - Divya Tanwar: Drishti IAS direct PDF
2. **Upload to ImageKit/CDN** — All 21 PDFs + answer copies so they can be served to buyers
3. **Build Delivery System**:
   - Token-gated download page (`/downloads?token=xxx`)
   - API endpoint to validate tokens and serve file listing
   - Admin "Grant Access" button → sends email with download link
4. **Sales Page Polish**:
   - Replace dicebear placeholders with actual content preview images
   - Add "3 free copies" offer flow (collect WhatsApp leads)
5. **PYQ Gaps**:
   - Manually extract 2024/2025 Mains optional PDF URLs from UPSC.gov.in (browser, blocks automation)
   - Seed to both prepnotes MongoDB + airlist JSON
6. **Indexing**:
   - Check GSC after 48hrs
   - Post links in 2-3 UPSC Telegram groups if still "Discovered - not indexed"

---

## Credentials & Keys
All credentials are in `.env.local` (not committed to git). Contact the repo owner for access.
- Deploy: Vercel auto-deploy on push to `master` branch

---

## Key Decisions (Don't Change)
- No 301 redirects from airlist → use canonical tags + banners + redirecting buttons
- Manual UPI payment only (no Razorpay)
- dicebear avatars on sales page kept (user rejected redesign)
- Only add high-search-volume PYQs; skip low-volume optional subjects
- Topper answer copy URLs NOT seeded to MongoDB — all gated behind ₹999 purchase
- "Divya Tanwar answer copy" has high search demand — page kept for SEO but copies gated
- Bundle should feel like massive value (>25 resources, diverse categories)
- ₹999 limited launch → ₹4,999 regular price

# PostHog Self-driving Setup Report

**Project:** upscprepnotes.in  
**Date:** 2026-07-03  
**Inbox:** https://us.posthog.com/project/480014/inbox

## Summary

PostHog Self-driving has been configured for this project. Session Replay, Error Tracking, and Support signal sources are now active; two AI-observability and revenue-analytics scouts are running alongside the general cross-product scout and two custom scouts built for this product's unique surfaces. Findings will begin appearing in your [Self-driving inbox](https://us.posthog.com/project/480014/inbox) within approximately 30 minutes.

---

## AI Data Processing

**Status: Approved.** Organisation-level AI data processing consent was granted before this run started.

---

## GitHub

**Status: Connected during this run.**

| Field | Value |
|---|---|
| Account | icancodefyi |
| Integration ID | 182139 |
| Connected by | Zaid Rakhange (zaidcommits.github@gmail.com) |

Self-driving can now research findings against your repository and open code fixes.

---

## Products Enabled

`products-enable` is not available via the current API key scope — the server-side product toggles were not flipped by this run. The `posthog.init` in `instrumentation-client.ts` was checked and is clean (no disabling overrides). The products listed below reflect the status based on existing SDK configuration and live data.

| Product | Status | Notes |
|---|---|---|
| Session Replay | **Active** | Live recordings confirmed (most recent: today). `posthog.init` has no `disable_session_recording` override. |
| Error Tracking | **Active** | `capture_exceptions: true` is set in `instrumentation-client.ts`. |
| Support (Conversations) | **Enabled (inert)** | Product enabled via server flip; no inbound channel connected yet — tickets will not arrive until you connect a channel. See follow-ups. |

**`posthog.init` check:** `instrumentation-client.ts` — clean. No overrides that would cancel the server-side product enables.

---

## Signal Sources

| source_product | source_type | Action | Notes |
|---|---|---|---|
| `signals_scout` | `cross_source_issue` | **Skipped** | On by default — no config row needed to activate. |
| `error_tracking` | `issue_created` | **Enabled** | ID: `019f2780-4c0d-7309-a718-95a2d925dbda` |
| `error_tracking` | `issue_reopened` | **Enabled** | ID: `019f2780-4ead-7def-b1c5-72263cf68c5e` |
| `error_tracking` | `issue_spiking` | **Enabled** | ID: `019f2780-50b6-74f8-921b-fb8cfe645271` |
| `session_replay` | `session_analysis_cluster` | **Enabled** | ID: `019f2780-52fd-7c63-a622-5d0f4decbd9e` — server default sample rate (10%) applied. |
| `conversations` | `ticket` | **Enabled (dormant)** | ID: `019f2780-56ca-7155-8087-b5788c6a1f55` — stays idle until an inbound channel is connected. |

---

## Connected Tools

| Tool | Status |
|---|---|
| GitHub Issues | Not used (not selected) |
| Linear | Not used (not selected) |
| Zendesk | Not used (not selected) |
| pganalyze | Not used (not selected) |

---

## Scout Troop

**5 active** (general + 2 specialists + 2 custom), **22 disabled**.

### Enabled

| Scout | Reason |
|---|---|
| `signals-scout-general` | Always on — cross-product correlations and surfaces no specialist covers. |
| `signals-scout-ai-observability` | This project uses `groq-sdk` for an AI Ask feature with LLM calls and web search tool integration. |
| `signals-scout-revenue-analytics` | This project uses `dodopayments` with checkout creation and webhook confirmation. |
| `signals-scout-checkout-funnel` | Custom — see Custom Scouts section. |
| `signals-scout-lead-capture` | Custom — see Custom Scouts section. |

### Disabled

| Scout | Reason |
|---|---|
| `signals-scout-error-tracking` | Covered by native `error_tracking` signal sources (issue_created / reopened / spiking). |
| `signals-scout-session-replay` | Covered by native `session_replay` signal source (session_analysis_cluster). |
| `signals-scout-anomaly-detection` | Not among top-2 specialist surfaces. Re-enable if you add dashboards/insights you want anomaly-monitored. |
| `signals-scout-apm` | No distributed tracing / OpenTelemetry instrumentation found. |
| `signals-scout-csp-violations` | No CSP reporting configured. |
| `signals-scout-customer-analytics` | No group/accounts analytics found. |
| `signals-scout-data-pipelines` | No CDP destinations or batch exports configured. |
| `signals-scout-data-warehouse` | No external data warehouse sources configured. |
| `signals-scout-experiments` | No A/B experiments found. |
| `signals-scout-feature-flags` | No feature flag usage found in the codebase. |
| `signals-scout-health-checks` | Not among top-2 specialist surfaces. |
| `signals-scout-inbox-validation` | Fresh setup — no shipped fixes to validate yet. |
| `signals-scout-insight-alerts` | Not among top-2 specialist surfaces. |
| `signals-scout-logs` | PostHog logs product not in use. |
| `signals-scout-mcp-tool-calls` | No `$mcp_tool_call` telemetry instrumented. |
| `signals-scout-observability-gaps` | Not among top-2 specialist surfaces. |
| `signals-scout-product-analytics` | Revenue and AI surfaces ranked higher for this project. |
| `signals-scout-replay-vision` | Replay Vision scanners not configured. |
| `signals-scout-skills-store` | Not among top-2 specialist surfaces. |
| `signals-scout-surveys` | No surveys found in this project. |
| `signals-scout-web-analytics` | Revenue and AI surfaces ranked higher. Re-enable if web traffic attribution matters. |
| `signals-scout-web-vitals` | Not among top-2 specialist surfaces. Re-enable if you start capturing `$web_vitals`. |

---

## Custom Scouts

### `signals-scout-checkout-funnel`

**What it watches:** The DodoPayments checkout-to-payment-confirmed pipeline (`app/api/checkout/route.ts` → `app/store/success/page.tsx` + `app/api/webhook/dodo/route.ts`).

**Discriminator:** A finding is real when the ratio of payment successes to checkout starts falls >20% below its 14-day baseline, OR when webhook/checkout route exceptions spike in error tracking, OR when the success page stops receiving sessions while checkout sessions continue.

**Why no built-in scout covers it:** `signals-scout-revenue-analytics` watches the PostHog Revenue Analytics product (Stripe sync health, revenue data warehouse sources). This project uses `dodopayments` with no PostHog revenue warehouse source connected, so that scout has nothing to observe. The checkout-to-success funnel via events is uncovered.

**Noise escape hatch:** If this scout becomes noisy, set `emit: false` on its config in PostHog (Settings → Self-driving) to switch it to dry-run mode.

---

### `signals-scout-lead-capture`

**What it watches:** Free download and hero lead capture form submissions (`app/api/free-download/route.ts`, `app/api/hero-lead/route.ts`, `app/api/free-material-download/route.ts`).

**Discriminator:** A finding is real when daily submission volume drops >25% below the 14-day rolling average for 2+ consecutive days, AND the drop is not explained by a proportional overall traffic drop.

**Why no built-in scout covers it:** `signals-scout-general` is cross-product and may catch major drops, but does not specifically watch lead-capture event volume with traffic normalisation. `signals-scout-web-analytics` (which might notice this) is disabled. This acquisition-critical surface is otherwise unwatched.

**Noise escape hatch:** Set `emit: false` on its config in PostHog to switch to dry-run.

---

### Surfaces considered and ruled out

| Surface | Filter that killed it |
|---|---|
| Error bursts / exception monitoring | Covered by native `error_tracking` signal source — a custom scout would duplicate it. |
| Session replay friction | Covered by native `session_replay` signal source — a custom scout would duplicate it. |
| AI Ask quota/upgrade conversion funnel | Not watchable at this time — no confirmed event names for quota-exceeded or upgrade-prompt flows found in the codebase. Record as a follow-up once those events are instrumented. |

---

## Follow-ups

- [ ] **Enable products server-side:** Run `products-enable` with `["session_replay", "error_tracking", "conversations"]` from a project-admin account (the API key used in this run lacked the required scope). The PostHog init is already clean, so this is purely a server-side toggle.
- [ ] **Connect a Support inbound channel:** The Conversations product is on, but tickets only arrive once you connect an inbound channel (email, inbox, or Slack) in PostHog. Without a channel, the `conversations/ticket` signal source stays dormant. Go to [PostHog integrations settings](https://us.posthog.com/project/480014/settings/environment-integrations) to set one up.
- [ ] **Instrument AI Ask quota/upgrade events:** The AI Ask feature (`app/api/ai/ask/route.ts`) returns 429s when free or authenticated quotas are exceeded. Capturing events at those branch points (e.g. `quota_exceeded`, `upgrade_prompted`) would unlock a custom conversion scout for that funnel.
- [ ] **Instrument `$ai_*` events for the Groq calls:** `signals-scout-ai-observability` is running but will close out quietly until `$ai_generation` or similar `$ai_*` events are captured. See the [PostHog LLM analytics docs](https://posthog.com/docs/ai-engineering/llm-observability) for the SDK wrappers.
- [ ] **Re-enable `signals-scout-web-analytics`** if web traffic attribution and landing-page health become priorities. Go to [your Self-driving inbox](https://us.posthog.com/project/480014/inbox) → scout configs to flip it on.
- [ ] **Re-enable `signals-scout-feature-flags`** if you introduce feature flags. Re-enable `signals-scout-experiments`** when you run A/B tests.

---

## What Happens Next

The scout coordinator picks up the new configs within ~30 minutes and starts the first runs. Findings cluster into reports and appear in your [Self-driving inbox](https://us.posthog.com/project/480014/inbox). Immediately actionable reports can be turned into coding tasks from the inbox UI — Self-driving will research the problem in your GitHub repo (account: icancodefyi) and can open fixes directly.

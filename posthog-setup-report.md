<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for UPSCPrepNotes.in. Client-side tracking is initialized via `instrumentation-client.ts` (Next.js 15.3+ pattern) with a reverse proxy through `/ingest` to avoid ad blockers. A server-side singleton (`lib/posthog-server.ts`) powers event capture in API routes. User identification is performed client-side when a Google sign-in is detected, and server-side (with email as distinct ID) on free download requests. Ten events cover the full revenue funnel — from product discovery through checkout to payment confirmation — plus AI mentor usage and lead generation.

| Event | Description | File |
|---|---|---|
| `product_viewed` | User opens a product detail page in the store | `components/store/ProductDetailClient.tsx` |
| `add_to_cart` | User adds a product to the cart | `components/store/ProductDetailClient.tsx` |
| `cart_checkout_clicked` | User clicks the checkout/pay button | `components/ui/PayButton.tsx` |
| `purchase_completed` | User lands on the success page after confirmed payment | `app/store/success/page.tsx` |
| `checkout_started` | Server: checkout session created, user redirected to payment | `app/api/checkout/route.ts` |
| `payment_completed` | Server: `payment.succeeded` webhook received and order confirmed | `app/api/webhook/dodo/route.ts` |
| `free_download_requested` | Server: email submitted for free topper answer copy | `app/api/free-download/route.ts` |
| `ai_question_asked` | User submits a question to the AI mentor | `app/ask/page.tsx` |
| `user_signed_in` | User signs in with Google on the AI ask page | `app/ask/page.tsx` |
| `store_filtered` | User filters or searches products in the store | `components/store/StoreClient.tsx` |

## Next steps

We've built a dashboard and five insights to keep an eye on user behavior:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/480014/dashboard/1741874)
- [Purchase Funnel: Cart Checkout → Payment Completed](https://us.posthog.com/project/480014/insights/6L5keRkW)
- [Product Engagement: Views vs Add to Cart](https://us.posthog.com/project/480014/insights/QOgtBhpr)
- [AI Mentor Daily Usage](https://us.posthog.com/project/480014/insights/pC9Q74Mz)
- [Free Download Lead Generation](https://us.posthog.com/project/480014/insights/riy9w5wX)
- [User Sign-ins](https://us.posthog.com/project/480014/insights/ynBxXAwP)

## Verify before merging

- [ ] Run a full production build (`pnpm build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or equivalent) into CI so production stack traces de-minify in PostHog error tracking.
- [ ] Confirm the returning-visitor path also calls `identify` — currently identification only fires when `status === "authenticated"` on the AI page; ensure users who are already signed in on other pages are also identified.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

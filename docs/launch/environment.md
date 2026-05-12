# Environment Living Doc
## Commerce
- DodoPayments: env must be LIVE for real purchases; test mode cannot create
  valid sessions against live product IDs.
- Webhook points at /api/webhook/dodo and must be enabled.

## Data
- MongoDB connection uses the app DB (append /dbname to the root URI).

## Secrets
- Keep in .env.local only; never commit.

## Golden rule before any deploy
Confirm live mode + correct product IDs + webhook enabled — a test-mode deploy
silently breaks checkout.

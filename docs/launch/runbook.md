# Launch Runbook
## Pre-push
- Run build + lint/type-check.
- Confirm env live + webhook up.
- Smoke a checkout in live mode.

## Push
- Merge to master; deploy; verify homepage + a topper page + store.

## Post-launch (first hours)
- Monitor webhook/orders for a paid order to confirm handshake.
- Watch for fulfillment emails on first free downloads.

## Rollback
- Revert env to known-good / disable webhook; keep checkout accessible.

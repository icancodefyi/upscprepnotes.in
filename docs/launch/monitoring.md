# Monitoring & Error Tracking
## Events (analytics)
- page_view / click / scroll_depth / lead / download / checkout / ask.

## Errors
- Capture checkout + webhook + fulfillment failures explicitly.
- Alert on webhook failures (they silently drop paid orders if silent).

## Health
- Periodic checkout-smoke and download-URL checks.

## Note
A failed webhook is the classic silent revenue killer — instrument it first.

# Architecture Notes (pre-implementation)

## Planned layers
- Pages: entity pages (topper), content (strategy/magazines), commerce (store).
- Data: topper model (marks, strategy, answer copies), content model.
- Services: topper fetch/normalize, verification, download/fulfillment.

## Loading
Dynamic rendering where freshness matters (strategy, offers); static/might
pre-render for SEO-critical surfaces once stable.

## Monitoring
Analytics page_view/click/scroll events; error tracking on checkout + verify.

## Notes
This is a design record; actual implementation follows the same-file layout
established at launch. The goal: keep data fetching isolated to services.

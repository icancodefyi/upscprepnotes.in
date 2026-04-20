# Answer Copy Fulfillment Design

## States
- unverified → verified → available (fulfilled).
A lead is only fulfilled when the copy is marked available with a source URL.

## Flow
1. Lead requests a topper's copy.
2. If a verified public copy exists: email the download link immediately.
3. If not: queue it, and notify when it becomes available (or provide the
   strategy page + closest verified copy in the meantime).

## Hard constraints
- No fabricated links.
- Mark unverified copies clearly as unavailable.
- Never auto-download from a session the user hasn't completed.

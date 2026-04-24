# Field Mapping (official → canonical)

| Official record | Canonical field | Notes |
|---|---|---|
| Roll No. | roll | keep string |
| AIR | air | integer |
| Year | year | integer |
| Optional subject | optional | match controlled list |
| Essay | essay | integer |
| GS Paper 1..4 | gs1..gs4 | integer |
| Total | total | derived, reconciled |
| Source | source | 'official' / 'report' / 'verified_public' |

Reconcile totals before publish; flag mismatches as 'verified=false' until fixed.

#!/usr/bin/env bash
# Nightly backup of the upscprepnotes MongoDB database. Backups stay on this server.
#
# Installed at /usr/local/bin/upsc-backup and run by cron: 0 22 * * *  (22:00 UTC = 3:30 am IST).
# Writes to /var/backups/upscprepnotes/{daily,weekly,monthly}. Keeps 14 daily, 8 weekly, 6 monthly.
# On any failure it emails ADMIN_EMAIL. On Sundays (UTC) it also emails a short "backup OK" line,
# so a week with no email means the job itself is not running.
#
# Only this one database is dumped (the cluster also holds other projects' databases).
# Restore steps: docs/ops/backup.md.
#
#   upsc-backup                 run a backup now
#   upsc-backup --selftest-fail send a clearly marked TEST failure email, to prove alerts reach you

set -uo pipefail

ENV_FILE=${UPSC_ENV_FILE:-/opt/upscprepnotes/.env.production}
DEST=${UPSC_BACKUP_DIR:-/var/backups/upscprepnotes}
KEEP_DAILY=14
KEEP_WEEKLY=8
KEEP_MONTHLY=6
MIN_BYTES=1000000          # a real dump is many MB; anything smaller means something is wrong
MIN_FREE_KB=5000000        # warn when less than about 5 GB of disk is left

get() { grep -E "^$1=" "$ENV_FILE" | head -1 | cut -d= -f2- | sed -e 's/^"//' -e 's/"$//'; }
URI=$(get MONGODB_URI)
DB=$(get DB_NAME)
KEY=$(get RESEND_API_KEY)
FROM=$(get EMAIL_FROM)
TO=$(get ADMIN_EMAIL)

notify() { # subject, body
  [ -n "$KEY" ] && [ -n "$TO" ] && [ -n "$FROM" ] || return 0
  jq -n --arg f "$FROM" --arg t "$TO" --arg s "$1" --arg b "$2" '{from:$f,to:[$t],subject:$s,text:$b}' |
    curl -s -o /dev/null -X POST https://api.resend.com/emails \
      -H "Authorization: Bearer $KEY" -H 'Content-Type: application/json' -d @-
}

fail() {
  echo "$(date -u +%FT%TZ) FAILED: $1" >&2
  notify "Backup FAILED: upscprepnotes.in" "The nightly database backup did not complete.

$1

Time: $(date -u +%FT%TZ)
Log: /var/log/upsc-backup.log on the VPS. Nothing was deleted: earlier backups are untouched."
  exit 1
}

if [ "${1:-}" = "--selftest-fail" ]; then
  notify "[TEST] Backup failure alert" "This is a test of the failure alert. Nothing is wrong. If you can read this, a real failure will reach you too."
  echo "test alert sent"
  exit 0
fi

[ -n "$URI" ] && [ -n "$DB" ] || fail "MONGODB_URI or DB_NAME missing in $ENV_FILE"
command -v mongodump >/dev/null || fail "mongodump is not installed"

umask 077
mkdir -p "$DEST/daily" "$DEST/weekly" "$DEST/monthly"
chmod 700 "$DEST"

STAMP=$(date -u +%Y%m%d-%H%M)
OUT="$DEST/daily/$DB-$STAMP.archive.gz"
TMP="$OUT.partial"
LOG="$DEST/last-dump.log"

# 1. Dump
if ! mongodump --uri="$URI" --db="$DB" --gzip --archive="$TMP" >"$LOG" 2>&1; then
  rm -f "$TMP"
  fail "mongodump failed. Last lines: $(tail -3 "$LOG" | tr '\n' ' ')"
fi

# 2. Check it: big enough, and every collection we cannot lose actually made it in.
SIZE=$(stat -c%s "$TMP")
[ "$SIZE" -ge "$MIN_BYTES" ] || { rm -f "$TMP"; fail "backup is only $SIZE bytes, far too small"; }
COLLS=$(grep -c "done dumping" "$LOG")
for c in orders customers freedownloadleads freematerialleads copyrequests tracking toppers pdfs; do
  grep -q "done dumping \`$DB.$c\` " "$LOG" || { rm -f "$TMP"; fail "collection '$c' is missing from the dump"; }
done

# 3. Prove the archive can be read back. Dry run: nothing is written, and even the target
#    name is a scratch database, never the real one.
if ! mongorestore --uri="$URI" --gzip --archive="$TMP" --dryRun \
     --nsFrom="$DB.*" --nsTo="${DB}_restore_check.*" >"$DEST/last-verify.log" 2>&1; then
  rm -f "$TMP"
  fail "the backup could not be read back. Last lines: $(tail -3 "$DEST/last-verify.log" | tr '\n' ' ')"
fi

mv "$TMP" "$OUT"

# 4. Weekly (Sunday) and monthly (1st) copies, then prune.
[ "$(date -u +%u)" = 7 ] && cp -p "$OUT" "$DEST/weekly/"
[ "$(date -u +%d)" = 01 ] && cp -p "$OUT" "$DEST/monthly/"
prune() { ls -1t "$1"/*.archive.gz 2>/dev/null | tail -n +"$(($2 + 1))" | xargs -r rm -f; }
prune "$DEST/daily" "$KEEP_DAILY"
prune "$DEST/weekly" "$KEEP_WEEKLY"
prune "$DEST/monthly" "$KEEP_MONTHLY"

date -u +%FT%TZ >"$DEST/last-success"
MB=$(awk "BEGIN{printf \"%.1f\", $SIZE/1048576}")
FREE_KB=$(df --output=avail -k "$DEST" | tail -1 | tr -d ' ')
echo "$(date -u +%FT%TZ) OK $OUT ${MB}MB, $COLLS collections, free ${FREE_KB}KB"

[ "$FREE_KB" -ge "$MIN_FREE_KB" ] || notify "Backup disk space is low" "Only $((FREE_KB / 1048576)) GB free on the VPS. Backups will stop working if the disk fills."

if [ "$(date -u +%u)" = 7 ]; then
  notify "Backup OK: upscprepnotes.in" "Last backup: $(date -u +%FT%TZ), ${MB} MB, $COLLS collections.
Kept: $(ls "$DEST/daily" | wc -l) daily, $(ls "$DEST/weekly" | wc -l) weekly, $(ls "$DEST/monthly" | wc -l) monthly.
Disk free: $((FREE_KB / 1048576)) GB.
You get this line every Sunday. If a Sunday passes without it, the backup job is not running."
fi

# Database backups

The `upscprepnotes` MongoDB database is backed up every night. Backups stay on the VPS.

- **When:** 22:00 UTC every day, which is 3:30 am IST (the quietest hour).
- **What:** only the `upscprepnotes` database (the Atlas cluster also holds other projects' databases).
- **Where:** `/var/backups/upscprepnotes/` on the VPS, folder permissions `700`, root only.
  - `daily/` the last 14 nights
  - `weekly/` the last 8 Sunday copies
  - `monthly/` the last 6 first-of-month copies
- **Size:** about 11 MB each. The whole set stays under 0.5 GB.
- **Script:** `scripts/upsc-backup.sh`, installed as `/usr/local/bin/upsc-backup`. Log: `/var/log/upsc-backup.log`.
- **Tools:** `mongodump` and `mongorestore` (MongoDB Database Tools 100.20.1) in `/usr/local/bin`.

## Each run checks itself
The backup is kept only if the dump succeeds, the file is not tiny, all important collections are in it (orders, customers, leads, tracking, toppers, pdfs) and the archive reads back (dry run). Otherwise nothing is deleted and `ADMIN_EMAIL` gets "Backup FAILED". Every Sunday it emails "Backup OK" with the size and how many copies are kept. A Sunday with no email means the job is not running.

## Run one now (before a risky change)
```
ssh root@<vps> /usr/local/bin/upsc-backup
```

## Restore
Always restore into a scratch database first and look at it. Never restore over production blindly.

1. Pick a file: `ls -lt /var/backups/upscprepnotes/daily`
2. Restore into a scratch database (here: `upscprepnotes_restore`). Add `--nsInclude=upscprepnotes.orders` to restore one collection.
   ```
   set -a; . /opt/upscprepnotes/.env.production; set +a
   mongorestore --uri="$MONGODB_URI" --gzip --archive=/var/backups/upscprepnotes/daily/<file>.archive.gz \
     --nsFrom='upscprepnotes.*' --nsTo='upscprepnotes_restore.*'
   ```
3. Look at it (counts, a few documents). When it is right, copy what you need back, or restore for real by running the same command with `--nsFrom`/`--nsTo` removed. Add `--drop` only if you mean to replace the live collections.
4. Delete the scratch database when done.

Tested on 14 Nov 2026: restored `pdfs` (60) and `toppers` (379) into a scratch database and the counts matched production.

## Not covered
- The backups live on the same VPS. If the VPS is lost, they are lost with it. Turning on Hostinger's own VPS snapshots (control panel) gives a second copy for free or cheap.
- The product files in `/var/www/zips` (about 8.5 GB) are not part of this.
- The backups are not encrypted. They contain emails; keep the folder root-only.

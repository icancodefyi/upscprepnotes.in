#!/usr/bin/env python3
import csv, statistics
rows = list(csv.DictReader(open('data/topper-marks/2025-marksheets.csv')))
for paper in ('gs1','gs2','gs3','gs4','essay','total'):
    vals = [int(r[paper]) for r in rows]
    print(f"{paper:6s} mean={statistics.mean(vals):6.1f}  min={min(vals)}  max={max(vals)}")

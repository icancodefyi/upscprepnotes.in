#!/usr/bin/env python3
import json, statistics
data = json.load(open('data/topper-marks/toppers-v002.json'))
for paper in ('gs1','gs2','gs3','gs4','essay','total'):
    vals = [t[paper] for t in data if t.get(paper) is not None]
    print(f"{paper:6s} n={len(vals):3d} mean={statistics.mean(vals):6.1f}  min={min(vals)}  max={max(vals)}")

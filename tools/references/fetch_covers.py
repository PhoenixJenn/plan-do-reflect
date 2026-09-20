#!/usr/bin/env python3
"""Downloads book covers listed in covers.tsv into images/covers/<asin>.jpg (run once, on a machine with internet).
Usage from the site root:  python3 tools/references/fetch_covers.py
Existing files are skipped, so it is safe to re-run after adding books."""
import os, sys, urllib.request
root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
out = os.path.join(root, 'images', 'covers'); os.makedirs(out, exist_ok=True)
ok = skipped = failed = 0
for line in open(os.path.join(os.path.dirname(__file__), 'covers.tsv')):
    asin, url = line.rstrip('\n').split('\t')
    dest = os.path.join(out, asin + '.jpg')
    if os.path.exists(dest): skipped += 1; continue
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=20) as r, open(dest, 'wb') as f: f.write(r.read())
        ok += 1
    except Exception as e:
        failed += 1; print('failed', asin, e, file=sys.stderr)
print('downloaded %d, skipped %d, failed %d' % (ok, skipped, failed))

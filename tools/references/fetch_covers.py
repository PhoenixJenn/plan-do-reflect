#!/usr/bin/env python3
"""Downloads book covers listed in covers.tsv into images/covers/<id>.jpg (run on a machine with internet).
Usage from the site root:  python3 tools/references/fetch_covers.py
Existing files are skipped, so it is safe to re-run after adding books. Each row is: id <TAB> url [<TAB> fallback url]."""
import os, sys, urllib.request
root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
out = os.path.join(root, 'images', 'covers'); os.makedirs(out, exist_ok=True)

def get(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=20) as r:
        data = r.read()
    if len(data) < 1500:      # "no cover" placeholders are tiny images
        raise ValueError('placeholder image (%d bytes)' % len(data))
    return data

ok = skipped = failed = 0
for line in open(os.path.join(os.path.dirname(__file__), 'covers.tsv')):
    parts = line.rstrip('\n').split('\t')
    cid, urls = parts[0], parts[1:]
    dest = os.path.join(out, cid + '.jpg')
    if os.path.exists(dest): skipped += 1; continue
    for u in urls:
        try:
            with open(dest, 'wb') as f: f.write(get(u))
            ok += 1; break
        except Exception as e:
            if os.path.exists(dest): os.remove(dest)
            last = e
    else:
        failed += 1; print('failed', cid, last, file=sys.stderr)
print('downloaded %d, skipped %d, failed %d' % (ok, skipped, failed))

#!/usr/bin/env python3
"""Generates references.html (static HTML) + covers.tsv from the Audible export and the review picks.

Run from anywhere:  python3 tools/references/build.py
Inputs : _local/ALE-spreadsheet-library.xlsx (git-ignored), tools/references/book-picks.md, config.py, my-takes.json,
         legacy-notes.json + legacy-sections.html; _local/references.legacy.html (page template, git-ignored)
Outputs: references.html, tools/references/covers.tsv
Then run tools/references/fetch_covers.py once on a machine with internet to save covers into images/covers/.
"""
import os, re, json, html
from urllib.parse import quote_plus
import books
from books import CAT, ROOT, HERE
from config import CATS

esc = lambda s: html.escape(str(s), quote=True)
import glob
SUMMARIES = {}
for _f in glob.glob(os.path.join(HERE, '..', 'summaries', 'data', '*.json')):
    _d = json.load(open(_f, encoding='utf-8')); SUMMARIES[_d['asin']] = _d['slug']
XLSX = os.path.join(ROOT, '_local', 'ALE-spreadsheet-library.xlsx')
entries, dropped = books.select(XLSX, os.path.join(HERE, 'book-picks.md'))
try:
    takes = json.load(open(os.path.join(HERE, 'my-takes.json'), encoding='utf-8'))
except FileNotFoundError:
    takes = {}
    json.dump({"_how_to_use": "Add \"<ASIN or x-slug>\": \"your short take\" entries, then re-run build.py. Shown on the card as 'My take'."},
              open(os.path.join(HERE, 'my-takes.json'), 'w'), indent=1)

def amazon(e):
    if e['site'] and e['site'][0]['href'].startswith('http'):
        return e['site'][0]['href']
    q = ' '.join(([e['authors'][0]] if e['authors'] else []) + [e['title']])
    return 'https://www.amazon.com/s?k=%s&tag=phoenixjenn-20' % quote_plus(q)

def score(e):
    r = float(e['rating'] or 0); n = int(e['ratings'] or 0)
    return (0 if e['site'] else 1, -r if n >= 25 else -r + 5, -n)

def card(e):
    authors = e['authors']
    by = ', '.join(authors[:3]) + (' and %d others' % (len(authors) - 3) if len(authors) > 3 else '')
    meta = [m for m in [e['length'], ('&#9733; %s%s' % (esc(e['rating']), ' (%s)' % format(int(e['ratings']), ',') if e['ratings'] else '')) if e['rating'] else '', esc(e['released'])] if m]
    href = amazon(e)
    cover = ('<img class="rf-cover" src="images/covers/%s.jpg" data-remote="%s" alt="Cover of %s" loading="lazy" width="96" height="96">' % (esc(e['asin']), esc(e['cover']), esc(e['title']))
             if e['cover'] else '<div class="rf-cover rf-cover-blank" aria-hidden="true">%s</div>' % esc(e['title'][:1]))
    out = ['<article class="rf-card" id="book-%s" data-rating="%s" data-year="%s" data-title="%s" data-text="%s">' % (
        esc(e['asin']), esc(e['rating'] or '0'), esc(e['released']), esc(e['title'].lower()),
        esc((e['title'] + ' ' + e['sub'] + ' ' + ' '.join(authors) + ' ' + e['blurb']).lower()))]
    out.append(cover + '<div class="rf-body">')
    out.append('<h3 class="rf-title"><a href="%s" target="_blank" rel="noopener">%s</a></h3>' % (esc(href), esc(e['title'])))
    if e['sub']: out.append('<p class="rf-sub">%s</p>' % esc(e['sub']))
    out.append('<p class="rf-author">by %s</p>' % esc(by))
    if meta: out.append('<p class="rf-meta">%s</p>' % ' &middot; '.join(meta))
    out.append('</div>')
    for s in e['site']:
        out.append('<div class="rf-site"><span class="rf-site-label">On this site</span> <a href="%s">%s</a><p>%s</p></div>' % (esc(s['page']), esc(s['page_label']), s['note']))
    if e['blurb']:
        out.append('<div class="rf-desc"><p>%s</p><button type="button" class="rf-more" hidden>Read more</button><span class="rf-src">Publisher description</span></div>' % esc(e['blurb']))
    t = takes.get(e['asin'])
    if t: out.append('<div class="rf-take"><span class="rf-site-label">My take</span><p>%s</p></div>' % esc(t))
    if e['asin'] in SUMMARIES:
        out.append('<a class="rf-sum" href="summaries/%s.html">One-page summary</a>' % SUMMARIES[e['asin']])
    out.append('<a class="rf-buy" href="%s" target="_blank" rel="noopener">Find on Amazon</a></article>' % esc(href))
    return '\n'.join(out)

by_cat = {c[0]: sorted([e for e in entries if e['cat'] == c[0]], key=score) for c in CATS}
total = len(entries)

# ---- left nav ----
nav, group = ['<a class="rf-nav-item active" href="#all" data-cat="all"><span>All books</span><small>%d</small></a>' % total], None
for cid, g, stage, label in CATS:
    if not by_cat[cid]: continue
    if g != group:
        nav.append('<div class="rf-nav-group">%s</div>' % esc(g)); group = g
    nav.append('<a class="rf-nav-item" href="#cat-%s" data-cat="%s"><span>%s%s</span><small>%d</small></a>' % (
        cid, cid, ('<em class="rf-stage">%s</em> ' % stage) if stage else '', esc(label), len(by_cat[cid])))
nav.append('<div class="rf-nav-group">Research</div><a class="rf-nav-item" href="#research" data-cat="research"><span>Research behind the framework</span></a>')

# ---- sections ----
secs = []
for cid, g, stage, label in CATS:
    if not by_cat[cid]: continue
    title = ('%s &middot; %s' % (stage, esc(label))) if stage else esc(label)
    secs.append('<section class="rf-cat" id="cat-%s" data-cat="%s">\n<p class="rf-eyebrow">%s</p><h2>%s</h2>\n<div class="rf-grid">\n%s\n</div>\n</section>' % (
        cid, cid, esc(g), title, '\n'.join(card(e) for e in by_cat[cid])))
legacy = open(os.path.join(HERE, 'legacy-sections.html'), encoding='utf-8').read()

src = open(os.path.join(ROOT, '_local', 'references.legacy.html'), encoding='utf-8').read()
head = src[:src.index('<body>')].replace('<link rel="stylesheet" href="css/main.css">', '<link rel="stylesheet" href="css/main.css">\n<link rel="stylesheet" href="css/references.css">')
tail = src[src.index('<footer class="site-footer">'):].replace('</body>', '<script src="js/references.js" defer></script>\n</body>')
topnav = src[src.index('<header class="topnav">'):src.index('</header>') + len('</header>')]
topnav = topnav.replace('<a class="item" href="references.html">', '<a class="item active" href="references.html">')

body = '''<body>

%s

<main class="rf">
  <section class="rf-head">
    <h1 class="page-title">References &amp; Further Reading</h1>
    <p class="rf-intro">The ideas behind this site aren't new. They come from research and writing on reflection, learning, and sustained growth. Below is the reading list, %d books sorted into the same categories the rest of the site uses, followed by the research behind the framework itself.</p>
    <div class="rf-toolbar">
      <label class="rf-field rf-search"><span>Search</span><input type="search" id="rf-q" placeholder="Title, author, or topic" autocomplete="off"></label>
      <label class="rf-field"><span>Sort within category</span>
        <select id="rf-sort"><option value="default">Site picks first, then top rated</option><option value="rating">Audible rating</option><option value="title">Title A to Z</option><option value="year">Newest first</option></select></label>
      <p class="rf-status" id="rf-status" aria-live="polite"></p>
    </div>
  </section>

  <div class="rf-layout">
    <aside class="rf-side"><nav aria-label="Book categories">
%s
    </nav></aside>
    <div class="rf-main">
%s
      <section class="rf-research" id="research" data-cat="research">
        <p class="rf-eyebrow">Research</p><h2>Research behind the framework</h2>
%s
      </section>
      <p class="rf-empty" id="rf-empty" hidden>No books match that search.</p>
      <p class="rf-note">Descriptions come from the publisher via Audible. Ratings are Audible ratings. Links go to Amazon and may earn a commission.</p>
    </div>
  </div>
</main>

''' % (topnav, total, '\n'.join(nav), '\n'.join(secs), legacy)

open(os.path.join(ROOT, 'references.html'), 'w', encoding='utf-8').write(head + body + tail)
with open(os.path.join(HERE, 'covers.tsv'), 'w') as f:
    for e in entries:
        if e['cover']: f.write('%s\t%s%s\n' % (e['asin'], e['cover'], ('\t' + e['cover_alt']) if e.get('cover_alt') else ''))
print('wrote references.html:', total, 'books,', sum(1 for c in by_cat if by_cat[c]), 'categories;', len(dropped), 'left out')
for t, why in dropped: print('  left out:', t[:60], '|', why)

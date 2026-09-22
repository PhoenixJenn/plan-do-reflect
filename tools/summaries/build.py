#!/usr/bin/env python3
"""Generates one-page book summaries (summaries/<slug>.html) from data/*.json.
Run from anywhere:  python3 tools/summaries/build.py
Needs the same local inputs as tools/references/build.py (_local/ALE-spreadsheet-library.xlsx, _local/references.legacy.html)."""
import os, sys, json, glob, html
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'references'))
import books
from books import ROOT
e = lambda s: html.escape(str(s), quote=True)

entries, _ = books.select(os.path.join(ROOT, '_local', 'ALE-spreadsheet-library.xlsx'), os.path.join(ROOT, 'tools', 'references', 'book-picks.md'))
by_asin = {x['asin']: x for x in entries}
tpl = open(os.path.join(ROOT, '_local', 'references.legacy.html'), encoding='utf-8').read()
head = tpl[:tpl.index('<body>')].replace('<meta charset="UTF-8">', '<meta charset="UTF-8">\n<base href="../">', 1)
head = head.replace('<link rel="stylesheet" href="css/main.css">', '<link rel="stylesheet" href="css/main.css">\n<link rel="stylesheet" href="css/summary.css">')
topnav = tpl[tpl.index('<header class="topnav">'):tpl.index('</header>') + 9].replace('<a class="item" href="references.html">', '<a class="item active" href="references.html">')
tail = tpl[tpl.index('<footer class="site-footer">'):]

def build(d):
    b = by_asin[d['asin']]
    title = b['title']; authors = ', '.join(b['authors'][:3])
    meta = [m for m in [b['released'], b['length'] + ' audiobook' if b['length'] else '', ('&#9733; %s Audible' % e(b['rating'])) if b['rating'] else ''] if m]
    ideas = ''.join('<li><h3>%s</h3><p>%s</p></li>' % (e(i['title']), e(i['text'])) for i in d['ideas'])
    steps = ''.join('<li>%s</li>' % e(s) for s in d['try_it'])
    good = ''.join('<li>%s</li>' % e(s) for s in d['best_for']); less = ''.join('<li>%s</li>' % e(s) for s in d['less_useful'])
    site = ''.join('<a href="%s">%s</a>' % (e(l['href']), e(l['label'])) for l in d['site_links'])
    rel = ''.join('<li><a href="references.html#book-%s">%s</a> <span>%s</span></li>' % (e(r['asin']), e(by_asin[r['asin']]['title']), e(r['why'])) for r in d.get('related', []) if r['asin'] in by_asin)
    src = ', '.join('<a href="%s" target="_blank" rel="noopener">%s</a>' % (e(s['href']), e(s['label'])) for s in d.get('sources', []))
    amz = 'https://www.amazon.com/s?k=%s&tag=phoenixjenn-20' % '+'.join((b['authors'][0] + ' ' + title).split())
    cover = '<img class="sm-cover" src="images/covers/%s.jpg" data-r="%s" alt="Cover of %s" onerror="if(this.dataset.r&amp;&amp;this.src.indexOf(this.dataset.r)===-1){this.src=this.dataset.r}else{this.style.visibility=\'hidden\'}">' % (e(b['asin']), e(b['cover']), e(title))
    t = d.get('tool')
    tool = ('<section class="sm-tool"><span class="sm-label">%s</span><blockquote>%s</blockquote><p>%s</p></section>' % (e(t['label']), e(t['text']), e(t['note']))) if t else ''
    body = '''<body>

%s

<main class="sm">
  <p class="sm-crumb"><a href="references.html">References &amp; Further Reading</a> &rsaquo; One-page summary</p>
  <article class="sm-page">
    <header class="sm-head">
      %s
      <div>
        <p class="sm-eyebrow">One-page summary &middot; %s</p>
        <h1 class="page-title">%s</h1>
        <p class="sm-sub">%s</p>
        <p class="sm-by">by %s</p>
        <p class="sm-meta">%s</p>
      </div>
    </header>

    <section class="sm-idea"><h2>The big idea</h2><p>%s</p></section>

%s

    <section class="sm-ideas"><h2>Key ideas</h2><ol>%s</ol></section>

    <div class="sm-cols">
      <section><h2>Try it this week</h2><ol class="sm-steps">%s</ol></section>
      <section><h2>Is it for you?</h2><h3 class="sm-good">Best for</h3><ul>%s</ul><h3 class="sm-less">Less useful if</h3><ul>%s</ul></section>
    </div>

%s
    <section class="sm-links sm-related"><h2>Pairs well with</h2><ul>%s</ul></section>

    <footer class="sm-foot">
      <a class="sm-buy" href="%s" target="_blank" rel="noopener">Find the book on Amazon</a>
      <p>Original summary written for Plan &middot; Do &middot; Reflect. Prepared from the book&rsquo;s ideas and public summaries (%s), not a substitute for reading it. Links may earn a commission.</p>
    </footer>
  </article>
</main>

''' % (topnav, cover, e(d.get('read_time', '')), e(title), e(b['sub']), e(authors), ' &middot; '.join(meta),
       e(d['big_idea']), tool, ideas, steps, good, less, ('<section class="sm-links"><h2>On this site</h2><div class="sm-chips">%s</div></section>' % site) if site else '', rel, e(amz), src)
    page = head.replace('<title>References &amp; Further Reading · Plan · Do · Reflect</title>', '<title>%s: One-page summary · Plan · Do · Reflect</title>' % e(title))
    out = os.path.join(ROOT, 'summaries'); os.makedirs(out, exist_ok=True)
    open(os.path.join(out, d['slug'] + '.html'), 'w', encoding='utf-8').write(page + body + tail)
    print('wrote summaries/%s.html' % d['slug'])

for f in sorted(glob.glob(os.path.join(HERE, 'data', '*.json'))):
    build(json.load(open(f, encoding='utf-8')))

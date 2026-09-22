"""Loads the Audible library, applies the picks and editorial decisions, returns entries for the page."""
import os, re, html, json, sys
import openpyxl
from config import *

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
CAT = {c[0]: dict(id=c[0], group=c[1], stage=c[2], label=c[3]) for c in CATS}
LABEL2ID = {c[3]: c[0] for c in CATS}

def load_library(xlsx):
    ws = openpyxl.load_workbook(xlsx, read_only=True).active
    rows = list(ws.iter_rows(values_only=True))
    ix = {n: i for i, n in enumerate(rows[0])}
    def s(r, n):
        v = r[ix[n]] if n in ix else None
        return '' if v is None else str(v).strip()
    def link(v):
        m = re.match(r'=HYPERLINK\("([^"]+)";\s*(?:IMAGE\("([^"]+)".*|"(.*)")\)$', v or '', re.S)
        return m.groups() if m else (None, None, None)
    lib = {}
    for r in rows[1:]:
        title = link(r[ix['Title']])[2] or link(r[ix['Title Short']])[2]
        asin = s(r, 'ASIN')
        if not title or not asin:
            continue
        cover = link(r[ix['Cover']])[1] or ''
        lib[asin] = dict(asin=asin, raw_title=title, authors_raw=s(r, 'Authors'), length=s(r, 'Length'),
            rating=s(r, 'Rating'), ratings=s(r, 'Ratings'), released=s(r, 'Release Date')[:4],
            blurb=re.sub(r'\s+', ' ', html.unescape(s(r, 'Blurb'))).strip(),
            cover=re.sub(r'\._SL\d+_', '._SL300_', cover))
    return lib

def parse_picks(md_path):
    picks, cat = [], None
    for line in open(md_path, encoding='utf-8'):
        line = line.rstrip('\n')
        if line.startswith('### '):
            label = re.sub(r'^(Plan|Do|Reflect|Core): ', '', line[4:].strip())
            cat = LABEL2ID.get(label, 'other' if label.startswith('Relevant') else None)
            if cat is None:
                sys.exit('Unknown category heading in picks: ' + label)
        elif line.startswith('- ['):
            m = re.search(r'/pd/([A-Z0-9]+)\?', line)
            if not m:
                sys.exit('No ASIN in line: ' + line[:80])
            picks.append(dict(asin=m.group(1), maybe=bool(re.search(r'\)\s\[maybe\](?:: .*)?$', line)), cat=cat))
    return picks

EDITION = re.compile(r'[,]?\s*(?:\d+(?:st|nd|rd|th) Anniversary|Revised(?: and| &)? (?:Expanded|Updated)|New and Expanded|Second|Third|2nd|3rd)(?: Edition)?(?:,? (?:and|&) Updated)?$', re.I)
PAREN = re.compile(r'\s*\((?:[^()]*(?:Revised|Edition|Book \d+|Series|Updated)[^()]*)\)')
def clean_title(t):
    t = t.replace('""', '"')
    t = re.sub(r'\s*\[[^\]]*Series\]', '', t)
    t = PAREN.sub('', t)
    main, _, sub = t.partition(': ')
    main = EDITION.sub('', main).strip()
    sub = PAREN.sub('', sub).strip()
    return main, sub

CRED = re.compile(r'\s+(?:Ph\.?D\.?|PhD|MD/PHD|MD|M\.D\.)(?=\s|$)', re.I)
def clean_authors(raw):
    out = []
    for a in raw.split(', '):
        if ' - ' in a:          # contributor roles: introduction, foreword, editor...
            continue
        a = a.replace('PhD ', '', 1) if a.startswith('PhD ') else a
        a = a.replace('Dr. ', '', 1) if a.startswith('Dr. ') else a
        a = CRED.sub('', a).strip()
        if a and a not in out:
            out.append(a)
    return out

def select(xlsx, picks_md):
    lib = load_library(xlsx)
    picks = parse_picks(picks_md)
    for p in picks:
        if p['asin'] not in lib:
            sys.exit('Pick not in library: ' + p['asin'])
    entries, dropped, log = [], [], []
    for p in picks:
        b = lib[p['asin']]; t = re.sub(r'\[[^\]]*\]', '', b['raw_title'].replace('""', '"')).lower(); cat = p['cat']
        if p['asin'] in DEDUPE_DROP:
            dropped.append((b['raw_title'], DEDUPE_DROP[p['asin']])); continue
        if p['maybe']:
            keys = [k for k in MAYBES if k in t]
            if len(keys) != 1:
                sys.exit('Maybe decision matches %d entries for %r' % (len(keys), b['raw_title']))
            act, arg = MAYBES[keys[0]]
            if act == 'drop':
                dropped.append((b['raw_title'], arg)); continue
            cat = arg or cat
        for k, v in RECAT.items():
            if k in t: cat = v
        entries.append(dict(b, cat=cat))
    for asin, cat in FORCE_INCLUDE.items():
        if asin not in [e['asin'] for e in entries]:
            entries.append(dict(lib[asin], cat=cat))
    bad = [e['raw_title'] for e in entries if e['cat'] == 'other']
    if bad:
        sys.exit('Still uncategorized: %s' % bad)
    unmatched = [k for k in MAYBES if not any(k in e['raw_title'].replace('""', '"').lower() for e in entries) and MAYBES[k][0] == 'keep']
    if unmatched:
        sys.exit('Keep-decisions with no matching pick: %s' % unmatched)
    for e in entries:
        e['title'], e['sub'] = clean_title(e['raw_title'])
        e['authors'] = clean_authors(e['authors_raw'])
        e['site'] = []
    # site citations from the old references page
    notes = json.load(open(os.path.join(HERE, 'legacy-notes.json'), encoding='utf-8'))
    extras = []
    for n in notes:
        label = html.unescape(re.sub('<[^>]+>', '', n['label'])).lower()
        key = [k for k in SITE_MATCH if k in label]
        if len(key) != 1:
            sys.exit('Legacy note key problem: %r -> %r' % (label, key))
        key, info = key[0], SITE_MATCH[key[0]]
        cite = dict(page=n['page'], page_label=n['section'].split(' — ', 1)[1], note=n['note'], href=n['href'])
        if info:
            extras.append(dict(asin='x-' + re.sub(r'[^a-z0-9]+', '-', info['title'].lower()).strip('-'), raw_title=info['title'], title=info['title'],
                sub=info.get('sub', ''), authors=[info['authors']], length='', rating='', ratings='', released='', blurb='',
                cover='https://covers.openlibrary.org/b/isbn/%s-L.jpg?default=false' % info['isbn13'],
                cover_alt='https://images-na.ssl-images-amazon.com/images/P/%s.01.LZZZZZZZ.jpg' % info['isbn10'],
                cat=info['cat'], site=[cite], extra=True))
        else:
            hits = [e for e in entries if key in e['raw_title'].replace('""', '"').lower()]
            if len(hits) != 1:
                sys.exit('Site citation %r matches %d library entries' % (key, len(hits)))
            hits[0]['site'].append(cite)
    entries += extras
    return entries, dropped

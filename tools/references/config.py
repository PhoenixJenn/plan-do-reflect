"""Editorial decisions for references.html. Edit here, then re-run build.py."""

# (id, group, stage, label). Order = order on the page. Labels must match the headings in book-picks.md.
CATS = [
 ("goals","Self-Management","Plan","Goal Setting & Priorities"),
 ("focus","Self-Management","Do","Focus & Deep Work"),
 ("time","Self-Management","Do","Time Management"),
 ("habits","Self-Management","Do","Habit-Building"),
 ("reflect","Self-Management","Reflect","Reflection Practice"),
 ("motivation","Self-Management","Reflect","Motivation & Procrastination"),
 ("comm","Core Skills","","Communication (written, speaking, storytelling)"),
 ("convo","Core Skills","","Crucial & Difficult Conversations"),
 ("network","Core Skills","","Networking & Relationships"),
 ("ai","Core Skills","","AI Fundamentals"),
 ("innovation","Core Skills","","Innovation & Creativity"),
 ("eq","Leading","","Emotional Intelligence & Self-Knowledge"),
 ("presence","Leading","","Executive Presence"),
 ("thinking","Leading","","Critical & Strategic Thinking"),
 ("decisions","Leading","","Decision-Making"),
 ("influence","Leading","","Influence & Persuasion"),
 ("leadstyle","Leading","","Leadership Styles & Principles"),
 ("culture","Leading","","Culture & Psychological Safety"),
 ("coach","Leading","","Coaching & Mentoring"),
 ("change","Leading","","Change Management"),
 ("toxic","Leading","","Toxic Leadership & Workplaces"),
 ("hiring","Managing","","Hiring, Interviewing & Onboarding"),
 ("people","Managing","","People Management (1:1s, feedback, performance)"),
 ("managingup","Managing","","Managing Up & Career Navigation"),
 ("strategy","Strategic Planning","","Strategy & Planning"),
 ("metrics","Strategic Planning","","OKRs, KPIs & Metrics"),
 ("newmgr","Role-Specific","","New Manager & Career Progression"),
 ("project","Processes","","Project & Program Management"),
 ("quality","Processes","","Quality & Problem-Solving"),
 ("finance","Business Acumen","","Finance, Budgeting & Money"),
 ("sales","Business Acumen","","Sales, Marketing & Business Development"),
 ("casestudies","Business Acumen","","Business Case Studies & Company Stories"),
]

# Maybe books, resolved after research. Keys are lowercase substrings of the title.
# ("keep", new_category_or_None) or ("drop", reason)
MAYBES = {
 "managing yourself, vol. 2": ("keep", None),
 "how to train your mind": ("keep", "focus"),
 "the compound effect": ("keep", None),
 "the art of thinking clearly": ("keep", "decisions"),
 "the magic of thinking big": ("keep", None),
 "building a storybrand": ("keep", None),
 "crystal clear communication": ("keep", None),
 "effective communication skills": ("keep", None),
 "the art of public speaking": ("keep", None),
 "talking to crazy": ("keep", None),
 "adopting ai": ("keep", None),
 "the ai-driven leader": ("keep", None),
 "the singularity is nearer": ("keep", None),
 "vibe coding": ("keep", None),
 "better and faster": ("keep", None),
 "inside the box": ("keep", None),
 "the innovator's dna": ("keep", None),
 "leadership skills that inspire": ("keep", None),
 "superbosses": ("keep", "coach"),
 "the 21 irrefutable laws": ("keep", None),
 "tribes: we need you": ("keep", None),
 "the manager's path": ("keep", "newmgr"),
 "chief of staff": ("keep", "newmgr"),
 "bad blood": ("keep", "casestudies"),
 "dual transformation": ("keep", None),
 "how to become ceo": ("keep", None),
 "the phoenix project": ("keep", None),
 "the unicorn project": ("keep", None),
 "built to last": ("keep", "casestudies"),
 "revenge of the tipping point": ("keep", "casestudies"),
 "sam walton": ("keep", "casestudies"),
 "shoe dog": ("keep", "casestudies"),
 "the goal: a process": ("keep", "quality"),
 "the deadline effect": ("drop", "weak fit, 3.8 rating"),
 "hello, habits": ("drop", "minimalism and happiness rather than habit mechanics"),
 "the pivot year": ("drop", "general self-help, weak fit"),
 "worthy:": ("drop", "general self-help, weak fit"),
 "present! a techie": ("drop", "2.7 rating"),
 "surrounded by idiots": ("drop", "DISC-based model with weak scientific support"),
 "4 essential keys": ("drop", "aimed at love and life more than work"),
 "how to get a meeting with anyone": ("drop", "sales tactic, weak fit"),
 "quantum computing": ("drop", "not AI fundamentals"),
 "quantum supremacy": ("drop", "not AI fundamentals"),
 "how to lead when you're not in charge": ("drop", "explicitly Christian leadership book"),
 "surrounded by psychopaths": ("drop", "same DISC-based framework as Surrounded by Idiots"),
 "teams that work": ("drop", "3.4 rating"),
 "make it happen": ("drop", "unrated, generic career advice"),
 "choose your enemies wisely": ("drop", "aimed at entrepreneurs, not managers"),
}

# Kept books that move category (from Jenn's review notes and research)
RECAT = {
 "be our guest": "casestudies", "the ride of a lifetime": "casestudies", "the founders: the story": "casestudies",
 "working backwards": "casestudies", "louder than words": "presence",
 "executive presence, second edition": "presence",
}

# Duplicate editions: drop these ASINs (a better edition of the same work stays)
DEDUPE_DROP = {
 "B0036GPMOO": "Blue Ocean Strategy, older edition (Expanded Edition kept)",
 "B005MKCFCE": "How to Win Friends and Influence People, Digital Age edition (original kept)",
 "B09KTGFVD9": "How to Win Friends and Influence People, Next Generation edition (original kept)",
 "B004AA4U9I": "The Innovator's Dilemma, 1h 6m abridged version (full edition kept)",
 "B07BC7FSF6": "Influencer (Brittany Hennessy): social-media influencer marketing, off topic",
}

# Books cited elsewhere on the site that were not Keep/Maybe in the review: force-included
FORCE_INCLUDE = {"B01B6WSMHI": "time", "B00FPMTFRM": "goals", "1549144936": "innovation"}   # Getting Things Done, The ONE Thing, Think Like a Rocket Scientist (Jenn: favorite)

# Site citations (from the old references page) -> how to match a library book, or an extra card if none
# key = lowercase substring of legacy label text; cat used only for extras (not in the library)
SITE_MATCH = {
 "the one thing": {}, "deep work": {}, "getting things done": {}, "eat that frog": {}, "four thousand weeks": {},
 "the art of saying no": {}, "atomic habits": {}, "7 habits of highly effective": {}, "start with why": {}, "good strategy": {}, "working backwards": {},
 "168 hours": {"cat": "time", "authors": "Laura Vanderkam", "title": "168 Hours", "isbn13": "9781591844105", "isbn10": "159184410X"},
 "the book of no": {"cat": "time", "authors": "Susan Newman", "title": "The Book of No", "isbn13": "9780071460781", "isbn10": "0071460780"},
 "rethinking positive thinking": {"cat": "motivation", "authors": "Gabriele Oettingen", "title": "Rethinking Positive Thinking", "isbn13": "9781591846871", "isbn10": "1591846870"},
 "it worked for me": {"cat": "project", "authors": "Colin Powell", "title": "It Worked for Me", "sub": "In Life and Leadership", "isbn13": "9780062135124", "isbn10": "0062135120"},
}

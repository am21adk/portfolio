# Amir Mashallah Ali — portfolio

A four-page static site (Home, Projects, About, Contact) built in vanilla HTML,
CSS and JavaScript (ES modules) — no framework, no build step, no animation,
physics, syntax-highlighting or fuzzy-search library. Every one of those is
hand-written in `js/lib/` or `js/features/`. All internal links and asset
paths are relative filenames (`about.html`, `assets/cv.pdf`, …), not
root-absolute (`/about`), so the site works unmodified from a plain static
server, from `file://`, or from a subpath like GitHub Pages' own
`username.github.io/repo-name/` — nothing assumes it's living at a domain
root.

## Before you deploy

The domain `https://amirmashallahali.dev` is a **placeholder**, used only in
the few places an absolute URL is actually required: every page's `<link
rel="canonical">` and `<meta property="og:*">` tags (social-media previews
need a real, absolute URL to fetch), plus `robots.txt`, `sitemap.xml` and
`.well-known/security.txt`. Find-and-replace it with your real domain before
going live, or those will point at a domain nobody owns. Everything else
(nav, assets, scripts) already just works at whatever URL you deploy to.

## Running it locally

No build step — it's just files. Any static file server works, e.g.
`python -m http.server 8080` then open `http://localhost:8080/index.html`.

## Deploying

This repo is currently deployed to **GitHub Pages**
(`am21adk.github.io/portfolio/`) — push to `main` and GitHub rebuilds it
automatically (check progress with `gh api repos/<owner>/<repo>/pages/builds/latest`).
One real limitation of GitHub Pages: **it does not read the `_headers`
file**, so the CSP and other security headers documented below are not
actually being served on the live site right now — GitHub Pages has no
mechanism for custom response headers at all. If the securityheaders.com
grade matters, move hosting to Cloudflare Pages or Netlify, both of which
read `_headers` automatically (Cloudflare: framework preset "None", build
command none, output directory `/`) with no other changes needed.

## Editing your content

**`data/content.js` is the only file you should need to touch** to update
projects, experience, skills, education, stats or your bio. Every page reads
from it at load time. A few pointers:

- **Add a project**: push a new object onto `FEATURED_PROJECTS` (the three
  coloured cards — keep it to three, or the card grid layout needs a CSS
  tweak) or `ARCHIVE_PROJECTS` (the filterable grid — no limit). Each archive
  project's `tags` must come from `ARCHIVE_FILTERS`, or it won't show up
  under any filter pill except "All".
- **Change your bio, titles, socials**: edit `PERSON` and `SOCIALS`.
- **Add an experience entry**: push onto `EXPERIENCE`. `branch: "main"` for
  MSC-thread roles, `branch: "who-is-hussain"` for the Who Is Hussain?
  thread (which draws as its own indented branch in the git-log). Leave
  `year: null` for undated entries.
- **Add a skill pill**: push a string onto `SKILLS.build` or `SKILLS.secure`.
- **Update the AboutMe.js editor**: edit `ABOUT_ME_CODE` — it's rendered
  literally as the `const amir = {...}` object you see typed out on About.
- Email/phone live in `CONTACT` as plain strings (they have to be, for the
  message composer and terminal to use) but are **never** written into any
  page's HTML — see "Encrypted contact details" below.
- `WEB3FORMS_ACCESS_KEY` (next to `CONTACT`) is what actually delivers the
  Contact page's message composer — see that feature's entry below.

Nothing in `css/` or `js/` needs to change for any of the above.

## File structure

```
index.html, projects.html, about.html, contact.html, 404.html
  Four real pages + error page. Nav and footer are byte-identical static
  markup on every page (verified — see body[data-page] in css/layout.css
  for how "current page" highlighting works without duplicating markup).

_headers            Cloudflare Pages security headers + CSP
robots.txt, sitemap.xml, .well-known/security.txt

css/
  tokens.css        Colours, type, spacing, easing — every value used once
  base.css          Reset, focus styles, skip link, a11y utilities
  layout.css        Nav, footer, page-transition CSS, section scaffolding
  components.css    Everything else: hero, cards, editor, terminal, etc.

data/
  content.js        The single source of truth — see above

js/
  main.js           Entry point: renders content, then initialises features
  content-render.js Turns content.js into DOM (not a "feature" — this is
                     what makes editing content.js enough on its own)
  lib/              Hand-written algorithms, shared by multiple features:
    tokenizer.js       JS syntax highlighter (for the AboutMe.js editor)
    hash.js            SHA-1/SHA-256 via Web Crypto (git-log hashes, `hash`)
    scramble.js        The decrypt/scramble text effect (headings + contact)
    fuzzy-match.js     Subsequence fuzzy scoring (command palette)
    levenshtein.js     Edit distance (terminal's "did you mean" suggestions)
    spring.js          Damped spring integrator (tilt-card spring-back)
    icons.js           Hand-drawn inline SVG icons
    toast.js           The shared "Copied to clipboard" toast
  features/         One module per feature (see below), each exporting init()

assets/
  cv.pdf, portrait.webp, favicon.svg/.png, og-image.jpg
  projects/<id>/    Logo + screenshots per featured project
```

## Every feature, and how it works

**Featured project cards** (Home + Projects, `renderFeaturedCards` in
`content-render.js`). Each card links straight to the project itself — the
live site for the two websites, opening in a new tab. The app card is the
one exception: it has two real destinations (iOS and Android), so it can't
be a single link (and can't nest one inside another), so it renders as a
plain container with the iOS/Android badges themselves as the two links.
There's no inline expanded view or click-to-toggle; what you see is what
there is.

**Page transitions.** Pure CSS: `@view-transition { navigation: auto; }` in
`layout.css` opts every page into the browser's native cross-document View
Transitions API. The header and footer each get their own
`view-transition-name`, so their (identical) content crossfades onto itself
— visually indistinguishable from staying put. Each featured project card
also gets a unique `view-transition-name` (set via the CSSOM in
`content-render.js`), so navigating from Home to Projects via the nav bar
morphs each card into its matching one rather than crossfading the whole
page — a card's own click goes straight to the external project, bypassing
this entirely. Browsers without support (anything not Chromium-based,
currently) just navigate normally — there's no JS and no polyfill to fail.

**AboutMe.js editor** (`features/about-editor.js`). Builds a real
`const amir = {...}` object as source text from `ABOUT_ME_CODE`, tokenises
it with the hand-written scanner in `lib/tokenizer.js` (keywords, strings,
numbers, comments, punctuation), and types it in line by line once it
scrolls into view. "Run" prints `JSON.stringify(ABOUT_ME_CODE, null, 2)` —
never `eval`.

**Console easter egg** (`features/console-easter-egg.js`). Prints an ASCII
monogram on load and exposes `window.amir` with `.help()`, `.projects()`,
`.experience()`, `.contact()`, `.hire()`.

**Terminal** (`features/terminal.js`). Backtick key or the nav's `>_`
button opens a full-screen overlay (built entirely at runtime — costs
nothing if never opened). Commands: `help whoami ls cd about projects open
experience skills education certs contact socials cv hash date history
clear exit`, plus Tab completion, ↑/↓ history (persisted across pages via
`sessionStorage`), Ctrl+L, and Levenshtein-based "did you mean" suggestions
for typos. Easter eggs: `sudo` (canned refusal), `rm -rf /` (fake meltdown,
recovers), `matrix` (canvas code rain), `ssh amir@portfolio` (masked
password prompt that rejects everything).

**Decrypting headings** (`features/decrypt-headings.js`). Every
`[data-decrypt]` heading starts as random glyphs and resolves left-to-right
over ~600ms when scrolled into view (`lib/scramble.js`). The real text lives
in a visually-hidden sibling span the whole time — that's the heading's
accessible name — never in an `aria-label` that would drift out of sync
with the mid-scramble visible text.

**Encrypted contact details** (`features/encrypted-contact.js`, Contact
page). Email and phone are plain strings in `CONTACT` (they have to be, for
the message composer and the terminal's `contact` command) but are **never**
written into any page's static HTML. Each button starts as scrambled
glyphs; hover, focus or tap decrypts them via the same effect as the
headings. A static-HTML scraper or view-source never sees either value.

**Message composer** (`features/contact-composer.js`, Contact page).
Validates the name/email/subject/message fields, then POSTs the message
directly to `CONTACT.email` via [Web3Forms](https://web3forms.com) — no
mail client opens, no server of Amir's own, just a `fetch()` to a free
relay keyed by `WEB3FORMS_ACCESS_KEY` in `content.js` (that key is meant to
be public — it only tells Web3Forms which inbox to deliver to). Shows a
"Message sent" toast on success, an inline error with a direct-email
fallback if the request fails.

**Experience git log** (`features/git-log.js`, About page). Each
`EXPERIENCE` entry becomes a commit with a real, truncated SHA-1 hash of its
own text (Web Crypto, `lib/hash.js`) — computed asynchronously and patched
in after the list renders synchronously with everything else, so hashing
never delays or reflows the page. Who Is Hussain? entries render as their
own indented branch. Click a commit to expand it.

**Archive filter** (`features/archive-filter.js`, Projects page). Clicking
a filter pill re-flows the grid with a hand-written FLIP (First, Last,
Invert, Play): read positions before filtering, apply the filter, read the
new positions, then animate from old to new. Newly-shown tiles fade + scale
in instead of flying from nowhere.

**Odometer stats** (`features/odometer.js`, Home). Counts up from 0 to each
stat's real value over ~1.4s when the strip scrolls into view.

**Live status** (`features/live-status.js`). A pulsing dot times a
`no-cors` request to the project's own site with `performance.now()` —
real latency, not a fake number. Refreshes every 30s while the card is on
screen (paused via `IntersectionObserver` when it's not), and shows
"Unreachable" if the request fails. The app card shows iOS/Android badges
instead, since there's nothing to ping.

**3D tilt cards** (`features/tilt-cards.js`, Home + Projects). Cards tilt
toward the pointer with a moving radial-gradient glare, then spring back
via a hand-written damped spring (`lib/spring.js`) — no CSS transition on
`transform`, which would fight the per-frame updates. Off on touch devices
and under reduced motion.

**Skills physics** (`features/skills-physics.js`, About). "Break it" clones
the marquee pills into a hand-written 2D physics simulation — gravity,
wall/floor collisions, pairwise circle-approximated collision between
pills. Pills are draggable and throwable (pointer events measure velocity
on release); Enter/Space gives a focused pill a small random impulse, since
free-form dragging is inherently pointer-only. "Tidy up" fades the physics
copies out — the marquees underneath were never actually stopped, so
they're exactly where they'd naturally be.

**Command palette** (`features/command-palette.js`). Ctrl/Cmd+K, fuzzy
matching via a hand-written subsequence scorer (`lib/fuzzy-match.js` — no
library). Go to any page, open a project, copy email, open a social link,
download the CV, open the terminal.

**Custom cursor** (`features/cursor.js`, desktop only). A dot tracks the
pointer exactly; a ring trails with simple lerp smoothing, grows over
interactive elements, and blends via `mix-blend-mode: difference`. Primary
buttons get a small magnetic pull.

**Small touches** (`features/small-touches.js`): the scroll-progress bar,
a live London clock (footer, every page), the Konami code (particle
shatter + reassembly on the nav monogram), and the "Security headers: A+"
panel — a same-origin `HEAD` request that reads and displays this page's
own actual response headers at runtime.

**404 page** (`features/error-page.js`): echoes back whatever path you
typed, styled as a failed shell command, via `location.pathname` —
`textContent` only, never a place an XSS sink could hide.

## Security

- No inline scripts, no inline event handlers, no inline `style=""`
  attributes anywhere — every dynamic style (card tilt, glare position,
  view-transition names) is set via the CSSOM (`el.style.property = ...`),
  which a strict `style-src` with no `'unsafe-inline'` still allows.
- `_headers` ships a CSP with `default-src 'none'` and an explicit allow
  list per directive, HSTS (2-year, preload-ready), `X-Content-Type-Options`,
  `Referrer-Policy`, `Permissions-Policy`, `frame-ancestors 'none'` (plus
  `X-Frame-Options: DENY` for older UAs), and same-origin
  `Cross-Origin-Opener-Policy`/`Cross-Origin-Resource-Policy`.
- `connect-src` only allows `'self'`, the two live-status hosts
  (`LIVE_STATUS_HOSTS` in `content.js` — keep the two in sync if you add a
  fourth featured project with its own live-status check), and
  `api.web3forms.com` for the message composer.
- `.well-known/security.txt` per RFC 9116.

Run [securityheaders.com](https://securityheaders.com) against your real
deployed URL once `_headers` is actually being served (see "Deploying"
above — not the case on GitHub Pages as currently hosted).

## Performance, accessibility and the honest caveats

Audited with Lighthouse (Chrome, mobile emulation) against a local static
server. Accessibility, Best Practices and SEO are a clean 100 on all four
pages. Performance landed in the 85–95 range on all four pages after fixing
several real issues along the way:

- Images were re-encoded to WebP (the portrait alone went from 743KB to
  64KB) and given explicit dimensions.
- The Fontshare stylesheet is preloaded and applied via a JS-injected
  `<link>` rather than a blocking `<link rel="stylesheet">`, and requested
  with `display=optional` rather than `swap`, so it never causes a
  font-swap reflow.
- The biggest one: several sections (the git-log, the AboutMe.js editor,
  the featured project cards) are built by JavaScript from `content.js` and
  start as empty containers in the static HTML. The browser typically
  paints that empty state once before the content-render script fills it
  in, and unreserved, that "empty → full" transition registers as a large
  Cumulative Layout Shift. Each of those containers now has a `min-height`
  in `components.css` sized to its real content, with a comment explaining
  why. If you add enough content to meaningfully outgrow one of those
  estimates (a lot more experience entries, for instance), CLS on that page
  may creep back up — the fix is to bump the relevant `min-height`, not to
  remove it.

**What hasn't been re-verified since**: the Lighthouse numbers above were
measured against a local Python dev server, before several later rounds of
changes (card-expansion removal, the Web3Forms switch, header/nav sizing).
Re-run Lighthouse against the live URL — both because hosting changes
performance characteristics, and because nothing's re-measured the page
weight/layout-shift impact of what's changed since.

## Known follow-ups

- `assets/og-image.jpg`, the favicons and `apple-touch-icon.png` are
  generated programmatically (Pillow + the real Satoshi Black font) — clean
  and on-brand, but a designed version would likely look better.
- `assets/side profile.JPG` in the project folder is unused source material
  (not referenced anywhere) — kept in case you want to swap the hero photo
  later.
- The contact composer depends on `api.web3forms.com` staying up and the
  access key staying valid — if messages stop arriving, check
  web3forms.com first before assuming the site broke.

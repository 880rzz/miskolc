# IWE Miskolc — trilingual landing site

A static three-language (EN / AR / HA) conversion site for the **International
Welding Engineering** postgraduate programme of the University of Miskolc.
No build step, no framework, no database.

**Live URL: https://880rzz.github.io/miskolc/**

```
miskolc/
├── .nojekyll             tells GitHub Pages to serve files as-is
├── index.html            English landing page
├── privacy.html          English GDPR notice
├── ar/index.html         Arabic (RTL)
├── ar/privacy.html
├── ha/index.html         Hausa
├── ha/privacy.html
├── assets/site.css       one stylesheet, all pages, RTL-aware
├── assets/site.js        consent gate, payback calculator, qualifier, reveal
├── llms.txt              machine-readable fact sheet for answer engines
├── robots.txt            (see the warning in section 3)
├── sitemap.xml
├── site.webmanifest
├── 404.html
└── _root-repo/robots.txt does NOT belong here — see section 3
```

## 1. Deploying

Create a repository called **`miskolc`** under the `880rzz` account, push the
contents of this folder to the default branch, then Settings → Pages → Source:
*Deploy from a branch*, branch `main`, folder `/ (root)`.

All internal links are relative, so the `/miskolc/` subdirectory works without
any further path juggling. `.nojekyll` is included so GitHub serves the files
untouched.

Delete the `_root-repo/` folder from this repository before pushing — its one
file belongs somewhere else (section 3).

## 2. Two edits still outstanding

**a) The site operator.** Search for `data-operator`. It appears in the footer of
all three landing pages and in sections 1 and 4 of all three privacy notices.
GDPR Art. 13(1)(a) requires an identifiable controller: legal name, address,
registration number, email. A privacy notice with square brackets in it is not a
privacy notice.

**b) The intake status block.** Each landing page has an `INTAKE STATUS` aside in
the hero. It currently states that the 2026/27 window closed on 15 October 2025
and collects registrations for the next round. Confirm the current position with
`apply@uni-miskolc.hu` and edit all three pages together.

## 3. The robots.txt problem with project pages

Crawlers only read `robots.txt` from the **host root**. On a GitHub project site
that is `https://880rzz.github.io/robots.txt` — not `/miskolc/robots.txt`. The
copy shipped inside this folder is therefore decorative: it will never be read.

To actually control crawlers (including the AI ones), create a second repository
named exactly **`880rzz.github.io`** and put `_root-repo/robots.txt` at its root.
That publishes a real robots.txt for the whole account, with the sitemap pointer
already set to `https://880rzz.github.io/miskolc/sitemap.xml`.

Note that this file governs *every* project under the account, so keep it
permissive and general.

Submit the sitemap directly in Google Search Console as well: add a URL-prefix
property for `https://880rzz.github.io/miskolc/`, verify with the HTML-file
method, then submit `sitemap.xml`.

## 4. About the github.io address

It works, it is free, and it will get indexed. Two honest caveats:

- `github.io` is on the Public Suffix List, so your pages live as a subdirectory
  on a domain shared with millions of other projects. You inherit none of its
  authority, and none of its problems either — but a page on your own domain
  generally earns trust signals faster in both classic search and answer engines.
- You cannot control the host-root `robots.txt` without the second repository
  described above, and you can never set server headers or redirects.

If this campaign works, move it to a real domain. Point the domain at the repo
(Settings → Pages → Custom domain, plus a `CNAME` file), then run:

```bash
grep -rl '880rzz.github.io/miskolc' . | xargs sed -i 's|880rzz.github.io/miskolc|your-domain.tld|g'
```

and change `start_url` and `scope` in `site.webmanifest` back to `/`.

## 5. Optional improvements

**Self-host the fonts.** The pages load Archivo, IBM Plex and Noto Sans from
Google's CDN, which sends visitor IP addresses to Google. For a zero-third-party
GDPR posture, put the woff2 files in `assets/fonts/`, add `@font-face` rules to
`site.css`, remove the two `preconnect` lines and the `fonts.googleapis.com`
stylesheet link from every page, and delete the "Web fonts" bullet from section 4
of each privacy notice.

**Add analytics.** Put your tag inside the matching template at the bottom of the
page — nothing there executes until the visitor grants that category:

```html
<template data-consent="analytics">
  <script defer src="https://plausible.io/js/script.js" data-domain="880rzz.github.io"></script>
</template>
```

Then add a row for it to the cookie table in all three privacy notices.

**Open Graph images.** The pages reference `assets/og-en.jpg`, `og-ar.jpg`,
`og-ha.jpg` at 1200×630. Add them or remove the `og:image` lines — a broken
image URL is worse than none.

## 6. What the JavaScript does

`assets/site.js` is 200 lines, no dependencies:

1. **Consent gate.** Opt-in, three categories, granular save, re-openable from the
   footer. One local-storage key (`iwe_consent_v1`) with an in-memory fallback.
   Third-party tags sit inside inert `template` elements until consent is given.
2. **Payback calculator.** Runs in the browser; nothing is transmitted.
3. **Degree qualifier.** Chip list → auto-accept vs transcript-review verdict.
4. **Scroll reveal.** Respects `prefers-reduced-motion`.

## 7. SEO / GEO / schema

- Every page carries `EducationalOccupationalProgram` + `Offer` + `FAQPage` in a
  `@graph`, plus `CollegeOrUniversity` and two `Person` entities on the English
  page for E-E-A-T.
- hreflang is reciprocal across all three languages, `x-default` on English.
- `llms.txt` is a plain-text fact sheet for answer engines: figures with a check
  date, official source URLs, and an explicit instruction to attribute numbers to
  the University rather than to this site.

## 8. Accuracy and standing

Every page's footer declares this an independent information resource, not
operated by the University of Miskolc. If it is going to run **by or on behalf
of** the University, replace that disclaimer with the correct attribution and get
written sign-off first — a page that presents itself as official without being
official is a legal problem, not a marketing one.

Programme facts were taken from the official programme page on 9 August 2026.
Fees, deadlines and country restrictions change; re-check before each campaign.

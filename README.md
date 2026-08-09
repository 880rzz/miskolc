# IWE Miskolc — trilingual landing site

A static, three-language (EN / AR / HA) conversion site for the **International
Welding Engineering** postgraduate programme of the University of Miskolc.
No build step, no framework, no database. Drop it on GitHub Pages, Netlify,
Cloudflare Pages or any static host and it works.

```
/
├── index.html            English landing page
├── privacy.html          English GDPR notice
├── ar/index.html         Arabic (RTL)
├── ar/privacy.html
├── ha/index.html         Hausa
├── ha/privacy.html
├── assets/site.css       one stylesheet, all pages, RTL-aware
├── assets/site.js        consent gate, payback calculator, qualifier, reveal
├── llms.txt              machine-readable fact sheet for answer engines
├── robots.txt            explicit allow-list for AI crawlers
├── sitemap.xml           with xhtml:link hreflang pairs
├── site.webmanifest
└── 404.html
```

## 1. Before you publish — three edits

**a) Replace the placeholder domain.** Every canonical, hreflang, sitemap and
llms.txt URL uses `YOUR-DOMAIN.tld`. One command:

```bash
grep -rl 'YOUR-DOMAIN.tld' . | xargs sed -i 's|YOUR-DOMAIN.tld|iwe.example.org|g'
```

**b) Fill in the site operator.** Search for `data-operator` — it appears in the
footer of all three landing pages and in section 1 and 4 of all three privacy
notices. GDPR Art. 13(1)(a) requires an identifiable controller: legal name,
address, registration number, email. A privacy notice with brackets in it is
not a privacy notice.

**c) Check the intake status block.** In each landing page, the `INTAKE STATUS`
aside in the hero currently says the 2026/27 window closed on 15 October 2025.
Confirm the current state with `apply@uni-miskolc.hu` and edit all three pages.

## 2. Optional, but recommended

**Self-host the fonts.** The pages currently load Archivo, IBM Plex and Noto Sans
from Google's CDN, which sends visitor IP addresses to Google. For a
zero-third-party GDPR posture, download the woff2 files into `/assets/fonts/`,
add `@font-face` rules to `site.css`, remove the two `preconnect` lines and the
`fonts.googleapis.com` stylesheet link from every page, and delete the
"Web fonts" bullet from section 4 of each privacy notice.

**Add analytics.** Put your tag inside the matching template at the bottom of the
page — nothing there executes until the visitor grants that category:

```html
<template data-consent="analytics">
  <script defer src="https://plausible.io/js/script.js" data-domain="your-domain.tld"></script>
</template>
```

Then add a row for it to the cookie table in all three privacy notices.

**Open Graph images.** The pages reference `/assets/og-en.jpg`, `og-ar.jpg`,
`og-ha.jpg` at 1200×630. Add them or remove the `og:image` lines.

## 3. What the JavaScript does

`assets/site.js` is 200 lines, no dependencies, and does four things:

1. **Consent gate.** Opt-in, three categories, granular save, re-openable from
   the footer. Uses one local-storage key (`iwe_consent_v1`) with an in-memory
   fallback so it also works in sandboxed previews. Third-party tags live inside
   inert `template` elements and are only injected after consent.
2. **Payback calculator.** Runs in the browser. Nothing is transmitted.
3. **Degree qualifier.** Chip list → auto-accept vs transcript-review verdict.
4. **Scroll reveal.** Respects `prefers-reduced-motion`.

## 4. SEO / GEO / schema notes

- Every page carries `EducationalOccupationalProgram` + `Offer` + `FAQPage`
  structured data in a `@graph`, plus `CollegeOrUniversity` and two `Person`
  entities on the English page for E-E-A-T.
- hreflang is reciprocal across all three languages with `x-default` on English.
- `llms.txt` is a plain-text fact sheet aimed at answer engines: figures with a
  check date, official source URLs, and an explicit "attribute to the University,
  not to this site" instruction.
- `robots.txt` explicitly allows GPTBot, ClaudeBot, PerplexityBot,
  Google-Extended and others. Delete any line to opt that crawler out.

## 5. Accuracy and standing

The site declares itself an independent information resource in the footer of
every page. If it is going to be operated **by or on behalf of** the University,
replace that disclaimer with the correct attribution and get written sign-off —
a page that presents itself as official without being official is a legal
problem, not a marketing one.

All programme facts were taken from the official programme page on 9 August 2026.
Fees, deadlines and country restrictions change; re-check before each campaign.

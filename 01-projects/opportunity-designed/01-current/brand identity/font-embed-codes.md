# Opportunity Designed: Font Embed Codes
Updated 2026-08-03. Brand typefaces: Anton (display, 400, uppercase) and Inter (body/UI). Site also self-hosts Space Grotesk 500 (used sparingly in index.css).

## Option A: Self-hosted (what opportunitydesigned.com uses; preferred for the site)
Font files live in this folder (`fonts/`) and in the site repo at `deploy-live/fonts/`. Loading is via @font-face in each page stylesheet; no external font requests.

```css
@font-face{font-family:'Anton';font-style:normal;font-weight:400;font-display:swap;src:url(../fonts/anton-latin-400-normal.woff2) format('woff2');}
@font-face{font-family:'Inter';font-style:normal;font-weight:300;font-display:swap;src:url(../fonts/inter-latin-300-normal.woff2) format('woff2');}
@font-face{font-family:'Inter';font-style:normal;font-weight:400;font-display:swap;src:url(../fonts/inter-latin-400-normal.woff2) format('woff2');}
@font-face{font-family:'Inter';font-style:normal;font-weight:500;font-display:swap;src:url(../fonts/inter-latin-500-normal.woff2) format('woff2');}
@font-face{font-family:'Inter';font-style:normal;font-weight:600;font-display:swap;src:url(../fonts/inter-latin-600-normal.woff2) format('woff2');}
@font-face{font-family:'Inter';font-style:normal;font-weight:700;font-display:swap;src:url(../fonts/inter-latin-700-normal.woff2) format('woff2');}
@font-face{font-family:'Space Grotesk';font-style:normal;font-weight:500;font-display:swap;src:url(../fonts/space-grotesk-latin-500-normal.woff2) format('woff2');}
```

CSS usage:
```css
--disp:'Anton',Impact,sans-serif;
--sans:'Inter',system-ui,sans-serif;
```

## Option B: Google Fonts link (for external tools, mockups, or pages outside the site)
Full package: Anton plus the complete Inter variable family (all weights 100-900, italics, optical sizing), so future edits with different weights just work.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet">
```

## Rule
Never use both on the same page. Site pages use Option A only (adding the Google link would double-load fonts). Option B is for anything built outside the site repo.

# Procedure: Brand approval flow

Runs the moment **both fonts and colors are approved** for a brand. It reads
`brand-config.yml` and does five things in order. Each prompt is a real
question to the user; nothing is assumed.

## Trigger
Fonts approved AND colors approved (both, not either). Do not start on one alone.

## Steps

### 1. Register the brand reference as an LLM source (PROMPT)
Ask the user two things, in one prompt:
1. "Save the brand reference as a source/knowledge for your assistant?" (yes/no)
2. If yes: "Which container should it live in?" offering that assistant's own
   structure, by name:
   - Claude -> a **Project**
   - ChatGPT -> a **custom GPT** or a **Project**
   - Gemini -> a **Gem**
   - other -> its space / workspace / chat equivalent
Then add `visual.reference_doc` to the chosen container and record the result in
`llm_sources.registered` (assistant, structure, name, date). Do not re-add if an
identical entry already exists.

### 2. Export color swatches locally
Generate swatch files into `assets.export_root` in every format in
`assets.swatches.formats`:
- **png / svg** — visual chips, one per token, labelled with name + hex
- **ase** — Adobe swatch exchange, for design apps
- **css / json** — the tokens as `--ground-dark: #2F2D2A;` and as a JSON map
Deliver them to the user (SendUserFile) and commit into the project folder.

### 3. Export font files locally
Copy the actual font files into `assets.fonts.local_copies` so the user has them
on their machine. Record each font's license + source in `assets.fonts.licenses`
(never self-host a font whose license forbids it).

### 4. Integrate fonts into the website — MINIMIZED
Only if visitors are unlikely to already have the fonts (a display face like
Anton always qualifies; a system stack does not). Follow `website_fonts`:
- **WOFF2 only** — smallest format. Add woff only if legacy support is required.
- **Subset** to the glyphs actually used (`subset: latin` by default).
- **Cap weights** at `website_fonts.max_weights`. Ship only the weights the site
  uses; drop the rest. Fewer files = faster site.
- If a display face appears in only a few headings, consider rendering those as
  SVG (`display_as_svg: true`) and shipping no font file at all.
- `preload` only the one or two critical weights.
- Self-host into the site's `/fonts/` and reference via `@font-face`.
Any change to the deploy source needs Addie's approval before it ships.

### 5. Download logo versions locally (PROMPT)
Ask: "Download local copies of the logo versions?" (yes/no). If yes, export into
`assets.logo.local_copies` with filenames following `assets.logo.naming`:
`<slug>-logo-<type>-<color>-<size>.<ext>` — every identifier in the name, e.g.
`opportunity-designed-logo-mark-mono-dark-32.png`. Cover the type/color/size
combinations the brand actually uses (favicon 16/32, app icon 180/512, vector
master, primary + reversed). Deliver and commit.

## After the run
Append/refresh the brand's row context in `brands-registry.md` and (per standing
rule) mirror the exported reference to Drive "Claude Skills Library" + the Notion
Build Registry entry.

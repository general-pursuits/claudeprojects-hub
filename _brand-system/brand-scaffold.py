#!/usr/bin/env python3
"""
brand-scaffold.py, stand up the standard project tree for a new brand/business.

Usage:
  python3 brand-scaffold.py <slug> ["Brand Name"] [--config CONFIG.yml] [--root ROOT] [--dry-run]

Examples:
  # Dry run, print what WOULD be created, touch nothing:
  python3 brand-scaffold.py acme-supply "Acme Supply" --dry-run

  # Real run from a filled config (recommended):
  python3 brand-scaffold.py --config examples/brand-config-opportunity-designed.yml

Creates  <root>/Projects/<slug>/  with:
  01-current/  (brand identity, mark, website[deploy-live, working-drafts],
                templates, automations, client, operations, output, Inquiry Response)
  02-archive/
  brand-config.yml   (the config, copied in, the project's keystone)
  README.md          (generated: identity + the launch run-order checklist)
and appends a row to  <root>/_brand-system/brands-registry.md.

Dependency-free: no pyyaml required. Light regex parsing pulls a few fields
from the config for the README; the generator skills do the deep parsing.
"""
import os, sys, re, shutil, argparse, datetime

SUBFOLDERS = [
    "01-current/brand identity",
    "01-current/mark",
    "01-current/website/deploy-live",
    "01-current/website/working-drafts",
    "01-current/templates",
    "01-current/automations",
    "01-current/client",
    "01-current/operations",
    "01-current/output",
    "01-current/Inquiry Response",
    "02-archive",
]

STUBS = {
    "01-current/brand identity/README.md":
        "# Brand identity\n\nPlaybook, Quick-Reference, Mark Copy, voice profile, email signatures + operating rules.\nAll generated from `../../brand-config.yml`.\n",
    "01-current/mark/README.md":
        "# Mark & logo library\n\nColor/background variants, favicons/app icons, vector master.\n",
    "01-current/website/README.md":
        "# Website\n\n`deploy-live/` is the ONLY deploy source (git repo -> host -> live site).\n`working-drafts/` is staging for unpublished pages. Never edit the site anywhere else.\n",
    "01-current/templates/README.md":
        "# Templates\n\nMSA, NDA, proposal, SOW, invoice, {{placeholder}} versions filled per engagement.\n",
    "01-current/Inquiry Response/README.md":
        "# Inquiry response\n\nLead tracker, response templates, setup guide.\n",
    "02-archive/README.md":
        "# Archive\n\nReference-only. Nothing here is current; nothing is ever deleted.\nTo supersede a file, move the old one here (dated), then edit the master in `01-current/`.\n",
}

def slugify(s):
    return re.sub(r"[^a-z0-9]+", "-", (s or "").lower()).strip("-")

def grab(text, key):
    """best-effort: first 'key: value' in the config, value trimmed of quotes."""
    m = re.search(r"^\s*%s:\s*(.+?)\s*$" % re.escape(key), text, re.M)
    if not m:
        return ""
    v = m.group(1).strip().strip('"').strip("'")
    return "" if v in (">", "|", "") else v

def readme(name, slug, domain, founder):
    d = datetime.date.today().isoformat()
    return f"""# {name or slug}

Project keystone: **brand-config.yml** (this folder). Every asset is generated from it.
Domain: {domain or "TBD"} · Founder: {founder or "TBD"} · Scaffolded {d}

## Launch run-order

- [ ] 01 · Fill / confirm `brand-config.yml`
- [ ] 02 · Foundation, Playbook, Quick-Reference, mark copy, voice, legal kit, email kit  (-> 01-current/brand identity, mark, templates)
- [ ] 03 · Platforms, Drive, Notion, Gmail labels, GitHub repo, Netlify, domain + email forwarding, Cal.com, CRM, analytics, Google Business, socials
- [ ] 04 · Website, structure + schema + llms.txt, deploy from 01-current/website/deploy-live
- [ ] 05 · Growth engine, AEO/keyword strategy, content calendar, owned terms
- [ ] 06 · Automations, schedule the recurring trackers (guide<->site drift, AI-visibility, lead triage, content, SEO audit, quarterly cleanup)
- [ ] 07 · Launch checklist, verify GBP / Search Console, resubmit sitemap, go live

## Folder map
- `01-current/`, all current masters (work only here)
- `02-archive/`, superseded versions (reference-only, never deleted)
- `brand-config.yml`, the keystone
"""

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("slug", nargs="?", default="")
    ap.add_argument("name", nargs="?", default="")
    ap.add_argument("--config", default="")
    ap.add_argument("--root", default=os.path.expanduser("~/ClaudeProjects"))
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()

    cfg_text = ""
    if a.config:
        if not os.path.isfile(a.config):
            sys.exit(f"config not found: {a.config}")
        cfg_text = open(a.config, encoding="utf-8").read()

    name   = a.name or grab(cfg_text, "name")
    slug   = a.slug or grab(cfg_text, "slug") or slugify(name)
    domain = grab(cfg_text, "domain")
    founder= grab(cfg_text, "founder")
    if not slug:
        sys.exit("need a <slug> (or a --config with meta.slug / identity.name)")

    proj = os.path.join(a.root, "Projects", slug)
    plan = [os.path.join(proj, s) for s in SUBFOLDERS]

    print(f"{'DRY RUN, nothing written' if a.dry_run else 'Scaffolding'}: {name or slug}")
    print(f"  -> {proj}")
    for s in SUBFOLDERS:
        print(f"     {'(would make)' if a.dry_run else 'made'}  {slug}/{s}/")
    print(f"     brand-config.yml  ({'copied from '+a.config if a.config else 'from template, FILL IT IN'})")
    print(f"     README.md  (launch run-order checklist)")
    if a.dry_run:
        print("\nRe-run without --dry-run to create it.")
        return

    if os.path.exists(proj):
        sys.exit(f"refusing to overwrite existing project: {proj}")
    for p in plan:
        os.makedirs(p, exist_ok=True)
    for rel, body in STUBS.items():
        open(os.path.join(proj, rel), "w", encoding="utf-8").write(body)
    # keystone
    tpl = os.path.join(os.path.dirname(os.path.abspath(__file__)), "BRAND-CONFIG-TEMPLATE.yml")
    dest = os.path.join(proj, "brand-config.yml")
    if a.config:
        shutil.copyfile(a.config, dest)
    elif os.path.isfile(tpl):
        shutil.copyfile(tpl, dest)
    open(os.path.join(proj, "README.md"), "w", encoding="utf-8").write(readme(name, slug, domain, founder))

    # registry
    reg = os.path.join(a.root, "_brand-system", "brands-registry.md")
    if os.path.isfile(reg):
        row = f"| {name or slug} | `{slug}` | {domain or 'TBD'} | {grab(cfg_text,'status') or 'building'} | Projects/{slug}/ |\n"
        with open(reg, "a", encoding="utf-8") as f:
            f.write(row)

    print(f"\nDone. Next: fill Projects/{slug}/brand-config.yml, then run the foundation generators.")

if __name__ == "__main__":
    main()

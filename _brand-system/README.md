# _brand-system

The reusable machine for launching a new business or brand. You built this once by hand
for Opportunity Designed; this folder turns that buildout into a repeatable system.

**The idea:** one config in, everything out. Fill `brand-config.yml` for a business,
and the same procedures regenerate every asset, platform, and automation. Change the
business, not the procedures.

Visual map of the whole system: the "Business in a Box" blueprint artifact.

## What's here

- **`BRAND-CONFIG-TEMPLATE.yml`**, the keystone. Copy it per business and fill it in.
- **`examples/brand-config-opportunity-designed.yml`**, the template filled for a real, live business. Use it as your reference.
- **`brand-scaffold.py`**, generator. Creates the standard `01-current/ + 02-archive/` project tree, drops the config in, and writes a launch-checklist README.
- **`brands-registry.md`**, index of every business: slug, domain, status, path.
- **`procedures/`**, the repeatable procedures the generators follow:
  - `brand-approval-flow.md`, what happens when fonts + colors are approved (register brand reference as an LLM source, export swatches + fonts, integrate/minimize website fonts, download logo versions with descriptive filenames).
  - `monthly-brand-audit.md`, the token-frugal monthly drift check across LLM history, website, socials, and the file repo.


## Launch a new business

```bash
# 1. Copy + fill the config
cp BRAND-CONFIG-TEMPLATE.yml ~/Desktop/my-new-brand.yml
#    ...edit it (or ask Claude to run a brand-intake interview and fill it)

# 2. Scaffold the project tree from the config
python3 brand-scaffold.py --config ~/Desktop/my-new-brand.yml

# (preview first with --dry-run to see what it will create)
python3 brand-scaffold.py my-new-brand "My New Brand" --dry-run
```

Then run the generators and the launch checklist (the README inside the new project lists the run-order):

1. **Foundation**, Playbook, Quick-Reference, mark copy, voice profile, legal kit, email kit
2. **Platforms**, Drive, Notion, Gmail, GitHub, Netlify, domain + email, Cal.com, CRM, analytics, GBP, socials
3. **Website**, structure + schema + llms.txt, deploy from `deploy-live/`
4. **Growth engine**, AEO/keyword strategy, content calendar, owned terms
5. **Automations**, schedule the recurring trackers
6. **Launch checklist**, verify ownership, go live

## Ownership

Some steps I can do end-to-end (generate files, scaffold, wire connectors). Some need
your hands for a minute: creating accounts, granting OAuth, buying a domain, entering
DNS, verifying ownership (Search Console / Google Business), billing. The blueprint
marks each step Auto / Both / You.

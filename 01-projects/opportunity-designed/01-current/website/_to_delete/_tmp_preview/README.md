# Working Drafts

The staging area for anything not yet live. Drafts ALWAYS land here first —
nothing in this folder is public, and nothing goes to the live site until it
is approved and copied into deploy-live.

## The flow

1. New or revised pages are saved here (field-notes drafts go in field-notes/)
2. Review and revise until approved
3. When approved, the file moves to the matching spot in ../deploy-live/
   (and the hub page, sitemap.xml, llms.txt, and cross-links get updated)
4. Publish from deploy-live:  sh publish.sh "what changed"

## Rules

- The most recent version of every unpublished draft lives here — this folder
  is the source of truth for work in progress
- Never edit deploy-live directly for content that hasn't been approved yet
- Once a draft is published, its copy here can be deleted or kept as a record

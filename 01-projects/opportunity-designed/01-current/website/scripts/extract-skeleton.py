#!/usr/bin/env python3
"""
extract-skeleton.py - print a compact structural skeleton of a field note.

Strips prose and CSS so the output is small enough to paste into chat, while
keeping every tag, class, id, and attribute needed to rebuild the template.

Usage:
    python3 extract-skeleton.py get-into-costco.html
    python3 extract-skeleton.py get-into-costco.html | pbcopy
"""

import re
import sys
from html.parser import HTMLParser
from pathlib import Path

# Attributes that matter for rebuilding the template.
KEEP_ATTRS = {
    "class", "id", "href", "name", "rel", "type", "method", "action",
    "for", "placeholder", "value", "aria-label", "data-cal-link",
    "data-cal-namespace", "data-cal-config", "netlify", "data-netlify",
    "property", "content", "src", "alt", "width", "height", "hidden",
    "required", "open", "lang", "charset",
}

# Long attribute values get truncated; these are structural so keep them whole.
NEVER_TRUNCATE = {"class", "id", "for", "name", "type", "rel", "method"}

VOID = {"meta", "link", "img", "br", "hr", "input", "source"}


class Skeleton(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out = []
        self.depth = 0
        self.skip_stack = []
        self.text_buf = []
        self.jsonld_types = []
        self._in_jsonld = False

    # -- helpers ----------------------------------------------------------
    def _flush_text(self):
        text = " ".join("".join(self.text_buf).split())
        self.text_buf = []
        if not text:
            return
        if self.skip_stack:
            return
        words = text.split()
        if len(words) <= 6:
            self.out.append(f"{'  ' * self.depth}[text] {text}")
        else:
            preview = " ".join(words[:5])
            self.out.append(
                f"{'  ' * self.depth}[text {len(words)}w] {preview} ...")

    def _fmt_attrs(self, attrs):
        parts = []
        for k, v in attrs:
            if k not in KEEP_ATTRS:
                continue
            if v is None:
                parts.append(k)
                continue
            if k not in NEVER_TRUNCATE and len(v) > 60:
                v = v[:57] + "..."
            parts.append(f'{k}="{v}"')
        return (" " + " ".join(parts)) if parts else ""

    # -- parser hooks -----------------------------------------------------
    def handle_starttag(self, tag, attrs):
        self._flush_text()
        adict = dict(attrs)

        if tag == "script" and adict.get("type") == "application/ld+json":
            self._in_jsonld = True
            self.out.append(f"{'  ' * self.depth}<script type=ld+json>")
            return

        if tag in {"style", "script"}:
            self.skip_stack.append(tag)
            note = "css" if tag == "style" else "js"
            self.out.append(f"{'  ' * self.depth}<{tag}> ... [{note} omitted]")
            return

        if self.skip_stack:
            return

        self.out.append(f"{'  ' * self.depth}<{tag}{self._fmt_attrs(attrs)}>")
        if tag not in VOID:
            self.depth += 1

    def handle_endtag(self, tag):
        self._flush_text()
        if self._in_jsonld and tag == "script":
            self._in_jsonld = False
            return
        if self.skip_stack and self.skip_stack[-1] == tag:
            self.skip_stack.pop()
            return
        if self.skip_stack:
            return
        if tag not in VOID:
            self.depth = max(0, self.depth - 1)
            self.out.append(f"{'  ' * self.depth}</{tag}>")

    def handle_data(self, data):
        if self._in_jsonld:
            for m in re.finditer(r'"@type"\s*:\s*"([^"]+)"', data):
                self.jsonld_types.append(m.group(1))
            return
        if self.skip_stack:
            return
        self.text_buf.append(data)


def main():
    if len(sys.argv) != 2:
        print(__doc__)
        return 2
    path = Path(sys.argv[1])
    if not path.exists():
        print(f"no such file: {path}", file=sys.stderr)
        return 2

    raw = path.read_text(encoding="utf-8", errors="replace")
    p = Skeleton()
    p.feed(raw)
    p._flush_text()

    print(f"# skeleton of {path.name}  ({len(raw):,} bytes source)")
    if p.jsonld_types:
        seen = []
        for t in p.jsonld_types:
            if t not in seen:
                seen.append(t)
        print(f"# JSON-LD @types present: {', '.join(seen)}")
    print()
    print("\n".join(p.out))
    return 0


if __name__ == "__main__":
    sys.exit(main())

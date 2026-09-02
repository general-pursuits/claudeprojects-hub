#!/usr/bin/env bash
# Installs docs/ context packs into all 19 repositories.
# Run from your own terminal, where your GitHub credentials live.
#   cd ~/ClaudeProjects/_context-packs && bash install-context-packs.sh
#
# Empty repos (no commits) get the pack pushed straight to main.
# Every other repo gets a branch you can open a PR from. Nothing is force-pushed.

set -u
PACKS="$(cd "$(dirname "$0")" && pwd)"
BRANCH="docs/context-recovery-2026-09-02"
WORK="$(mktemp -d)"
OK=(); FAIL=()

for OWNER_DIR in "$PACKS"/*/; do
  OWNER="$(basename "$OWNER_DIR")"
  [ "$OWNER" = "_logs" ] && continue
  for REPO_DIR in "$OWNER_DIR"*/; do
    REPO="$(basename "$REPO_DIR")"
    SLUG="$OWNER/$REPO"
    echo "=== $SLUG ==="
    cd "$WORK" || exit 1
    rm -rf "$REPO"
    if ! git clone --quiet "https://github.com/$SLUG.git" "$REPO" 2>/dev/null; then
      echo "  clone failed"; FAIL+=("$SLUG (clone)"); continue
    fi
    cd "$REPO" || continue
    mkdir -p docs
    cp "$REPO_DIR"docs/*.md docs/

    if git rev-parse --verify HEAD >/dev/null 2>&1; then
      git checkout --quiet -b "$BRANCH"
      TARGET="$BRANCH"
    else
      git checkout --quiet -b main 2>/dev/null || true
      TARGET="main"
    fi

    git add docs/
    if git diff --cached --quiet; then
      echo "  no change, skipping"; OK+=("$SLUG (already current)"); continue
    fi
    git commit --quiet -m "docs: add context recovery pack

Adds docs/PROJECT_CONTEXT.md, docs/CURRENT_STATE.md and docs/NEXT_ACTION.md
so this repository states its own purpose, deployment state and next action.

Recovered from the 2026-09-02 GitHub and Netlify audit."
    if git push --quiet -u origin "$TARGET" 2>/dev/null; then
      echo "  pushed to $TARGET"
      OK+=("$SLUG -> $TARGET")
      [ "$TARGET" = "$BRANCH" ] && echo "  PR: https://github.com/$SLUG/compare/$BRANCH?expand=1"
    else
      echo "  push failed"; FAIL+=("$SLUG (push)")
    fi
  done
done

echo
echo "================ SUMMARY ================"
printf 'OK   %s\n' "${OK[@]:-none}"
printf 'FAIL %s\n' "${FAIL[@]:-none}"
echo "Working clones left in: $WORK"

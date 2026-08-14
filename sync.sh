#!/bin/bash
# One-command sync for ~/ClaudeProjects <-> GitHub (adelitaodm/claudeprojects-hub)
# Run after working on files on this Mac:  sh sync.sh "what changed"
# Safe to run any time. Pulls the latest first, then sends your changes up.
set -e
cd "$HOME/ClaudeProjects"

echo "Getting latest from the cloud..."
git pull --rebase --autostash origin main

git add -A
if git diff --cached --quiet; then
  echo "No local changes to send. You are up to date."
else
  git commit -m "${1:-Mac sync $(date +%Y-%m-%d_%H%M)}"
  echo "Sending your changes to the cloud..."
  git push origin main
  echo "Synced. Cloud and Mac now match."
fi

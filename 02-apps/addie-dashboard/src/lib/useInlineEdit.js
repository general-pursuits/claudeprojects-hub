import { useState } from "react";

// Shared click-to-edit state: draft value, commit/cancel and Enter/Escape handling.
// `parse` may return undefined to reject a draft (the editor still closes).
export function useInlineEdit(value, onSave, parse) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const commit = () => {
    const next = parse ? parse(draft) : draft;
    if (next !== undefined) onSave(next);
    setEditing(false);
  };
  const cancel = () => { setDraft(value); setEditing(false); };
  const onKeyDown = (e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") cancel(); };
  return { editing, setEditing, draft, setDraft, commit, cancel, onKeyDown };
}

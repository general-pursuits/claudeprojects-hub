export const slug = (s) => String(s || "").replace(/\s+/g, "_");

export const projectFileName = (proj, ext, suffix = "") =>
  `${slug(proj.client)}_${slug(proj.name)}${suffix}.${ext}`;

export function downloadBlob(fileName, content, type) {
  Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(new Blob([content], { type })),
    download: fileName,
  }).click();
}

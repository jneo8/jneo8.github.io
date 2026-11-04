// Local Quartz 5 emitter plugin.
//
// Quartz 5 lowercases every slug, including the ones derived from frontmatter
// `aliases`. GitHub Pages is case-sensitive, so an alias such as
// `publish/Linux-task-process-thread-202301071513` only produces
// `publish/linux-task-process-thread-202301071513.html`. This emitter writes an
// additional redirect page at the case-preserved alias path so the exact old URL
// keeps working. Helper functions mirror @quartz-community/alias-redirects.
import path from "path"
import fs from "fs/promises"

function joinSegments(...segments) {
  return segments
    .filter((segment) => segment.length > 0)
    .join("/")
    .replace(/\/+/g, "/")
}
function endsWith(s, suffix) {
  return s === suffix || s.endsWith("/" + suffix)
}
function trimSuffix(s, suffix) {
  return endsWith(s, suffix) ? s.slice(0, -suffix.length) : s
}
function stripSlashes(s, onlyStripPrefix) {
  if (s.startsWith("/")) s = s.substring(1)
  if (!onlyStripPrefix && s.endsWith("/")) s = s.slice(0, -1)
  return s
}
function getFileExtension(s) {
  return s.match(/\.[A-Za-z0-9]+$/)?.[0]
}
function simplifySlug(fp) {
  const res = stripSlashes(trimSuffix(fp, "index"), true)
  return res.length === 0 ? "/" : res
}
function pathToRoot(slug) {
  const rootPath = slug
    .split("/")
    .filter((x) => x !== "")
    .slice(0, -1)
    .map(() => "..")
    .join("/")
  return rootPath.length === 0 ? "." : rootPath
}
function resolveRelative(current, target) {
  return joinSegments(pathToRoot(current), simplifySlug(target))
}
function slugifyPathPreserveCase(s) {
  return s
    .split("/")
    .map((segment) =>
      segment
        .replace(/\s/g, "-")
        .replace(/&/g, "-and-")
        .replace(/%/g, "-percent")
        .replace(/\?/g, "")
        .replace(/#/g, ""),
    )
    .join("/")
    .replace(/\/$/, "")
}
function slugifyFilePathPreserveCase(fp) {
  fp = stripSlashes(fp)
  const ext = getFileExtension(fp)
  const withoutFileExt = fp.replace(new RegExp((ext ?? "") + "$"), "")
  const finalExt = [".md", ".html", undefined].includes(ext) ? "" : ext ?? ""
  let slug = slugifyPathPreserveCase(withoutFileExt)
  if (endsWith(slug, "_index")) slug = slug.replace(/_index$/, "index")
  return slug + finalExt
}
function redirectHtml(title, redirectUrl) {
  return `<!DOCTYPE html>
<html lang="en-us">
<head>
<title>${title}</title>
<link rel="canonical" href="${redirectUrl}">
<meta name="robots" content="noindex">
<meta charset="utf-8">
<meta http-equiv="refresh" content="0; url=${redirectUrl}">
</head>
</html>
`
}
async function write(ctx, slug, ext, content) {
  const pathToPage = joinSegments(ctx.argv.output, slug + ext)
  await fs.mkdir(path.dirname(pathToPage), { recursive: true })
  await fs.writeFile(pathToPage, content)
  return pathToPage
}
function rawAliases(file) {
  const fm = file.data.frontmatter ?? {}
  const raw = fm.aliases ?? fm.alias
  if (raw === undefined || raw === null) return []
  return Array.isArray(raw) ? raw.map(String) : [String(raw)]
}
async function* processFile(ctx, file, emitted) {
  const ogSlug = simplifySlug(file.data.slug ?? "")
  const lowered = new Set(file.data.aliases ?? [])
  for (const alias of rawAliases(file)) {
    const isMd = getFileExtension(alias) === ".md"
    const preserved = slugifyFilePathPreserveCase(isMd ? alias : alias + ".md")
    // Skip aliases that are already all-lowercase (alias-redirects handles them)
    // and anything emitted twice.
    if (lowered.has(preserved) || emitted.has(preserved)) continue
    emitted.add(preserved)
    yield write(ctx, preserved, ".html", redirectHtml(ogSlug, resolveRelative(preserved, ogSlug)))
  }
}
export const AliasCaseRedirects = () => ({
  name: "AliasCaseRedirects",
  async *emit(ctx, content) {
    const emitted = new Set()
    for (const [, file] of content) yield* processFile(ctx, file, emitted)
  },
  async *partialEmit(ctx, _content, _resources, changeEvents) {
    const emitted = new Set()
    for (const ev of changeEvents) {
      if (ev.file && (ev.type === "add" || ev.type === "change")) {
        yield* processFile(ctx, ev.file, emitted)
      }
    }
  },
})
export default AliasCaseRedirects

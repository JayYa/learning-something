// 生成 GitHub Pages 站点：复制课程、参考页和共享资源到 _site/，并生成目录页。
// 用法：node scripts/build-site.mjs
import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const out = join(root, "_site");
const dirs = ["lessons", "reference", "assets"];

rmSync(out, { recursive: true, force: true });
mkdirSync(out);
for (const dir of dirs) cpSync(join(root, dir), join(out, dir), { recursive: true });
writeFileSync(join(out, ".nojekyll"), "");

function escapeHtml(str) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function stripTags(str) {
  return str.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function readMeta(dir, file) {
  const html = readFileSync(join(root, dir, file), "utf8");
  const title = stripTags(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || file);
  const kicker = stripTags(html.match(/<p[^>]*class="[^"]*\bkicker\b[^"]*"[^>]*>([\s\S]*?)<\/p>/i)?.[1] || "");
  const subtitle = stripTags(html.match(/<p[^>]*class="[^"]*\bsubtitle\b[^"]*"[^>]*>([\s\S]*?)<\/p>/i)?.[1] || "");
  return { file, key: file.replace(/\.html$/i, ""), title, kicker, subtitle };
}

function listPages(dir) {
  return readdirSync(join(root, dir))
    .filter((f) => f.endsWith(".html"))
    .sort()
    .map((f) => readMeta(dir, f));
}

function renderCards(dir, pages, withLessonKey = false) {
  return pages
    .map((p) => {
      const keyAttr = withLessonKey ? ` data-lesson-key="${escapeHtml(p.key)}"` : "";
      const kickerHtml = p.kicker ? `\n        <span class="card-kicker">${escapeHtml(p.kicker)}</span>` : "";
      const descHtml = p.subtitle ? `\n        <p class="card-desc">${escapeHtml(p.subtitle)}</p>` : "";
      return `      <a class="card" href="${dir}/${encodeURI(p.file)}"${keyAttr}>${kickerHtml}
        <span class="card-title">${escapeHtml(p.title)}</span>${descHtml}
      </a>`;
    })
    .join("\n");
}

const lessons = listPages("lessons");
const references = listPages("reference");

const index = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>TypeScript 学习：目录</title>
<link rel="stylesheet" href="assets/style.css">
</head>
<body>

<header class="site-header">
  <div class="site-header-inner">
    <a class="site-brand" href="index.html">TS 审阅笔记</a>
    <nav class="site-nav" aria-label="站点导航">
      <a href="index.html" class="active">目录</a>
      <a href="reference/roadmap.html">学习路线</a>
      <a href="reference/csharp-to-ts.html">C# → TS 速查</a>
    </nav>
    <span class="header-meta">共 ${lessons.length} 课 · ${references.length} 份参考</span>
  </div>
</header>

<div class="page-shell">
  <main>
    <p class="kicker">TypeScript · AI 代码审阅笔记</p>
    <h1>TypeScript 学习目录</h1>
    <p class="subtitle">面向 C# 开发者的 TypeScript 学习记录：每课 15–20 分钟，以读懂、挑错、给 AI 提修改意见为核心。</p>

    <h2>课程</h2>
    <div class="card-grid">
${renderCards("lessons", lessons, true)}
    </div>

    <h2>参考页</h2>
    <div class="card-grid">
${renderCards("reference", references, false)}
    </div>

    <footer>静态站点由 <code>scripts/build-site.mjs</code> 自动生成。</footer>
  </main>
</div>

<script src="assets/site.js"></script>
</body>
</html>
`;

writeFileSync(join(out, "index.html"), index);
console.log(`已生成 ${out}`);

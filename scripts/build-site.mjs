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

function entries(dir) {
  return readdirSync(join(root, dir))
    .filter((f) => f.endsWith(".html"))
    .sort()
    .map((f) => {
      const html = readFileSync(join(root, dir, f), "utf8");
      const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1].trim() || f;
      return `  <li><a href="${dir}/${encodeURI(f)}">${title}</a></li>`;
    })
    .join("\n");
}

const index = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>TypeScript 学习：目录</title>
<link rel="stylesheet" href="assets/style.css">
</head>
<body>
<main>
<h1>TypeScript 学习：目录</h1>

<h2>课程</h2>
<ul>
${entries("lessons")}
</ul>

<h2>参考页</h2>
<ul>
${entries("reference")}
</ul>
</main>
</body>
</html>
`;

writeFileSync(join(out, "index.html"), index);
console.log(`已生成 ${out}`);

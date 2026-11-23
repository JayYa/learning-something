## 发布站点

`lessons/`、`reference/`、`assets/` 会发布到 https://jayya.github.io/learning-something/ 。push 到 `main` 后由 `.github/workflows/pages.yml` 自动发布；目录页由 `scripts/build-site.mjs` 在发布时生成，仓库里不存。

- 目录页的条目文字取自每页的 `<title>`。课程标题保持"编号 · 课名"的格式，例如 `0001 · 类型只活在编译期`。
- 课程和参考页之间、以及对 `assets/` 的引用都用相对路径。

## Agent skills

### Issue tracker

Issues 记在 GitHub Issues（JayYa/learning-something），用 `gh` CLI 操作。See `docs/agents/issue-tracker.md`.

### Triage labels

使用默认的五个标签：needs-triage、needs-info、ready-for-agent、ready-for-human、wontfix。See `docs/agents/triage-labels.md`.

### Domain docs

单上下文（single-context）：根目录 `GLOSSARY.md` 加 `docs/adr/`。See `docs/agents/domain.md`.

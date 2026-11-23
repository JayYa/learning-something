/*
 * 站点轻交互（零依赖）：
 * 1. 代码块：自动行号、报错/重点行高亮、一键复制
 * 2. 宽屏右侧本页大纲（TOC）及当前小节高亮
 * 3. 速查页实时关键字过滤
 * 4. 目录页/路线图上的本地自测完成徽章
 */
(function () {
  // 1. 增强 .code-block
  document.querySelectorAll('.code-block').forEach((block) => {
    const code = block.querySelector('pre code');
    if (!code) return;
    const rawText = code.textContent.replace(/\n$/, '');

    // 复制按钮
    const head = block.querySelector('.code-head');
    if (head && !head.querySelector('.code-copy')) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'code-copy';
      btn.textContent = '复制';
      btn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(rawText);
          btn.textContent = '已复制';
          btn.classList.add('copied');
          setTimeout(() => {
            btn.textContent = '复制';
            btn.classList.remove('copied');
          }, 1500);
        } catch {
          btn.textContent = '复制失败';
          setTimeout(() => {
            btn.textContent = '复制';
          }, 1500);
        }
      });
      head.appendChild(btn);
    }

    // 行号与行高亮
    if (block.hasAttribute('data-lines')) {
      const parseLineSet = (attr) =>
        new Set(
          (block.getAttribute(attr) || '')
            .split(',')
            .map((s) => Number(s.trim()))
            .filter((n) => Number.isFinite(n) && n > 0)
        );
      const errLines = parseLineSet('data-error-line');
      const hlLines = parseLineSet('data-hl-line');

      const lines = rawText.split('\n');
      const frag = document.createDocumentFragment();
      lines.forEach((line, idx) => {
        const lineNo = idx + 1;
        const row = document.createElement('span');
        row.className = 'code-line';
        if (errLines.has(lineNo)) row.classList.add('is-error');
        else if (hlLines.has(lineNo)) row.classList.add('is-highlight');

        const ln = document.createElement('span');
        ln.className = 'code-ln';
        ln.setAttribute('aria-hidden', 'true');
        ln.textContent = String(lineNo);

        const txt = document.createElement('span');
        txt.className = 'code-txt';
        txt.textContent = line || ' ';

        row.append(ln, txt);
        frag.appendChild(row);
      });
      code.replaceChildren(frag);
    } else {
      block.classList.add('no-lines');
    }
  });

  // 2. 自动生成本页大纲（TOC）
  const tocNav = document.querySelector('.page-toc');
  if (tocNav) {
    const headings = Array.from(document.querySelectorAll('main h2'));
    if (headings.length > 0) {
      const title = document.createElement('p');
      title.className = 'toc-title';
      title.textContent = '本页大纲';

      const list = document.createElement('ul');
      list.className = 'toc-list';

      const links = headings.map((h, i) => {
        if (!h.id) h.id = `sec-${i + 1}`;
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${h.id}`;
        a.textContent = h.textContent.trim();
        li.appendChild(a);
        list.appendChild(li);
        return a;
      });

      tocNav.replaceChildren(title, list);

      if ('IntersectionObserver' in window) {
        const setActive = (id) => {
          links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
        };
        const observer = new IntersectionObserver(
          (entries) => {
            const visible = entries.find((e) => e.isIntersecting);
            if (visible) setActive(visible.target.id);
          },
          { rootMargin: '-12% 0px -72% 0px' }
        );
        headings.forEach((h) => observer.observe(h));
        setActive(headings[0].id);
      }
    }
  }

  // 3. 速查表实时过滤
  const filterInput = document.querySelector('.filter-input');
  if (filterInput) {
    const countEl = document.querySelector('.filter-count');
    const items = Array.from(document.querySelectorAll('tbody tr, .checklist li'));
    const updateFilter = () => {
      const q = filterInput.value.trim().toLowerCase();
      let shown = 0;
      items.forEach((el) => {
        const hit = !q || el.textContent.toLowerCase().includes(q);
        el.hidden = !hit;
        if (hit) shown += 1;
      });
      if (countEl) {
        countEl.textContent = q ? `匹配 ${shown} / ${items.length} 条` : `共 ${items.length} 条`;
      }
    };
    filterInput.addEventListener('input', updateFilter);
    updateFilter();
  }

  // 4. 在目录页/路线图上显示本地自测完成状态
  document.querySelectorAll('[data-lesson-key]').forEach((el) => {
    const key = el.getAttribute('data-lesson-key');
    if (!key) return;
    try {
      const raw = localStorage.getItem(`ts-quiz:${key}`);
      if (!raw) return;
      const rec = JSON.parse(raw);
      if (typeof rec.correct !== 'number' || typeof rec.total !== 'number') return;
      const badge = document.createElement('span');
      badge.className = 'card-badge';
      badge.textContent = `自测 ${rec.correct}/${rec.total}` + (rec.date ? ` · ${rec.date}` : '');
      el.appendChild(badge);
    } catch {
      // 忽略本地存储读取异常
    }
  });
})();

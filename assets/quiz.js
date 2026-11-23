/*
 * 共享小测组件。用法：
 *
 * <div class="quiz" data-answer="1">
 *   <p class="q">题干</p>
 *   <ol class="options">
 *     <li>选项 A</li>
 *     <li>选项 B</li>   ← data-answer 是从 0 开始的下标
 *   </ol>
 *   <div class="explain">答完后显示的解释</div>
 * </div>
 *
 * 每题只能选一次（第一次选择就是你的检索结果，不给反复试的机会）。
 * 页面里有 <div id="quiz-score"></div> 时会显示总分，并按文件名记录上次自测成绩。
 */
(function () {
  const quizzes = Array.from(document.querySelectorAll('.quiz'));
  if (quizzes.length === 0) return;

  let answered = 0;
  let correct = 0;
  const letters = 'ABCDEFGH';
  const lessonKey = (location.pathname.split('/').pop() || '').replace(/\.html$/i, '');
  const storageKey = lessonKey ? `ts-quiz:${lessonKey}` : '';

  let prevRecord = null;
  if (storageKey) {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) prevRecord = JSON.parse(raw);
    } catch {
      // 忽略本地存储异常
    }
  }

  const scoreEl = document.getElementById('quiz-score');
  if (scoreEl) scoreEl.setAttribute('aria-live', 'polite');

  function formatDate() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function updateScore() {
    if (!scoreEl) return;
    scoreEl.replaceChildren();
    if (answered < quizzes.length) {
      scoreEl.append(document.createTextNode(`已答 ${answered} / ${quizzes.length}`));
      if (prevRecord && typeof prevRecord.correct === 'number' && typeof prevRecord.total === 'number') {
        const prev = document.createElement('span');
        prev.className = 'quiz-prev';
        prev.textContent = `上次记录：答对 ${prevRecord.correct} / ${prevRecord.total}` +
          (prevRecord.date ? `（${prevRecord.date}）` : '');
        scoreEl.append(prev);
      }
    } else {
      scoreEl.textContent = `完成：答对 ${correct} / ${quizzes.length}。` +
        (correct === quizzes.length ? '全对。' : '答错的题，过一两天回来再做一次。');
      scoreEl.classList.add('done');
      if (storageKey) {
        try {
          localStorage.setItem(storageKey, JSON.stringify({
            correct,
            total: quizzes.length,
            date: formatDate(),
          }));
        } catch {
          // 忽略本地存储异常
        }
      }
    }
  }

  quizzes.forEach((quiz, qi) => {
    const answer = Number(quiz.dataset.answer);
    const options = Array.from(quiz.querySelectorAll('.options li'));
    const explain = quiz.querySelector('.explain');
    if (explain) {
      explain.hidden = true;
      explain.setAttribute('aria-live', 'polite');
    }

    const num = document.createElement('span');
    num.className = 'qnum';
    num.textContent = `第 ${qi + 1} 题 / 共 ${quizzes.length} 题`;
    quiz.prepend(num);

    options.forEach((li, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('aria-pressed', 'false');
      btn.innerHTML =
        `<span class="letter">${letters[i]}</span>` +
        `<span class="option-text">${li.innerHTML}</span>` +
        `<span class="option-mark" aria-hidden="true"></span>`;
      li.replaceChildren(btn);

      btn.addEventListener('click', () => {
        if (quiz.classList.contains('answered')) return;
        quiz.classList.add('answered');
        btn.setAttribute('aria-pressed', 'true');

        const ok = i === answer;
        answered += 1;
        if (ok) correct += 1;

        li.classList.add(ok ? 'right' : 'wrong');
        if (!ok) {
          li.querySelector('.option-mark').textContent = '✗';
        }
        options[answer].classList.add('right');
        options[answer].querySelector('.option-mark').textContent = '✓';

        options.forEach((o) => (o.querySelector('button').disabled = true));

        if (explain) {
          explain.hidden = false;
          explain.classList.add(ok ? 'is-right' : 'is-wrong');
          const verdict = document.createElement('p');
          verdict.className = 'explain-verdict';
          verdict.textContent = ok ? '✓ 正确。' : `✗ 不对，正确答案是 ${letters[answer]}。`;
          explain.prepend(verdict);
        }
        updateScore();
      });
    });
  });

  updateScore();
})();

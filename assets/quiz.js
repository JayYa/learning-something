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
 * 页面里有 <div id="quiz-score"></div> 时会显示总分。
 */
(function () {
  const quizzes = Array.from(document.querySelectorAll('.quiz'));
  let answered = 0;
  let correct = 0;
  const letters = 'ABCDEFGH';

  function updateScore() {
    const el = document.getElementById('quiz-score');
    if (!el) return;
    if (answered < quizzes.length) {
      el.textContent = `已答 ${answered} / ${quizzes.length}`;
    } else {
      el.textContent = `完成：答对 ${correct} / ${quizzes.length}。` +
        (correct === quizzes.length ? '全对。' : '答错的题，过一两天回来再做一次。');
      el.classList.add('done');
    }
  }

  quizzes.forEach((quiz, qi) => {
    const answer = Number(quiz.dataset.answer);
    const options = Array.from(quiz.querySelectorAll('.options li'));
    const explain = quiz.querySelector('.explain');
    if (explain) explain.hidden = true;

    const num = document.createElement('span');
    num.className = 'qnum';
    num.textContent = `第 ${qi + 1} 题`;
    quiz.prepend(num);

    options.forEach((li, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.innerHTML = `<span class="letter">${letters[i]}</span>${li.innerHTML}`;
      li.replaceChildren(btn);

      btn.addEventListener('click', () => {
        if (quiz.classList.contains('answered')) return;
        quiz.classList.add('answered');
        const ok = i === answer;
        answered += 1;
        if (ok) correct += 1;
        li.classList.add(ok ? 'right' : 'wrong');
        options[answer].classList.add('right');
        options.forEach(o => (o.querySelector('button').disabled = true));
        if (explain) {
          explain.hidden = false;
          explain.prepend(Object.assign(document.createElement('strong'), {
            textContent: ok ? '正确。' : `不对，答案是 ${letters[answer]}。`,
          }));
        }
        updateScore();
      });
    });
  });

  updateScore();
})();

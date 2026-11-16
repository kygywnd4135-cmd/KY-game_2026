// 한 글자씩 빠르게 출력하는 타자 효과.
// 글자를 처음부터 모두 깔아 두고(투명) 차례로 보이게 해서, 가운데 정렬 문장도 흔들리지 않는다.
//
//   const t = Typewriter.run([{ el, text }, ...], { speed, onDone });
//   t.finish();   // 남은 글자를 즉시 전부 출력
//   t.done        // 출력이 끝났는지
window.Typewriter = (function () {
  function fill(el, text) {
    el.textContent = "";
    el.classList.add("tw");
    el.classList.remove("is-instant");
    const chars = [];
    for (const ch of Array.from(text)) {
      if (ch === "\n") {
        el.appendChild(document.createElement("br"));
      } else if (ch === " ") {
        el.appendChild(document.createTextNode(" "));
      } else {
        const span = document.createElement("span");
        span.className = "tw__ch";
        span.textContent = ch;
        el.appendChild(span);
        chars.push(span);
      }
    }
    return chars;
  }

  function run(parts, options) {
    const speed = (options && options.speed) || 42;
    const gap = (options && options.gap) || 260; // 문장 사이 쉬는 시간
    const onDone = options && options.onDone;

    // 각 글자에 "몇 ms 뒤에 나올지"를 미리 매긴다
    const queue = [];
    let at = 0;
    parts.forEach((part, i) => {
      if (i > 0) at += gap;
      fill(part.el, part.text).forEach((span) => {
        queue.push({ span, at });
        // 문장부호 뒤에서는 아주 살짝 숨을 고른다
        at += /[,.!?…]/.test(span.textContent) ? speed * 2.2 : speed;
      });
    });

    const state = { done: false, finish };
    let index = 0;
    let raf = 0;
    const start = performance.now();

    function complete() {
      if (state.done) return;
      state.done = true;
      cancelAnimationFrame(raf);
      if (onDone) onDone();
    }

    function frame(now) {
      const elapsed = now - start;
      while (index < queue.length && queue[index].at <= elapsed) {
        queue[index].span.classList.add("is-on");
        index++;
      }
      if (index >= queue.length) complete();
      else raf = requestAnimationFrame(frame);
    }

    function finish() {
      if (state.done) return;
      parts.forEach((part) => part.el.classList.add("is-instant"));
      for (; index < queue.length; index++) queue[index].span.classList.add("is-on");
      complete();
    }

    if (queue.length) raf = requestAnimationFrame(frame);
    else complete();

    return state;
  }

  function clear(el) {
    el.textContent = "";
  }

  return { run, clear };
})();

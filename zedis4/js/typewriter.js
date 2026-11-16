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
    let pos = 0; // 원문에서 몇 번째 글자까지인지(공백·줄바꿈 포함)
    for (const ch of Array.from(text)) {
      pos += ch.length;
      if (ch === "\n") {
        el.appendChild(document.createElement("br"));
      } else if (ch === " ") {
        el.appendChild(document.createTextNode(" "));
      } else {
        const span = document.createElement("span");
        span.className = "tw__ch";
        span.textContent = ch;
        span.twPos = pos;
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
    const onChar = options && options.onChar; // 글자가 나올 때마다 (원문 기준 위치)를 알려 준다
    const decorate = options && options.decorate; // (span, 몇 번째 글자, 전체 글자 수): 글자별 꾸밈
    const pace = options && options.pace; // (몇 번째 글자, 전체 글자 수) → 속도 배수(클수록 느림)

    // 각 글자에 "몇 ms 뒤에 나올지"를 미리 매긴다
    const queue = [];
    let at = 0;
    let shift = 0;
    parts.forEach((part, i) => {
      if (i > 0) at += gap;
      fill(part.el, part.text).forEach((span) => {
        queue.push({ span, at });
        at += speed;
      });
    });
    queue.forEach((item, k) => {
      if (decorate) decorate(item.span, k, queue.length);
      const step = speed * (pace ? pace(k, queue.length) : 1);
      item.at += shift;
      // 문장부호 뒤에서는 아주 살짝 숨을 고른다
      shift += (/[,.!?…]/.test(item.span.textContent) ? step * 2.2 : step) - speed;
    });

    const state = { done: false, finish, cancel };
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
        if (onChar) onChar(queue[index].span.twPos);
        index++;
      }
      if (index >= queue.length) complete();
      else raf = requestAnimationFrame(frame);
    }

    // 출력을 그 자리에서 멈춘다(끝났다는 알림 없이). 장면을 떠날 때 쓴다.
    function cancel() {
      state.done = true;
      cancelAnimationFrame(raf);
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

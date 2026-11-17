// 대화2(피그마 '대화2 변경'): 메모장이 위에서 툭! 떨어지고 캐릭터들이 뿅! 나온다.
// 떨어지고 튀어나오는 연출은 css/scenario.css가 맡고, 여기서는 순서와 말풍선 글자 출력을 맡는다.
window.Scenario = (function () {
  const LINE = "막을 올리러 가보자고!";
  const SPEAK_AT = 1750; // 메모가 떨어지고 캐릭터들이 나온 뒤 말하기 시작(ms)

  const root = document.querySelector('[data-screen="scenario"]');
  const text = root.querySelector("[data-scenario-text]");

  let phase = "off"; // off → opening → line → waiting
  let typer = null;
  let timer = 0;

  function speak() {
    phase = "line";
    typer = Typewriter.run([{ el: text, text: LINE }], {
      onDone: () => (phase = "waiting"),
    });
  }

  // 떨어지는 연출을 건너뛰고 다 나온 상태로 만든다
  function skipOpening() {
    clearTimeout(timer);
    root.getAnimations({ subtree: true }).forEach((a) => {
      const timing = a.effect && a.effect.getComputedTiming();
      if (!timing) return;
      try {
        if (timing.iterations === Infinity) a.currentTime = Math.max(a.currentTime || 0, timing.delay);
        else a.finish();
      } catch (e) {}
    });
    speak();
  }

  function enter() {
    clearTimeout(timer);
    typer = null;
    Typewriter.clear(text);
    root.classList.remove("is-open");
    void root.offsetWidth;
    root.classList.add("is-open");
    phase = "opening";
    timer = setTimeout(speak, SPEAK_AT);
  }

  function leave() {
    clearTimeout(timer);
    phase = "off";
  }

  // 터치/아무 키. 장면이 끝났으면 "done"을 돌려준다.
  function advance() {
    if (phase === "opening") {
      skipOpening();
    } else if (phase === "line") {
      if (typer) typer.finish();
    } else if (phase === "waiting") {
      return "done";
    }
    return "handled";
  }

  return { enter, leave, advance };
})();

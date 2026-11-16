// 대화2: 두루마리가 촤라라락 펼쳐지며 시나리오가 나오는 장면.
// 펼쳐지는 연출은 css/scenario.css가 맡고, 여기서는 순서와 말풍선 글자 출력을 맡는다.
window.Scenario = (function () {
  const LINE = "막을 올리러 가보자고!";
  const SPEAK_AT = 2000; // 펼쳐지고 배우가 올라온 뒤 말하기 시작(ms)

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
    if (phase === "line") {
      if (typer) typer.finish();
    } else if (phase === "waiting") {
      return "done";
    }
    // 펼쳐지는 중에는 짧은 연출이 끝나길 기다린다
    return "handled";
  }

  return { enter, leave, advance };
})();

// 연극 종료 → 연극 결과 연결 연출.
// 캄캄한 화면에서 베레모 쓴 파랑이 뿅! 튀어나오고, 대사를 한 글자씩 말한다.
window.Bridge = (function () {
  const LINE = "후후.. 오늘 연극은 어땠어?\n이제 내가 시나리오를 화려하게 바꿔주지!";
  const DARK_TIME = 650; // 캄캄한 채로 머무는 시간(ms)
  const SPEAK_AFTER = 1050; // 튀어나온 뒤 말하기까지(ms)

  const root = document.querySelector('[data-screen="bridge"]');
  const bubble = root.querySelector(".bubble");
  const bubblePop = root.querySelector(".bubble__pop");
  const text = root.querySelector("[data-bridge-text]");

  let phase = "off"; // off → dark → popping → line → waiting
  let typer = null;
  let timer = 0;

  function replay(el, className) {
    el.classList.remove(className);
    void el.offsetWidth;
    el.classList.add(className);
  }

  function speak() {
    clearTimeout(timer);
    phase = "line";
    root.classList.add("is-speaking", "is-talking");
    replay(bubblePop, "is-entering");
    typer = Typewriter.run([{ el: text, text: LINE }], {
      onDone: () => {
        root.classList.remove("is-talking");
        bubble.classList.add("is-ready");
        phase = "waiting";
      },
    });
  }

  function pop() {
    clearTimeout(timer);
    phase = "popping";
    root.classList.add("is-on");
    timer = setTimeout(speak, SPEAK_AFTER);
  }

  function enter() {
    clearTimeout(timer);
    if (typer) typer.cancel();
    typer = null;
    root.classList.remove("is-on", "is-speaking", "is-talking");
    bubble.classList.remove("is-ready");
    bubblePop.classList.remove("is-entering");
    Typewriter.clear(text);
    phase = "dark";
    timer = setTimeout(pop, DARK_TIME);
  }

  function leave() {
    clearTimeout(timer);
    if (typer) typer.cancel();
    phase = "off";
    root.classList.remove("is-talking");
  }

  // 터치/아무 키. 장면이 끝났으면 "done"을 돌려준다.
  function advance() {
    if (phase === "dark") pop();
    else if (phase === "popping") speak();
    else if (phase === "line") typer && typer.finish();
    else if (phase === "waiting") return "done";
    return "handled";
  }

  return { enter, leave, advance };
})();

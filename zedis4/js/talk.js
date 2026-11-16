// 대화(극장) 장면.
// 어두운 극장에 실루엣만 보이다가 → 조명이 켜지고 → 대사가 출력되며 → 대사에 맞춰 관객이 반응한다.
//
// 대사와 반응은 아래 SCRIPT만 고치면 된다.
//   text  : 대사 (줄바꿈은 \n)
//   cues  : 대사가 after 글자까지 출력된 순간에 일어나는 관객 반응
//     say  : { 자리: "한마디" }  자리 = farLeft | left | right | farRight
//     gasp : 느낌표가 뜨는 쪽   "l" | "r"
//     hop  : 들썩이는 관객      peach | mint | green | violet | pink
window.Talk = (function () {
  const SCRIPT = [
    {
      text: "으흠! 오늘은.. 이럴수가!\n또 그 김부장이 사고를 치셨구만!",
      cues: [
        { after: "으흠!", say: { left: "웅성웅성" }, hop: ["mint", "green"] },
        { after: "이럴수가!", say: { farRight: "이런!" }, gasp: ["l", "r"], hop: ["peach", "pink"] },
        { after: "김부장이", say: { farLeft: "또 너냐!" }, hop: ["peach", "violet"] },
        { after: "치셨구만!", say: { right: "에라이~" }, hop: ["violet", "mint", "pink"] },
      ],
    },
    {
      text: "후임이 점점 불쌍해지기 시작하는군..\n좋아, 연극을 시작해볼까?",
      cues: [
        { after: "시작해볼까?", say: { farLeft: "와!!", farRight: "꺄!!", right: "기대된다!!" }, hop: ["peach", "pink", "violet", "mint", "green"] },
      ],
    },
  ];

  const DARK_TIME = 1500; // 실루엣으로 보이는 시간(ms)
  const LIGHT_TIME = 1050; // 조명이 켜지고 대사가 시작되기까지(ms)

  const root = document.querySelector('[data-screen="talk"]');
  const bubble = root.querySelector(".bubble");
  const bubblePop = root.querySelector(".bubble__pop");
  const bubbleText = root.querySelector("[data-talk-text]");
  const shouts = {};
  root.querySelectorAll("[data-shout]").forEach((el) => (shouts[el.dataset.shout] = el));
  const gasps = {};
  root.querySelectorAll("[data-gasp]").forEach((el) => (gasps[el.dataset.gasp] = el));
  const seats = {};
  root.querySelectorAll("[data-seat]").forEach((el) => (seats[el.dataset.seat] = el.querySelector(".crowd__hop")));

  let phase = "off"; // off → dark → lighting → line → waiting
  let lineIndex = 0;
  let typer = null;
  let timer = 0;

  function replay(el, className) {
    el.classList.remove(className);
    void el.offsetWidth;
    el.classList.add(className);
  }

  function clearReactions() {
    Object.values(shouts).forEach((el) => el.classList.remove("is-on"));
    Object.values(gasps).forEach((el) => el.classList.remove("is-on"));
  }

  function react(cue) {
    Object.entries(cue.say || {}).forEach(([slot, words]) => {
      const el = shouts[slot];
      if (!el) return;
      el.querySelector(".shout__wiggle").textContent = words;
      el.classList.add("is-on");
    });
    (cue.gasp || []).forEach((side) => gasps[side] && gasps[side].classList.add("is-on"));
    (cue.hop || []).forEach((id, i) => {
      if (seats[id]) setTimeout(() => replay(seats[id], "is-hopping"), i * 70);
    });
  }

  function startLine(index) {
    const line = SCRIPT[index];
    lineIndex = index;
    phase = "line";
    clearReactions();
    bubble.classList.remove("is-ready");
    if (index > 0) replay(bubblePop, "is-popping");

    // 각 반응이 "몇 번째 글자까지 나왔을 때" 일어나는지 미리 계산
    const pending = (line.cues || [])
      .map((cue) => {
        const found = cue.after ? line.text.indexOf(cue.after) : -1;
        return { cue, at: found < 0 ? 0 : found + cue.after.length };
      })
      .sort((a, b) => a.at - b.at);

    root.classList.add("is-talking");
    typer = Typewriter.run([{ el: bubbleText, text: line.text }], {
      onChar: (pos) => {
        while (pending.length && pending[0].at <= pos) react(pending.shift().cue);
      },
      onDone: () => {
        while (pending.length) react(pending.shift().cue);
        root.classList.remove("is-talking");
        bubble.classList.add("is-ready");
        phase = "waiting";
      },
    });
  }

  function lightOn() {
    clearTimeout(timer);
    phase = "lighting";
    root.classList.add("is-lit");
    replay(bubblePop, "is-entering");
    timer = setTimeout(() => startLine(0), LIGHT_TIME);
  }

  function enter() {
    clearTimeout(timer);
    typer = null;
    root.classList.remove("is-lit", "is-talking");
    bubble.classList.remove("is-ready");
    bubblePop.classList.remove("is-entering", "is-popping");
    Typewriter.clear(bubbleText);
    clearReactions();
    phase = "dark";
    timer = setTimeout(lightOn, DARK_TIME);
  }

  function leave() {
    clearTimeout(timer);
    phase = "off";
    root.classList.remove("is-talking");
  }

  // 터치/아무 키. 장면이 모두 끝났으면 "done"을 돌려준다.
  function advance() {
    if (phase === "dark") {
      lightOn();
    } else if (phase === "lighting") {
      clearTimeout(timer);
      startLine(0);
    } else if (phase === "line") {
      if (typer) typer.finish();
    } else if (phase === "waiting") {
      if (lineIndex + 1 < SCRIPT.length) startLine(lineIndex + 1);
      else return "done";
    }
    return "handled";
  }

  return { enter, leave, advance, script: SCRIPT };
})();

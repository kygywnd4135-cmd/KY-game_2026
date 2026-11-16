// 화면 흐름: 대기화면 → 전원 1 → 전원 2 → 전원 3 → 펜 로딩
// 터치(클릭)하거나 아무 키나 누르면 진행한다.
// 글자가 출력되는 중이면 먼저 남은 글자를 전부 보여 주고, 한 번 더 누르면 다음으로 넘어간다.
(function () {
  const POWER_LINES = {
    1: "엇, 안녕! 오늘은 일찍 들어왔네?!",
    2: "오늘은 11:50분에 펜을 사용했었어..",
    3: "무슨 일이 있었던걸까?\n기록을 저장하고 올테니까 기다려줘!",
  };
  const LOADING_LEAD = "맞다!";
  const LOADING_SUB = "지난번 꼬집고 싶다던 김부장님에게 시원한 한마디, 성공하셨나요?";

  const STEPS = [
    { screen: "standby" },
    { screen: "power", step: 1 },
    { screen: "power", step: 2 },
    { screen: "power", step: 3 },
    { screen: "loading" },
    { screen: "lobby" },
  ];

  const screens = {};
  document.querySelectorAll("[data-screen]").forEach((el) => (screens[el.dataset.screen] = el));

  const power = screens.power;
  const bubble = power.querySelector(".bubble");
  const bubblePop = power.querySelector(".bubble__pop");
  const bubbleText = power.querySelector("[data-bubble-text]");
  const bounce = power.querySelector(".pc__bounce");
  const loadingLead = screens.loading.querySelector("[data-loading-lead]");
  const loadingSub = screens.loading.querySelector("[data-loading-sub]");

  let index = 0;
  let typer = null;

  // 같은 애니메이션 클래스를 다시 붙여 처음부터 재생한다
  function replay(el, className, others) {
    el.classList.remove(className, ...(others || []));
    void el.offsetWidth;
    el.classList.add(className);
  }

  function showScreen(name) {
    Object.keys(screens).forEach((key) => screens[key].classList.toggle("is-active", key === name));
  }

  function enterPower(step, fromOtherScreen) {
    power.dataset.step = String(step);
    bubble.classList.remove("is-ready");

    if (fromOtherScreen) {
      replay(bubblePop, "is-entering", ["is-popping"]);
      replay(bounce, "is-waking", ["is-jelly"]);
    } else {
      replay(bubblePop, "is-popping", ["is-entering"]);
      replay(bounce, "is-jelly", ["is-waking"]);
    }

    typer = Typewriter.run([{ el: bubbleText, text: POWER_LINES[step] }], {
      onDone: () => bubble.classList.add("is-ready"),
    });
  }

  function enterLoading() {
    typer = Typewriter.run(
      [
        { el: loadingLead, text: LOADING_LEAD },
        { el: loadingSub, text: LOADING_SUB },
      ],
      { gap: 380 }
    );
  }

  function go(next) {
    const prev = STEPS[index];
    const cur = STEPS[next];
    index = next;
    typer = null;

    showScreen(cur.screen);
    if (prev.screen === "lobby" && cur.screen !== "lobby") Lobby.leave();

    if (cur.screen === "lobby") {
      Lobby.enter();
    } else if (cur.screen === "power") {
      enterPower(cur.step, prev.screen !== "power");
    } else if (cur.screen === "loading") {
      enterLoading();
    } else {
      Typewriter.clear(bubbleText);
      Typewriter.clear(loadingLead);
      Typewriter.clear(loadingSub);
    }
  }

  function advance() {
    if (typer && !typer.done) {
      typer.finish();
      return;
    }
    go((index + 1) % STEPS.length);
  }

  const inLobby = () => STEPS[index].screen === "lobby";

  // ── 입력: 터치/클릭, 아무 키 ──
  document.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (inLobby()) return; // 로비의 터치·밀기는 js/lobby.js가 처리
    advance();
  });

  document.addEventListener("keydown", (e) => {
    if (e.repeat) return;
    // 새로고침(Ctrl+R) 같은 브라우저 단축키와 보조키 단독 입력은 무시
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (["Shift", "Control", "Alt", "Meta", "CapsLock", "Tab"].includes(e.key)) return;
    if (e.key === " " || e.key.startsWith("Arrow") || e.key.startsWith("Page")) e.preventDefault();
    if (inLobby()) {
      // 로비: ←/→ 로 다이얼을 돌린다. 로비 다음 화면은 아직 없어서 Esc는 대기화면으로 돌아간다.
      if (e.key === "Escape") go(0);
      else Lobby.handleKey(e);
      return;
    }
    advance();
  });

  // 확인·디버깅용: 원하는 장면으로 바로 이동
  window.__flow = { go, advance, steps: STEPS };
})();

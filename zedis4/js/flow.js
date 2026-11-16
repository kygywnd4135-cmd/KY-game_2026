// 화면 흐름: 대기화면 → 전원 1~3 → 펜 로딩 → 로비 → 대화(극장) → 시나리오 두루마리 → 연극 1~5
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
    { screen: "talk" },
    { screen: "scenario" },
    { screen: "play" },
  ];
  const LOBBY = STEPS.findIndex((s) => s.screen === "lobby");
  const TALK = STEPS.findIndex((s) => s.screen === "talk");
  const SCENARIO = STEPS.findIndex((s) => s.screen === "scenario");
  const PLAY = STEPS.findIndex((s) => s.screen === "play");

  const screens = {};
  document.querySelectorAll("[data-screen]").forEach((el) => (screens[el.dataset.screen] = el));

  const power = screens.power;
  const bubble = power.querySelector(".bubble");
  const bubblePop = power.querySelector(".bubble__pop");
  const bubbleText = power.querySelector("[data-bubble-text]");
  const bounce = power.querySelector(".pc__bounce");
  const loadingLead = screens.loading.querySelector("[data-loading-lead]");
  const loadingSub = screens.loading.querySelector("[data-loading-sub]");
  const blackoutEl = document.querySelector(".blackout");

  let index = 0;
  let typer = null;
  let busy = false; // 암전 전환 중에는 입력을 받지 않는다

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
    if (prev.screen === "talk" && cur.screen !== "talk") Talk.leave();
    if (prev.screen === "scenario" && cur.screen !== "scenario") Scenario.leave();
    if (prev.screen === "play" && cur.screen !== "play") Play.leave();

    if (cur.screen === "lobby") {
      Lobby.enter();
    } else if (cur.screen === "talk") {
      Talk.enter();
    } else if (cur.screen === "scenario") {
      Scenario.enter();
    } else if (cur.screen === "play") {
      Play.enter();
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

  // 스르륵 암전 → 화면 교체 → 다시 밝아짐
  function blackout(next) {
    busy = true;
    blackoutEl.classList.add("is-on");
    setTimeout(() => {
      go(next);
      blackoutEl.classList.remove("is-on");
      setTimeout(() => (busy = false), 350);
    }, 850);
  }

  function advance() {
    if (typer && !typer.done) {
      typer.finish();
      return;
    }
    go((index + 1) % STEPS.length);
  }

  const screenNow = () => STEPS[index].screen;

  // 로비에서 캐릭터를 골랐을 때: 파랑("오늘의 기록 준비 완료!")이면 극장으로
  Lobby.onPick = (id) => {
    if (busy || id !== "blue") return;
    busy = true;
    setTimeout(() => blackout(TALK), 380); // 고른 캐릭터가 통! 튀는 걸 잠깐 보여 주고
  };

  function advanceTalk() {
    // 대사가 모두 끝나면 두루마리 장면으로
    if (Talk.advance() === "done") go(SCENARIO);
  }

  function advanceScenario() {
    // 두루마리 다음: 암전 → 연극 시작
    if (Scenario.advance() === "done") blackout(PLAY);
  }

  function advancePlay() {
    // 연극이 END! 까지 끝나면 일단 로비로 돌아간다
    if (Play.advance() === "done") blackout(LOBBY);
  }

  // 장면마다 터치/아무 키를 처리하는 방법
  const HANDLERS = {
    talk: advanceTalk,
    scenario: advanceScenario,
    play: advancePlay,
  };

  // ── 입력: 터치/클릭, 아무 키 ──
  document.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (busy) return;
    if (screenNow() === "lobby") return; // 로비의 터치·밀기는 js/lobby.js가 처리
    if (HANDLERS[screenNow()]) return HANDLERS[screenNow()]();
    advance();
  });

  document.addEventListener("keydown", (e) => {
    if (e.repeat) return;
    // 새로고침(Ctrl+R) 같은 브라우저 단축키와 보조키 단독 입력은 무시
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (["Shift", "Control", "Alt", "Meta", "CapsLock", "Tab"].includes(e.key)) return;
    if (e.key === " " || e.key.startsWith("Arrow") || e.key.startsWith("Page")) e.preventDefault();
    if (busy) return;

    if (screenNow() === "lobby") {
      // 로비: ←/→ 로 다이얼을 돌리고 Enter로 고른다. Esc는 대기화면으로.
      if (e.key === "Escape") go(0);
      else Lobby.handleKey(e);
      return;
    }
    if (HANDLERS[screenNow()]) {
      if (e.key === "Escape") blackout(LOBBY);
      else HANDLERS[screenNow()]();
      return;
    }
    advance();
  });

  // 확인·디버깅용: 원하는 장면으로 바로 이동
  window.__flow = { go, advance, steps: STEPS };
})();

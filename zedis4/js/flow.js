// 화면 흐름: 대기화면 → 전원 1~3 → 펜 로딩 → 로비 → 대화(극장) → 시나리오 두루마리 → 연극 1~5 → 연극 결과 연결 → 수정할 장면 고르기 → 대본 고치기 → 작별 인사 → 마무리(기록 중) → 별점·추천 → 로비
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
    { screen: "keywords" },
    { screen: "settings" },
    { screen: "recommend" },
    { screen: "history" },
    { screen: "replay" },
    { screen: "custom" },
    { screen: "talk" },
    { screen: "scenario" },
    { screen: "play" },
    { screen: "bridge" },
    { screen: "pick" },
    { screen: "edit" },
    { screen: "wrap" },
    { screen: "rate" },
  ];
  const LOBBY = STEPS.findIndex((s) => s.screen === "lobby");
  const KEYWORDS = STEPS.findIndex((s) => s.screen === "keywords");
  const SETTINGS = STEPS.findIndex((s) => s.screen === "settings");
  const RECOMMEND = STEPS.findIndex((s) => s.screen === "recommend");
  const HISTORY = STEPS.findIndex((s) => s.screen === "history");
  const REPLAY = STEPS.findIndex((s) => s.screen === "replay");
  const CUSTOM = STEPS.findIndex((s) => s.screen === "custom");
  const TALK = STEPS.findIndex((s) => s.screen === "talk");
  const SCENARIO = STEPS.findIndex((s) => s.screen === "scenario");
  const PLAY = STEPS.findIndex((s) => s.screen === "play");
  const BRIDGE = STEPS.findIndex((s) => s.screen === "bridge");
  const PICK = STEPS.findIndex((s) => s.screen === "pick");
  const EDIT = STEPS.findIndex((s) => s.screen === "edit");
  const WRAP = STEPS.findIndex((s) => s.screen === "wrap");
  const RATE = STEPS.findIndex((s) => s.screen === "rate");

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
  let bridgeMode = "intro"; // 연결 연출의 대사: intro(연극 직후) | outro(시나리오를 다 고친 뒤)

  // 같은 애니메이션 클래스를 다시 붙여 처음부터 재생한다
  function replay(el, className, others) {
    el.classList.remove(className, ...(others || []));
    void el.offsetWidth;
    el.classList.add(className);
  }

  // 보여 줄 장면만 켠다. 꺼진 장면은 사라지는 연출(0.22초)이 끝나면 아예 그리지 않는다.
  const parkTimers = {};
  function showScreen(name) {
    Object.keys(screens).forEach((key) => {
      const el = screens[key];
      clearTimeout(parkTimers[key]);
      if (key === name) {
        if (el.classList.contains("is-parked")) {
          el.classList.remove("is-parked");
          void el.offsetWidth; // 다시 그린 다음에 켜야 나타나는 연출이 보인다
        }
        el.classList.add("is-active");
      } else if (el.classList.contains("is-active")) {
        el.classList.remove("is-active");
        parkTimers[key] = setTimeout(() => el.classList.add("is-parked"), 260);
      } else {
        el.classList.add("is-parked");
      }
    });
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
    if (prev.screen === "keywords" && cur.screen !== "keywords") Keywords.leave();
    if (prev.screen === "settings" && cur.screen !== "settings") Settings.leave();
    if (prev.screen === "recommend" && cur.screen !== "recommend") Recommend.leave();
    if (prev.screen === "history" && cur.screen !== "history") WeekLog.leave();
    if (prev.screen === "replay" && cur.screen !== "replay") Replay.leave();
    if (prev.screen === "custom" && cur.screen !== "custom") Custom.leave();
    if (prev.screen === "talk" && cur.screen !== "talk") Talk.leave();
    if (prev.screen === "scenario" && cur.screen !== "scenario") Scenario.leave();
    if (prev.screen === "play" && cur.screen !== "play") Play.leave();
    if (prev.screen === "bridge" && cur.screen !== "bridge") Bridge.leave();
    if (prev.screen === "pick" && cur.screen !== "pick") Pick.leave();
    if (prev.screen === "edit" && cur.screen !== "edit") Edit.leave();
    if (prev.screen === "wrap" && cur.screen !== "wrap") Wrap.leave();
    if (prev.screen === "rate" && cur.screen !== "rate") Rate.leave();

    if (cur.screen === "lobby") {
      Lobby.enter();
    } else if (cur.screen === "keywords") {
      Keywords.enter();
    } else if (cur.screen === "settings") {
      Settings.enter();
    } else if (cur.screen === "recommend") {
      Recommend.enter();
    } else if (cur.screen === "history") {
      WeekLog.enter();
    } else if (cur.screen === "replay") {
      Replay.enter();
    } else if (cur.screen === "custom") {
      Custom.enter();
    } else if (cur.screen === "talk") {
      Talk.enter();
    } else if (cur.screen === "scenario") {
      Scenario.enter();
    } else if (cur.screen === "play") {
      Play.enter();
    } else if (cur.screen === "bridge") {
      Bridge.enter(bridgeMode);
    } else if (cur.screen === "wrap") {
      Wrap.enter();
    } else if (cur.screen === "rate") {
      Rate.enter();
    } else if (cur.screen === "pick") {
      Pick.enter();
    } else if (cur.screen === "edit") {
      Edit.enter();
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

  // 로비에서 캐릭터를 골랐을 때
  //   파랑("오늘의 기록 준비 완료!")  → 암전 후 극장
  //   보라("오늘의 키워드를 확인하기") → 오늘의 키워드
  //   청록("세부 설정")                → 세부 설정
  //   빨강("오늘의 추천 시나리오")      → 오늘의 추천 시나리오
  //   주황("주간 키워드 확인하기")      → 지난 기록 확인하기
  //   연보라("내 에피소드 다시보기")    → 지난스토리 리플레이
  //   초록("커스터마이징 숍")           → 커스터마이징
  const LOBBY_TARGETS = { violet: () => KEYWORDS, mint: () => SETTINGS, pink: () => RECOMMEND, peach: () => HISTORY, lilac: () => REPLAY, green: () => CUSTOM };
  Lobby.onPick = (id) => {
    if (busy || (id !== "blue" && !LOBBY_TARGETS[id])) return;
    busy = true;
    // 고른 캐릭터가 통! 튀는 걸 잠깐 보여 주고
    setTimeout(() => {
      if (id === "blue") return blackout(TALK);
      busy = false;
      go(LOBBY_TARGETS[id]());
    }, 380);
  };

  Settings.onBack = () => {
    if (!busy && screenNow() === "settings") go(LOBBY);
  };

  Recommend.onBack = () => {
    if (!busy && screenNow() === "recommend") go(LOBBY);
  };

  WeekLog.onBack = () => {
    if (!busy && screenNow() === "history") go(LOBBY);
  };

  Replay.onBack = () => {
    if (!busy && screenNow() === "replay") go(LOBBY);
  };

  Custom.onBack = () => {
    if (!busy && screenNow() === "custom") go(LOBBY);
  };

  Keywords.onBack = () => {
    if (!busy && screenNow() === "keywords") go(LOBBY);
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
    // END! 다음: 암전 → 연극 결과 연결 연출
    if (Play.advance() === "done") toBridge("intro");
  }

  function toBridge(mode) {
    bridgeMode = mode;
    blackout(BRIDGE);
  }

  // END! 가 나오고 잠시 뒤에는 누르지 않아도 자연스럽게 암전된다
  Play.onEnd = () => {
    if (!busy && screenNow() === "play") toBridge("intro");
  };

  function advanceBridge() {
    // 연결 연출 다음: 처음엔 수정할 장면 고르기, 다 고친 뒤에는 마무리(기록 중) 화면
    if (Bridge.advance() === "done") go(bridgeMode === "outro" ? WRAP : PICK);
  }

  // 대본 고치기에서 뒤로(− 키·버튼): 장면 고르기로
  Edit.onBack = () => {
    if (!busy && screenNow() === "edit") go(PICK);
  };

  // 대본을 다 고치고 Alt → 마무리 인사가 끝나면: 암전 → 작별 인사
  Edit.onFinish = () => {
    if (!busy && screenNow() === "edit") toBridge("outro");
  };

  // 마무리(기록 중) 화면이 끝나면: 별점과 비슷한 시나리오 추천
  Wrap.onDone = () => {
    if (!busy && screenNow() === "wrap") go(RATE);
  };

  // 장면을 고르면(지금은 첫 장면만) 그 장면의 대본을 고치는 화면으로
  Pick.onPick = () => {
    if (busy) return;
    busy = true;
    setTimeout(() => {
      busy = false;
      go(EDIT);
    }, 380);
  };

  // 장면마다 터치/아무 키를 처리하는 방법
  const HANDLERS = {
    talk: advanceTalk,
    scenario: advanceScenario,
    play: advancePlay,
    bridge: advanceBridge,
    wrap: () => Wrap.advance(),
  };

  // ── 입력: 터치/클릭, 아무 키 ──
  document.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (busy) return;
    if (["lobby", "keywords", "settings", "recommend", "history", "replay", "custom", "pick", "edit", "rate"].includes(screenNow())) return; // 이 화면들은 터치를 각자 처리한다
    if (HANDLERS[screenNow()]) return HANDLERS[screenNow()]();
    advance();
  });

  document.addEventListener("keydown", (e) => {
    // 대본 고치기 화면에서 Alt: 수정을 마치고 연극을 종료한다
    if (e.key === "Alt" && screenNow() === "edit") {
      e.preventDefault(); // 브라우저 메뉴로 초점이 넘어가지 않게
      if (!busy && !e.repeat) Edit.finish();
      return;
    }
    // 별점 화면에서 Alt: 로비로 돌아간다
    if (e.key === "Alt" && screenNow() === "rate") {
      e.preventDefault();
      if (!busy && !e.repeat) blackout(LOBBY);
      return;
    }
    // 대사를 고쳐 쓰는 중에는 모든 글쇠가 입력 칸으로 가야 한다
    if (screenNow() === "edit" && Edit.isTyping()) {
      if (!busy) Edit.handleKey(e);
      return;
    }
    if (e.repeat) return;
    // 새로고침(Ctrl+R) 같은 브라우저 단축키와 보조키 단독 입력은 무시
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (["Shift", "Control", "Alt", "Meta", "CapsLock", "Tab"].includes(e.key)) return;
    // F1~F12(전체 화면 F11 등)는 브라우저 기능이라 장면을 넘기지 않는다
    if (/^F\d{1,2}$/.test(e.key)) return;
    if (e.key === " " || e.key.startsWith("Arrow") || e.key.startsWith("Page")) e.preventDefault();
    if (busy) return;

    if (screenNow() === "lobby") {
      // 로비: ←/→ 로 다이얼을 돌리고 Enter로 고른다. Esc는 대기화면으로.
      if (e.key === "Escape") go(0);
      else Lobby.handleKey(e);
      return;
    }
    if (screenNow() === "custom") {
      // 커스터마이징: ↑/↓ 줄 고르기, ←/→ 장식·색 바꾸기, ＋ 저장. −(또는 Esc)는 로비로.
      if (Custom.handleKey(e) === "back") go(LOBBY);
      return;
    }
    if (screenNow() === "replay") {
      // 지난스토리 리플레이: ←/→ 다이얼, Delete 삭제 알림창. −(또는 Esc)는 로비로(알림창이 떠 있으면 닫기만).
      if (Replay.handleKey(e) === "back") go(LOBBY);
      return;
    }
    if (screenNow() === "history") {
      // 지난 기록 확인하기: ←/→ 로 날짜 다이얼. −(또는 Esc)는 로비로.
      if (WeekLog.handleKey(e) === "back") go(LOBBY);
      return;
    }
    if (screenNow() === "recommend") {
      // 오늘의 추천 시나리오: ←/→ 로 다이얼을 돌린다. −(또는 Esc)는 로비로.
      if (Recommend.handleKey(e) === "back") go(LOBBY);
      return;
    }
    if (screenNow() === "settings") {
      // 세부 설정: ↑/↓ 로 고르고 ←/→·Enter로 값을 바꾼다. −(또는 Esc)는 로비로.
      if (Settings.handleKey(e) === "back") go(LOBBY);
      return;
    }
    if (screenNow() === "keywords") {
      // 오늘의 키워드: ←/→ 로 메모를 돌려 보고, −(또는 Esc)로 로비에 돌아간다
      if (Keywords.handleKey(e) === "back") go(LOBBY);
      return;
    }
    if (screenNow() === "rate") {
      // 별점: ←/→ 로 반 칸씩, Enter로 저장. (Alt 는 위에서 처리)
      if (e.key === "Escape") blackout(LOBBY);
      else Rate.handleKey(e);
      return;
    }
    if (screenNow() === "pick") {
      // 장면 고르기: ←/→ 로 옮기고 Enter로 결정. Esc는 로비로.
      if (e.key === "Escape") blackout(LOBBY);
      else Pick.handleKey(e);
      return;
    }
    if (screenNow() === "edit") {
      // 대본 고치기: ↑/↓ 로 대사를 고르고 Enter로 고친다. −(또는 Esc)는 장면 고르기로.
      if (Edit.handleKey(e) === "back") go(PICK);
      return;
    }
    if (HANDLERS[screenNow()]) {
      if (e.key === "Escape") blackout(LOBBY);
      else HANDLERS[screenNow()]();
      return;
    }
    advance();
  });

  // 처음에는 대기화면만 그린다
  showScreen(STEPS[0].screen);

  // 확인·디버깅용: 원하는 장면으로 바로 이동
  window.__flow = { go, advance, steps: STEPS };
})();

// 로비 - 지난 기록 확인하기: 지난 일주일의 키워드 기록을 날짜 다이얼로 본다.
// 로비와 같은 다이얼 조작:
//   ← / →, 좌우로 밀기   다이얼 돌리기(→ 는 시계 방향)
//   날짜 누르기            그 날로 돌리기
//   Enter / ＋           '데이터 자세히 확인하기'(지금은 통! 튀기만 한다)
//   − / Esc              로비로 돌아가기
// 가운데 날짜는 진한 색, 나머지는 연한 색. 오늘 이후(미래)는 회색이고 고를 수 없다.
// 내용은 임시다. DAYS만 고치면 된다(배열 순서 = 날짜순, 다이얼 왼쪽 → 오른쪽).
window.WeekLog = (function () {
  const C = {
    orange: ["#FFBB83", "#FF7C0F"],
    pink: ["#FFC1FE", "#E85FE5"],
    green: ["#D3FF9E", "#7CCB1E"],
    blue: ["#A3CCFF", "#3E8BF5"],
    violet: ["#DCC6FF", "#9B5CF6"],
    mint: ["#AEF2D8", "#1FB985"],
    gray: ["#D7D7D7", "#B6B6B6"],
  };

  // pin: 날짜 옆 작은 물방울 표시(피그마 예시처럼 몇몇 날에만)
  const DAYS = [
    { day: "WED", date: "11.11", color: "mint", title: "조용히 지나간 하루", desc: ["특별한 일 없이 무난하게 흘러간 날이에요.", "연극에서는 ‘평범함의 소중함’을 이야기했어요."], keywords: ["그냥저냥", "평화롭다", "낮잠 최고", "내일도 이대로"] },
    { day: "THU", date: "11.12", color: "violet", title: "괜히 설레던 날", desc: ["새로운 시작에 관한 키워드가 많았던 날이에요.", "연극에서는 ‘첫걸음’을 주제로 진행했었답니다."], keywords: ["두근두근", "새 출발", "할 수 있다", "일단 해보자"] },
    { day: "FRI", date: "11.13", color: "orange", title: "불타는 금요일!", desc: ["한 주의 끝을 기다리는 키워드가 가득했어요.", "연극에서는 ‘보상’을 주제로 진행했었답니다."], keywords: ["드디어 금요일", "치킨 각", "퇴근하자", "주말아 와라"] },
    { day: "SAT", date: "11.14", color: "green", title: "푹 쉬어 간 주말", desc: ["쉼과 여유에 관한 키워드를 많이 작성했어요.", "연극에서는 ‘나를 돌보는 법’을 다뤘답니다."], keywords: ["늦잠", "산책", "아무것도 안 함", "행복하다"] },
    { day: "SUN", date: "11.15", color: "pink", pin: true, title: "월요일이 무서운 밤", desc: ["다가올 한 주를 걱정하는 키워드가 많았어요.", "연극에서는 ‘마음의 준비’를 주제로 진행했었답니다."], keywords: ["벌써 일요일", "출근 싫어", "시간 멈춰", "그래도 힘내"] },
    { day: "MON", date: "11.16", color: "orange", title: "정신없던 월요일", desc: ["해야 할 일에 관한 키워드를 유독 많이 작성했어요.", "연극에서는 ‘우선순위’를 주제로 진행했었답니다."], keywords: ["할 일 폭탄", "커피 수혈", "회의 또 회의", "버텨보자"] },
    { day: "TUE", date: "11.17", color: "orange", title: "묘하게 운이 없던 날..", desc: ["운과 운명에 관한 키워드를 유독 많이 작성한 날이에요.", "연극에서는 ‘미움받을 용기’를 주제로 진행했었답니다."], keywords: ["운이없다운이", "오 신이시여", "진짜 억까 뭐지", "아 제발요"] },
    { day: "WED", date: "11.18", color: "blue", today: true, title: "오늘은 어떤 하루였나요?", desc: ["오늘 작성한 키워드를 모아 보고 있어요.", "하루가 끝나면 이야기로 정리해 드릴게요."], keywords: ["오늘의 키워드", "작성 중", "조금만 더", "기대된다"] },
    { day: "THU", date: "11.19", future: true },
    { day: "FRI", date: "11.20", future: true, pin: true },
    { day: "SAT", date: "11.21", future: true },
    { day: "SUN", date: "11.22", future: true },
  ];
  const COUNT = DAYS.length;
  const TODAY = DAYS.findIndex((d) => d.today);
  const START = TODAY - 1; // 피그마처럼 어제(가장 최근의 다 끝난 하루)부터
  const MIN = 0;
  const MAX = TODAY; // 미래로는 돌릴 수 없다

  const root = document.querySelector('[data-screen="history"]');

  // ── 자리(슬롯) 9개: 피그마 날짜 원의 중심 좌표 ──
  const CENTER = { x: 969, y: 984 };
  const SLOTS = [
    { x: 242.5, y: 1091.5 },
    { x: 258.5, y: 790.5 },
    { x: 402.5, y: 518.5 },
    { x: 642.5, y: 325.5 },
    { x: 965.5, y: 243.5 },
    { x: 1288.5, y: 325.5 },
    { x: 1548.5, y: 518.5 },
    { x: 1694.5, y: 790.5 },
    { x: 1721.5, y: 1091.5 },
  ].map((p) => ({ angle: Math.atan2(p.x - CENTER.x, CENTER.y - p.y), radius: Math.hypot(p.x - CENTER.x, CENTER.y - p.y) }));
  const EDGE = 4; // 가운데에서 양쪽으로 4칸까지 보인다
  const STEP_BEYOND = (26 * Math.PI) / 180;
  const SIZE = 193;
  const SELECTED_SCALE = 261 / 193;

  const DROP = "M969.137 99.8916C968.15 101.232 966.144 101.223 965.17 99.874L942.502 68.4961L942.506 68.4961C938.427 63.2019 936 56.5699 936 49.3701C936 32.045 950.045 18 967.37 18C984.695 18.0001 998.74 32.0451 998.74 49.3701C998.74 56.57 996.312 63.2019 992.233 68.4961L992.237 68.4961L969.137 99.8916Z";
  const drop = (cls, w) => `<svg class="${cls}" width="${w}" height="${(w * 82.9) / 62.74}" viewBox="936 18 62.74 82.9" fill="none" aria-hidden="true"><path d="${DROP}" fill="currentColor"/></svg>`;

  root.innerHTML =
    `<svg class="hs__grid" width="1935" height="1047" viewBox="0 0 1935 1047" fill="none" aria-hidden="true"></svg>` +
    `<div class="hs__ring"></div><div class="hs__plate"></div>` +
    `<div class="hs__info"><p class="hs__title"></p><p class="hs__desc"></p><div class="hs__chips"></div></div>` +
    `<i class="hs__line"></i>` +
    `<button class="hs__more" type="button"><svg width="59" height="59" viewBox="0 0 59 59" fill="none" aria-hidden="true"><rect width="59" height="59" rx="29.5" fill="#5F5F5F"/><path d="M31 28H44.5V31H31V44.5H28V31H14.5V28H28V14.5H31V28Z" fill="#F0F0F0"/></svg><span>데이터 자세히 확인하기</span></button>` +
    `<div class="hs__dial"></div>` +
    drop("hs__marker", 62.74) +
    `<div class="hint hs__hint" style="left:1690px;top:945px"><svg width="59" height="59" viewBox="0 0 59 59" fill="none" aria-hidden="true"><rect width="59" height="59" rx="29.5" fill="#FFFFFF"/><path d="M46 31.5H14V28.4H46V31.5Z" fill="#3C3C3C"/></svg><span class="hint__label">뒤로</span></div>`;

  // 로비와 같은 바둑판 무늬
  (function grid() {
    const xs = [0, 193.2, 386.41, 579.61, 772.81, 966.01, 1159.22, 1352.42, 1545.62, 1738.82];
    const ys = [-177.8, 15.4, 208.61, 401.81, 595.01, 788.22, 981.42];
    let rects = "";
    xs.forEach((x) => ys.forEach((y) => (rects += `<rect x="${x + 0.5}" y="${y + 0.5}" width="195.175" height="195.175" rx="31.5" stroke="#CACACA"/>`)));
    root.querySelector(".hs__grid").innerHTML = rects;
  })();

  const dial = root.querySelector(".hs__dial");
  const marker = root.querySelector(".hs__marker");
  const info = root.querySelector(".hs__info");
  const titleEl = root.querySelector(".hs__title");
  const descEl = root.querySelector(".hs__desc");
  const chipsEl = root.querySelector(".hs__chips");
  const more = root.querySelector(".hs__more");

  const nodes = DAYS.map((d, i) => {
    const [pastel, vivid] = C[d.future ? "gray" : d.color];
    const el = document.createElement("div");
    el.className = "hs" + (d.future ? " is-future" : "") + (d.today ? " is-today" : "");
    el.style.setProperty("--pastel", pastel);
    el.style.setProperty("--vivid", vivid);
    el.innerHTML =
      `<div class="hs__pop">` +
      (d.pin ? drop("hs__pin", 50) : "") +
      `<div class="hs__disc"><i class="hs__vivid"></i><span class="hs__day">${d.day}</span><span class="hs__date">${d.date}</span></div></div>`;
    dial.appendChild(el);
    el.addEventListener("pointerdown", () => {
      if (active) clickIndex = i; // 이어서 판(root)의 pointerdown이 드래그를 시작한다
    });
    return { el, pop: el.querySelector(".hs__pop"), index: i };
  });

  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (t) => t * t * (3 - 2 * t);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function place(s) {
    const a = Math.abs(s);
    let angle, radius;
    if (a <= EDGE) {
      const f = s + EDGE;
      const i = Math.min(Math.floor(f), EDGE * 2 - 1);
      const t = f - i;
      angle = lerp(SLOTS[i].angle, SLOTS[i + 1].angle, t);
      radius = lerp(SLOTS[i].radius, SLOTS[i + 1].radius, t);
    } else {
      const edge = s > 0 ? SLOTS[EDGE * 2] : SLOTS[0];
      angle = edge.angle + Math.sign(s) * (a - EDGE) * STEP_BEYOND;
      radius = edge.radius;
    }
    const sel = a < 1 ? smooth(1 - a) : 0;
    return { x: CENTER.x + radius * Math.sin(angle), y: CENTER.y - radius * Math.cos(angle), angle, scale: lerp(1, SELECTED_SCALE, sel), sel };
  }

  let rot = START;
  let vel = 0;
  let target = START;
  let selected = -1;
  let active = false;
  let raf = 0;
  let last = 0;
  let drag = null;
  let clickIndex = -1;

  const replay = (el, className) => {
    el.classList.remove(className);
    void el.offsetWidth;
    el.classList.add(className);
  };

  function render() {
    nodes.forEach((n) => {
      const s = n.index - rot;
      const st = n.el.style;
      if (Math.abs(s) > EDGE + 2) {
        st.display = "none";
        return;
      }
      st.display = "";
      const p = place(s);
      // 글자는 다이얼을 따라 기울어진다(글자 윗변이 바깥쪽)
      st.transform = `translate(${p.x.toFixed(2)}px, ${p.y.toFixed(2)}px) rotate(${p.angle.toFixed(4)}rad) scale(${p.scale.toFixed(4)})`;
      st.setProperty("--sel", p.sel.toFixed(3));
      st.zIndex = String(Math.round(p.sel * 10));
    });
  }

  function showInfo(animate) {
    const d = DAYS[selected];
    const [, vivid] = C[d.color];
    root.style.setProperty("--accent", vivid);
    titleEl.textContent = d.title;
    descEl.innerHTML = d.desc.join("<br>");
    chipsEl.innerHTML = d.keywords.map((k, i) => `<span class="hs__chip" style="--i:${i}">${k}</span>`).join("");
    if (animate) {
      replay(info, "is-changing");
      replay(marker, "is-ticking");
    }
  }

  function setSelected(next) {
    if (next === selected) return;
    selected = next;
    showInfo(true);
  }

  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.034);
    last = now;
    if (!drag) {
      for (let i = 0; i < 4; i++) {
        const h = dt / 4;
        vel += (-150 * (rot - target) - 15 * vel) * h;
        rot += vel * h;
      }
    }
    setSelected(clamp(Math.round(rot), MIN, MAX));
    render();
    if (active) raf = requestAnimationFrame(frame);
  }

  // 끝(가장 오래된 날 / 오늘)에 닿으면 살짝 튕기고 멈춘다
  function bump(direction) {
    vel -= direction * 4;
  }

  // → 는 시계 방향(날짜들이 오른쪽으로 이동 = 전날로), ← 는 반시계 방향(다음 날로)
  function turn(direction) {
    const next = Math.round(target) - direction;
    if (next < MIN || next > MAX) return bump(direction);
    target = next;
  }

  function turnTo(i) {
    if (i > MAX) {
      bump(-1);
      replay(nodes[i].pop, "is-refusing");
      return;
    }
    target = clamp(i, MIN, MAX);
  }

  function pick() {
    replay(more, "is-pressed");
    if (api.onPick) api.onPick(selected);
  }

  // ── 마우스·터치 ──
  root.addEventListener("pointerdown", (e) => {
    if (!active || (e.pointerType === "mouse" && e.button !== 0)) return;
    if (e.target.closest(".hs__hint, .hs__more")) return;
    drag = { x: Stage.point(e.clientX, e.clientY).x, rot, moved: false };
    vel = 0;
    try {
      root.setPointerCapture(e.pointerId);
    } catch (err) {}
  });

  root.addEventListener("pointermove", (e) => {
    if (!active || !drag) return;
    const dx = Stage.point(e.clientX, e.clientY).x - drag.x;
    if (Math.abs(dx) > 10) drag.moved = true;
    let next = drag.rot - dx / 380;
    // 끝을 넘어가면 고무줄처럼 덜 따라온다
    if (next < MIN) next = MIN - (MIN - next) * 0.3;
    if (next > MAX) next = MAX + (next - MAX) * 0.3;
    vel = (next - rot) * 60;
    rot = next;
  });

  function endDrag(e) {
    if (!drag) return;
    const moved = drag.moved;
    drag = null;
    if (moved) {
      target = clamp(Math.round(rot + clamp(vel * 0.12, -0.45, 0.45)), MIN, MAX);
      vel = clamp(vel, -8, 8);
    } else {
      target = clamp(Math.round(rot), MIN, MAX);
      if (e.type === "pointerup" && clickIndex >= 0) {
        if (clickIndex === selected) pick();
        else turnTo(clickIndex);
      }
    }
    clickIndex = -1;
  }
  root.addEventListener("pointerup", endDrag);
  root.addEventListener("pointercancel", endDrag);

  more.addEventListener("pointerdown", () => active && pick());
  root.querySelector(".hs__hint").addEventListener("pointerdown", () => active && api.onBack && api.onBack());

  function handleKey(e) {
    if (e.key === "ArrowRight") turn(1);
    else if (e.key === "ArrowLeft") turn(-1);
    else if (e.key === "Enter" || e.key === " " || e.key === "+" || e.key === "=") pick();
    else if (e.key === "-" || e.key === "Escape" || e.key === "Backspace") return "back";
    else return false;
    return true;
  }

  function enter() {
    active = true;
    rot = target = START;
    vel = 0;
    selected = -1;
    setSelected(START);
    render();
    replay(root, "is-entering");
    last = performance.now();
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(frame);
  }

  function leave() {
    active = false;
    drag = null;
    cancelAnimationFrame(raf);
  }

  nodes.forEach((n) => n.el.style.setProperty("--size", SIZE + "px"));
  selected = START;
  showInfo(false);
  render();

  // onPick(날짜 번호): '데이터 자세히 확인하기'. onBack: 화면의 − 버튼. js/flow.js가 연결한다.
  const api = { enter, leave, handleKey, turn, onPick: null, onBack: null, days: DAYS };
  return api;
})();

// 로비 - 세부 설정(피그마 '로비 - 기타 설정').
//   ↑ / ↓      설정 항목 고르기
//   ← / →      값 바꾸기(목록은 앞뒤로, 막대는 10씩, 켜고 끄기)
//   Enter      값 바꾸기(목록은 다음 값으로, 켜고 끄기, '접속 테스트'는 다시 검사)
//   ＋ 버튼 / + 키   저장
//   − 버튼 / − 키 / Esc   로비로 돌아가기
// 탭은 '기본 설정' · '데이터 관리' · '테마'가 열려 있고, '유저'는 아직 고를 수 없다.
//   맨 위 줄에서 ↑ 를 누르면 탭 줄로 올라가고, 거기서 ← / → 로 탭을 바꾼다(↓ 로 다시 목록).
//   테마 > 화면 모드: 일반 모드 ↔ 야간 모드(바로 적용, js/theme.js)
// 기본 설정의 항목과 값은 임시로 채워 둔 것이다(SECTIONS만 고치면 된다).
window.Settings = (function () {
  // type: select(목록) | slider(막대 0~100) | toggle(켜짐/꺼짐) | test(다시 검사) | info(보기만)
  const SECTIONS = [
    {
      title: "오디오 출력",
      rows: [
        { label: "기본 오디오 출력 장치", type: "select", options: ["자동", "펜 스피커", "블루투스"] },
        { label: "펜 마이크 출력 장치", type: "select", options: ["자동", "펜 마이크", "외부 마이크"] },
        { label: "효과음 설정", type: "slider", value: 70 },
      ],
    },
    {
      title: "인터넷",
      rows: [
        { label: "인터넷 설정", type: "select", options: ["WI-FI로 접속중", "테더링으로 접속중", "오프라인"] },
        { label: "접속 테스트", type: "test", value: "정상" },
        { label: "접속 상황", type: "info", value: "양호" },
      ],
    },
    {
      title: "화면",
      rows: [
        { label: "화면 밝기", type: "slider", value: 80 },
        { label: "자동 꺼짐", type: "select", options: ["5분", "10분", "30분", "끄지 않음"] },
        { label: "애니메이션 효과", type: "toggle", value: true },
      ],
    },
    {
      title: "알림",
      rows: [
        { label: "기록 알림", type: "toggle", value: true },
        { label: "알림 시간", type: "select", options: ["오후 9시", "오후 10시", "오후 11시"] },
      ],
    },
  ];
  // 테마 탭. apply가 있는 줄은 값이 바뀌는 즉시 적용된다.
  const THEME_SECTIONS = [
    {
      title: "화면 테마",
      rows: [
        {
          label: "화면 모드", type: "select", options: ["일반 모드", "야간 모드"],
          read: () => (Theme.get() === "night" ? 1 : 0),
          apply: (i) => {
            Theme.set(i === 1 ? "night" : "day");
            say(i === 1 ? "야간 모드로 바꿨어요" : "일반 모드로 바꿨어요");
          },
        },
      ],
    },
  ];
  // 데이터 관리 탭(피그마 '로비 - 기타 설정2'): 보기만 하는 제품 정보
  const DATA_SECTIONS = [
    {
      title: "제품 정보",
      rows: [
        { label: "시리얼 넘버", type: "info", value: "SN-7K4P-92MX-1Q8R" },
        { label: "등록일", type: "info", value: "2026.10.17" },
      ],
    },
  ];
  const TABS = [
    { label: "기본 설정", sections: SECTIONS },
    { label: "데이터 관리", sections: DATA_SECTIONS },
    { label: "유저" },
    { label: "테마", sections: THEME_SECTIONS },
  ];
  const OPEN_TABS = TABS.map((t, i) => (t.sections ? i : -1)).filter((i) => i >= 0);

  const root = document.querySelector('[data-screen="settings"]');
  const FOOT = "M-38 0H38C28.37 -18.585 28.37 -29.517 -2.68 -32.796C-27.51 -35.42 -36.57 -12.025 -38 0Z";
  const hint = (cls, x, y, sign, label) =>
    `<div class="hint set__hint ${cls}" style="left:${x}px;top:${y}px"><svg width="59" height="59" viewBox="0 0 59 59" fill="none" aria-hidden="true"><rect width="59" height="59" rx="29.5" fill="#4C4C4C"/>` +
    (sign === "+" ? `<path d="M31.5 28.4H46V31.5H31.5V46H28.4V31.5H14V28.4H28.4V14H31.5V28.4Z" fill="#F0F0F0"/>` : `<path d="M46 31.5H14V28.4H46V31.5Z" fill="#F0F0F0"/>`) +
    `</svg><span class="hint__label">${label}</span></div>`;

  // 탭마다 항목들을 한 줄로 펼쳐 둔다(구역 제목도 한 줄)
  function flatten(sections) {
    const out = [];
    sections.forEach((sec) => {
      out.push({ kind: "section", title: sec.title });
      sec.rows.forEach((r) => {
        const row = { kind: "row", ...r };
        if (r.type === "select") row.index = 0;
        out.push(row);
      });
    });
    return out;
  }
  const TAB_ROWS = TABS.map((t) => (t.sections ? flatten(t.sections) : null));

  root.innerHTML =
    `<svg class="set__grid" width="1935" height="1047" viewBox="0 0 1935 1047" fill="none" aria-hidden="true"></svg>` +
    // 판 뒤에서 내다보는 청록
    `<div class="set__buddy"><svg width="1935" height="1047" viewBox="0 0 1935 1047" fill="none" aria-hidden="true">
       <path d="${FOOT}" transform="translate(211 1025) scale(0.92)" fill="#299F78"/>
       <path d="${FOOT}" transform="translate(311 1041) scale(0.92)" fill="#299F78"/>
       <ellipse cx="262" cy="872" rx="124" ry="127" fill="#3CE1AA"/>
       <g class="set__eyes"><ellipse cx="194.5" cy="881" rx="43.5" ry="43" fill="white"/><ellipse cx="284.5" cy="881" rx="43.5" ry="43" fill="white"/></g>
       <g class="set__pupils"><ellipse cx="207" cy="872" rx="31" ry="30" fill="#299F78"/><ellipse cx="290" cy="868" rx="31" ry="30" fill="#299F78"/></g>
     </svg></div>` +
    // 맨 위 눈물 모양(로비와 같은 자리)
    `<svg class="set__marker" width="62.74" height="82.9" viewBox="936 18 62.74 82.9" fill="none" aria-hidden="true"><path d="M969.137 99.8916C968.15 101.232 966.144 101.223 965.17 99.874L942.502 68.4961L942.506 68.4961C938.427 63.2019 936 56.5699 936 49.3701C936 32.045 950.045 18 967.37 18C984.695 18.0001 998.74 32.0451 998.74 49.3701C998.74 56.57 996.312 63.2019 992.233 68.4961L992.237 68.4961L969.137 99.8916Z" fill="#3CE1AA"/></svg>` +
    // 설정 판
    `<div class="set__panel">` +
    `<div class="set__head">` +
    TABS.map((t, i) => `<button class="set__tab${t.sections ? "" : " is-locked"}" type="button" data-tab="${i}">${t.label}</button>`).join("") +
    `<i class="set__underline"></i></div>` +
    `<div class="set__view"><div class="set__list"></div>` +
    `<i class="set__scroll"></i>` +
    `</div>` +
    `<p class="set__toast" role="status" aria-live="polite"></p>` +
    hint("set__hint--ok", 1690, 850, "+", "저장") +
    hint("set__hint--back", 1690, 945, "-", "뒤로");

  // 로비와 같은 바둑판 무늬
  (function grid() {
    const xs = [0, 193.2, 386.41, 579.61, 772.81, 966.01, 1159.22, 1352.42, 1545.62, 1738.82];
    const ys = [-177.8, 15.4, 208.61, 401.81, 595.01, 788.22, 981.42];
    let rects = "";
    xs.forEach((x) => ys.forEach((y) => (rects += `<rect x="${x + 0.5}" y="${y + 0.5}" width="195.175" height="195.175" rx="31.5" stroke="#CACACA"/>`)));
    root.querySelector(".set__grid").innerHTML = rects;
  })();

  const list = root.querySelector(".set__list");
  const view = root.querySelector(".set__view");
  const thumb = root.querySelector(".set__scroll");
  const toast = root.querySelector(".set__toast");
  const head = root.querySelector(".set__head");
  const underline = root.querySelector(".set__underline");
  const tabEls = Array.from(root.querySelectorAll(".set__tab"));
  let rowEls = [];

  let tab = 0; // 지금 보고 있는 탭
  let focus = 0; // rowEls 안에서 몇 번째, -1 이면 탭 줄
  let active = false;
  let toastTimer = 0;

  // 탭의 목록을 그린다
  function buildList() {
    const rows = TAB_ROWS[tab];
    list.innerHTML = rows
      .map((r, i) => {
        if (r.kind === "section") return `<div class="set__section"><i></i>${r.title}</div>`;
        let value = "";
        if (r.type === "slider") value = `<span class="set__bar"><i></i></span><b class="set__value set__value--num"></b>`;
        else value = `<b class="set__value"></b>`;
        return `<div class="set__row" data-row="${i}"><span class="set__label">${r.label}</span>${value}</div>`;
      })
      .join("");
    rowEls = Array.from(list.querySelectorAll(".set__row"));
    rowEls.forEach((el, i) => {
      el.rowData = rows[Number(el.dataset.row)];
      if (el.rowData.read) el.rowData.index = el.rowData.read();
      paint(el);
      el.addEventListener("pointerdown", (e) => {
        if (!active) return;
        e.stopPropagation();
        if (i !== focus) {
          focus = i;
          render();
        } else change(1, true);
      });
    });
    list.dataset.scroll = 0;
  }

  function placeUnderline() {
    const t = tabEls[tab];
    underline.style.transform = `translateX(${t.offsetLeft - 36 - 236}px)`;
    underline.style.width = t.offsetWidth + 72 + "px";
    tabEls.forEach((el, i) => el.classList.toggle("is-on", i === tab));
  }

  function openTab(next) {
    if (next === tab) return;
    tab = next;
    placeUnderline();
    buildList();
    replay(list, "is-switching");
    render();
  }

  const replay = (el, className) => {
    el.classList.remove(className);
    void el.offsetWidth;
    el.classList.add(className);
  };

  function valueText(r) {
    if (r.type === "select") return r.options[r.index];
    if (r.type === "slider") return String(r.value);
    if (r.type === "toggle") return r.value ? "켜짐" : "꺼짐";
    return r.value;
  }

  function paint(el) {
    const r = el.rowData;
    el.querySelector(".set__value").textContent = valueText(r);
    el.classList.toggle("is-off", r.type === "toggle" && !r.value);
    if (r.type === "slider") el.querySelector(".set__bar i").style.width = r.value + "%";
  }

  // 고른 줄이 보이도록 목록을 밀고, 오른쪽 스크롤 막대도 따라 움직인다
  function scrollToFocus() {
    const el = rowEls[focus];
    const viewH = view.clientHeight;
    const max = Math.max(0, list.scrollHeight - viewH);
    let top = Number(list.dataset.scroll || 0);
    const y = el.offsetTop;
    const h = el.offsetHeight;
    const section = el.previousElementSibling && el.previousElementSibling.classList.contains("set__section") ? el.previousElementSibling.offsetHeight : 0;
    if (y - section < top) top = y - section;
    if (y + h > top + viewH - 140) top = y + h - viewH + 140; // 아래쪽은 반원 테두리에 가려지므로 여유를 둔다
    top = Math.max(0, Math.min(max, top));
    list.dataset.scroll = top;
    list.style.transform = `translateY(${-top}px)`;
    thumb.style.visibility = max > 0 ? "" : "hidden"; // 내용이 짧으면 스크롤 막대는 숨긴다
    const track = 520; // 막대가 움직일 수 있는 길이
    thumb.style.transform = `translateY(${max ? (top / max) * track : 0}px)`;
  }

  function render() {
    rowEls.forEach((el, i) => el.classList.toggle("is-focus", i === focus));
    head.classList.toggle("is-focus", focus < 0);
    if (focus >= 0) scrollToFocus();
  }

  function move(step) {
    const next = Math.max(-1, Math.min(rowEls.length - 1, focus + step));
    if (next === focus) return;
    focus = next;
    render();
  }

  // 탭 줄에서 ← / →: 열린 탭끼리만 오간다
  function moveTab(step) {
    const k = OPEN_TABS.indexOf(tab);
    openTab(OPEN_TABS[(k + step + OPEN_TABS.length) % OPEN_TABS.length]);
  }

  function change(step, viaEnter) {
    const el = rowEls[focus];
    const r = el.rowData;
    if (r.type === "select") {
      r.index = (r.index + step + r.options.length) % r.options.length;
      if (r.apply) r.apply(r.index);
    } else if (r.type === "slider") {
      if (viaEnter) return;
      const next = Math.max(0, Math.min(100, r.value + step * 10));
      if (next === r.value) return replay(el, "is-bumping");
      r.value = next;
    } else if (r.type === "toggle") {
      r.value = !r.value;
    } else if (r.type === "test") {
      if (!viaEnter || el.classList.contains("is-testing")) return;
      // 잠깐 검사하는 척하고 결과를 보여 준다
      el.classList.add("is-testing");
      el.querySelector(".set__value").textContent = "확인 중...";
      setTimeout(() => {
        el.classList.remove("is-testing");
        paint(el);
        replay(el.querySelector(".set__value"), "is-changed");
      }, 900);
      return;
    } else {
      return replay(el, "is-bumping"); // 보기만 하는 줄
    }
    paint(el);
    replay(el.querySelector(".set__value"), "is-changed");
  }

  function say(text) {
    toast.textContent = text;
    replay(toast, "is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-on"), 1500);
  }

  function save() {
    say("설정을 저장했어요");
    replay(root.querySelector(".set__hint--ok"), "is-saved");
  }

  // ── 마우스·터치 ──
  tabEls.forEach((tabEl) =>
    tabEl.addEventListener("pointerdown", (e) => {
      if (!active) return;
      e.stopPropagation();
      if (tabEl.classList.contains("is-locked")) {
        replay(tabEl, "is-refusing");
        say("아직 준비 중인 메뉴예요");
      } else {
        openTab(Number(tabEl.dataset.tab));
        focus = 0;
        render();
      }
    })
  );
  root.querySelector(".set__hint--ok").addEventListener("pointerdown", () => active && save());
  root.querySelector(".set__hint--back").addEventListener("pointerdown", () => active && api.onBack && api.onBack());

  // 키 입력. 처리했으면 true, "back" 이면 로비로 돌아간다.
  function handleKey(e) {
    if (e.key === "ArrowDown") move(1);
    else if (e.key === "ArrowUp") move(-1);
    else if (e.key === "ArrowRight") focus < 0 ? moveTab(1) : change(1);
    else if (e.key === "ArrowLeft") focus < 0 ? moveTab(-1) : change(-1);
    else if (e.key === "Enter" || e.key === " ") focus < 0 ? move(1) : change(1, true);
    else if (e.key === "+" || e.key === "=") save();
    else if (e.key === "-" || e.key === "Escape" || e.key === "Backspace") return "back";
    else return false;
    return true;
  }

  function enter() {
    active = true;
    tab = 0;
    focus = 0;
    buildList();
    placeUnderline();
    toast.classList.remove("is-on");
    replay(root, "is-opening");
    render();
  }

  function leave() {
    active = false;
    clearTimeout(toastTimer);
  }

  buildList();
  // onBack: 화면의 − 버튼을 눌렀을 때 불린다. js/flow.js가 연결한다.
  const api = { enter, leave, handleKey, onBack: null, tabs: TABS };
  return api;
})();

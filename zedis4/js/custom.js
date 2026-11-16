// 로비 - 커스터마이징: 연극에 나왔던 장식을 메인 캐릭터에 입혀 본다.
//   ← / →        고른 줄에서 바꾸기(위 줄: 장식, 아래 줄: 캐릭터 색)
//   ↑ / ↓        위 줄(장식) ↔ 아래 줄(캐릭터 색)
//   장식 원 · 캐릭터 양옆 화살표 누르기도 된다
//   ＋ / Enter   저장(지금은 알림창2 "아직 준비되지 않은 기능")
//   − / Esc      로비로 돌아가기
// 뒤의 초록이는 제자리에서 숨 쉬다가, 외형이 바뀔 때마다 말풍선으로 반응한다.
window.Custom = (function () {
  const THEME = "green"; // 알림창 색: 로비의 초록(커스터마이징 숍)

  // ── 장식(위 줄). icon: 원 안의 회색 그림, wear: 캐릭터에 입힌 모습(무대 좌표) ──
  const ITEMS = [
    {
      id: "tie", name: "넥타이",
      icon: `<svg width="64" height="154" viewBox="0 0 64 154" style="left:92px;top:47px"><path d="M63 23.8L36.6 38L54.4 124.2L34.9 153.2L1.7 124.2L24.8 38.7L0 23.8L11.9 5.1L51 0L63 23.8Z" fill="#6E6E6E"/></svg>`,
      wear: `<g transform="translate(931 838) scale(0.9)"><path d="M63 23.8L36.6 38L54.4 124.2L34.9 153.2L1.7 124.2L24.8 38.7L0 23.8L11.9 5.1L51 0L63 23.8Z" fill="#FF5A5A"/><path d="M11.9 5.1L51 0L63 23.8L36.6 38L24.8 38.7L0 23.8Z" fill="#D83A3A"/></g>`,
    },
    {
      id: "beret", name: "베레모",
      icon: `<svg width="172" height="111" viewBox="0 0 172 111" style="left:38px;top:69px"><path d="${"M37.9 0.3C40.9 -0.8 44.2 1.1 44.6 4.3L45.6 11.5C87 6.8 133.2 34.6 146.7 36.5C159.4 38.2 162.3 51.9 162.2 58.6L169.7 56.6L171.9 64.6L2.1 110.1L0.3 103.2L8.5 96.1C-0.7 76.2 -10.3 32.5 25.8 16.7C29.9 14.9 34.1 13.6 38.4 12.7L35.3 7.5C33.7 4.8 35 1.4 37.9 0.3Z"}" fill="#6E6E6E"/></svg>`,
      wear: `<g transform="translate(962 652) rotate(8) scale(1.4) translate(-86 -80)"><path d="M37.9 0.3C40.9 -0.8 44.2 1.1 44.6 4.3L45.6 11.5C87 6.8 133.2 34.6 146.7 36.5C159.4 38.2 162.3 51.9 162.2 58.6L169.7 56.6L171.9 64.6L2.1 110.1L0.3 103.2L8.5 96.1C-0.7 76.2 -10.3 32.5 25.8 16.7C29.9 14.9 34.1 13.6 38.4 12.7L35.3 7.5C33.7 4.8 35 1.4 37.9 0.3Z" fill="#FF3D3D"/><path d="M2.1 110.1L0.3 103.2L8.5 96.1L162.2 58.6L169.7 56.6L171.9 64.6Z" fill="#B82424"/></g>`,
    },
    {
      id: "natural", name: "내추럴",
      icon: `<svg width="219" height="217" viewBox="0 0 219 217" style="left:15px;top:47px"><ellipse cx="109" cy="108.5" rx="109" ry="108.5" fill="#878787"/><ellipse cx="57.7" cy="79.6" rx="40.3" ry="39.2" fill="white"/><ellipse cx="146.1" cy="79.6" rx="40.3" ry="39.2" fill="white"/><ellipse cx="62.1" cy="68.6" rx="29.4" ry="28.3" fill="#4E4E4E"/><ellipse cx="142.3" cy="68.6" rx="28.8" ry="28.3" fill="#4E4E4E"/></svg>`,
      wear: "",
    },
    {
      id: "mustache", name: "콧수염",
      icon: `<svg width="213" height="73" viewBox="0 0 213 73" style="left:17px;top:101px"><path d="M163.1 14.6C136.8 -14.1 108.4 6 97.4 19.8C108.4 33.9 135.8 63.5 157.8 68.7C179.9 73.8 203.8 56.2 213 46.8C207.3 48.1 189.3 43.4 163.1 14.6Z" fill="#5B5B5B"/><path d="M50.2 15.1C76.6 -14.6 105.3 6.2 116.3 20.5C105.3 35.1 77.7 65.8 55.5 71.1C33.3 76.4 9.2 58.2 0 48.4C5.7 49.8 23.7 45 50.2 15.1Z" fill="#5B5B5B"/></svg>`,
      wear: `<g transform="translate(830 836) scale(1.08)"><path d="M163.1 14.6C136.8 -14.1 108.4 6 97.4 19.8C108.4 33.9 135.8 63.5 157.8 68.7C179.9 73.8 203.8 56.2 213 46.8C207.3 48.1 189.3 43.4 163.1 14.6Z" fill="#111"/><path d="M50.2 15.1C76.6 -14.6 105.3 6.2 116.3 20.5C105.3 35.1 77.7 65.8 55.5 71.1C33.3 76.4 9.2 58.2 0 48.4C5.7 49.8 23.7 45 50.2 15.1Z" fill="#111"/></g>`,
    },
    {
      id: "glasses", name: "선글라스",
      icon: `<svg width="275" height="65" viewBox="0 0 275 65" style="left:22px;top:102px"><rect x="-1.2" y="1.2" width="102.5" height="41.5" rx="2.2" transform="matrix(-1 0 0 1 213.5 0)" fill="black" fill-opacity="0.7" stroke="black" stroke-width="2.4"/><rect x="-1.2" y="1.2" width="83.5" height="41.5" rx="2.2" transform="matrix(-1 0 0 1 83.5 0)" fill="black" fill-opacity="0.7" stroke="black" stroke-width="2.4"/><path d="M113 24C108.8 17.9 97.2 9.5 84 24" stroke="black" stroke-width="2.4" stroke-linecap="round"/><path d="M214 20L265.5 43.1L272 62" stroke="black" stroke-width="4.2" stroke-linecap="round"/></svg>`,
      wear: `<g transform="translate(803 737) scale(1.32)"><rect x="-1.2" y="1.2" width="102.5" height="41.5" rx="3" transform="matrix(-1 0 0 1 213.5 0)" fill="black" fill-opacity="0.78" stroke="black" stroke-width="3"/><rect x="-1.2" y="1.2" width="83.5" height="41.5" rx="3" transform="matrix(-1 0 0 1 83.5 0)" fill="black" fill-opacity="0.78" stroke="black" stroke-width="3"/><path d="M113 24C108.8 17.9 97.2 9.5 84 24" stroke="black" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M214 20L248 35" stroke="black" stroke-width="5" stroke-linecap="round"/><path class="cu__shine" d="M30 8L14 34M48 8L32 34M150 8L132 34" stroke="white" stroke-opacity="0.5" stroke-width="5" stroke-linecap="round"/></g>`,
    },
  ];
  const START_ITEM = ITEMS.findIndex((i) => i.id === "natural");

  // ── 캐릭터 색 5가지: 로비 캐릭터들의 색에서 ──
  const COLORS = [
    { body: "#1871ed", deep: "#1949ab" }, // 파랑(기본)
    { body: "#ff1a75", deep: "#a30f55" }, // 빨강
    { body: "#2fd45a", deep: "#138a3a" }, // 초록
    { body: "#a555fb", deep: "#661fa4" }, // 보라
    { body: "#ff8a2b", deep: "#b5540f" }, // 주황
  ];

  const LINES = ["...! 아름답다!", "좋은데?", "넌 최고야!", "어머나!"];

  const root = document.querySelector('[data-screen="custom"]');

  const hint = (cls, y, sign, label) =>
    `<div class="hint cu__hint ${cls}" style="left:1690px;top:${y}px"><svg width="59" height="59" viewBox="0 0 59 59" fill="none" aria-hidden="true"><rect width="59" height="59" rx="29.5" fill="#4C4C4C"/>` +
    (sign === "+" ? `<path d="M31.5 28.4H46V31.5H31.5V46H28.4V31.5H14V28.4H28.4V14H31.5V28.4Z" fill="#F0F0F0"/>` : `<path d="M46 31.5H14V28.4H46V31.5Z" fill="#F0F0F0"/>`) +
    `</svg><span class="hint__label">${label}</span></div>`;

  // 초록이: 평소 얼굴(두 눈) / 반응 얼굴(윙크 + 별)
  const BUDDY =
    `<svg class="cu__buddy-art" width="245" height="237" viewBox="0 0 245 237" fill="none">` +
    `<path class="cu__foot" d="M67 236H8C15.4 221.9 15.4 213.6 39.5 211.1C58.8 209.1 65.8 226.8 67 236Z" fill="#299F78"/>` +
    `<path class="cu__foot cu__foot--b" d="M186.3 236.4L244.8 228.7C235.5 215.2 234.4 206.6 210.2 207.2C190.8 207.7 186.2 226.8 186.3 236.4Z" fill="#299F78"/>` +
    `<g class="cu__buddy-body"><circle cx="122" cy="113" r="113" fill="#97EA73"/>` +
    `<g class="cu__eye"><ellipse cx="69.2" cy="124.1" rx="42.5" ry="41" transform="rotate(-14.1 69.2 124.1)" fill="white"/><ellipse cx="82.2" cy="126.5" rx="30.5" ry="28.5" transform="rotate(-14.1 82.2 126.5)" fill="#299F78"/></g>` +
    `<g class="cu__eye cu__eye--open"><ellipse cx="160" cy="118" rx="38" ry="37" fill="white"/><ellipse cx="171" cy="121" rx="27" ry="26" fill="#299F78"/></g>` +
    `<path class="cu__wink" d="M190.1 90.5L136.8 125.9C135.4 126.8 135.7 128.8 137.2 129.4L182.8 147" stroke="#299F78" stroke-width="6" stroke-linecap="round"/></g>` +
    `<path class="cu__star" d="M17.9 11.2C17.8 8.8 20.4 7.3 22.4 8.5L41.2 19.7C42 20.1 42.9 20.2 43.8 19.9L64.3 12.4C66.5 11.6 68.7 13.6 68.2 15.9L63.4 37.2C63.2 38.1 63.4 39 64 39.7L77.4 56.9C78.9 58.8 77.7 61.5 75.3 61.7L53.6 63.7C52.7 63.8 51.9 64.3 51.4 65L39.2 83.1C37.9 85.1 34.9 84.8 34 82.7L25.3 62.6C25 61.8 24.3 61.2 23.4 60.9L2.4 54.9C0.1 54.3 -0.4 51.3 1.3 49.8L17.7 35.4C18.4 34.8 18.7 33.9 18.7 33L17.9 11.2Z" fill="#299F78"/>` +
    `</svg>`;

  root.innerHTML =
    `<svg class="cu__grid" width="1935" height="1047" viewBox="0 0 1935 1047" fill="none" aria-hidden="true"></svg>` +
    // 뒤에서 지켜보는 초록이(그림자 포함)
    `<div class="cu__buddy"><i class="cu__buddy-shadow"></i><div class="cu__buddy-flip">${BUDDY}</div></div>` +
    // 장식 줄
    `<div class="cu__row"></div>` +
    `<svg class="cu__marker" width="62.74" height="82.9" viewBox="936 18 62.74 82.9" fill="none" aria-hidden="true"><path d="M969.137 99.8916C968.15 101.232 966.144 101.223 965.17 99.874L942.502 68.4961L942.506 68.4961C938.427 63.2019 936 56.5699 936 49.3701C936 32.045 950.045 18 967.37 18C984.695 18.0001 998.74 32.0451 998.74 49.3701C998.74 56.57 996.312 63.2019 992.233 68.4961L992.237 68.4961L969.137 99.8916Z" fill="#35D271"/></svg>` +
    `<p class="cu__name"></p>` +
    // 메인 캐릭터
    `<i class="cu__shadow"></i>` +
    `<svg class="cu__hero" width="560" height="560" viewBox="700 440 560 560" fill="none" aria-hidden="true">` +
    `<g class="cu__feet"><path d="M948 982H855C866.7 959.4 866.7 946.2 904.7 942.2C935.1 939.1 946.2 967.4 948 982Z"/><path d="M989 981.6L1082.8 981.6C1070.9 958.7 1070.9 945.2 1032.6 941.2C1001.9 938 990.7 966.8 989 981.6Z"/></g>` +
    `<g class="cu__body"><ellipse class="cu__skin" cx="959" cy="761.5" rx="175" ry="174.5"/>` +
    `<g class="cu__eyes"><ellipse cx="875" cy="766" rx="64" ry="63" fill="white"/><ellipse cx="1015" cy="766" rx="64" ry="63" fill="white"/>` +
    `<ellipse class="cu__pupil" cx="861.5" cy="752.5" rx="45.5" ry="44.5"/><ellipse class="cu__pupil" cx="1005" cy="752.5" rx="45" ry="44.5"/></g>` +
    `<g class="cu__wear"></g></g></svg>` +
    // 캐릭터 양옆 화살표(색 바꾸기)
    `<button class="cu__arrow cu__arrow--left" type="button" aria-label="이전 색"><svg width="55" height="95" viewBox="0 0 55 95"><path d="M1.7 51.1C-0.2 49.1 -0.2 45.8 1.7 43.8L45.7 1.5C48.9 -1.5 54.2 0.7 54.2 5.1L54.2 89.8C54.2 94.2 48.9 96.5 45.7 93.4L1.7 51.1Z" fill="#303030"/></svg></button>` +
    `<button class="cu__arrow cu__arrow--right" type="button" aria-label="다음 색"><svg width="55" height="95" viewBox="693 0 55 95"><path d="M746.2 51.1C748.3 49.1 748.3 45.8 746.2 43.8L702.2 1.5C699 -1.5 693.7 0.7 693.7 5.1L693.7 89.8C693.7 94.2 699 96.5 702.2 93.4L746.2 51.1Z" fill="#303030"/></svg></button>` +
    // 초록이 말풍선(초록이를 따라다닌다)
    `<div class="cu__say"><svg width="260" height="165" viewBox="0 0 260 165" fill="none"><path d="M2.1 94.8L24.3 23.4L195 9.1L259.3 73.8L220.7 130.3L136.9 138.5L109.9 164.5L103.4 128L2.1 94.8Z" fill="#ABABAB"/><path d="M0.6 86.4L22.8 15.1L193.5 0.8L257.8 65.4L219.2 121.9L135.4 130.1L108.5 156.2L101.9 119.6L0.6 86.4Z" fill="#F4F4F4"/></svg><b></b></div>` +
    hint("cu__hint--save", 850, "+", "저장") +
    hint("cu__hint--back", 945, "-", "뒤로");

  (function grid() {
    const xs = [0, 193.2, 386.41, 579.61, 772.81, 966.01, 1159.22, 1352.42, 1545.62, 1738.82];
    const ys = [-177.8, 15.4, 208.61, 401.81, 595.01, 788.22, 981.42];
    let rects = "";
    xs.forEach((x) => ys.forEach((y) => (rects += `<rect x="${x + 0.5}" y="${y + 0.5}" width="195.175" height="195.175" rx="31.5" stroke="#CACACA"/>`)));
    root.querySelector(".cu__grid").innerHTML = rects;
  })();

  const $ = (s) => root.querySelector(s);
  const row = $(".cu__row");
  const nameEl = $(".cu__name");
  const hero = $(".cu__hero");
  const bodyEl = $(".cu__body");
  const wearEl = $(".cu__wear");
  const buddy = $(".cu__buddy");
  const say = $(".cu__say");
  const sayText = say.querySelector("b");
  const arrows = [$(".cu__arrow--left"), $(".cu__arrow--right")];

  const discs = ITEMS.map((item, i) => {
    const el = document.createElement("div");
    el.className = "cu__item";
    el.innerHTML = `<div class="cu__disc">${item.icon}</div>`;
    row.appendChild(el);
    el.addEventListener("pointerdown", (e) => {
      if (!active || Alert.isOpen()) return;
      e.stopPropagation();
      focusRow(0);
      turnTo(i);
    });
    return el;
  });

  const replay = (el, className) => {
    el.classList.remove(className);
    void el.offsetWidth;
    el.classList.add(className);
  };
  const mod = (n, m) => ((n % m) + m) % m;
  const smooth = (t) => t * t * (3 - 2 * t);

  let active = false;
  let raf = 0;
  let last = 0;
  let rot = START_ITEM;
  let vel = 0;
  let target = START_ITEM;
  let item = -1;
  let color = 0;
  let rowFocus = 0; // 0: 장식 줄, 1: 색 줄

  // ── 장식 줄(가로로 늘어선 원, 고른 것이 가운데) ──
  const GAP = 294;
  function renderRow() {
    discs.forEach((el, i) => {
      const s = mod(i - rot + ITEMS.length / 2, ITEMS.length) - ITEMS.length / 2;
      const a = Math.abs(s);
      const sel = a < 1 ? smooth(1 - a) : 0;
      const fade = a <= 2 ? 1 : Math.max(0, 1 - (a - 2) / 0.5);
      el.style.transform = `translate(${(969.5 + s * GAP).toFixed(1)}px, 254.5px) scale(${(0.85 + 0.15 * fade).toFixed(3)})`;
      el.style.opacity = fade.toFixed(3);
      el.style.setProperty("--sel", sel.toFixed(3));
    });
  }

  function setItem(next) {
    if (next === item) return;
    const first = item < 0;
    item = next;
    nameEl.textContent = ITEMS[item].name;
    wearEl.innerHTML = ITEMS[item].wear;
    if (!first) {
      replay(nameEl, "is-changing");
      replay(wearEl, "is-popping");
      replay(bodyEl, "is-boing");
      react();
    }
  }

  function setColor(next, direction) {
    color = mod(next, COLORS.length);
    hero.style.setProperty("--body", COLORS[color].body);
    hero.style.setProperty("--deep", COLORS[color].deep);
    replay(bodyEl, "is-boing");
    if (direction) replay(arrows[direction > 0 ? 1 : 0], "is-pushed");
    react();
  }

  function turn(direction) {
    target = Math.round(target) + direction;
  }

  function turnTo(i) {
    let diff = mod(i - mod(Math.round(target), ITEMS.length), ITEMS.length);
    if (diff > ITEMS.length / 2) diff -= ITEMS.length;
    target = Math.round(target) + diff;
  }

  function focusRow(r) {
    rowFocus = r;
    root.classList.toggle("is-color-row", r === 1);
  }

  // ── 초록이: 외형이 바뀌면 반응 ──
  const bud = { mode: "idle", timer: 0, lastLine: -1 };

  function react() {
    let k;
    do k = Math.floor(Math.random() * LINES.length);
    while (k === bud.lastLine);
    bud.lastLine = k;
    bud.mode = "react";
    bud.timer = 2;
    sayText.textContent = LINES[k];
    replay(buddy, "is-reacting");
    replay(say, "is-on");
  }

  // 초록이는 피그마 자리에 가만히 서서 숨만 쉬고, 반응이 끝나면 말풍선을 거둔다
  function stepBuddy(dt) {
    if (bud.mode !== "react") return;
    bud.timer -= dt;
    if (bud.timer <= 0) {
      bud.mode = "idle";
      say.classList.remove("is-on");
      buddy.classList.remove("is-reacting");
    }
  }

  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.034);
    last = now;
    for (let i = 0; i < 4; i++) {
      const h = dt / 4;
      vel += (-150 * (rot - target) - 15 * vel) * h;
      rot += vel * h;
    }
    setItem(mod(Math.round(rot), ITEMS.length));
    renderRow();
    stepBuddy(dt);
    if (active) raf = requestAnimationFrame(frame);
  }

  function save() {
    replay($(".cu__hint--save"), "is-saved");
    Alert.notReady(root, THEME);
  }

  // ── 입력 ──
  arrows.forEach((btn, k) =>
    btn.addEventListener("pointerdown", (e) => {
      if (!active || Alert.isOpen()) return;
      e.stopPropagation();
      focusRow(1);
      setColor(color + (k ? 1 : -1), k ? 1 : -1);
    })
  );
  $(".cu__hint--save").addEventListener("pointerdown", () => active && !Alert.isOpen() && save());
  $(".cu__hint--back").addEventListener("pointerdown", () => active && !Alert.isOpen() && api.onBack && api.onBack());

  function handleKey(e) {
    if (Alert.handleKey(e)) return true;
    if (e.key === "ArrowUp") focusRow(0);
    else if (e.key === "ArrowDown") focusRow(1);
    else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      const d = e.key === "ArrowRight" ? 1 : -1;
      if (rowFocus === 0) turn(d);
      else setColor(color + d, d);
    } else if (e.key === "Enter" || e.key === " " || e.key === "+" || e.key === "=") save();
    else if (e.key === "-" || e.key === "Escape" || e.key === "Backspace") return "back";
    else return false;
    return true;
  }

  function enter() {
    active = true;
    Alert.close();
    rot = target = START_ITEM;
    vel = 0;
    item = -1;
    setItem(START_ITEM);
    color = 0;
    hero.style.setProperty("--body", COLORS[0].body);
    hero.style.setProperty("--deep", COLORS[0].deep);
    focusRow(0);
    Object.assign(bud, { mode: "idle", timer: 0 });
    buddy.classList.remove("is-reacting");
    say.classList.remove("is-on");
    renderRow();
    replay(root, "is-entering");
    last = performance.now();
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(frame);
  }

  function leave() {
    active = false;
    Alert.close();
    cancelAnimationFrame(raf);
  }

  setItem(START_ITEM);
  hero.style.setProperty("--body", COLORS[0].body);
  hero.style.setProperty("--deep", COLORS[0].deep);
  renderRow();

  // onBack: 화면의 − 버튼. js/flow.js가 연결한다.
  const api = { enter, leave, handleKey, onBack: null, items: ITEMS, colors: COLORS };
  return api;
})();

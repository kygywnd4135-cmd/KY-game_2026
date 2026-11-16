// 로비 - 지난스토리 리플레이: 내가 만든 에피소드를 다이얼로 돌려 다시 본다.
// 로비와 같은 다이얼 조작:
//   ← / →, 좌우로 밀기   다이얼 돌리기(→ 는 시계 방향)
//   썸네일 누르기          그 에피소드로 돌리기
//   Enter / ＋           리플레이!(지금은 통! 튀기만 한다)
//   Delete, '삭제' 버튼   알림창1(정말 삭제할거야?) → 삭제 → 알림창2(아직 준비되지 않은 기능)
//   − / Esc              로비로 돌아가기(알림창이 떠 있으면 알림창만 닫는다)
// 에피소드 내용은 EP03 말고는 임시다. EPISODES만 고치면 된다(배열 순서 = 다이얼 시계 방향).
window.Replay = (function () {
  const ART = {
    // EP01: 주황 바탕의 파랑(1204:1175)
    sad: `<svg width="329" height="329" viewBox="0 0 329 329" fill="none"><rect width="329" height="329" fill="#FDAA62"/><circle cx="226.5" cy="248.5" r="108.5" fill="#FFCC73"/><circle cx="70" cy="70" r="70" fill="#FFCC73"/><path d="M143.1 273.1L92.9 306.7C91.2 290.5 86.5 283.5 105.6 267.6C120.9 255 136.9 266 143.1 273.1Z" fill="#3B81B4"/><path d="M123.9 324.3L185 329C178.3 314 179 305.5 154.2 301.1C134.4 297.6 125.8 315.1 123.9 324.3Z" fill="#3B81B4"/><ellipse cx="192.4" cy="168.3" rx="98.1" ry="98.3" fill="#BDE5FF"/><circle cx="35.6" cy="35.6" r="35.6" transform="matrix(-0.986 -0.164 -0.164 0.986 253.1 136.6)" fill="white"/><path d="M158.3 159.8C159 164.4 158.9 169.2 157.9 173.7C156.8 178.3 154.9 182.6 152.2 186.4C149.5 190.3 146 193.5 142.1 196C138.1 198.5 133.7 200.2 129.1 201C124.4 201.8 119.7 201.6 115.1 200.6C110.6 199.5 106.3 197.6 102.4 194.9C98.6 192.2 95.4 188.7 92.9 184.8C90.4 180.8 88.7 176.4 87.9 171.8L123.1 165.8L158.3 159.8Z" fill="white"/><circle cx="23.9" cy="23.9" r="23.9" transform="matrix(-0.986 -0.164 -0.164 0.986 239.5 146.2)" fill="#3B81B4"/><path d="M146.7 161.8C147.2 164.9 147.1 168.1 146.4 171.1C145.7 174.2 144.4 177.1 142.6 179.6C140.8 182.2 138.5 184.4 135.8 186C133.1 187.7 130.2 188.8 127.1 189.4C124 189.9 120.8 189.8 117.8 189.1C114.7 188.4 111.8 187.1 109.3 185.3C106.7 183.5 104.5 181.2 102.8 178.5C101.2 175.9 100 172.9 99.5 169.8L123.1 165.8L146.7 161.8Z" fill="#3B81B4"/><path d="M38.5 135.4C38.8 128 45.1 122.3 52.7 122.1C53.4 114.5 59.7 108.8 67.1 109.1C74.4 109.4 80.2 115.6 80.4 123.2L79.3 151L51.5 149.9C44 149 38.2 142.8 38.5 135.4Z" fill="#466EFF"/></svg>`,
    // EP02: 연두 바탕의 청록(1204:1160)
    shock: `<svg width="329" height="329" viewBox="0 0 329 329" fill="none"><rect width="329" height="329" fill="#BAFFA7"/><path d="M284.2 19.5C285 9.7 296.5 5 303.9 11.4L358.3 58.2C361.2 60.7 365.1 61.6 368.8 60.8L438.6 44.4C448.1 42.2 456.2 51.7 452.4 60.7L424.7 126.8C423.2 130.4 423.5 134.4 425.5 137.7L462.7 199C467.7 207.4 461.2 218 451.4 217.2L380 211.3C376.1 210.9 372.4 212.5 369.9 215.4L323.1 269.6C316.7 277 304.5 274.1 302.3 264.5L285.8 194.8C285 191 282.4 188 278.8 186.5L212.7 158.7C203.7 154.9 202.8 142.5 211.2 137.4L272.4 100.2C275.7 98.2 277.8 94.7 278.2 90.9L284.2 19.5Z" fill="#B0E6FF"/><path d="M46.2 19.5C47 9.7 58.5 5 65.9 11.4L120.3 58.2C123.2 60.7 127.1 61.6 130.8 60.8L200.6 44.4C210.1 42.2 218.2 51.7 214.4 60.7L186.7 126.8C185.2 130.4 185.5 134.4 187.5 137.7L224.7 199C229.7 207.4 223.2 218 213.4 217.2L142 211.3C138.1 210.9 134.4 212.5 131.9 215.4L85.1 269.6C78.7 277 66.5 274.1 64.3 264.5L47.8 194.8C47 191 44.4 188 40.8 186.5L-25.2 158.7C-34.2 154.9 -35.1 142.5 -26.7 137.4L34.4 100.2C37.7 98.2 39.8 94.7 40.2 90.9L46.2 19.5Z" fill="#B1E6FF"/><ellipse cx="245.3" cy="264.9" rx="40" ry="49" transform="rotate(-64.9 245.3 264.9)" fill="#03A99B"/><ellipse cx="119.2" cy="119.4" rx="119.2" ry="119.4" transform="matrix(-1 0 0 1 269.4 55)" fill="#05E2CF"/><ellipse cx="224" cy="185" rx="38" ry="42" fill="white"/><ellipse cx="235" cy="184" rx="27" ry="30" fill="#03A99B"/><ellipse cx="93.2" cy="279.8" rx="40" ry="49" transform="rotate(60.8 93.2 279.8)" fill="#03A99B"/><path d="M147.2 119.5L164.9 104.4L137.2 41.9L147.3 16.7L177.2 33.2L173.7 101.9L195 109.2L189.1 125.3L160.2 135.7L147.2 119.5Z" fill="#FF6C6C"/><path d="M170 183.5C170 186.4 168.8 189.3 166.6 192.1C164.3 194.8 161 197.3 156.9 199.4C152.8 201.4 147.9 203.1 142.5 204.2C137.1 205.4 131.3 206 125.5 206C119.6 206 113.8 205.4 108.4 204.2C103 203.1 98.1 201.4 94 199.4C89.9 197.3 86.6 194.8 84.3 192.1C82.1 189.3 81 186.4 81 183.5H170Z" fill="#03A99B"/></svg>`,
    // EP03: 김부장(1204:1122)
    boss: `<svg width="411" height="411" viewBox="0 0 411 411" fill="none"><rect width="411" height="411" fill="#27C5FF"/><circle cx="198.5" cy="327.5" r="108.5" fill="#008CE9"/><path d="M46.2 19.5C47 9.7 58.5 5 65.9 11.4L120.3 58.2C123.2 60.7 127.1 61.6 130.8 60.8L200.6 44.4C210.1 42.2 218.2 51.7 214.4 60.7L186.7 126.8C185.2 130.4 185.5 134.4 187.5 137.7L224.7 199C229.7 207.4 223.2 218 213.4 217.2L142 211.3C138.1 210.9 134.4 212.5 131.9 215.4L85.1 269.6C78.7 277 66.5 274.1 64.3 264.5L47.8 194.8C47 191 44.4 188 40.8 186.5L-25.2 158.7C-34.2 154.9 -35.1 142.5 -26.7 137.4L34.4 100.2C37.7 98.2 39.8 94.7 40.2 90.9L46.2 19.5Z" fill="#FFC61C"/><path d="M284.2 19.5C285 9.7 296.5 5 303.9 11.4L358.3 58.2C361.2 60.7 365.1 61.6 368.8 60.8L438.6 44.4C448.1 42.2 456.2 51.7 452.4 60.7L424.7 126.8C423.2 130.4 423.5 134.4 425.5 137.7L462.7 199C467.7 207.4 461.2 218 451.4 217.2L380 211.3C376.1 210.9 372.4 212.5 369.9 215.4L323.1 269.6C316.7 277 304.5 274.1 302.3 264.5L285.8 194.8C285 191 282.4 188 278.8 186.5L212.7 158.7C203.7 154.9 202.8 142.5 211.2 137.4L272.4 100.2C275.7 98.2 277.8 94.7 278.2 90.9L284.2 19.5Z" fill="#FFC61C"/><circle cx="218.1" cy="229.8" r="163.8" fill="#3A3AFF"/><path d="M223 209.8C221.6 217.8 221.8 225.9 223.6 233.7C225.4 241.6 228.8 249 233.4 255.6C238.1 262.2 244 267.7 250.8 272C257.6 276.3 265.2 279.2 273.2 280.6C281.1 281.9 289.2 281.7 297.1 279.9C304.9 278.1 312.3 274.8 318.9 270.1C325.5 265.4 331.1 259.5 335.3 252.7C339.6 245.9 342.5 238.3 343.9 230.4L283.4 220.1L223 209.8Z" fill="white"/><path d="M242.9 213.2C242 218.5 242.2 224 243.4 229.2C244.6 234.5 246.8 239.5 249.9 243.9C253 248.3 257 252 261.6 254.9C266.1 257.8 271.2 259.7 276.5 260.6C281.9 261.5 287.3 261.4 292.6 260.1C297.8 258.9 302.8 256.7 307.2 253.6C311.6 250.5 315.3 246.5 318.2 241.9C321.1 237.4 323 232.3 323.9 227L283.4 220.1L242.9 213.2Z" fill="#191EAB"/><path d="M145 271.2C179.3 233.7 216.5 260 230.8 277.9C216.5 296.4 180.7 334.9 151.8 341.6C123 348.3 91.7 325.4 79.7 313.1C87.2 314.8 110.6 308.8 145 271.2Z" fill="black"/><path d="M282.2 269.3C248.1 230.8 211.2 257.8 197 276.2C211.2 295.1 246.7 334.7 275.3 341.6C304 348.4 335 324.9 346.9 312.3C339.5 314 316.2 307.8 282.2 269.3Z" fill="black"/><path d="M354.9 264.7L321.1 363C347.9 358.3 361.2 362.8 379 324.1C393.2 293 368.9 271.5 354.9 264.7Z" fill="#17179B"/><path d="M55.7 235.3L101.5 325.9C74.4 325.2 61.9 331.5 39.5 296.4C21.5 268.3 42.8 244 55.7 235.3Z" fill="#17179B"/><path d="M101.8 194.5L183.5 223C185 223.6 185.3 225.6 184 226.5L129.8 264.7" stroke="#191EAB" stroke-width="8" stroke-linecap="round"/></svg>`,
  };

  const EPISODES = [
    { art: "sad", ep: "EP01.", title: "첫 출근은 원래 이래?", rating: 3.5, date: "2026.11.03",
      desc: ["설레는 마음으로 첫 출근한 후임, 그런데 사수가 보이지 않는다..?", "텅 빈 자리 앞에서 무엇부터 해야 할지 몰라 허둥대는데!"] },
    { art: "shock", ep: "EP02.", title: "회식은 자율이라면서요!", rating: 4.5, date: "2026.11.10",
      desc: ["자율 참석이라던 회식, 빠지겠다고 말하는 순간 분위기가 싸해졌다..", "후임은 과연 무사히 퇴근 버스에 오를 수 있을까?"] },
    { art: "boss", ep: "EP03.", title: "또 너야, 김부장?!", rating: 4.0, date: "2026.11.17", isNew: true,
      desc: ["김부장이 퇴사한다는 후임을 붙잡고 또 한소리를 하고있다..", "그런데, 후임도 더이상 참을 수 없었던걸까? 큰맘먹고 한마디를 꺼내는데!"] },
  ];
  const COUNT = EPISODES.length;
  const START = EPISODES.findIndex((e) => e.isNew); // 새로 추가된 에피소드부터

  const root = document.querySelector('[data-screen="replay"]');

  // ── 자리(슬롯): 피그마의 썸네일 중심 좌표(왼쪽 · 가운데 · 오른쪽) ──
  const CENTER = { x: 969, y: 984 };
  const SLOTS = [
    { x: 509.5, y: 353.5 },
    { x: 965.5, y: 230.5 },
    { x: 1421.5, y: 353.5 },
  ].map((p) => ({ angle: Math.atan2(p.x - CENTER.x, CENTER.y - p.y), radius: Math.hypot(p.x - CENTER.x, CENTER.y - p.y) }));
  const BEYOND = (34 * Math.PI) / 180; // 양 끝 너머로 이만큼 더 가면서 사라진다
  const SIZE = 329;
  const SELECTED_SCALE = 411 / 329;

  const RATE_STAR =
    "M674.1 326.4C676.3 322.1 682.6 322.1 684.8 326.4L693.1 342.6C693.9 344.3 695.6 345.5 697.5 345.8L715.4 348.7C720.2 349.4 722.2 355.4 718.7 358.8L705.9 371.7C704.5 373 703.9 375 704.2 376.8L707 394.8C707.8 399.6 702.7 403.3 698.4 401.1L682.2 392.8C680.5 392 678.4 392 676.7 392.8L660.5 401.1C656.2 403.3 651.1 399.6 651.9 394.8L654.7 376.8C655 375 654.4 373 653 371.7L640.2 358.8C636.7 355.4 638.7 349.4 643.5 348.7L661.4 345.8C663.3 345.5 665 344.3 665.8 342.6L674.1 326.4Z";
  const star = (fill) => `<svg width="44" height="43" viewBox="637 320 86 84" fill="none" aria-hidden="true"><path d="${RATE_STAR}" fill="${fill}"/></svg>`;

  root.innerHTML =
    `<svg class="rp__grid" width="1935" height="1047" viewBox="0 0 1935 1047" fill="none" aria-hidden="true"></svg>` +
    `<div class="rp__ring"></div><div class="rp__plate"></div>` +
    `<div class="rp__info">` +
    `<p class="rp__title"><b class="rp__ep"></b> <span class="rp__name"></span></p>` +
    `<div class="rp__pills"><div class="rp__pill rp__rating">` +
    [0, 1, 2, 3, 4].map((i) => `<span class="rp__star">${star("#D9D9D9")}<span class="rp__star-fill">${star("#FFC61C")}</span></span>`).join("") +
    `<b class="rp__score"></b></div><div class="rp__pill rp__date"></div></div>` +
    `<p class="rp__desc"></p></div>` +
    `<i class="rp__line"></i>` +
    `<button class="rp__btn rp__btn--delete" type="button">삭제</button>` +
    `<button class="rp__btn rp__btn--play" type="button">리플레이!</button>` +
    `<div class="rp__dial"></div>` +
    `<svg class="rp__marker" width="62.74" height="82.9" viewBox="936 18 62.74 82.9" fill="none" aria-hidden="true"><path d="M969.137 99.8916C968.15 101.232 966.144 101.223 965.17 99.874L942.502 68.4961L942.506 68.4961C938.427 63.2019 936 56.5699 936 49.3701C936 32.045 950.045 18 967.37 18C984.695 18.0001 998.74 32.0451 998.74 49.3701C998.74 56.57 996.312 63.2019 992.233 68.4961L992.237 68.4961L969.137 99.8916Z" fill="currentColor"/></svg>` +
    `<div class="hint rp__hint" style="left:1690px;top:945px"><svg width="59" height="59" viewBox="0 0 59 59" fill="none" aria-hidden="true"><rect width="59" height="59" rx="29.5" fill="#FFFFFF"/><path d="M46 31.5H14V28.4H46V31.5Z" fill="#202020"/></svg><span class="hint__label">뒤로</span></div>` ;

  (function grid() {
    const xs = [0, 193.2, 386.41, 579.61, 772.81, 966.01, 1159.22, 1352.42, 1545.62, 1738.82];
    const ys = [-177.8, 15.4, 208.61, 401.81, 595.01, 788.22, 981.42];
    let rects = "";
    xs.forEach((x) => ys.forEach((y) => (rects += `<rect x="${x + 0.5}" y="${y + 0.5}" width="195.175" height="195.175" rx="31.5" stroke="#CACACA"/>`)));
    root.querySelector(".rp__grid").innerHTML = rects;
  })();

  const $ = (s) => root.querySelector(s);
  const dial = $(".rp__dial");
  const marker = $(".rp__marker");
  const info = $(".rp__info");
  const epEl = $(".rp__ep");
  const nameEl = $(".rp__name");
  const scoreEl = $(".rp__score");
  const dateEl = $(".rp__date");
  const descEl = $(".rp__desc");
  const stars = Array.from(root.querySelectorAll(".rp__star"));
  const playBtn = $(".rp__btn--play");
  const deleteBtn = $(".rp__btn--delete");

  const nodes = EPISODES.map((ep, i) => {
    const el = document.createElement("div");
    el.className = "rp";
    el.innerHTML =
      `<div class="rp__pop"><div class="rp__disc">${ART[ep.art]}</div>` +
      (ep.isNew ? `<span class="rp__new">NEW!</span>` : "") +
      `</div>`;
    dial.appendChild(el);
    el.addEventListener("pointerdown", () => {
      if (active && !Alert.isOpen()) clickIndex = i;
    });
    return { el, pop: el.querySelector(".rp__pop"), index: i };
  });

  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (t) => t * t * (3 - 2 * t);
  const mod = (n, m) => ((n % m) + m) % m;

  function place(s) {
    const a = Math.abs(s);
    let angle, radius, fade = 1;
    if (a <= 1) {
      const f = s + 1;
      const i = Math.min(Math.floor(f), 1);
      const t = f - i;
      angle = lerp(SLOTS[i].angle, SLOTS[i + 1].angle, t);
      radius = lerp(SLOTS[i].radius, SLOTS[i + 1].radius, t);
    } else {
      // 양 끝 너머: 계속 돌아가며 작아지고 사라진다(다시 반대편에서 나타난다)
      const edge = s > 0 ? SLOTS[2] : SLOTS[0];
      const t = Math.min((a - 1) / 0.5, 1);
      angle = edge.angle + Math.sign(s) * t * BEYOND;
      radius = edge.radius;
      fade = 1 - t;
    }
    const sel = a < 1 ? smooth(1 - a) : 0;
    return { x: CENTER.x + radius * Math.sin(angle), y: CENTER.y - radius * Math.cos(angle), scale: lerp(1, SELECTED_SCALE, sel) * lerp(0.6, 1, fade), sel, fade };
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
      const s = mod(n.index - rot + COUNT / 2, COUNT) - COUNT / 2;
      const p = place(s);
      const st = n.el.style;
      st.transform = `translate(${p.x.toFixed(2)}px, ${p.y.toFixed(2)}px) scale(${p.scale.toFixed(4)})`;
      st.opacity = p.fade.toFixed(3);
      st.visibility = p.fade < 0.01 ? "hidden" : "";
      st.setProperty("--sel", p.sel.toFixed(3));
      st.zIndex = String(Math.round(p.sel * 10));
    });
  }

  function showInfo(animate) {
    const ep = EPISODES[selected];
    epEl.textContent = ep.ep;
    nameEl.textContent = ep.title;
    scoreEl.textContent = ep.rating.toFixed(1);
    stars.forEach((el, i) => el.style.setProperty("--part", String(Math.max(0, Math.min(1, ep.rating - i)))));
    dateEl.textContent = `${ep.date} 출시`;
    descEl.innerHTML = ep.desc.join("<br>");
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
    setSelected(mod(Math.round(rot), COUNT));
    render();
    if (active) raf = requestAnimationFrame(frame);
  }

  function turn(direction) {
    target = Math.round(target) - direction;
  }

  function turnTo(i) {
    let diff = mod(i - mod(Math.round(target), COUNT), COUNT);
    if (diff > COUNT / 2) diff -= COUNT;
    target = Math.round(target) + diff;
  }

  function play() {
    replay(playBtn, "is-pressed");
    replay(nodes[selected].pop, "is-picked");
    if (api.onPick) api.onPick(selected);
  }

  // ── 알림창: 이 화면은 연보라(내 에피소드 다시보기) 색 ──
  const THEME = "lilac";

  function askDelete() {
    replay(deleteBtn, "is-pressed");
    Alert.open(root, {
      theme: THEME,
      text: "시나리오는 한번 지우면 <b>영영 복구할 수 없어</b>.<br>정말 삭제할거야?",
      buttons: [
        { id: "cancel", label: "취소", kind: "muted" },
        { id: "delete", label: "삭제", kind: "main" },
      ],
      // 실제 삭제는 아직 → 알림창2
      onChoose: (id) => id === "delete" && Alert.notReady(root, THEME),
    });
  }

  // ── 마우스·터치 ──
  root.addEventListener("pointerdown", (e) => {
    if (!active || Alert.isOpen() || (e.pointerType === "mouse" && e.button !== 0)) return;
    if (e.target.closest(".rp__hint, .rp__btn")) return;
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
    const next = drag.rot - dx / 420;
    vel = (next - rot) * 60;
    rot = next;
  });

  function endDrag(e) {
    if (!drag) return;
    const moved = drag.moved;
    drag = null;
    if (moved) {
      target = Math.round(rot + Math.max(-0.45, Math.min(0.45, vel * 0.12)));
      vel = Math.max(-8, Math.min(8, vel));
    } else {
      target = Math.round(rot);
      if (e.type === "pointerup" && clickIndex >= 0) {
        if (clickIndex === selected) play();
        else turnTo(clickIndex);
      }
    }
    clickIndex = -1;
  }
  root.addEventListener("pointerup", endDrag);
  root.addEventListener("pointercancel", endDrag);

  playBtn.addEventListener("pointerdown", () => active && !Alert.isOpen() && play());
  deleteBtn.addEventListener("pointerdown", () => active && !Alert.isOpen() && askDelete());
  $(".rp__hint").addEventListener("pointerdown", () => active && !Alert.isOpen() && api.onBack && api.onBack());

  function handleKey(e) {
    if (Alert.handleKey(e)) return true;
    if (e.key === "ArrowRight") turn(1);
    else if (e.key === "ArrowLeft") turn(-1);
    else if (e.key === "Enter" || e.key === " " || e.key === "+" || e.key === "=") play();
    else if (e.key === "Delete") askDelete();
    else if (e.key === "-" || e.key === "Escape" || e.key === "Backspace") return "back";
    else return false;
    return true;
  }

  function enter() {
    active = true;
    Alert.close();
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
    Alert.close();
    cancelAnimationFrame(raf);
  }

  nodes.forEach((n) => n.el.style.setProperty("--size", SIZE + "px"));
  selected = START;
  showInfo(false);
  render();

  // onPick(에피소드 번호): 리플레이!. onBack: 화면의 − 버튼. js/flow.js가 연결한다.
  const api = { enter, leave, handleKey, turn, onPick: null, onBack: null, episodes: EPISODES };
  return api;
})();

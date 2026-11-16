// 로비: 캐릭터들이 다이얼처럼 도는 선택 화면.
//  - ← / → 방향키(또는 좌우로 밀기)로 돌린다. → 는 시계 방향.
//  - 끝에서 사라진 캐릭터는 반대쪽 끝에서 다시 나온다(빈자리 없음).
//  - 가운데(선택된) 캐릭터는 색이 진해지고 눈이 시선(포인터)을 따라온다.
window.Lobby = (function () {
  const root = document.querySelector('[data-screen="lobby"]');
  const stage = document.querySelector(".stage");
  const dial = root.querySelector(".dial");
  const marker = root.querySelector(".lobby__marker");
  const gridEl = root.querySelector(".lobby__grid");

  // ── 자리(슬롯) 7개: 피그마의 캐릭터 중심 좌표 ──
  // 가운데(0)가 선택 자리이고, 양옆으로 -3 … +3.
  const CENTER = { x: 970, y: 969 };
  const SLOTS = [
    { x: 222, y: 953, sx: -18, sy: 27 },
    { x: 335, y: 613, sx: -17, sy: 11 },
    { x: 583, y: 339, sx: -13, sy: 11 },
    { x: 966.5, y: 306.72, sx: 0, sy: 0 },
    { x: 1350, y: 346, sx: 12, sy: 8 },
    { x: 1615, y: 613, sx: 10, sy: 14 },
    { x: 1739, y: 953, sx: 16, sy: 16 },
  ].map((p) => {
    const dx = p.x - CENTER.x;
    const dy = CENTER.y - p.y;
    return { angle: Math.atan2(dx, dy), radius: Math.hypot(dx, dy), sx: p.sx, sy: p.sy };
  });
  const HIDDEN_ANGLE = (132 * Math.PI) / 180; // 화면 아래로 완전히 숨는 각도
  const SELECTED_SCALE = 341 / 248;

  // ── 캐릭터 7명 (배열 순서 = 시계 방향 순서) ──
  const lid = (x, y, w) => `<i class="lc__lid" style="--x:${x}px;--y:${y}px;--w:${w || 69}px"></i>`;
  const white = (x, y, r) => `<i class="lc__white" style="--x:${x}px;--y:${y}px;--r:${r}px"></i>`;
  const dot = (x, y, r) => `<i class="lc__dot" style="--x:${x}px;--y:${y}px;--r:${r}px"></i>`;
  const arch = (x, y) => `<span class="lc__arch" style="--x:${x}px;--y:${y}px"><i class="lc__white"></i><i class="lc__dot"></i></span>`;
  const SPIRAL_A =
    "M1568.42 591C1568.2 591 1566.91 591.164 1563.28 592.04C1552.84 594.566 1551.46 595.908 1549.91 596.457C1548.33 597.014 1548.79 599.267 1547.82 601.849C1546.07 606.484 1544.06 609.585 1544.01 610.328C1543.9 611.812 1545.14 613.879 1546.77 617.161C1547.82 619.267 1549.49 621.928 1551.25 623.732C1554.99 627.541 1560.95 626.406 1564.6 626.798C1566.17 626.967 1567.38 627.074 1568.25 626.938C1571.93 626.359 1576.45 620.525 1578.25 618.366C1581.37 614.64 1579.4 604.531 1579.26 601.939C1579.2 600.799 1577.45 600.82 1575.65 600.133C1574.04 599.514 1572.82 598.725 1572.09 598.421C1570.49 597.758 1569.07 599.052 1562.57 601.69C1559.56 602.909 1557.82 605.989 1556.51 608.258C1555.24 610.459 1554.01 612.949 1554.01 613.775C1554.01 615.187 1556.34 615.981 1558.78 617.223C1560.14 617.914 1561.07 618.579 1561.89 618.717C1565.66 619.36 1570.2 615.881 1571.4 614.614C1572.62 613.328 1572 609.886 1571.74 606.659C1571.64 605.533 1570.93 605.562 1570.41 605.589C1568.47 605.782 1567.06 606.002 1566.09 606.195C1565.65 606.279 1565.32 606.333 1564.99 606.39";
  const spiral = (cls, x, y) =>
    `<span class="lc__spin ${cls}" style="--x:${x}px;--y:${y}px"><svg width="40" height="40" viewBox="1542 589 40 40" fill="none" aria-hidden="true"><path d="${SPIRAL_A}" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`;

  const ZZZ = `<svg class="lc__prop" style="left:140px;top:9px" width="114" height="66" viewBox="1490 355 114 66" fill="none" aria-hidden="true">
    <path class="lc__z" fill="var(--deep)" d="M1492.15 393.706L1493.22 389.101L1517.55 367.691L1499.2 363.397L1500.7 357L1528.79 363.575L1527.72 368.18L1503.37 389.586L1521.74 393.884L1520.24 400.281L1492.15 393.706Z"/>
    <path class="lc__z" fill="var(--deep)" d="M1525.91 401.607L1526.97 397.056L1544.35 383.526L1544.4 383.329L1531.39 380.285L1532.81 374.193L1555.02 379.388L1553.85 384.352L1537.4 397.662L1537.35 397.859L1550.47 400.928L1549.04 407.02L1525.91 401.607Z"/>
    <path class="lc__z" fill="var(--deep)" d="M1554.95 408.402L1555.66 405.343L1567.11 396.192L1567.14 396.059L1558.62 394.067L1559.58 389.972L1574.11 393.371L1573.33 396.708L1562.49 405.708L1562.46 405.841L1571.04 407.849L1570.09 411.945L1554.95 408.402Z"/>
    <path class="lc__z" fill="var(--deep)" d="M1581.01 414.992C1579.82 414.715 1578.91 414.059 1578.25 413.025C1577.61 411.981 1577.43 410.868 1577.71 409.685C1577.99 408.514 1578.64 407.609 1579.67 406.968C1580.71 406.33 1581.83 406.15 1583.01 406.427C1584.16 406.695 1585.06 407.348 1585.73 408.385C1586.39 409.423 1586.59 410.527 1586.31 411.698C1586.13 412.486 1585.76 413.161 1585.2 413.723C1584.65 414.276 1584.01 414.674 1583.27 414.917C1582.54 415.149 1581.78 415.173 1581.01 414.992Z"/>
    <path class="lc__z" fill="var(--deep)" d="M1596.03 418.509C1594.85 418.232 1593.93 417.577 1593.28 416.542C1592.64 415.498 1592.46 414.385 1592.74 413.202C1593.01 412.032 1593.67 411.126 1594.7 410.485C1595.74 409.848 1596.86 409.667 1598.04 409.944C1599.19 410.212 1600.09 410.865 1600.76 411.903C1601.42 412.94 1601.61 414.044 1601.34 415.215C1601.16 416.003 1600.78 416.679 1600.22 417.241C1599.68 417.793 1599.04 418.191 1598.3 418.435C1597.57 418.666 1596.81 418.691 1596.03 418.509Z"/>
  </svg>`;

  const STAR = `<svg class="lc__prop lc__star" style="left:124px;top:-79px" width="43" height="44" viewBox="459 534 43 44" fill="none" aria-hidden="true">
    <path fill="var(--body)" d="M479.486 538.316C481.533 535.771 485.602 536.619 486.462 539.77L488.293 546.481C488.629 547.715 489.535 548.713 490.731 549.167L497.233 551.639C500.286 552.8 500.736 556.932 498.005 558.723L492.189 562.538C491.119 563.239 490.45 564.409 490.387 565.686L490.046 572.634C489.885 575.896 486.095 577.602 483.547 575.558L478.121 571.205C477.124 570.405 475.804 570.13 474.57 570.464L467.857 572.287C464.705 573.142 461.912 570.064 463.068 567.01L465.532 560.504C465.985 559.309 465.839 557.968 465.139 556.898L461.331 551.077C459.543 548.343 461.608 544.736 464.87 544.892L471.818 545.224C473.095 545.285 474.325 544.732 475.126 543.736L479.486 538.316Z"/>
  </svg>`;

  const CHARACTERS = [
    { id: "blue", vivid: "#1871ed", vividDeep: "#1949ab", pastel: "#b4d2ff", pastelDeep: "#6f9de6", face: "" },
    { id: "violet", vivid: "#8a4dff", vividDeep: "#4b1fb3", pastel: "#bea9ff", pastelDeep: "#a369ff", face: lid(-58.5, 25.5) + lid(23.5, 25.5) + ZZZ },
    {
      id: "pink", vivid: "#ff1a75", vividDeep: "#a30f55", pastel: "#ffacce", pastelDeep: "#e18abb",
      face: white(-58.5, 9.5, 40.5) + white(40.5, 9.5, 40.5) + dot(-52.5, -2.5, 29) + dot(37.5, 21, 29) + spiral("lc__spin--a", -53, -4) + spiral("lc__spin--b", 36, 21),
    },
    { id: "green", vivid: "#2fd45a", vividDeep: "#138a3a", pastel: "#b9ffb8", pastelDeep: "#79df65", face: lid(-37.5, 27.5) + lid(44.5, 27.5) },
    { id: "lilac", vivid: "#c24dff", vividDeep: "#7a1fb8", pastel: "#e5c3fd", pastelDeep: "#cc89ff", face: lid(-58.5, 27.5) + lid(23.5, 27.5) },
    {
      id: "mint", vivid: "#17d6c2", vividDeep: "#0b8a80", pastel: "#c7fffa", pastelDeep: "#5acac0",
      face: lid(-44.5, 17.5, 75) + white(54.5, 16.5, 42.5) + dot(66.5, 15, 30.2) + STAR,
    },
    { id: "peach", vivid: "#ff8a2b", vividDeep: "#b5540f", pastel: "#ffd3af", pastelDeep: "#dd9765", face: arch(-35.35, 26) + arch(61.4, 26) },
  ];
  const COUNT = CHARACTERS.length;

  const AWAKE_FACE =
    `<span class="lc__eye">${white(-48, 6.5, 43.3)}${dot(-48, 6.5, 30.9)}</span>` +
    `<span class="lc__eye">${white(48, 6.5, 43.3)}${dot(48, 6.5, 30.9)}</span>`;
  const BANG = `<svg class="lc__prop lc__bang" width="33.5" height="72" viewBox="1136 95 46 99" fill="none" aria-hidden="true">
    <path fill="currentColor" d="M1160.7 96.2193L1145.02 161.84L1161.65 166.295L1180.92 101.636L1160.7 96.2193ZM1145.54 193.142C1148.54 193.945 1151.4 193.575 1154.12 192.031C1156.84 190.457 1158.59 188.167 1159.37 185.16C1160.19 182.2 1159.81 179.372 1158.23 176.676C1156.65 173.98 1154.36 172.23 1151.36 171.427C1148.48 170.656 1145.67 171.038 1142.92 172.574C1140.17 174.11 1138.39 176.357 1137.56 179.317C1137.05 181.324 1137.09 183.299 1137.68 185.24C1138.24 187.144 1139.2 188.814 1140.57 190.252C1141.95 191.659 1143.6 192.623 1145.54 193.142Z"/>
  </svg>`;

  // ── 화면 요소 만들기 ──
  function buildGrid() {
    const xs = [0, 193.2, 386.41, 579.61, 772.81, 966.01, 1159.22, 1352.42, 1545.62, 1738.82];
    const ys = [-177.8, 15.4, 208.61, 401.81, 595.01, 788.22, 981.42];
    let rects = "";
    xs.forEach((x) => ys.forEach((y) => {
      rects += `<rect x="${x + 0.5}" y="${y + 0.5}" width="195.175" height="195.175" rx="31.5" stroke="#CACACA"/>`;
    }));
    gridEl.innerHTML = rects;
  }

  const nodes = CHARACTERS.map((c, i) => {
    const el = document.createElement("div");
    el.className = "lc lc--" + c.id;
    el.style.setProperty("--vivid", c.vivid);
    el.style.setProperty("--vivid-deep", c.vividDeep);
    el.style.setProperty("--pastel", c.pastel);
    el.style.setProperty("--pastel-deep", c.pastelDeep);
    el.innerHTML =
      `<div class="lc__pop"><i class="lc__shadow"></i><div class="lc__idle"><i class="lc__body"></i>` +
      `<div class="lc__face lc__face--idle">${c.face}</div>` +
      `<div class="lc__face lc__face--awake">${AWAKE_FACE}</div></div>${BANG}</div>`;
    dial.appendChild(el);
    return { el, pop: el.querySelector(".lc__pop"), awake: null, index: i };
  });

  // ── 다이얼 계산 ──
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (t) => t * t * (3 - 2 * t);
  const mod = (n, m) => ((n % m) + m) % m;

  // 슬롯 위치 s(-3.5 … 3.5)에 해당하는 좌표·크기·선택 정도
  function place(s) {
    const a = Math.abs(s);
    let angle, radius, sx, sy;
    if (a <= 3) {
      const f = s + 3;
      const i = Math.min(Math.floor(f), 5);
      const t = f - i;
      const p = SLOTS[i];
      const q = SLOTS[i + 1];
      angle = lerp(p.angle, q.angle, t);
      radius = lerp(p.radius, q.radius, t);
      sx = lerp(p.sx, q.sx, t);
      sy = lerp(p.sy, q.sy, t);
    } else {
      // 양 끝 바깥: 화면 아래로 빠르게 숨는다
      const edge = s > 0 ? SLOTS[6] : SLOTS[0];
      const t = Math.min((a - 3) / 0.3, 1);
      angle = lerp(edge.angle, Math.sign(s) * HIDDEN_ANGLE, t);
      radius = edge.radius;
      sx = edge.sx;
      sy = edge.sy;
    }
    const sel = a < 1 ? smooth(1 - a) : 0;
    return {
      x: CENTER.x + radius * Math.sin(angle),
      y: CENTER.y - radius * Math.cos(angle),
      scale: lerp(1, SELECTED_SCALE, sel),
      sel, sx, sy,
    };
  }

  // rot: 다이얼이 돌아간 양(자리 단위). 정수일 때 딱 맞는다.
  let rot = 0;
  let vel = 0;
  let target = 0;
  let active = false;
  let raf = 0;
  let last = 0;
  let selected = 0;
  let drag = null;
  let enterTimer = 0;

  // 시선(포인터) 추적
  const gaze = { x: 8.7, y: -8.7, tx: 8.7, ty: -8.7, seen: 0 };
  const PUPIL_RANGE = 12.4;

  function render(now) {
    nodes.forEach((n) => {
      let s = mod(n.index - rot + COUNT / 2, COUNT) - COUNT / 2; // -3.5 … 3.5
      const p = place(s);
      const st = n.el.style;
      st.transform = `translate(${p.x.toFixed(2)}px, ${p.y.toFixed(2)}px) scale(${p.scale.toFixed(4)})`;
      st.setProperty("--sel", p.sel.toFixed(3));
      st.setProperty("--sx", (p.sx / p.scale).toFixed(2) + "px");
      st.setProperty("--sy", (p.sy / p.scale).toFixed(2) + "px");
      st.zIndex = String(Math.round(p.sel * 10));
      n.el.classList.toggle("is-awake", Math.abs(s) < 0.5);
    });

    // 한동안 포인터가 없으면 눈이 천천히 두리번거린다
    if (now - gaze.seen > 3500) {
      const t = now / 1000;
      gaze.tx = Math.sin(t * 0.7) * 9;
      gaze.ty = Math.cos(t * 0.9) * 6 - 3;
    }
    gaze.x = lerp(gaze.x, gaze.tx, 0.16);
    gaze.y = lerp(gaze.y, gaze.ty, 0.16);
    dial.style.setProperty("--gx", gaze.x.toFixed(2) + "px");
    dial.style.setProperty("--gy", gaze.y.toFixed(2) + "px");
  }

  function setSelected(next) {
    if (next === selected) return;
    selected = next;
    marker.style.color = CHARACTERS[selected].vivid;
    marker.classList.remove("is-ticking");
    void marker.offsetWidth;
    marker.classList.add("is-ticking");
  }

  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.034);
    last = now;
    if (!drag) {
      // 쫀득하게 넘쳤다 돌아오는 스프링
      const steps = 4;
      for (let i = 0; i < steps; i++) {
        const h = dt / steps;
        vel += (-150 * (rot - target) - 15 * vel) * h;
        rot += vel * h;
      }
    }
    setSelected(mod(Math.round(rot), COUNT));
    render(now);
    if (active) raf = requestAnimationFrame(frame);
  }

  // → 는 시계 방향(캐릭터들이 오른쪽으로 이동), ← 는 반시계 방향
  function turn(direction) {
    target = Math.round(target) - direction;
  }

  function pick() {
    const pop = nodes[selected].pop;
    pop.classList.remove("is-picked");
    void pop.offsetWidth;
    pop.classList.add("is-picked");
  }

  // 화면 좌표 → 스테이지(1935×1047) 좌표
  function toStage(e) {
    const r = stage.getBoundingClientRect();
    const k = r.width / 1935 || 1;
    return { x: (e.clientX - r.left) / k, y: (e.clientY - r.top) / k, k };
  }

  function lookAt(e) {
    const p = toStage(e);
    const center = place(0);
    const dx = p.x - center.x;
    const dy = p.y - (center.y + 9);
    const dist = Math.hypot(dx, dy) || 1;
    const reach = PUPIL_RANGE * Math.min(1, dist / 260);
    gaze.tx = (dx / dist) * reach;
    gaze.ty = (dy / dist) * reach;
    gaze.seen = performance.now();
  }

  root.addEventListener("pointermove", (e) => {
    if (!active) return;
    lookAt(e);
    if (!drag) return;
    const p = toStage(e);
    const dx = p.x - drag.x;
    if (Math.abs(dx) > 10) drag.moved = true;
    const next = drag.rot - dx / 380;
    vel = (next - rot) * 60;
    rot = next;
  });

  root.addEventListener("pointerdown", (e) => {
    if (!active || (e.pointerType === "mouse" && e.button !== 0)) return;
    lookAt(e);
    drag = { x: toStage(e).x, rot, moved: false, id: e.pointerId };
    vel = 0;
    try {
      root.setPointerCapture(e.pointerId);
    } catch (err) {}
  });

  function endDrag(e) {
    if (!drag) return;
    const moved = drag.moved;
    drag = null;
    if (moved) {
      // 놓는 순간의 속도를 조금 반영해서 가까운 자리에 맞춘다
      target = Math.round(rot + Math.max(-0.45, Math.min(0.45, vel * 0.12)));
      vel = Math.max(-8, Math.min(8, vel));
    } else {
      target = Math.round(rot);
      if (e.type === "pointerup") pick();
    }
  }
  root.addEventListener("pointerup", endDrag);
  root.addEventListener("pointercancel", endDrag);

  // 키 입력: 처리했으면 true
  function handleKey(e) {
    if (e.key === "ArrowRight") turn(1);
    else if (e.key === "ArrowLeft") turn(-1);
    else if (e.key === "Enter" || e.key === " ") pick();
    else return false;
    return true;
  }

  function enter() {
    active = true;
    root.classList.remove("is-entering");
    void root.offsetWidth;
    root.classList.add("is-entering");
    clearTimeout(enterTimer);
    enterTimer = setTimeout(() => root.classList.remove("is-entering"), 1400);
    last = performance.now();
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(frame);
  }

  function leave() {
    active = false;
    drag = null;
    cancelAnimationFrame(raf);
  }

  buildGrid();
  nodes.forEach((n, i) => {
    // 등장 순서: 가운데부터 바깥으로
    const s = mod(i + COUNT / 2, COUNT) - COUNT / 2;
    n.el.style.setProperty("--order", String(Math.abs(s)));
  });
  render(performance.now());

  return { enter, leave, handleKey, turn, pick };
})();

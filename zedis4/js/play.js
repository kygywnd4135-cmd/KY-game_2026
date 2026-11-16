// 연극 1~5.
// 배우 셋(부장·후임·동료)의 자세는 css/play.css가 data-scene 값에 따라 바꾸고,
// 여기서는 장면 순서, 대사 출력, 관객 반응, 엔딩 연출을 맡는다.
//
// 장면별 대사와 반응은 아래 SCENES만 고치면 된다.
//   speaker : boss(부장) | junior(후임) | pal(동료)
//   cues    : 대사가 after 글자까지 나온 순간의 반응
//     shout : [x, y, 기울기, "한마디"]   (피그마 좌표 그대로)
//     hop   : 들썩이는 관객  peach | mint | violet | pink
//     flag  : 장면에 붙는 표시(.has-이름) — 느낌표 같은 소품을 띄울 때 쓴다
window.Play = (function () {
  const SCENES = [
    {
      speaker: "boss",
      text: "나는 말이야.. 자네같이 열정없고\n끈기도 없는 젊은이가 너무 싫다네.",
      cues: [
        { after: "열정없고", shout: [153, 894.85, -18.07, "어휴.."], hop: ["peach"] },
        { after: "싫다네.", shout: [1629.43, 820, 16.51, "어떻게\n저런말을!"], hop: ["pink", "violet"] },
      ],
    },
    {
      // 목소리가 점점 기어들어간다: 글자가 작아지고, 느려지고, 몸도 움츠러든다
      speaker: "junior",
      fading: true,
      text: "하지만..그..업무의 강도가 너무 과하고\n점점 지쳐가는 것 같아요.....\n아니에요 죄송합니다....",
      cues: [
        { after: "과하고", flag: "boss-bang" },
        { after: "같아요.....", shout: [130.26, 857.74, 15.55, "기죽지마!!"], hop: ["peach", "mint"] },
        { after: "죄송합니다....", shout: [1648.61, 825.68, 16.51, "넌 잘못\n없어!!"], hop: ["pink", "violet"] },
      ],
    },
    {
      // 부장이 버럭! 큰 말풍선이 쾅 하고 떨어지고 화면이 흔들린다
      speaker: "boss",
      yell: true,
      text: "말을 좀 똑바로 하란 말이야!!!!",
      cues: [
        { after: "말", flag: "junior-bang", shout: [189.4, 906, 15.55, "!!!!!!"], hop: ["peach", "mint", "violet", "pink"] },
        { after: "말을", shout: [1664.22, 892, 16.51, "!!!!!!"] },
      ],
    },
    {
      speaker: "pal",
      text: "많이 힘들지?\n우리.. 조금만 더 버텨보자.",
      cues: [
        { after: "힘들지?", shout: [167.24, 899.83, 15.55, "최고다!!"], hop: ["peach", "mint"] },
        { after: "버텨보자.", shout: [1688, 895.13, -16.1, "ㅠㅠㅠ"], hop: ["pink", "violet"] },
      ],
    },
    {
      speaker: "pal",
      text: "모두가 행복한 하루를\n보냈으면 좋겠어요!",
      cues: [{ after: "좋겠어요!", hop: ["peach", "mint", "violet", "pink"] }],
    },
  ];

  // 연극 2에서 글자가 줄어드는 순서(피그마의 글자 크기 그대로)
  const FADING_SIZES = [
    ["하지만..그..업무의강도", 62.04], ["가", 61], ["너", 59], ["무", 58], ["과", 57], ["하", 56], ["고", 55],
    ["점", 53], ["점", 51], ["지", 51], ["쳐", 48], ["가", 45], ["는", 44], ["것", 43], ["같", 42], ["아", 41], ["요", 40], [".....", 38],
    ["아니에요죄송합니다....", 30],
  ].flatMap(([chars, size]) => Array.from(chars).map(() => size));

  const END_HOLD = 2200; // END! 가 나온 뒤 암전까지 머무는 시간(ms)

  const root = document.querySelector('[data-screen="play"]');

  // ── 화면 요소 만들기 ──
  const FOOT_R = "M-38 0H38C28.37 -18.585 28.37 -29.517 -2.68 -32.796C-27.51 -35.42 -36.57 -12.025 -38 0Z";
  const FOOT_L = "M37.46 0H-37.46C-27.96 -18.177 -27.96 -28.868 2.64 -32.076C27.12 -34.642 36.06 -11.761 37.46 0Z";
  // held: 손에 쥔 물건(술잔). 손과 한 덩어리로 움직인다.
  const foot = (side, color, held) =>
    `<div class="pa__foot pa__foot--${side}"><div class="pa__foot-idle"><svg width="76" height="34" viewBox="-38 -33.5 76 34"><path d="${side === "r" ? FOOT_R : FOOT_L}" fill="${color}"/></svg>${held || ""}</div></div>`;
  // 술잔: 손의 기준점(밑변 가운데)에서 (x, y)만큼 떨어진 자리에 놓는다. k = 손의 배율
  const CUP = "M1056.62 791H1010.93C1007.83 791 1005.48 793.78 1006 796.84L1014.29 845.34C1014.7 847.74 1016.78 849.5 1019.22 849.5H1048.75C1051.2 849.5 1053.29 847.72 1053.68 845.3L1061.56 796.8C1062.05 793.76 1059.7 791 1056.62 791Z";
  const cup = (x, y, k) =>
    `<svg class="pa__cup" style="left:${x}px;top:${y}px;transform-origin:${-x}px ${-y}px;--k:${(1 / k).toFixed(4)}" width="59.6" height="62.5" viewBox="1004 789 59.6 62.5" fill="none"><path d="${CUP}" fill="#D9D9D9" fill-opacity="0.2" stroke="#838383" stroke-width="2"/></svg>`;
  const eye = (side) =>
    `<div class="pa__eye pa__eye--${side}"><div class="pa__eye-clip"><i class="pa__white"></i><i class="pa__pupil"></i></div><i class="pa__lid"></i></div>`;
  // 피그마 좌표로 그린 그림을 배우의 중심(cx, cy)에 맞춰 얹는다
  const art = (cx, cy, inner, cls) =>
    `<svg class="pa__art ${cls || ""}" style="left:${-cx}px;top:${-cy}px" width="1935" height="1047" viewBox="0 0 1935 1047" fill="none">${inner}</svg>`;
  const actor = (id, inner) =>
    `<div class="pa pa--${id}"><div class="pa__mood"><div class="pa__idle">${inner}</div></div></div>`;

  const BOSS = actor(
    "boss",
    foot("l", "#17179B") + foot("r", "#17179B") + `<i class="pa__body"></i>` + eye("l") + eye("r") +
      art(
        768, 701,
        `<path class="actor__stache actor__stache--r" d="M868.25 749.1C835.75 713.5 800.54 738.5 787 755.46C800.54 772.94 834.45 809.5 861.75 815.85C889.05 822.21 918.62 800.49 930 788.83C922.95 790.42 900.75 784.7 868.25 749.1Z" fill="black"/>
         <path class="actor__stache actor__stache--l" d="M739.31 746.73C771.59 709.89 806.55 735.77 820 753.31C806.55 771.4 772.88 809.23 745.77 815.81C718.66 822.39 689.29 799.91 678 787.85C684.99 789.5 707.04 783.58 739.31 746.73Z" fill="black"/>
         <path d="M788.91 708.99C782.74 704.46 770 690.93 768.42 673" stroke="#A1BDFE" stroke-width="3.5"/>
         <path class="pa__vein" d="M802.61 718.9C806.17 716.11 813.25 707.43 813.16 695" stroke="#A1BDFE" stroke-width="3.5"/>`
      )
  );

  const JUNIOR = actor(
    "junior",
    foot("l", "#8A024F", cup(-51.7, -52.07, 0.979)) + foot("r", "#8A024F") + `<i class="pa__body"></i>` + eye("l") + eye("r") +
      art(
        1252.19, 744.47,
        `<rect x="1227.96" y="765.83" width="75.46" height="29.61" rx="3.25" fill="white" fill-opacity="0.45" stroke="black" stroke-width="3.5"/>
         <rect x="1144.91" y="765.83" width="60.69" height="29.61" rx="3.25" fill="white" fill-opacity="0.45" stroke="black" stroke-width="3.5"/>
         <path d="M1227.22 778.78C1224.1 774.17 1215.37 767.71 1205.38 778.78" stroke="black" stroke-width="3.5"/>`,
        "pa__glasses"
      ) +
      art(1252.19, 744.47, `<path d="M1276.13 730.97C1268.55 729.92 1250.9 724.08 1240.98 709.06" stroke="#8A024F" stroke-width="3.5"/>`) +
      `<i class="pa__sweat pa__sweat--1"></i><i class="pa__sweat pa__sweat--2"></i>`
  );

  const PAL = actor(
    "pal",
    foot("l", "#019185") + foot("r", "#019185", cup(-0.7, -52.07, 0.965)) + `<i class="pa__body"></i>` + eye("l") + eye("r") +
      art(708.22, 744.47, `<path d="M684.27 730.97C691.85 729.92 709.49 724.08 719.42 709.06" stroke="#019185" stroke-width="3.5"/>`, "pa__brow") +
      art(708.22, 744.47, `<path d="M621.92 740.51L601.43 751.54L615.31 818.52L600.1 841L574.32 818.52L592.27 752.07L573 740.51L582.25 725.96L612.66 722L621.92 740.51Z" fill="#FF6C6C"/>`, "pa__tie") +
      `<i class="pa__blush"></i>`
  );

  const seat = (id, x, y, r, c, tempo, offset) =>
    `<div class="crowd__seat" data-seat="${id}" style="--x:${x}px;--y:${y}px;--r:${r}px;--c:${c};--tempo:${tempo}s;--offset:${offset}s"><div class="crowd__hop"><i class="crowd__head"></i></div></div>`;

  const stageSvg = (cls, inner) =>
    `<svg class="${cls}" width="1935" height="1047" viewBox="0 0 1935 1047" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>`;

  root.innerHTML =
    `<div class="play__world">` +
    `<div class="play__light"></div><div class="play__floor"></div>` +
    BOSS + JUNIOR + PAL +
    // 잔이 부딪히는 순간의 반짝임(연극 4)
    stageSvg("play__clink", `<g stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"><path d="M963 742V716"/><path d="M938 752L920 734"/><path d="M988 752L1006 734"/></g>`) +
    // 느낌표: 부장 머리 위(연극 2), 후임 옆(연극 3)
    stageSvg("play__bang play__bang--boss", `<path d="M964.85 524.24L947.49 596.88L965.89 601.81L987.23 530.23L964.85 524.24ZM948.07 631.53C951.38 632.42 954.55 632.01 957.56 630.3C960.58 628.55 962.51 626.02 963.37 622.69C964.28 619.42 963.86 616.28 962.11 613.3C960.36 610.32 957.83 608.38 954.51 607.49C951.32 606.64 948.21 607.06 945.16 608.76C942.12 610.46 940.14 612.95 939.23 616.22C938.67 618.45 938.71 620.63 939.36 622.78C939.98 624.89 941.05 626.74 942.56 628.33C944.09 629.89 945.92 630.95 948.07 631.53Z" fill="#3A65FF"/>`) +
    stageSvg("play__bang play__bang--junior", `<path d="M1597.85 599.24L1580.49 671.88L1598.9 676.81L1620.23 605.23L1597.85 599.24ZM1581.07 706.53C1584.39 707.42 1587.55 707.01 1590.56 705.3C1593.58 703.56 1595.52 701.02 1596.37 697.69C1597.29 694.42 1596.87 691.28 1595.12 688.3C1593.36 685.32 1590.83 683.38 1587.51 682.49C1584.33 681.64 1581.21 682.06 1578.17 683.76C1575.13 685.46 1573.15 687.95 1572.23 691.22C1571.67 693.45 1571.72 695.63 1572.36 697.78C1572.98 699.89 1574.05 701.74 1575.57 703.33C1577.09 704.89 1578.92 705.95 1581.07 706.53Z" fill="#FF1777"/>`) +
    `<div class="crowd" aria-hidden="true">` +
    seat("peach", 88, 1047, 117, "#ffd3af", 2.6, 0) + seat("mint", 365, 1059, 91, "#c7fffa", 2.1, -0.7) +
    seat("violet", 1597, 1045, 105, "#bea9ff", 2.3, -0.4) + seat("pink", 1871.5, 1027.5, 122.5, "#ffacce", 2.7, -1.8) +
    `</div>` +
    // 빵파레 조각: 말풍선을 가리지 않도록 말풍선보다 아래 층에 둔다
    `<div class="confetti" aria-hidden="true"></div>` +
    `<div class="play__shouts"></div>` +
    // 보통 말풍선
    `<div class="bubble"><div class="bubble__pop">
       <svg class="bubble__shape" width="1049" height="359" viewBox="0 0 1049 359" fill="none" aria-hidden="true">
         <path d="M58.988 326.482L14.08 73.178L527.887 18.48L1048.96 73.178L1025.84 282.854L664.59 359.04L58.988 326.482Z" fill="#6B6B6B"/>
         <path d="M44.87 308.001L0 54.698L513.371 0L1034 54.698L1010.9 264.373L649.96 340.56L44.87 308.001Z" fill="#F4F4F4"/>
       </svg>
       <p class="bubble__text" data-play-text></p>
     </div></div>` +
    // 버럭 말풍선(연극 3)
    `<div class="yell"><div class="yell__pop">` +
    stageSvg("", `<path d="M1522.22 137.81L1486.16 311.54L1391.73 393.73L1221.61 377.88L545.25 480.31L362.02 326.71L378.49 169.47L894.68 98.43L1469.96 78.65L1522.22 137.81Z" fill="#878787"/><path d="M1496.7 109.46L1460.51 291.87L1364.81 377.97L1192 360.91L505.36 466.86L318.91 305.06L335.25 139.92L859.3 66.56L1443.48 47.18L1496.7 109.46Z" fill="#F0F0F0"/>`) +
    `<p class="yell__text" data-play-yell></p></div></div>` +
    `</div>` +
    // 엔딩: 캐릭터를 중심으로 좁혀지는 검은 원, 별, END!
    `<div class="iris"></div>` +
    stageSvg("play__star", `<path d="M1109.77 589.74C1111.82 587.19 1115.89 588.04 1116.75 591.19L1121.49 608.58C1121.83 609.82 1122.73 610.81 1123.93 611.27L1140.78 617.67C1143.83 618.83 1144.28 622.97 1141.55 624.76L1126.48 634.64C1125.41 635.34 1124.74 636.51 1124.68 637.79L1123.79 655.8C1123.63 659.06 1119.84 660.76 1117.29 658.72L1103.23 647.44C1102.23 646.64 1100.92 646.36 1099.68 646.7L1082.28 651.42C1079.13 652.28 1076.34 649.2 1077.5 646.14L1083.88 629.29C1084.33 628.09 1084.19 626.75 1083.49 625.68L1073.62 610.59C1071.83 607.86 1073.9 604.25 1077.16 604.41L1095.16 605.27C1096.44 605.33 1097.67 604.78 1098.47 603.78L1109.77 589.74Z" fill="white"/>`) +
    `<p class="play__end" data-play-end></p>`;

  const world = root.querySelector(".play__world");
  const bubble = root.querySelector(".bubble");
  const bubblePop = root.querySelector(".bubble__pop");
  const bubbleText = root.querySelector("[data-play-text]");
  const yellPop = root.querySelector(".yell__pop");
  const yellText = root.querySelector("[data-play-yell]");
  const shoutBox = root.querySelector(".play__shouts");
  const confettiBox = root.querySelector(".confetti");
  const endText = root.querySelector("[data-play-end]");
  const seats = {};
  root.querySelectorAll("[data-seat]").forEach((el) => (seats[el.dataset.seat] = el.querySelector(".crowd__hop")));

  let phase = "off"; // off → intro → line → waiting → finale → ended
  let sceneIndex = 0;
  let typer = null;
  let timers = [];

  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  function replay(el, className) {
    el.classList.remove(className);
    void el.offsetWidth;
    el.classList.add(className);
  }

  function clearFlags() {
    Array.from(root.classList).forEach((c) => c.startsWith("has-") && root.classList.remove(c));
  }

  function shout(x, y, rot, words) {
    const el = document.createElement("p");
    el.className = "shout";
    el.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;
    el.innerHTML = `<span class="shout__pop"><span class="shout__wiggle"></span></span>`;
    el.querySelector(".shout__wiggle").textContent = words;
    shoutBox.appendChild(el);
    void el.offsetWidth;
    el.classList.add("is-on");
  }

  function react(cue) {
    if (cue.shout) shout(...cue.shout);
    if (cue.flag) root.classList.add("has-" + cue.flag);
    (cue.hop || []).forEach((id, i) => seats[id] && setTimeout(() => replay(seats[id], "is-hopping"), i * 70));
  }

  // ── 빵파레: 위에서 팔랑팔랑 쏟아져 내린다 ──
  const CONFETTI_COLORS = ["#FF1777", "#1871ED", "#05E2CF", "#FFFFFF", "#FFD23F"];
  function burst(count) {
    for (let i = 0; i < count; i++) {
      const piece = document.createElement("i");
      const size = 54 + Math.random() * 84;
      piece.className = "confetti__piece";
      piece.style.cssText =
        `--x0:${-60 + Math.random() * 1990}px;--y0:${-90 - Math.random() * 170}px;` +
        `--drift:${-180 + Math.random() * 360}px;--sway:${50 + Math.random() * 90}px;` +
        `--spin:${-620 + Math.random() * 1240}deg;--tilt:${Math.random() * 360}deg;` +
        `--size:${size}px;--thick:${size > 100 ? 22 : 14}px;--c:${CONFETTI_COLORS[i % CONFETTI_COLORS.length]};` +
        `--dur:${2.6 + Math.random() * 2.4}s;--delay:${Math.random() * 0.9}s`;
      confettiBox.appendChild(piece);
      piece.addEventListener("animationend", () => piece.remove());
    }
  }

  // ── 대사 출력 ──
  function startLine() {
    const scene = SCENES[sceneIndex];
    const el = scene.yell ? yellText : bubbleText;
    phase = "line";
    root.classList.add("is-talking");
    if (scene.yell) {
      replay(yellPop, "is-slamming");
      replay(world, "is-quaking");
    }

    const pending = (scene.cues || [])
      .map((cue) => {
        const found = scene.text.indexOf(cue.after);
        return { cue, at: found < 0 ? 0 : found + cue.after.length };
      })
      .sort((a, b) => a.at - b.at);

    const options = {
      onChar: (pos) => {
        while (pending.length && pending[0].at <= pos) react(pending.shift().cue);
        // 목소리가 작아질수록 몸도 움츠러든다
        if (scene.fading) root.style.setProperty("--cower", (pos / scene.text.length).toFixed(3));
      },
      onDone: () => {
        while (pending.length) react(pending.shift().cue);
        if (scene.fading) root.style.setProperty("--cower", "1");
        root.classList.remove("is-talking");
        bubble.classList.add("is-ready");
        phase = "waiting";
      },
    };
    if (scene.fading) {
      options.decorate = (span, k) => {
        const size = FADING_SIZES[k] || 30;
        span.style.fontSize = size + "px";
        if (size <= 30) span.classList.add("is-whisper");
      };
      options.pace = (k, total) => 1 + 1.7 * Math.pow(k / total, 2); // 뒤로 갈수록 머뭇머뭇
    }
    if (scene.yell) options.speed = 30;

    typer = Typewriter.run([{ el, text: scene.text }], options);
  }

  function enterScene(index, delay) {
    clearTimers();
    sceneIndex = index;
    const scene = SCENES[index];
    phase = "intro";
    if (typer) typer.cancel();
    typer = null;
    clearFlags();
    root.classList.remove("is-talking", "is-finale", "is-wink");
    root.style.setProperty("--cower", "0");
    root.dataset.scene = String(index + 1);
    root.dataset.speaker = scene.speaker;
    shoutBox.textContent = "";
    Typewriter.clear(bubbleText);
    Typewriter.clear(yellText);
    Typewriter.clear(endText);
    bubble.classList.remove("is-ready");
    yellPop.classList.remove("is-slamming");
    world.classList.remove("is-quaking");
    if (!scene.yell) replay(bubblePop, index === 0 ? "is-entering" : "is-popping");
    if (index === 4) later(() => burst(46), 250); // 엔딩 장면은 빵파레와 함께 시작
    later(startLine, delay);
  }

  // ── 엔딩: 빵! → 검은 원이 캐릭터를 중심으로 좁혀지고 → 윙크 → END! ──
  function finale() {
    clearTimers();
    phase = "finale";
    burst(60);
    later(() => root.classList.add("is-finale"), 500);
    later(() => root.classList.add("is-wink"), 1650);
    later(() => {
      typer = Typewriter.run([{ el: endText, text: "END!" }], {
        speed: 90,
        onDone: () => {
          phase = "ended";
          // 여운을 잠깐 두고, 누르지 않아도 다음으로 넘어간다
          later(() => api.onEnd && api.onEnd(), END_HOLD);
        },
      });
    }, 2000);
  }

  function enter() {
    confettiBox.textContent = "";
    enterScene(0, 900);
  }

  function leave() {
    clearTimers();
    if (typer) typer.cancel();
    phase = "off";
    root.classList.remove("is-talking");
  }

  // 터치/아무 키. 모두 끝났으면 "done"을 돌려준다.
  function advance() {
    if (phase === "intro") {
      clearTimers();
      if (sceneIndex === 4) burst(46);
      startLine();
    } else if (phase === "line") {
      if (typer) typer.finish();
    } else if (phase === "waiting") {
      if (sceneIndex + 1 < SCENES.length) enterScene(sceneIndex + 1, sceneIndex + 1 === 2 ? 380 : 620);
      else finale();
    } else if (phase === "ended") {
      return "done";
    }
    return "handled";
  }

  // onEnd: END! 가 나온 뒤 여운이 지나면 불린다. js/flow.js가 연결한다.
  // actors: 다른 화면(장면 카드)에서 같은 배우를 줄여 쓰도록 내준다.
  const api = { enter, leave, advance, scenes: SCENES, goScene: (i) => enterScene(i, 500), onEnd: null, actors: { boss: BOSS, junior: JUNIOR } };
  return api;
})();

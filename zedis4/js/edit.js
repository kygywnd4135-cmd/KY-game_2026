// 연극 결과: ① 수정 시점 선택(Pick) → ② 등장인물 행동 수정(Edit)
//
// Pick  ← / → 로 장면 카드를 고르고 Enter(탭)로 결정. 지금은 첫 장면만 열려 있다.
// Edit  캐릭터가 튀어나오고 시나리오가 펼쳐진 뒤, ↑ / ↓ 로 대사를 고르고 Enter로 고친다.
//       글을 고치고 Enter를 누르면 파랑이 붓으로 뾰로롱 마법을 부려 대사가 바뀐다.
(function () {
  const STAR_PATH =
    "M1109.77 589.74C1111.82 587.19 1115.89 588.04 1116.75 591.19L1121.49 608.58C1121.83 609.82 1122.73 610.81 1123.93 611.27L1140.78 617.67C1143.83 618.83 1144.28 622.97 1141.55 624.76L1126.48 634.64C1125.41 635.34 1124.74 636.51 1124.68 637.79L1123.79 655.8C1123.63 659.06 1119.84 660.76 1117.29 658.72L1103.23 647.44C1102.23 646.64 1100.92 646.36 1099.68 646.7L1082.28 651.42C1079.13 652.28 1076.34 649.2 1077.5 646.14L1083.88 629.29C1084.33 628.09 1084.19 626.75 1083.49 625.68L1073.62 610.59C1071.83 607.86 1073.9 604.25 1077.16 604.41L1095.16 605.27C1096.44 605.33 1097.67 604.78 1098.47 603.78L1109.77 589.74Z";
  const star = (cls, x, y, size, color) =>
    `<svg class="${cls}" style="left:${x}px;top:${y}px" width="${size}" height="${size}" viewBox="1071 586 74 75" fill="none" aria-hidden="true"><path d="${STAR_PATH}" fill="${color}"/></svg>`;
  const BERET =
    "M844.12 606.32C847.13 605.19 850.4 607.15 850.83 610.33L852.52 622.87C910.22 616.27 974.54 655.03 993.44 657.61C1011.05 660.01 1015.11 679.16 1014.95 688.43L1025.46 685.61L1028.45 696.75L791.99 760.11L789.44 750.61L800.94 740.61C787.94 712.95 774.54 652.11 824.94 630.11C830.68 627.61 836.59 625.76 842.61 624.48L837.08 615.26C835.48 612.58 836.69 609.1 839.62 608.01L844.12 606.32Z";
  const stageSvg = (cls, inner) =>
    `<svg class="${cls}" width="1935" height="1047" viewBox="0 0 1935 1047" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>`;
  const hint = (cls, x, y, sign, label, fill) =>
    `<div class="hint ${cls}" style="left:${x}px;top:${y}px"><svg width="59" height="59" viewBox="0 0 59 59" fill="none" aria-hidden="true"><rect width="59" height="59" rx="29.5" fill="${fill}"/>` +
    (sign === "+" ? `<path d="M31.5 28.4H46V31.5H31.5V46H28.4V31.5H14V28.4H28.4V14H31.5V28.4Z" fill="#3D3D3D"/>` : `<path d="M46 31.5H14V28.4H46V31.5Z" fill="#3D3D3D"/>`) +
    `</svg><span class="hint__label">${label}</span></div>`;
  const replay = (el, className) => {
    el.classList.remove(className);
    void el.offsetWidth;
    el.classList.add(className);
  };

  /* ═════════ ① 수정 시점 선택 ═════════ */
  window.Pick = (function () {
    // locked: 아직 고를 수 없는 장면
    const SCENES = [
      { no: "S#1.", title: "당돌한 우리 부장님", locked: false },
      { no: "S#2.", title: "용기내서 말해봐요", locked: true },
      { no: "S#3.", title: "버럭! 부장님", locked: true },
    ];
    const ASK = "오늘의 시나리오에서 수정하고 싶은 순간들이 있었나요?";
    const LOCKED_MSG = "이 장면은 아직 수정할 수 없어요.";
    const PITCH = 672; // 카드 간격

    const root = document.querySelector('[data-screen="pick"]');
    const cast = window.Play.actors;
    const cardArt = [cast.boss + cast.junior, cast.junior, cast.junior];

    root.innerHTML =
      `<div class="pick__light"></div>` +
      // 띠 뒤에서 고개를 내민 파랑
      `<div class="pick__painter">` +
      stageSvg("", `<circle cx="1281" cy="238" r="132" fill="#1871ED"/>
        <path d="M1098.9 222L1138.4 279.7C1119.9 281.6 1112 287 1093.5 265.1C1078.7 247.5 1090.9 229 1098.9 222Z" fill="#1949AB"/>
        <path class="painter__beret" d="${BERET}" transform="translate(348.98 -553.12)" fill="#FF3D3D"/>`) +
      `<span class="pick__eye" style="left:1186.2px"><i></i><b></b></span><span class="pick__eye" style="left:1290.8px"><i></i><b></b></span>` +
      `</div>` +
      `<div class="pick__band"></div>` +
      // 띠 위에 걸친 손
      stageSvg("pick__grip", `<path d="M1365 294.3L1453.3 313.6C1446.8 289.5 1449.6 276.8 1414.3 265.1C1386.1 255.8 1369.7 280.7 1365 294.3Z" fill="#1949AB"/>`) +
      `<p class="pick__title">오늘의 시나리오 수정하기</p>` +
      `<div class="pick__strip">` +
      SCENES.map(
        (s, i) =>
          `<div class="card card--${i + 1}${s.locked ? " is-locked" : ""}" data-card="${i}" style="--i:${i}"><div class="card__pop">` +
          `<i class="card__light"></i><i class="card__floor"></i><div class="card__cast">${cardArt[i]}</div>` +
          `<p class="card__title"><span>${s.no}</span> ${s.title}</p></div></div>`
      ).join("") +
      `</div>` +
      `<i class="pick__ring"></i>` +
      `<i class="pick__rule"></i>` +
      `<p class="pick__ask" data-pick-ask>${ASK}</p>` +
      hint("", 1272, 900, "+", "슬라이드 / 결정", "#DBDBDB") +
      hint("", 1698, 900, "-", "진행", "#E2E2E2");

    const strip = root.querySelector(".pick__strip");
    const ring = root.querySelector(".pick__ring");
    const ask = root.querySelector("[data-pick-ask]");
    const cards = Array.from(root.querySelectorAll(".card"));

    let focus = 0;
    let active = false;
    let askTimer = 0;

    function render() {
      strip.style.setProperty("--shift", -PITCH * focus + "px");
      root.classList.toggle("is-on-locked", SCENES[focus].locked);
      cards.forEach((c, i) => c.classList.toggle("is-focus", i === focus));
    }

    function move(step) {
      const next = Math.max(0, Math.min(SCENES.length - 1, focus + step));
      if (next === focus) return replay(ring, "is-bumping"); // 끝에서는 툭 부딪히기만
      focus = next;
      render();
      replay(ring, "is-ticking");
    }

    function choose() {
      if (SCENES[focus].locked) {
        // 잠긴 장면: 도리도리 + 안내
        replay(cards[focus].querySelector(".card__pop"), "is-refusing");
        replay(ring, "is-refusing");
        ask.textContent = LOCKED_MSG;
        clearTimeout(askTimer);
        askTimer = setTimeout(() => (ask.textContent = ASK), 1600);
        return;
      }
      replay(cards[focus].querySelector(".card__pop"), "is-picked");
      if (api.onPick) api.onPick(focus);
    }

    cards.forEach((card, i) =>
      card.addEventListener("pointerdown", (e) => {
        if (!active) return;
        e.stopPropagation();
        if (i !== focus) move(i - focus);
        else choose();
      })
    );

    function handleKey(e) {
      if (e.key === "ArrowRight") move(1);
      else if (e.key === "ArrowLeft") move(-1);
      else if (e.key === "Enter" || e.key === " ") choose();
      else return false;
      return true;
    }

    function enter() {
      active = true;
      focus = 0;
      ask.textContent = ASK;
      render();
      replay(root, "is-entering");
    }

    function leave() {
      active = false;
      clearTimeout(askTimer);
    }

    const api = { enter, leave, handleKey, onPick: null };
    return api;
  })();

  /* ═════════ ② 등장인물 행동 수정 ═════════ */
  window.Edit = (function () {
    // who: boss(파랑 글씨) | junior(분홍 글씨). 고친 내용은 text 에 그대로 저장된다.
    const NARRATION = "이른 아침, 김부장이 민사원을 불러낸다.\n김부장의 손에는 ‘사직서’라고 적힌 봉투가 들려있다.";
    const LINES = [
      { who: "boss", name: "김부장", text: "민사원, 잠깐 나랑 얘기좀 하지?" },
      { who: "junior", name: "민사원", text: "아, 앗.. 네..네!" },
      { who: "boss", name: "김부장", text: "(봉투를 건넨다) 이거, 민사원이 쓴거 맞아?" },
      { who: "junior", name: "민사원", text: "(당황한다) 어...! 그게요.." },
      { who: "boss", name: "김부장", text: "..." },
      { who: "boss", name: "김부장", text: "나는 말이야.. 자네같이 열정없고 끈기도 없는 젊은이를 싫어한다네." },
    ];
    const GREETING = "좋아! 이 순간을 어떻게 바꿔볼까? 뭐든 바꿔보자고!";
    const FAREWELL = "좋아! 이제 시나리오가 마음에들어? 이걸로 연극을 종료하지!";
    const FAREWELL_HOLD = 1300; // 마무리 인사가 다 나온 뒤 암전까지(ms)
    const START_LINE = 1; // 처음에 골라 둘 대사

    const root = document.querySelector('[data-screen="edit"]');

    root.innerHTML =
      `<div class="edit__panel"></div>` +
      `<p class="edit__title"><span>S#1.</span> 당돌한 우리 부장님</p>` +
      `<i class="edit__rule"></i>` +
      `<div class="edit__viewport"><div class="edit__script">` +
      `<p class="edit__narration">${NARRATION.replace("\n", "<br>")}</p>` +
      LINES.map(
        (l, i) =>
          `<div class="line line--${l.who}" data-line="${i}" style="--i:${i}"><span class="line__who">${l.name} : </span>` +
          `<span class="line__text"></span><input class="line__input" type="text" maxlength="60" autocomplete="off" spellcheck="false" aria-label="${l.name} 대사 고치기" /></div>`
      ).join("") +
      `</div></div>` +
      `<i class="edit__thumb"></i>` +
      `<div class="edit__dim"></div>` +
      // 붓을 든 파랑(윙크) + 주변을 맴도는 별
      `<div class="wizard"><div class="wizard__pop"><div class="wizard__idle">` +
      stageSvg("", `<g class="wizard__shadow"><ellipse cx="1704.5" cy="1016.8" rx="154.5" ry="11" fill="#474747"/><ellipse cx="1629.5" cy="1016.8" rx="154.5" ry="11" fill="#0D0D0D"/></g>
        <circle cx="1571" cy="865.8" r="132" fill="#1871ED"/>
        <path d="M1532.1 1022.4H1438.8C1450.6 1000.6 1450.6 987.8 1488.7 984C1519.2 980.9 1530.4 1008.3 1532.1 1022.4Z" fill="#1949AB"/>
        <path class="painter__beret" d="${BERET}" transform="translate(638.98 74.68)" fill="#FF3D3D"/>
        <ellipse cx="1491.5" cy="871.7" rx="40.5" ry="45" fill="white"/>
        <ellipse class="wizard__pupil" cx="1479.5" cy="865.7" rx="28.5" ry="32" fill="#1949AB"/>
        <path d="M1639 880.5C1639 883.4 1637.8 886.3 1635.6 889.1C1633.3 891.8 1630.1 894.3 1625.9 896.4C1621.8 898.4 1616.9 900.1 1611.5 901.2C1606.1 902.4 1600.3 903 1594.5 903C1588.6 903 1582.8 902.4 1577.4 901.2C1572 900.1 1567.1 898.4 1563 896.4C1558.9 894.3 1555.6 891.8 1553.3 889.1C1551.1 886.3 1550 883.4 1550 880.5L1594.5 880.5H1639Z" fill="#1949AB"/>
        <g class="wizard__arm">
          <path d="M1743.5 730.2C1743 728.2 1732 727.7 1735 709.7C1738 691.7 1751.5 697.2 1761 678.7C1767.5 666.1 1766.4 659.8 1764.5 657.5C1764.1 657.3 1763.8 657 1763.5 656.7C1763.8 656.9 1764.1 657.2 1764.5 657.5C1771.7 663.7 1783.9 678.6 1782 695.7C1780 713.7 1770.8 728.6 1766.5 733.7L1743.5 730.2Z" fill="#C2C2C2"/>
          <path d="M1752 791.3L1717.8 888C1745.8 884.1 1759.7 889.1 1777.8 851C1792.3 820.6 1766.7 798.5 1752 791.3Z" fill="#1949AB"/>
          <path d="M1739.7 734.2L1718.7 856.9C1718.3 859.5 1719.9 862 1722.4 862.6L1730.6 864.7C1733.3 865.4 1736 863.8 1736.7 861.1L1769.2 735.5C1769.7 733.6 1769.1 731.6 1767.5 730.6C1757.2 723.6 1746.7 727.5 1741.4 731.4C1740.4 732 1739.8 733.1 1739.7 734.2Z" fill="#71340D"/>
        </g>`) +
      `</div></div>` +
      star("wizard__star wizard__star--a", 1793, 756, 73, "#6ADCFF") +
      star("wizard__star wizard__star--b", 1708, 582, 51, "#6AFF7B") +
      star("wizard__star wizard__star--c", 1676, 710, 39, "#FF7F7F") +
      `</div>` +
      `<div class="edit__sparks" aria-hidden="true"></div>` +
      // 인사 말풍선
      `<div class="say"><div class="say__pop">` +
      stageSvg("", `<path d="M180 975L154 848L543 768L1330 782L1313.5 841L1382 914L1288 902L1257 956.5L948.5 996.5L180 975Z" fill="#6B6B6B"/><path d="M173 960L147 833L536 753L1323 767L1306.5 826L1375 899L1281 887L1250 941.5L941.5 981.5L173 960Z" fill="#F4F4F4"/>`) +
      `<p class="say__text" data-edit-say></p></div></div>` +
      hint("edit__hint edit__hint--ok", 75, 850, "+", `<span data-edit-ok>선택</span>`, "#C7C7C7") +
      hint("edit__hint edit__hint--back", 75, 945, "-", `<span data-edit-back>뒤로</span>`, "#C7C7C7");

    const script = root.querySelector(".edit__script");
    const thumb = root.querySelector(".edit__thumb");
    const sayPop = root.querySelector(".say__pop");
    const sayText = root.querySelector("[data-edit-say]");
    const okLabel = root.querySelector("[data-edit-ok]");
    const backLabel = root.querySelector("[data-edit-back]");
    const sparks = root.querySelector(".edit__sparks");
    const wizard = root.querySelector(".wizard");
    const stage = document.querySelector(".stage");
    const rows = Array.from(root.querySelectorAll(".line"));
    rows.forEach((row, i) => (row.querySelector(".line__text").textContent = LINES[i].text));

    let phase = "off"; // off → intro → select → typing → magic → ending
    let focus = START_LINE;
    let typer = null;
    let timers = [];
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));
    const clearTimers = () => {
      timers.forEach(clearTimeout);
      timers = [];
    };

    function setHints(ok, back) {
      okLabel.textContent = ok;
      backLabel.textContent = back;
    }

    // 고른 대사가 화면 안에 들어오도록 대본을 밀어 올린다
    function scrollToFocus() {
      const row = rows[focus];
      const center = row.offsetTop + row.offsetHeight / 2; // 대본 안에서의 높이
      const max = Math.max(0, script.scrollHeight - 980);
      const scroll = Math.max(0, Math.min(max, center - 420));
      script.style.setProperty("--scroll", -scroll + "px");
      thumb.style.setProperty("--thumb", (max ? (scroll / max) * 330 : 0) + "px");
    }

    function render() {
      rows.forEach((row, i) => row.classList.toggle("is-focus", phase !== "intro" && i === focus));
      scrollToFocus();
    }

    function move(step) {
      const next = Math.max(0, Math.min(rows.length - 1, focus + step));
      if (next === focus) return;
      focus = next;
      render();
    }

    // ── 고치기 ──
    function startTyping() {
      const row = rows[focus];
      const input = row.querySelector(".line__input");
      phase = "typing";
      row.classList.add("is-typing");
      input.value = LINES[focus].text;
      setHints("저장", "취소");
      input.focus({ preventScroll: true });
      input.setSelectionRange(input.value.length, input.value.length);
    }

    function stopTyping() {
      const row = rows[focus];
      row.classList.remove("is-typing");
      row.querySelector(".line__input").blur();
      setHints("선택", "뒤로");
    }

    function cancelTyping() {
      stopTyping();
      phase = "select";
    }

    // 스테이지 좌표로 바꾼 요소의 위치
    function stageBox(el) {
      const s = stage.getBoundingClientRect();
      const k = s.width / 1935 || 1;
      const r = el.getBoundingClientRect();
      return { x: (r.left - s.left) / k, y: (r.top - s.top) / k, w: r.width / k, h: r.height / k };
    }

    // 붓끝에서 별이 날아가 대사 위에 내려앉는다
    function castSparks(box) {
      const COLORS = ["#6ADCFF", "#6AFF7B", "#FF7F7F", "#FFE066", "#EBA3FF", "#FFFFFF"];
      for (let i = 0; i < 16; i++) {
        const s = document.createElement("i");
        s.className = "spark";
        s.style.cssText =
          `--x0:${1758}px;--y0:${672}px;` +
          `--x1:${box.x + 30 + Math.random() * (box.w - 60)}px;--y1:${box.y + 12 + Math.random() * (box.h - 24)}px;` +
          `--arc:${-140 - Math.random() * 200}px;--size:${20 + Math.random() * 30}px;--c:${COLORS[i % COLORS.length]};` +
          `--delay:${0.28 + i * 0.035}s;--spin:${-360 + Math.random() * 720}deg`;
        sparks.appendChild(s);
        s.addEventListener("animationend", () => s.remove());
      }
    }

    function commit() {
      const row = rows[focus];
      const textEl = row.querySelector(".line__text");
      const next = row.querySelector(".line__input").value.trim();
      stopTyping();
      if (!next || next === LINES[focus].text) {
        phase = "select";
        return;
      }

      // 뾰로롱! 붓을 휘두르고 → 별이 날아가고 → 대사가 새로 써진다
      phase = "magic";
      LINES[focus].text = next;
      replay(wizard, "is-casting");
      later(() => wizard.classList.remove("is-casting"), 1000);
      castSparks(stageBox(row));
      later(() => {
        replay(row, "is-changing");
        typer = Typewriter.run([{ el: textEl, text: next }], {
          speed: 34,
          onDone: () => {
            // 긴 글이 띄어쓰기에서 줄바꿈되도록, 타자 효과용 글자 조각과 표시를 걷어 낸다
            textEl.textContent = next;
            textEl.classList.remove("tw", "is-instant");
            scrollToFocus();
            phase = "select";
          },
        });
      }, 620);
    }

    // ── 등장: 캐릭터 뿅 → 시나리오 펼침 → 인사 말풍선 ──
    function greet() {
      replay(sayPop, "is-entering");
      root.classList.add("is-greeting");
      typer = Typewriter.run([{ el: sayText, text: GREETING }], {});
    }

    function endIntro() {
      clearTimers();
      if (typer) typer.cancel();
      typer = null;
      // is-opening 을 걷어 둬야, 나중에 줄 모양이 바뀔 때 등장 애니메이션이 다시 돌지 않는다
      root.classList.remove("is-intro", "is-greeting", "is-opening");
      phase = "select";
      render();
    }

    function enter() {
      clearTimers();
      if (typer) typer.cancel();
      typer = null;
      focus = START_LINE;
      phase = "intro";
      sparks.textContent = "";
      Typewriter.clear(sayText);
      rows.forEach((row, i) => {
        row.classList.remove("is-typing", "is-changing");
        row.querySelector(".line__text").textContent = LINES[i].text;
        row.querySelector(".line__text").classList.remove("tw", "is-instant");
      });
      setHints("선택", "뒤로");
      root.classList.remove("is-greeting", "is-farewell");
      root.classList.add("is-intro");
      replay(root, "is-opening");
      wizard.classList.remove("is-casting");
      render();
      later(greet, 1150);
    }

    function leave() {
      clearTimers();
      if (typer) typer.cancel();
      if (phase === "typing") stopTyping();
      phase = "off";
    }

    // 대사를 눌러서 고르거나 고치기
    rows.forEach((row, i) =>
      row.addEventListener("pointerdown", (e) => {
        if (phase !== "select") return;
        e.stopPropagation();
        if (i !== focus) {
          focus = i;
          render();
        } else {
          e.preventDefault(); // 입력 칸이 뜨기 전에 초점을 뺏기지 않게
          startTyping();
        }
      })
    );

    root.addEventListener("pointerdown", (e) => {
      if (phase === "intro") advanceIntro();
      else if (phase === "ending") advanceEnding();
      else if (phase === "typing" && !e.target.closest(".line.is-typing")) commit();
    });

    // ── 마무리(Alt): 파랑이 인사하고 → onFinish(암전) ──
    function finish() {
      if (phase !== "select") return false; // 고치는 중·마법 중에는 받지 않는다
      phase = "ending";
      rows.forEach((row) => row.classList.remove("is-focus"));
      setHints("선택", "뒤로");
      Typewriter.clear(sayText);
      root.classList.add("is-greeting", "is-farewell");
      replay(sayPop, "is-entering");
      replay(wizard, "is-casting");
      later(() => wizard.classList.remove("is-casting"), 1000);
      typer = Typewriter.run([{ el: sayText, text: FAREWELL }], {
        onDone: () => later(leaveStage, FAREWELL_HOLD),
      });
      return true;
    }

    function leaveStage() {
      if (phase !== "ending") return;
      phase = "off";
      clearTimers();
      if (api.onFinish) api.onFinish();
    }

    function advanceEnding() {
      if (typer && !typer.done) typer.finish();
      else leaveStage();
    }

    // 화면의 ＋ / − 버튼도 키와 똑같이 동작한다
    root.querySelector(".edit__hint--ok").addEventListener("pointerdown", (e) => {
      if (phase === "select") {
        e.stopPropagation();
        e.preventDefault();
        startTyping();
      } else if (phase === "typing") {
        e.stopPropagation();
        commit();
      }
    });
    root.querySelector(".edit__hint--back").addEventListener("pointerdown", (e) => {
      if (phase === "select") {
        e.stopPropagation();
        if (api.onBack) api.onBack();
      } else if (phase === "typing") {
        e.stopPropagation();
        cancelTyping();
      }
    });

    function advanceIntro() {
      if (!root.classList.contains("is-greeting")) {
        clearTimers();
        greet();
      } else if (typer && !typer.done) typer.finish();
      else endIntro();
    }

    // 키 입력. 처리했으면 true, "back" 이면 장면 선택으로 돌아간다.
    function handleKey(e) {
      if (phase === "typing") {
        // 한글 조합 중의 Enter(글자 확정)는 저장으로 치지 않는다
        if (e.isComposing || e.keyCode === 229) return true;
        if (e.key === "Enter") {
          e.preventDefault();
          commit();
        } else if (e.key === "Escape") {
          e.preventDefault();
          cancelTyping();
        }
        return true;
      }
      if (phase === "intro") {
        advanceIntro();
        return true;
      }
      if (phase === "ending") {
        advanceEnding();
        return true;
      }
      if (phase === "select") {
        if (e.key === "ArrowDown") move(1);
        else if (e.key === "ArrowUp") move(-1);
        else if (e.key === "Enter" || e.key === " ") startTyping();
        else if (e.key === "-" || e.key === "Escape" || e.key === "Backspace") return "back"; // − : 뒤로
        else return false;
      }
      return true;
    }

    // onFinish: 마무리 인사가 끝나면 불린다. js/flow.js가 연결한다.
    // onBack: 뒤로(− 버튼)를 눌렀을 때 불린다.
    const api = { enter, leave, handleKey, finish, isTyping: () => phase === "typing", lines: LINES, onFinish: null, onBack: null };
    return api;
  })();
})();

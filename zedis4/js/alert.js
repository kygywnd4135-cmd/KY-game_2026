// 알림창(피그마 '알림창1' · '알림창2' 모양). 어느 화면에서나 같은 모양으로 띄운다.
// 색은 그 화면으로 들어올 때 고른 로비 캐릭터 색(theme)을 따라간다.
//   Alert.open(화면요소, { theme, text, buttons: [{ id, label, kind: "main" | "muted" }], onChoose(id) })
//   Alert.notReady(화면요소, theme)   "으아악! 미안해! 아직 준비되지 않은 기능이야."
//   Alert.handleKey(e)               알림창이 떠 있으면 키를 먹고 true
// 조작: ← / → 버튼 고르기, Enter / ＋ 누르기, − / Esc 닫기
window.Alert = (function () {
  // 로비 캐릭터 id → 머리띠 · 머리띠 아랫선 · 구분선 · 주 버튼 색
  // (lilac, peach 는 피그마 알림창1 · 2 색 그대로, 나머지는 캐릭터 색에 맞춰 만든 것)
  const THEMES = {
    lilac: ["#d4a2ff", "#bc7ffe", "#c480ff", "#b462fb"],
    peach: ["#ffb578", "#ff9d4c", "#ff9c4a", "#ff7c10"],
    green: ["#a6eda0", "#6fdc6a", "#6fdc6a", "#35c94f"],
    blue: ["#a5c8ff", "#77a8f7", "#7fb0f8", "#1871ed"],
    violet: ["#c9adff", "#a985ff", "#b08cff", "#9446f0"],
    pink: ["#ff9cc3", "#ff6fa6", "#ff7fb0", "#ff2f82"],
    mint: ["#93ece2", "#5fd8cb", "#6adfd2", "#14c3b0"],
  };

  let cur = null; // { dim, box, buttons, focus, onChoose }

  function open(container, { theme = "lilac", text, buttons, onChoose }) {
    close();
    let dim = container.querySelector(":scope > .al__dim");
    if (!dim) {
      dim = document.createElement("div");
      dim.className = "al__dim";
      dim.innerHTML = `<div class="al" role="alertdialog" aria-modal="true"></div>`;
      container.appendChild(dim);
    }
    const box = dim.firstElementChild;
    const [head, headLine, line, main] = THEMES[theme] || THEMES.lilac;
    box.style.cssText = `--head:${head};--head-line:${headLine};--line:${line};--main:${main}`;
    const n = buttons.length;
    box.innerHTML =
      `<div class="al__head">알림</div>` +
      `<p class="al__text">${text}</p>` +
      // 구분선 위의 점: 버튼 가운데마다 하나씩
      `<div class="al__line">${buttons.map((_, i) => `<i style="left:${n === 2 ? 221.5 + i * 386 : 414.5}px"></i>`).join("")}</div>` +
      `<div class="al__btns">${buttons.map((b, i) => `<button type="button" class="al__btn is-${b.kind}" data-i="${i}">${b.label}</button>`).join("")}</div>`;
    cur = { dim, box, buttons, focus: 0, onChoose };
    box.querySelectorAll(".al__btn").forEach((btn) =>
      btn.addEventListener("pointerdown", (e) => {
        e.stopPropagation();
        if (!cur) return;
        cur.focus = Number(btn.dataset.i);
        choose();
      })
    );
    // 알림창 바깥을 눌러도 뒤 화면이 반응하지 않게
    dim.onpointerdown = (e) => e.stopPropagation();
    paintFocus();
    dim.classList.add("is-open");
    box.classList.remove("is-popping");
    void box.offsetWidth;
    box.classList.add("is-popping");
  }

  function notReady(container, theme) {
    open(container, {
      theme,
      text: "으아악! 미안해!<br>아직 준비되지 않은 기능이야.",
      buttons: [{ id: "ok", label: "확인", kind: "main" }],
    });
  }

  function paintFocus() {
    cur.box.querySelectorAll(".al__btn").forEach((b, i) => b.classList.toggle("is-focus", i === cur.focus));
  }

  function choose() {
    const { buttons, focus, onChoose } = cur;
    close();
    if (onChoose) onChoose(buttons[focus].id);
  }

  function close() {
    if (!cur) return;
    cur.dim.classList.remove("is-open");
    cur = null;
  }

  function handleKey(e) {
    if (!cur) return false;
    const n = cur.buttons.length;
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      cur.focus = (cur.focus + (e.key === "ArrowRight" ? 1 : -1) + n) % n;
      paintFocus();
    } else if (e.key === "Enter" || e.key === " " || e.key === "+" || e.key === "=") choose();
    else if (e.key === "-" || e.key === "Escape" || e.key === "Backspace") close();
    return true;
  }

  return { open, notReady, close, handleKey, isOpen: () => !!cur, themes: THEMES };
})();

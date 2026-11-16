// 연극 결과 - 비슷한 시나리오 추천.
// 내 시나리오에 별점을 매기고(← / → 로 반 칸씩, 별을 눌러도 됨),
// 아래에는 비슷한 상황을 겪은 사람들의 이야기가 추천으로 뜬다(아직 고를 수는 없다).
// 오른쪽 '나도 이번 스토리를 공개할래!' 칸은 눌러서(또는 ↑ / ↓ 키) 켜고 끈다.
// Alt 나 스페이스바를 누르면 로비로 돌아간다(js/flow.js가 처리).
window.Rate = (function () {
  const root = document.querySelector('[data-screen="rate"]');
  const START = 0; // 처음 별점

  // ── 추천 썸네일을 그리는 작은 도구들 ──
  const BIG_STAR =
    "M32.6 13.7C33.1 6.8 41.3 3.5 46.5 8L84.7 40.9C86.8 42.7 89.5 43.4 92.2 42.8L141.3 31.2C148 29.7 153.7 36.4 151 42.7L131.5 89.3C130.5 91.8 130.7 94.6 132.1 96.9L158.2 140.1C161.8 146 157.2 153.4 150.3 152.9L100 148.7C97.3 148.5 94.7 149.6 92.9 151.6L60 189.8C55.4 195 46.9 192.9 45.3 186.2L33.8 137.1C33.1 134.5 31.3 132.3 28.8 131.3L-17.7 111.7C-24.1 109 -24.7 100.3 -18.8 96.7L24.3 70.5C26.6 69.1 28.1 66.7 28.3 64L32.6 13.7Z";
  const FOOT = "M-38 0H38C28.37 -18.585 28.37 -29.517 -2.68 -32.796C-27.51 -35.42 -36.57 -12.025 -38 0Z";
  const bigStar = (x, y, k, fill) => `<path d="${BIG_STAR}" transform="translate(${x} ${y}) scale(${k})" fill="${fill}"/>`;
  const foot = (x, y, rot, k, fill) => `<path d="${FOOT}" transform="translate(${x} ${y}) rotate(${rot}) scale(${k})" fill="${fill}"/>`;
  const disc = (cx, cy, r, fill, ry) => `<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${ry || r}" fill="${fill}"/>`;
  // 반달 눈: 원을 반으로 자른 모양(upper=true 면 위쪽 절반)
  const half = (cx, cy, r, rot, fill, upper) =>
    `<path d="M${-r} 0A${r} ${r} 0 0 ${upper ? 1 : 0} ${r} 0Z" transform="translate(${cx} ${cy}) rotate(${rot})" fill="${fill}"/>`;
  const halfEye = (cx, cy, rot, deep, upper, r) => half(cx, cy, r || 35.7, rot, "#fff", upper) + half(cx, cy, (r || 35.7) * 0.67, rot, deep, upper);

  const THUMBS = [
    {
      title: "나 어제 차였다",
      bg: "#B1CCFF",
      art:
        bigStar(0, 0, 1.42, "#88B1FC") + bigStar(238, 0, 1.42, "#88B1FC") +
        foot(100, 253, -33.8, 0.8, "#3B81B4") + foot(137, 298, 4.4, 0.8, "#3B81B4") +
        disc(175.4, 140.3, 98.2, "#BDE5FF") +
        disc(195.5, 137.8, 35.6, "#fff") + disc(195.5, 137.8, 23.9, "#3B81B4") + halfEye(106.1, 137.8, -9.7, "#3B81B4") +
        `<path d="M21.5 107.4C21.8 100 28.1 94.3 35.7 94.1C36.4 86.5 42.7 80.8 50.1 81.1C57.4 81.4 63.2 87.6 63.4 95.2L62.3 123L34.5 121.9C27 121 21.2 114.8 21.5 107.4Z" fill="#466EFF"/>`,
    },
    {
      title: "상사님이 매일 혼내!",
      bg: "#FFD952",
      art:
        disc(209.5, 244.5, 108.5, "#FFA5BD") + disc(53, 66, 70, "#FFA5BD") +
        foot(30, 180, -33.8, 0.8, "#BD56C7") + foot(255, 233, 4.4, 0.8, "#BD56C7") +
        disc(151.7, 137.3, 98.2, "#E39CFF") +
        halfEye(83.8, 157.8, 5.3, "#BD56C7", true) + halfEye(170.8, 148.8, 5.3, "#BD56C7", true),
    },
    {
      title: "선생님의 무관심",
      bg: "#27C5FF",
      art:
        disc(139.8, 230.5, 76.3, "#008CE9") + bigStar(0, 0, 1, "#FFC61C") + bigStar(167.5, 0, 1, "#FFC61C") +
        foot(53.5, 226, 189.5, 0.86, "#8A024F") + foot(228.8, 280.8, 0, 0.86, "#8A024F") +
        disc(182.7, 144, 105, "#FF1777") +
        halfEye(195.7, 146.2, -20.4, "#8A024F", false, 38.2) + halfEye(107.9, 145.5, 22.5, "#8A024F", false, 38.2) +
        `<rect x="151.4" y="97.6" width="67.1" height="26.7" rx="2.2" fill="#000" fill-opacity="0.7" stroke="#000" stroke-width="2.4"/>
         <rect x="78.2" y="97.6" width="54.1" height="26.7" rx="2.2" fill="#000" fill-opacity="0.7" stroke="#000" stroke-width="2.4"/>
         <path d="M151.4 112.4C148.7 108.2 141.2 102.4 132.6 112.4" stroke="#000" stroke-width="2.4" stroke-linecap="round"/>
         <path d="M218.2 109.6L252.8 125L257.2 137.5" stroke="#000" stroke-width="4.2" stroke-linecap="round"/>`,
    },
    {
      title: "저요!라고 외치지마",
      bg: "#BAFFA7",
      art:
        bigStar(0, -8, 1.42, "#B1E6FF") + bigStar(238, -8, 1.42, "#B0E6FF") +
        disc(162.3, 204, 95.7, "#A555FB", 98) +
        disc(108.6, 204, 33.5, "#fff") + disc(183.6, 204, 33.5, "#fff") + disc(104.9, 194.1, 23.9, "#661FA4", 23.1) + disc(180.4, 194.1, 23.9, "#661FA4", 23.1) +
        `<path d="M230.8 265.6L304.2 234.1C283.7 212.1 277.1 196.8 245.2 205.1C219.7 211.8 225 248.2 230.8 265.6Z" fill="#661FA4"/>` +
        `<ellipse cx="55.5" cy="119.6" rx="28" ry="36.5" transform="rotate(5.8 55.5 119.6)" fill="#661FA4"/>`,
    },
    {
      title: "취업하는 동기들",
      bg: "#FF9CC5",
      art:
        bigStar(0, 0, 1.42, "#FFBF91") + bigStar(238, 0, 1.42, "#FFBF91") +
        foot(125, 263, 0, 0.79, "#D75A00") +
        disc(139, 135, 90, "#FF9E28", 92) +
        `<path d="M114 154.5A25 12.5 0 0 1 64 154.5Z" fill="#D75A00"/><path d="M181 154.5A25.5 12.5 0 0 1 130 154.5Z" fill="#D75A00"/>` +
        `<path d="M223.7 101.2L179.6 58.4C195.3 53.4 201.2 47.3 221 63C236.8 75.5 229.4 93.7 223.7 101.2Z" fill="#D75A00"/>`,
    },
  ];

  const RATE_STAR =
    "M674.1 326.4C676.3 322.1 682.6 322.1 684.8 326.4L693.1 342.6C693.9 344.3 695.6 345.5 697.5 345.8L715.4 348.7C720.2 349.4 722.2 355.4 718.7 358.8L705.9 371.7C704.5 373 703.9 375 704.2 376.8L707 394.8C707.8 399.6 702.7 403.3 698.4 401.1L682.2 392.8C680.5 392 678.4 392 676.7 392.8L660.5 401.1C656.2 403.3 651.1 399.6 651.9 394.8L654.7 376.8C655 375 654.4 373 653 371.7L640.2 358.8C636.7 355.4 638.7 349.4 643.5 348.7L661.4 345.8C663.3 345.5 665 344.3 665.8 342.6L674.1 326.4Z";
  const rateStar = (fill) => `<svg width="86" height="84" viewBox="637 320 86 84" fill="none" aria-hidden="true"><path d="${RATE_STAR}" fill="${fill}"/></svg>`;

  root.innerHTML =
    `<svg class="rate__grid" width="1935" height="1047" viewBox="0 0 1935 1047" fill="none" aria-hidden="true"></svg>` +
    `<p class="rate__title"><span>EP03.</span> 또 너야, 김부장?!</p>` +
    `<p class="rate__ask">오늘의 연극은 어떠셨나요? 평점을 매겨주세요!</p>` +
    // 별점
    `<div class="rate__pill" role="slider" aria-label="별점" aria-valuemin="0" aria-valuemax="5">` +
    [0, 1, 2, 3, 4].map((i) => `<span class="rate__star" data-star="${i}" style="--i:${i}">${rateStar("#D9D9D9")}<span class="rate__fill">${rateStar("#FFC61C")}</span></span>`).join("") +
    `<span class="rate__value" data-rate-value>0.0</span></div>` +
    `<div class="hint rate__save" style="left:1552px;top:411px"><svg width="59" height="59" viewBox="0 0 59 59" fill="none" aria-hidden="true"><rect width="59" height="59" rx="29.5" fill="#4C4C4C"/><path d="M31.5 28.4H46V31.5H31.5V46H28.4V31.5H14V28.4H28.4V14H31.5V28.4Z" fill="#F0F0F0"/></svg><span class="hint__label" data-rate-save>저장</span></div>` +
    // 추천 목록
    `<div class="rate__band"></div>` +
    `<p class="rate__more">다른 사람들은 비슷한 시나리오에서 어떻게 행동했을까요?</p>` +
    // 내 스토리 공개 체크
    `<button class="rate__share" type="button" role="checkbox" aria-checked="false">` +
    `<span class="rate__check"><svg width="56" height="53" viewBox="0 0 56 53" fill="none" aria-hidden="true"><path d="M14 27.5L24 37L43 17" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>` +
    `<span class="rate__share-label">나도 이번 스토리를 공개할래!</span></button>` +
    THUMBS.map(
      (t, i) =>
        `<div class="reco" data-reco="${i}" style="--i:${i}"><div class="reco__pop"><div class="reco__disc" style="background:${t.bg}">` +
        `<svg width="289.3" height="289.3" viewBox="0 0 289.3 289.3" fill="none" aria-hidden="true">${t.art}</svg></div></div>` +
        `<p class="reco__title">${t.title}</p></div>`
    ).join("");

  // 로비와 같은 바둑판 무늬
  (function grid() {
    const xs = [0, 193.2, 386.41, 579.61, 772.81, 966.01, 1159.22, 1352.42, 1545.62, 1738.82];
    const ys = [-177.8, 15.4, 208.61, 401.81, 595.01, 788.22, 981.42];
    let rects = "";
    xs.forEach((x) => ys.forEach((y) => (rects += `<rect x="${x + 0.5}" y="${y + 0.5}" width="195.175" height="195.175" rx="31.5" stroke="#CACACA"/>`)));
    root.querySelector(".rate__grid").innerHTML = rects;
  })();

  const pill = root.querySelector(".rate__pill");
  const valueEl = root.querySelector("[data-rate-value]");
  const saveLabel = root.querySelector("[data-rate-save]");
  const stars = Array.from(root.querySelectorAll(".rate__star"));
  const recos = Array.from(root.querySelectorAll(".reco"));

  const share = root.querySelector(".rate__share");

  let rating = START;
  let saved = false;
  let shared = false;
  let active = false;

  const replay = (el, className) => {
    el.classList.remove(className);
    void el.offsetWidth;
    el.classList.add(className);
  };

  function render(popped) {
    stars.forEach((star, i) => {
      const part = Math.max(0, Math.min(1, rating - i)); // 0, 0.5, 1
      star.style.setProperty("--part", String(part));
      if (popped && part > 0 && rating - i <= 1) replay(star, "is-popping"); // 방금 채워진 별이 통!
    });
    valueEl.textContent = rating.toFixed(1);
    pill.classList.toggle("is-empty", rating === 0);
    pill.setAttribute("aria-valuenow", String(rating));
  }

  function setRating(next) {
    next = Math.max(0, Math.min(5, Math.round(next * 2) / 2));
    if (next === rating) return replay(pill, "is-bumping");
    const up = next > rating;
    rating = next;
    saved = false;
    saveLabel.textContent = "저장";
    render(up);
  }

  function save() {
    if (rating === 0) return replay(pill, "is-bumping");
    saved = true;
    saveLabel.textContent = "저장됨";
    stars.forEach((star, i) => i < Math.ceil(rating) && replay(star, "is-saved"));
    replay(root.querySelector(".rate__save"), "is-saved");
  }

  // 별을 누르면: 왼쪽 반은 .5, 오른쪽 반은 1
  stars.forEach((star, i) =>
    star.addEventListener("pointerdown", (e) => {
      if (!active) return;
      const box = Stage.box(star);
      const pt = Stage.point(e.clientX, e.clientY);
      setRating(i + ((pt.x - box.x) / box.w < 0.5 ? 0.5 : 1));
    })
  );
  root.querySelector(".rate__save").addEventListener("pointerdown", () => active && save());

  // 공개 체크 켜고 끄기
  function toggleShare() {
    shared = !shared;
    share.classList.toggle("is-on", shared);
    share.setAttribute("aria-checked", String(shared));
    replay(share, "is-toggling");
  }
  share.addEventListener("pointerdown", (e) => {
    if (!active) return;
    e.stopPropagation();
    toggleShare();
  });

  // 추천 이야기는 아직 고를 수 없다: 누르면 도리도리
  recos.forEach((reco) => reco.addEventListener("pointerdown", () => active && replay(reco.querySelector(".reco__pop"), "is-refusing")));

  function handleKey(e) {
    if (e.key === "ArrowRight") setRating(rating + 0.5);
    else if (e.key === "ArrowLeft") setRating(rating - 0.5);
    else if (e.key === "ArrowUp" || e.key === "ArrowDown") toggleShare();
    else if (/^[0-5]$/.test(e.key)) setRating(Number(e.key));
    else if (e.key === "Enter") save(); // 스페이스바는 Alt처럼 로비로(js/flow.js)
    else return false;
    return true;
  }

  function enter() {
    active = true;
    rating = START;
    saved = false;
    shared = false;
    share.classList.remove("is-on", "is-toggling");
    share.setAttribute("aria-checked", "false");
    saveLabel.textContent = "저장";
    stars.forEach((s) => s.classList.remove("is-popping", "is-saved"));
    render(false);
    replay(root, "is-entering");
  }

  function leave() {
    active = false;
  }

  return { enter, leave, handleKey, get rating() { return rating; }, get saved() { return saved; }, get shared() { return shared; } };
})();
